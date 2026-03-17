/**
 * BlockDrawer Component - LIST VIEW (Not Card)
 *
 * Native-feel swipe gesture — real-time finger tracking
 * Momentum based: quick flick = instant snap
 * Damp drag: when expanded and swiping up, drawer slows naturally
 * iOS cubic-bezier curve: cubic-bezier(0.32, 0.72, 0, 1)
 * Style applied directly on element (not CSS var) — no lag
 * Multi-touch guard: ignores second finger while dragging
 * Vaul structure unchanged — always open, always visible
 *
 * ✅ CANVA STRATEGY:
 * - Semua block bisa dipilih/preview bebas (tidak ada lock)
 * - Badge "Pro" = hint visual saja
 * - Gate terjadi saat Publish di page.tsx
 */

'use client';

import { useState, useMemo, useCallback, memo, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/shared/utils';
import { Search, Loader2, ChevronLeft, ChevronRight, Check, Crown } from 'lucide-react';
import type { SectionType } from './builder-sidebar';
import type { BlockOption } from './block-options';
import { BLOCK_OPTIONS_MAP } from './block-options';

export type DrawerState = 'collapsed' | 'expanded';

const UI_DISPLAY_LIMIT = 50;

const DRAG_THRESHOLD_RATIO = 0.08;
const VELOCITY_THRESHOLD = 0.2;

interface BlockDrawerProps {
  state: DrawerState;
  onStateChange: (state: DrawerState) => void;
  section: SectionType;
  currentBlock?: string;
  onBlockSelect: (block: string) => void;
  // blockVariantLimit hanya untuk badge hint — tidak lock selection
  blockVariantLimit?: number;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

export function BlockDrawer(props: BlockDrawerProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <DrawerMode {...props} /> : <SheetMode {...props} />;
}

// ============================================================================
// DRAWER MODE (Mobile)
// ============================================================================

function DrawerMode({
  state,
  onStateChange,
  section,
  currentBlock,
  onBlockSelect,
  blockVariantLimit = 3,
}: BlockDrawerProps) {
  const [search, setSearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);
  const isExpanded = state === 'expanded';

  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const currentDragY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const activeTouchId = useRef<number | null>(null);

  const allBlocks = useMemo(() => BLOCK_OPTIONS_MAP[section] || [], [section]);

  const filteredBlocks = useMemo(() => {
    if (!debouncedSearch.trim()) return allBlocks;
    const s = debouncedSearch.toLowerCase();
    return allBlocks.filter(
      (b) => b.value.toLowerCase().includes(s) || b.label.toLowerCase().includes(s)
    );
  }, [allBlocks, debouncedSearch]);

  const displayedBlocks = useMemo(() => filteredBlocks.slice(0, UI_DISPLAY_LIMIT), [filteredBlocks]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: displayedBlocks.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  useEffect(() => {
    rowVirtualizer.scrollToIndex(0, { align: 'start' });
  }, [debouncedSearch, section, rowVirtualizer]);

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => rowVirtualizer.measure(), 50);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, rowVirtualizer]);

  const handleBlockSelect = useCallback((v: string) => onBlockSelect(v), [onBlockSelect]);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);

  const setDragTransform = useCallback((y: number, withTransition: boolean) => {
    if (!drawerRef.current) return;
    drawerRef.current.style.transition = withTransition
      ? 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
      : 'none';
    drawerRef.current.style.transform = `translateY(${y}px)`;
  }, []);

  const resetTransform = useCallback((withTransition = true) => {
    if (!drawerRef.current) return;
    drawerRef.current.style.transition = withTransition
      ? 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
      : 'none';
    drawerRef.current.style.transform = 'translateY(0px)';
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (activeTouchId.current !== null) return;
    const touch = e.touches[0];
    activeTouchId.current = touch.identifier;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
    currentDragY.current = 0;
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId.current);
    if (!touch) return;
    const deltaY = touch.clientY - touchStartY.current;
    if (isExpanded && scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      if (scrollTop > 0 && deltaY > 0) return;
    }
    isDragging.current = true;
    let clampedDelta = deltaY;
    if (isExpanded) {
      clampedDelta = Math.max(0, deltaY);
    } else {
      clampedDelta = Math.min(0, deltaY) * 0.4;
    }
    currentDragY.current = clampedDelta;
    setDragTransform(clampedDelta, false);
  }, [isExpanded, setDragTransform]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId.current);
    if (!touch) return;
    activeTouchId.current = null;
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaY = currentDragY.current;
    const elapsed = Date.now() - touchStartTime.current;
    const velocity = Math.abs(deltaY) / elapsed;
    const expandedHeight = window.innerHeight * 0.95;
    const threshold = expandedHeight * DRAG_THRESHOLD_RATIO;
    let nextState: DrawerState = state;
    if (isExpanded) {
      if (deltaY > threshold || velocity > VELOCITY_THRESHOLD) nextState = 'collapsed';
    } else {
      if (Math.abs(deltaY) > threshold || velocity > VELOCITY_THRESHOLD) nextState = 'expanded';
    }
    resetTransform(true);
    if (nextState !== state) onStateChange(nextState);
    currentDragY.current = 0;
  }, [state, isExpanded, onStateChange, resetTransform]);

  return (
    <Drawer.Root open={true} onOpenChange={() => { }} modal={false} noBodyStyles dismissible={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-30" />
        <Drawer.Content
          ref={drawerRef}
          className={cn(
            'fixed bottom-0 left-4 right-4 z-40 flex flex-col rounded-t-[20px] bg-background border-t shadow-2xl',
            isExpanded ? 'h-[95vh]' : 'h-auto min-h-[115px]',
          )}
          style={{ transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)' }}
          aria-describedby="block-drawer-description"
        >
          <VisuallyHidden.Root>
            <Drawer.Title>Select {section} block</Drawer.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root id="block-drawer-description">
            <Drawer.Description>Choose a block design for the {section} section</Drawer.Description>
          </VisuallyHidden.Root>

          {/* Drag handle */}
          <div
            className="flex flex-col items-center pt-3 pb-2 shrink-0 select-none gap-1"
            style={{ cursor: 'grab', touchAction: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => !isDragging.current && onStateChange(isExpanded ? 'collapsed' : 'expanded')}
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors" />
            {!isExpanded && (
              <p className="text-xs text-muted-foreground mt-1">Tap or swipe up to open</p>
            )}
          </div>

          {/* Header */}
          {isExpanded && (
            <div className="px-4 pb-3 border-b shrink-0 space-y-3">
              <h3 className="capitalize font-semibold text-foreground">{section}</h3>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search blocks..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-8 h-9"
                />
                {debouncedSearch !== search && (
                  <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
                )}
              </div>
            </div>
          )}

          {/* Block list */}
          {isExpanded && (
            <div ref={scrollContainerRef} className="flex-1 overflow-auto pb-20">
              {displayedBlocks.length > 0 ? (
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const block = displayedBlocks[virtualItem.index];
                    return (
                      <div
                        key={virtualItem.key}
                        style={{
                          position: 'absolute', top: 0, left: 0,
                          width: '100%', height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <BlockListItem
                          block={block}
                          isSelected={currentBlock === block.value}
                          onSelect={handleBlockSelect}
                          blockVariantLimit={blockVariantLimit}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                  <Search className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">No blocks found matching &quot;{search}&quot;</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// ============================================================================
// SHEET MODE (Desktop)
// ============================================================================

function SheetMode({
  state,
  onStateChange,
  section,
  currentBlock,
  onBlockSelect,
  blockVariantLimit = 3,
}: BlockDrawerProps) {
  const [search, setSearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  const allBlocks = useMemo(() => BLOCK_OPTIONS_MAP[section] || [], [section]);

  const filteredBlocks = useMemo(() => {
    if (!debouncedSearch.trim()) return allBlocks;
    const s = debouncedSearch.toLowerCase();
    return allBlocks.filter(
      (b) => b.value.toLowerCase().includes(s) || b.label.toLowerCase().includes(s)
    );
  }, [allBlocks, debouncedSearch]);

  const displayedBlocks = useMemo(() => filteredBlocks.slice(0, UI_DISPLAY_LIMIT), [filteredBlocks]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: displayedBlocks.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  useEffect(() => {
    if (state === 'expanded') rowVirtualizer.scrollToIndex(0, { align: 'start' });
  }, [debouncedSearch, section, state, rowVirtualizer]);

  useEffect(() => {
    if (state === 'expanded') {
      const t = setTimeout(() => rowVirtualizer.measure(), 50);
      return () => clearTimeout(t);
    }
  }, [state, rowVirtualizer]);

  const handleBlockSelect = useCallback((v: string) => onBlockSelect(v), [onBlockSelect]);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);
  const isCollapsed = state === 'collapsed';

  return (
    <>
      {isCollapsed && (
        <div className="fixed right-0 top-14 bottom-0 w-12 bg-background border-l shadow-lg z-40 flex items-center justify-center">
          <Button variant="ghost" size="sm" onClick={() => onStateChange('expanded')} className="h-auto py-8" title="Open block selector">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <Sheet open={!isCollapsed} onOpenChange={() => onStateChange('collapsed')} modal={false}>
        <SheetContent side="right" className="w-[400px] p-0 flex flex-col z-40" onInteractOutside={(e) => e.preventDefault()}>
          <SheetHeader className="p-4 border-b shrink-0">
            <VisuallyHidden.Root>
              <SheetTitle>{section} Blocks</SheetTitle>
              <SheetDescription>Block selector for {section}</SheetDescription>
            </VisuallyHidden.Root>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onStateChange('collapsed')} title="Close block selector">
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search blocks..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-8 h-9"
                />
                {debouncedSearch !== search && (
                  <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
                )}
              </div>
            </div>
          </SheetHeader>

          <div ref={scrollContainerRef} className="flex-1 overflow-auto pb-4">
            {displayedBlocks.length > 0 ? (
              <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const block = displayedBlocks[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <BlockListItem
                        block={block}
                        isSelected={currentBlock === block.value}
                        onSelect={handleBlockSelect}
                        blockVariantLimit={blockVariantLimit}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <Search className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">No blocks found matching &quot;{search}&quot;</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ============================================================================
// BLOCK LIST ITEM
// ✅ CANVA STRATEGY: Semua block bisa diklik
// Badge Pro = hint visual saja, tidak memblokir selection
// ============================================================================

interface BlockListItemProps {
  block: BlockOption;
  isSelected: boolean;
  onSelect: (blockValue: string) => void;
  blockVariantLimit?: number;
}

const BlockListItem = memo(function BlockListItem({
  block,
  isSelected,
  onSelect,
  blockVariantLimit = 3,
}: BlockListItemProps) {
  // isPro dari block.isPro (pre-computed) atau hitung dari limit
  const isPro = isFinite(blockVariantLimit)
    ? (() => {
      const match = block.value.match(/(\d+)$/);
      return match ? parseInt(match[1]) > blockVariantLimit : false;
    })()
    : false;

  const handleClick = useCallback(() => {
    // ✅ Semua block bisa dipilih — tidak ada intercept
    onSelect(block.value);
  }, [block.value, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full h-14 px-4 flex items-center justify-between border-b transition-colors',
        isSelected
          ? 'bg-primary/10 border-primary/20'
          : 'hover:bg-muted/50 border-border'
      )}
    >
      <span className="text-sm font-medium text-left">{block.label}</span>

      <div className="flex items-center gap-2 ml-2 shrink-0">
        {/* ✅ Badge Pro = hint visual saja, tidak lock */}
        {isPro && (
          <span className="flex items-center gap-1 text-xs font-medium
                           text-amber-600 dark:text-amber-400
                           bg-amber-50 dark:bg-amber-950/40
                           border border-amber-200 dark:border-amber-800
                           rounded-full px-2 py-0.5">
            <Crown className="h-3 w-3" />
            Pro
          </span>
        )}
        {isSelected && (
          <Check className="h-4 w-4 text-primary" />
        )}
      </div>
    </button>
  );
});
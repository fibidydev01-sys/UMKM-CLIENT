/**
 * BlockDrawer Component - LIST VIEW (Not Card)
 * 
 * ✅ FIXED: Removed setState in useEffect (Line 64)
 * - Used lazy initialization for media query
 * - Also fixed unescaped quotes in JSX (Lines 254, 427)
 * 
 * Changes:
 * - Card grid → Simple list
 * - Faster rendering
 * - Better mobile UX
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
import { cn } from '@/lib/utils';
import { Minimize2, Grid3x3, Search, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { SectionType } from './builder-sidebar';
import type { BlockOption } from './block-options';
import { BLOCK_OPTIONS_MAP } from './block-options';

export type DrawerState = 'collapsed' | 'expanded';

const UI_DISPLAY_LIMIT = 50;

interface BlockDrawerProps {
  state: DrawerState;
  onStateChange: (state: DrawerState) => void;
  section: SectionType;
  currentBlock?: string;
  onBlockSelect: (block: string) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useMediaQuery(query: string): boolean {
  // ✅ FIX: Lazy initialization instead of setState in effect
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    // ✅ REMOVED: setMatches(media.matches); - moved to lazy init
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

function DrawerMode({
  state,
  onStateChange,
  section,
  currentBlock,
  onBlockSelect,
}: BlockDrawerProps) {
  const [search, setSearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  const allBlocks = useMemo(() => BLOCK_OPTIONS_MAP[section] || [], [section]);

  const filteredBlocks = useMemo(() => {
    if (!debouncedSearch.trim()) return allBlocks;
    const searchLower = debouncedSearch.toLowerCase();
    return allBlocks.filter(
      (block) =>
        block.value.toLowerCase().includes(searchLower) ||
        block.label.toLowerCase().includes(searchLower)
    );
  }, [allBlocks, debouncedSearch]);

  const displayedBlocks = useMemo(() => {
    return filteredBlocks.slice(0, UI_DISPLAY_LIMIT);
  }, [filteredBlocks]);

  // Virtual scrolling for list items (each item = 1 row)
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: displayedBlocks.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 56, // List item height: 56px
    overscan: 5,
  });

  useEffect(() => {
    rowVirtualizer.scrollToIndex(0, { align: 'start' });
  }, [debouncedSearch, section, rowVirtualizer]);

  useEffect(() => {
    if (state === 'expanded') {
      const timer = setTimeout(() => {
        rowVirtualizer.measure();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [state, rowVirtualizer]);

  const handleBlockSelect = useCallback(
    (blockValue: string) => {
      onBlockSelect(blockValue);
    },
    [onBlockSelect]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  return (
    <Drawer.Root
      open={true}
      onOpenChange={() => { }}
      modal={false}
      noBodyStyles
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-30" />

        <Drawer.Content
          className={cn(
            "fixed bottom-0 left-4 right-4 z-40 flex flex-col rounded-t-[20px] bg-background border-t shadow-2xl",
            state === 'expanded' ? "h-[95vh]" : "h-auto min-h-[120px]"
          )}
          aria-describedby="block-drawer-description"
        >
          <VisuallyHidden.Root>
            <Drawer.Title>Select {section} block</Drawer.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root id="block-drawer-description">
            <Drawer.Description>Choose a block design for the {section} section</Drawer.Description>
          </VisuallyHidden.Root>

          <div
            className="flex justify-center pt-3 pb-2 shrink-0 cursor-pointer"
            onClick={() => onStateChange(state === 'expanded' ? 'collapsed' : 'expanded')}
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors" />
          </div>

          <div className="px-4 pt-2 pb-3 border-b shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="capitalize font-semibold text-foreground">
                  {section} Blocks
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({displayedBlocks.length})
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {state === 'expanded'
                    ? 'Showing first 50 blocks'
                    : 'Drag up to see blocks'}
                </p>
              </div>
              <button
                onClick={() => onStateChange(state === 'expanded' ? 'collapsed' : 'expanded')}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                title={state === 'expanded' ? 'Collapse' : 'Expand'}
              >
                {state === 'expanded' ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Grid3x3 className="h-4 w-4" />
                )}
              </button>
            </div>

            {state === 'expanded' && (
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
            )}
          </div>

          {state === 'expanded' && (
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-auto pb-20"
            >
              {displayedBlocks.length > 0 ? (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const block = displayedBlocks[virtualItem.index];
                    return (
                      <div
                        key={virtualItem.key}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <BlockListItem
                          block={block}
                          isSelected={currentBlock === block.value}
                          onSelect={handleBlockSelect}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                  <Search className="h-12 w-12 mb-3 opacity-50" />
                  {/* ✅ FIXED: Escaped quotes */}
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

function SheetMode({
  state,
  onStateChange,
  section,
  currentBlock,
  onBlockSelect,
}: BlockDrawerProps) {
  const [search, setSearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  const allBlocks = useMemo(() => BLOCK_OPTIONS_MAP[section] || [], [section]);

  const filteredBlocks = useMemo(() => {
    if (!debouncedSearch.trim()) return allBlocks;
    const searchLower = debouncedSearch.toLowerCase();
    return allBlocks.filter(
      (block) =>
        block.value.toLowerCase().includes(searchLower) ||
        block.label.toLowerCase().includes(searchLower)
    );
  }, [allBlocks, debouncedSearch]);

  const displayedBlocks = useMemo(() => {
    return filteredBlocks.slice(0, UI_DISPLAY_LIMIT);
  }, [filteredBlocks]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: displayedBlocks.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  useEffect(() => {
    if (state === 'expanded') {
      rowVirtualizer.scrollToIndex(0, { align: 'start' });
    }
  }, [debouncedSearch, section, state, rowVirtualizer]);

  useEffect(() => {
    if (state === 'expanded') {
      const timer = setTimeout(() => {
        rowVirtualizer.measure();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [state, rowVirtualizer]);

  const handleBlockSelect = useCallback(
    (blockValue: string) => {
      onBlockSelect(blockValue);
    },
    [onBlockSelect]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const isCollapsed = state === 'collapsed';

  return (
    <>
      {isCollapsed && (
        <div className="fixed right-0 top-14 bottom-0 w-12 bg-background border-l shadow-lg z-40 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStateChange('expanded')}
            className="h-auto py-8"
            title="Open block selector"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <Sheet open={!isCollapsed} onOpenChange={() => onStateChange('collapsed')} modal={false}>
        <SheetContent
          side="right"
          className="w-[400px] p-0 flex flex-col z-40"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="p-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <SheetTitle className="capitalize text-foreground">
                  {section} Blocks
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    ({displayedBlocks.length})
                  </span>
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Showing first 50 blocks for your section
                </SheetDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStateChange('collapsed')}
                title="Close block selector"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative mt-3">
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
          </SheetHeader>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto pb-4"
          >
            {displayedBlocks.length > 0 ? (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const block = displayedBlocks[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <BlockListItem
                        block={block}
                        isSelected={currentBlock === block.value}
                        onSelect={handleBlockSelect}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <Search className="h-12 w-12 mb-3 opacity-50" />
                {/* ✅ FIXED: Escaped quotes */}
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

interface BlockListItemProps {
  block: BlockOption;
  isSelected: boolean;
  onSelect: (blockValue: string) => void;
}

const BlockListItem = memo(function BlockListItem({ block, isSelected, onSelect }: BlockListItemProps) {
  const handleClick = useCallback(() => {
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
      {isSelected && (
        <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
      )}
    </button>
  );
});
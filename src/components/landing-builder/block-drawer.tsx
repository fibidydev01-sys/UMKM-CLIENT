/**
 * BlockDrawer Component - Canva-Style Virtual Scrolling! 🎨
 *
 * Vaul drawer with smooth infinite scroll
 * Virtual scrolling for 200+ blocks (only renders visible items)
 * Performance optimized like Canva/Figma
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
import { Minimize2, Grid3x3, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SectionType } from './builder-sidebar';
import type { BlockOption } from './block-options';
import { BLOCK_OPTIONS_MAP } from './block-options'; // 🚀 Auto-generated blocks!

export type DrawerState = 'collapsed' | 'expanded';

/**
 * 🎯 UI DISPLAY LIMIT
 *
 * Limits the number of blocks shown in the UI for better UX.
 * - Data remains 200 blocks per section (unchanged)
 * - UI only displays first 10 blocks per section
 * - This prevents overwhelming users with too many options
 */
const UI_DISPLAY_LIMIT = 10;

interface BlockDrawerProps {
  state: DrawerState;
  onStateChange: (state: DrawerState) => void;
  section: SectionType;
  currentBlock?: string;
  onBlockSelect: (block: string) => void;
}

/**
 * Custom hook for debounced value (performance optimization)
 */
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

/**
 * Custom hook for media query detection
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * 🚀 MAIN EXPORT: Responsive Block Selector
 *
 * Renders different UI based on screen size:
 * - Mobile (<768px): Drawer from bottom (Vaul)
 * - Tablet/Desktop (≥768px): Sheet from right (Radix Dialog)
 */
export function BlockDrawer(props: BlockDrawerProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? <DrawerMode {...props} /> : <SheetMode {...props} />;
}

/**
 * 📱 MOBILE MODE: Drawer from bottom (Vaul)
 *
 * Features:
 * - Virtual scrolling (only renders ~15 visible items at a time)
 * - Infinite smooth scroll (no pagination buttons)
 * - Debounced search (300ms)
 * - Memoized components
 * - Buttery 60fps performance
 */
function DrawerMode({
  state,
  onStateChange,
  section,
  currentBlock,
  onBlockSelect,
}: BlockDrawerProps) {
  const [search, setSearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSmallMobile = useMediaQuery('(max-width: 639px)');

  // 🚀 OPTIMIZATION: Debounce search input (300ms delay)
  const debouncedSearch = useDebounce(search, 300);

  // Get all blocks for current section (memoized)
  const allBlocks = useMemo(() => BLOCK_OPTIONS_MAP[section] || [], [section]);

  // Filter by search (uses debounced value for performance)
  const filteredBlocks = useMemo(() => {
    if (!debouncedSearch.trim()) return allBlocks;
    const searchLower = debouncedSearch.toLowerCase();
    return allBlocks.filter(
      (block) =>
        block.value.toLowerCase().includes(searchLower) ||
        block.label.toLowerCase().includes(searchLower)
    );
  }, [allBlocks, debouncedSearch]);

  // 🎯 LIMIT DISPLAY: Only show first 10 blocks in UI
  // Data remains 200, but we slice to improve UX
  const displayedBlocks = useMemo(() => {
    return filteredBlocks.slice(0, UI_DISPLAY_LIMIT);
  }, [filteredBlocks]);

  // 🎨 Responsive columns: 2 cols on small mobile (375px), 3 cols on wider (640px+)
  const MAX_COLUMNS = isSmallMobile ? 2 : 3;
  const rows = useMemo(() => {
    const result: BlockOption[][] = [];
    for (let i = 0; i < displayedBlocks.length; i += MAX_COLUMNS) {
      result.push(displayedBlocks.slice(i, i + MAX_COLUMNS));
    }
    return result;
  }, [displayedBlocks, MAX_COLUMNS]);

  // 🚀 Virtual scrolling (only renders visible rows!)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 160, // aspect-square ~149px + gap-3 (12px)
    overscan: 3, // Render 3 extra rows above/below viewport (smooth scrolling)
  });

  // Reset scroll when search or section changes
  useEffect(() => {
    rowVirtualizer.scrollToIndex(0, { align: 'start' });
  }, [debouncedSearch, section, rowVirtualizer]);

  // Force virtualizer to re-measure when drawer mounts with expanded state
  // Handles Sheet→Drawer transition on resize (container has 0 height initially)
  useEffect(() => {
    if (state === 'expanded') {
      const timer = setTimeout(() => {
        rowVirtualizer.measure();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [state, rowVirtualizer]);

  // 🚀 OPTIMIZATION: Memoize handlers
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
      onOpenChange={() => {}}
      modal={false}
      noBodyStyles
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9998]" />

        <Drawer.Content
          className={cn(
            "fixed bottom-0 left-4 right-4 z-[9999] flex flex-col rounded-t-[20px] bg-background border-t shadow-2xl",
            state === 'expanded' ? "h-[80vh]" : "h-auto min-h-[120px]"
          )}
          aria-describedby="block-drawer-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>Select {section} block</VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="block-drawer-description">
              Choose a block design for the {section} section
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div
            className="flex justify-center pt-3 pb-2 shrink-0 cursor-pointer"
            onClick={() => onStateChange(state === 'expanded' ? 'collapsed' : 'expanded')}
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors" />
          </div>

          {/* Header */}
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
                    ? 'Showing first 10 blocks'
                    : 'Drag up to see blocks'}
                </p>
              </div>
              {/* Toggle Button */}
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

            {/* Search Bar */}
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

          {/* 🎨 CANVA-STYLE: Virtual Scrolling Grid */}
          {state === 'expanded' && (
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-auto p-4"
            >
              {displayedBlocks.length > 0 ? (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const rowBlocks = rows[virtualRow.index];
                    return (
                      <div
                        key={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        className="flex justify-center"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                          {rowBlocks.map((block) => (
                            <BlockCard
                              key={block.value}
                              block={block}
                              isSelected={currentBlock === block.value}
                              onSelect={handleBlockSelect}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Search className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">No blocks found matching "{search}"</p>
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

/**
 * 💻 TABLET/DESKTOP MODE: Sheet from right (Radix Dialog)
 *
 * Features:
 * - Collapsible with arrow button (48px collapsed, 400px expanded)
 * - Fixed position on right side
 * - High z-index (above content)
 * - Same virtual scrolling as DrawerMode
 * - No modal overlay (doesn't block clicks)
 */
function SheetMode({
  state,
  onStateChange,
  section,
  currentBlock,
  onBlockSelect,
}: BlockDrawerProps) {
  const [search, setSearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 🚀 OPTIMIZATION: Debounce search input (300ms delay)
  const debouncedSearch = useDebounce(search, 300);

  // Get all blocks for current section (memoized)
  const allBlocks = useMemo(() => BLOCK_OPTIONS_MAP[section] || [], [section]);

  // Filter by search (uses debounced value for performance)
  const filteredBlocks = useMemo(() => {
    if (!debouncedSearch.trim()) return allBlocks;
    const searchLower = debouncedSearch.toLowerCase();
    return allBlocks.filter(
      (block) =>
        block.value.toLowerCase().includes(searchLower) ||
        block.label.toLowerCase().includes(searchLower)
    );
  }, [allBlocks, debouncedSearch]);

  // 🎯 LIMIT DISPLAY: Only show first 10 blocks in UI
  // Data remains 200, but we slice to improve UX
  const displayedBlocks = useMemo(() => {
    return filteredBlocks.slice(0, UI_DISPLAY_LIMIT);
  }, [filteredBlocks]);

  // 🎨 CANVA-STYLE: Virtual scrolling config
  const MAX_COLUMNS = 3; // 3 columns for sheet (narrower than drawer)
  const rows = useMemo(() => {
    const result: BlockOption[][] = [];
    for (let i = 0; i < displayedBlocks.length; i += MAX_COLUMNS) {
      result.push(displayedBlocks.slice(i, i + MAX_COLUMNS));
    }
    return result;
  }, [displayedBlocks]);

  // 🚀 Virtual scrolling (only renders visible rows!)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 130, // aspect-square ~117px + gap-3 (12px)
    overscan: 3,
  });

  // Reset scroll when search or section changes
  useEffect(() => {
    if (state === 'expanded') {
      rowVirtualizer.scrollToIndex(0, { align: 'start' });
    }
  }, [debouncedSearch, section, state, rowVirtualizer]);

  // Force virtualizer to re-measure when sheet opens
  // Sheet animation delays container layout, so virtualizer sees 0 height initially
  useEffect(() => {
    if (state === 'expanded') {
      const timer = setTimeout(() => {
        rowVirtualizer.measure();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [state, rowVirtualizer]);

  // 🚀 OPTIMIZATION: Memoize handlers
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
      {/* 🚀 Collapsed State: Arrow button strip (always visible) */}
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

      {/* 🚀 Expanded State: Full Sheet */}
      <Sheet open={!isCollapsed} onOpenChange={() => onStateChange('collapsed')} modal={false}>
        <SheetContent
          side="right"
          className="w-[400px] p-0 flex flex-col z-50"
          // Prevent close on outside click (only arrow button can close)
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
                  Showing first 10 blocks for your section
                </SheetDescription>
              </div>
              {/* Close Button (arrow) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStateChange('collapsed')}
                title="Close block selector"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Search Bar */}
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

          {/* 🎨 CANVA-STYLE: Virtual Scrolling Grid */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto p-4"
          >
            {displayedBlocks.length > 0 ? (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const rowBlocks = rows[virtualRow.index];
                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="grid grid-cols-3 gap-3 w-full">
                        {rowBlocks.map((block) => (
                          <BlockCard
                            key={block.value}
                            block={block}
                            isSelected={currentBlock === block.value}
                            onSelect={handleBlockSelect}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Search className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">No blocks found matching "{search}"</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/**
 * 🚀 OPTIMIZED: Memoized block card component
 * Prevents unnecessary re-renders when parent re-renders
 */
interface BlockCardProps {
  block: BlockOption;
  isSelected: boolean;
  onSelect: (blockValue: string) => void;
}

const BlockCard = memo(function BlockCard({ block, isSelected, onSelect }: BlockCardProps) {
  const handleClick = useCallback(() => {
    onSelect(block.value);
  }, [block.value, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full aspect-square flex items-center justify-center p-2 rounded-md border transition-colors',
        isSelected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-muted/50 hover:bg-muted hover:border-muted-foreground/30'
      )}
    >
      <span className="text-xs font-medium line-clamp-2 text-center leading-tight">{block.label}</span>
    </button>
  );
});

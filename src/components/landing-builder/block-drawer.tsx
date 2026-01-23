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
import { cn } from '@/lib/utils';
import { Check, Minimize2, Grid3x3, Search, Loader2 } from 'lucide-react';
import type { SectionType } from './builder-sidebar';
import type { BlockOption } from './block-options';
import { BLOCK_OPTIONS_MAP } from './block-options'; // 🚀 Auto-generated blocks!

export type DrawerState = 'collapsed' | 'expanded';

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
 * 🎨 Canva-Style Block Drawer with Virtual Scrolling
 *
 * Features:
 * - Virtual scrolling (only renders ~15 visible items at a time)
 * - Infinite smooth scroll (no pagination buttons)
 * - Debounced search (300ms)
 * - Memoized components
 * - Buttery 60fps performance
 */
export function BlockDrawer({
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

  // 🎨 CANVA-STYLE: Virtual scrolling config
  // Grid: Responsive (2 mobile, 3 tablet, 4 desktop)
  // We calculate rows based on max columns (4) for virtual scrolling
  const MAX_COLUMNS = 4; // Desktop max
  const rows = useMemo(() => {
    const result: BlockOption[][] = [];
    for (let i = 0; i < filteredBlocks.length; i += MAX_COLUMNS) {
      result.push(filteredBlocks.slice(i, i + MAX_COLUMNS));
    }
    return result;
  }, [filteredBlocks]);

  // 🚀 Virtual scrolling (only renders visible rows!)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 120, // Estimated row height (adjust for your card size)
    overscan: 3, // Render 3 extra rows above/below viewport (smooth scrolling)
  });

  // Reset scroll when search or section changes
  useEffect(() => {
    rowVirtualizer.scrollToIndex(0, { align: 'start' });
  }, [debouncedSearch, section, rowVirtualizer]);

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
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9998]" />

        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-[9999] flex flex-col rounded-t-[20px] bg-background border-t shadow-2xl",
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
                    ({filteredBlocks.length})
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {state === 'expanded'
                    ? 'Scroll to browse all blocks'
                    : 'Drag up to see all blocks'}
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
              style={{ contain: 'strict' }} // Performance hint for browser
            >
              {filteredBlocks.length > 0 ? (
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
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto"
                      >
                        {rowBlocks.map((block) => (
                          <BlockCard
                            key={block.value}
                            block={block}
                            isSelected={currentBlock === block.value}
                            onSelect={handleBlockSelect}
                          />
                        ))}
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
 * 🚀 OPTIMIZED: Memoized block card component
 * Prevents unnecessary re-renders when parent re-renders
 */
interface BlockCardProps {
  block: BlockOption;
  isSelected: boolean;
  onSelect: (blockValue: string) => void;
}

const BlockCard = memo(function BlockCard({ block, isSelected, onSelect }: BlockCardProps) {
  const Icon = block.icon;

  const handleClick = useCallback(() => {
    onSelect(block.value);
  }, [block.value, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all aspect-square hover:shadow-md hover:scale-[1.02]',
        isSelected
          ? 'border-primary bg-primary/10 text-primary shadow-md scale-[1.02]'
          : 'border-transparent bg-muted/50 hover:border-primary/50 hover:bg-muted'
      )}
    >
      <Icon className="h-6 w-6 mb-2 flex-shrink-0" />
      <span className="text-xs font-medium line-clamp-2 text-center">{block.label}</span>
      {isSelected && (
        <Check className="h-4 w-4 mt-1 text-primary animate-in fade-in zoom-in duration-200" />
      )}
    </button>
  );
});

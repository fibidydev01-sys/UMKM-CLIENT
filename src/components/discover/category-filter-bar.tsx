// ══════════════════════════════════════════════════════════════
// CATEGORY FILTER BAR - V10.7 FINAL
// Fixed: Sticky z-index lowered so search dropdown stays on top
// ══════════════════════════════════════════════════════════════

'use client';

import { useRef, useState, useEffect, useCallback, memo } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Check,
  TrendingUp,
  Clock,
  History,
  ArrowDownAZ,
  ArrowUpAZ,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { CATEGORY_CONFIG, getCategoryList, type CategoryConfig } from '@/config/categories';

// ══════════════════════════════════════════════════════════════
// Z-INDEX HIERARCHY (FINAL V10.7):
// 
// Search Dropdown:          z-[99999]  ← Highest (from discover-search)
// Drawer overlay:           z-[9999]
// Drawer content:           z-[10000]
// Sort/Filter Popover:      z-[200]
// Header (fixed):           z-50
// Filter Bar (sticky):      z-30       ← LOWERED from z-40
// Hero elements:            z-[10]
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type SortOption = 'popular' | 'newest' | 'oldest' | 'name_asc' | 'name_desc';

interface CategoryFilterBarProps {
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  isSticky?: boolean;
  selectedColor?: string | null;
  onColorSelect?: (color: string | null) => void;
}

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

const sortOptions: {
  value: SortOption;
  label: string;
  description: string;
  icon: typeof TrendingUp;
}[] = [
    {
      value: 'popular',
      label: 'Popular',
      description: 'Toko dengan produk terbanyak',
      icon: TrendingUp,
    },
    {
      value: 'newest',
      label: 'Terbaru',
      description: 'Toko yang baru bergabung',
      icon: Clock,
    },
    {
      value: 'oldest',
      label: 'Terlama',
      description: 'Toko yang sudah lama bergabung',
      icon: History,
    },
    {
      value: 'name_asc',
      label: 'Nama A-Z',
      description: 'Urutkan nama dari A ke Z',
      icon: ArrowDownAZ,
    },
    {
      value: 'name_desc',
      label: 'Nama Z-A',
      description: 'Urutkan nama dari Z ke A',
      icon: ArrowUpAZ,
    },
  ];

function getUniqueColors(): { color: string; label: string; categories: string[] }[] {
  const categories = getCategoryList();
  const colorMap = new Map<string, { label: string; categories: string[] }>();

  categories.forEach((cat) => {
    if (!colorMap.has(cat.color)) {
      colorMap.set(cat.color, { label: cat.labelShort, categories: [cat.key] });
    } else {
      colorMap.get(cat.color)!.categories.push(cat.key);
    }
  });

  return Array.from(colorMap.entries()).map(([color, data]) => ({
    color,
    label: data.label,
    categories: data.categories,
  }));
}

// ══════════════════════════════════════════════════════════════
// SORT PANEL
// ══════════════════════════════════════════════════════════════

interface SortPanelProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClose: () => void;
}

const SortPanel = memo(function SortPanel({
  sortBy,
  onSortChange,
  onClose,
}: SortPanelProps) {
  return (
    <div className="w-[280px] p-0">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-sm">Urutkan</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-2">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = sortBy === option.value;
          return (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                onClose();
              }}
              className={cn(
                'flex items-start gap-3 w-full p-3 rounded-lg text-left transition-colors',
                isSelected ? 'bg-primary/10' : 'hover:bg-muted'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', isSelected && 'text-primary')}>
                  {option.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary shrink-0 mt-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
});

// ══════════════════════════════════════════════════════════════
// FILTER PANEL
// ══════════════════════════════════════════════════════════════

interface FilterPanelProps {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
  tagSearch: string;
  onTagSearchChange: (value: string) => void;
  categories: CategoryConfig[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onClose: () => void;
}

const FilterPanel = memo(function FilterPanel({
  selectedColor,
  onColorSelect,
  tagSearch,
  onTagSearchChange,
  categories,
  selectedCategory,
  onCategorySelect,
  onClose,
}: FilterPanelProps) {
  const uniqueColors = getUniqueColors();

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(tagSearch.toLowerCase()) ||
    cat.labelShort.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="w-[500px] lg:w-[600px] p-0">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Filters</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-6">
        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Tags
          </label>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={tagSearch}
              onChange={(e) => onTagSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {selectedCategory && (
            <div className="mb-3">
              <Badge
                variant="secondary"
                className="gap-1 pr-1"
                style={{
                  backgroundColor: `${CATEGORY_CONFIG[selectedCategory]?.color}15`,
                  color: CATEGORY_CONFIG[selectedCategory]?.color,
                }}
              >
                {CATEGORY_CONFIG[selectedCategory]?.labelShort}
                <button
                  onClick={() => onCategorySelect(null)}
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => onCategorySelect(isSelected ? null : cat.key)}
                  className={cn(
                    'flex items-center gap-2 w-full px-2 py-1.5 rounded text-left text-sm transition-colors',
                    isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                  )}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon className="h-3 w-3" style={{ color: cat.color }} />
                  </div>
                  <span className="truncate">{cat.labelShort}</span>
                  {isSelected && <Check className="h-3 w-3 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-muted-foreground">Color</label>
            {selectedColor && (
              <button onClick={() => onColorSelect(null)} className="text-xs text-primary hover:underline">
                Clear
              </button>
            )}
          </div>

          {selectedColor && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-muted">
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-sm font-mono">{selectedColor}</span>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {uniqueColors.map(({ color, categories: cats }) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => onColorSelect(isSelected ? null : color)}
                  className={cn(
                    'group relative aspect-square rounded-lg transition-all',
                    'hover:scale-110 hover:shadow-lg',
                    isSelected && 'ring-2 ring-primary ring-offset-2'
                  )}
                  style={{ backgroundColor: color }}
                  title={`${cats.length} kategori`}
                >
                  {isSelected && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Pilih warna untuk filter berdasarkan tema kategori.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          {selectedCategory || selectedColor ? (
            <>
              {selectedCategory && <span className="font-medium">1 kategori</span>}
              {selectedCategory && selectedColor && <span> · </span>}
              {selectedColor && <span className="font-medium">1 warna</span>}
            </>
          ) : (
            'Tidak ada filter aktif'
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onCategorySelect(null);
              onColorSelect(null);
            }}
          >
            Reset
          </Button>
          <Button size="sm" onClick={onClose}>
            Terapkan
          </Button>
        </div>
      </div>
    </div>
  );
});

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function CategoryFilterBar({
  selectedCategory = null,
  onCategorySelect,
  sortBy = 'popular',
  onSortChange,
  isSticky = false,
  selectedColor = null,
  onColorSelect,
}: CategoryFilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const categories = getCategoryList();
  const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedColor ? 1 : 0);
  const currentSortLabel = sortOptions.find(s => s.value === sortBy)?.label || 'Popular';

  // Scroll arrows
  const checkScrollArrows = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScrollArrows();
    container.addEventListener('scroll', checkScrollArrows, { passive: true });
    window.addEventListener('resize', checkScrollArrows);
    return () => {
      container.removeEventListener('scroll', checkScrollArrows);
      window.removeEventListener('resize', checkScrollArrows);
    };
  }, [checkScrollArrows]);

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  // Handlers
  const handleCategoryClick = useCallback((categoryKey: string | null) => {
    onCategorySelect?.(categoryKey);
  }, [onCategorySelect]);

  const handleSortChange = useCallback((sort: SortOption) => {
    onSortChange?.(sort);
  }, [onSortChange]);

  const handleColorSelect = useCallback((color: string | null) => {
    onColorSelect?.(color);
  }, [onColorSelect]);

  return (
    <div
      className={cn(
        'bg-background border-b transition-all duration-300',
        // ══════════════════════════════════════════════════════
        // z-30: LOWERED from z-40
        // This ensures search dropdown (z-99999) stays on top
        // ══════════════════════════════════════════════════════
        isSticky && 'sticky top-16 z-30 shadow-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 h-14">

          {/* Sort Popover - z-[200] */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 shrink-0">
                {currentSortLabel}
                <ChevronDown className={cn('h-4 w-4 transition-transform', sortOpen && 'rotate-180')} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="bottom"
              className="p-0 w-auto z-[200]"
              sideOffset={8}
            >
              <SortPanel
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onClose={() => setSortOpen(false)}
              />
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="h-6 w-px bg-border shrink-0" />

          {/* Category Pills */}
          <div className="relative flex-1 flex items-center min-w-0">
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-10 h-8 w-8 flex items-center justify-center bg-gradient-to-r from-background via-background to-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-1"
            >
              <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200',
                  !selectedCategory
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                Discover
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200',
                    selectedCategory === cat.key
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  {cat.labelShort}
                </button>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 z-10 h-8 w-8 flex items-center justify-center bg-gradient-to-l from-background via-background to-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Popover - z-[200] */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn('gap-2 shrink-0', activeFilterCount > 0 && 'border-primary')}
              >
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {activeFilterCount}
                  </span>
                )}
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              className="p-0 w-auto z-[200]"
              sideOffset={8}
            >
              <FilterPanel
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
                tagSearch={tagSearch}
                onTagSearchChange={setTagSearch}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategoryClick}
                onClose={() => setFilterOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/cn';

interface ProductFiltersProps {
  storeSlug: string;
  categories?: string[];
  className?: string;
}

export function ProductFilters({
  storeSlug,
  categories = [],
  className,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  // Get initial values from URL
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  // Local state
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(search, 400);

  // ✅ FIXED: Update URL when debounced search changes
  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Get current search from URL
    const currentSearch = searchParams.get('search') || '';

    // Only update if actually changed
    if (debouncedSearch === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset page on search

    router.push(`/store/${storeSlug}/products?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, storeSlug]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.delete('page');

    router.push(`/store/${storeSlug}/products?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'newest') {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }

    router.push(`/store/${storeSlug}/products?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    router.push(`/store/${storeSlug}/products`);
  };

  const hasActiveFilters = search || category || sort !== 'newest';

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {/* Category Filter Mobile */}
              {categories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sort Mobile */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Urutkan</label>
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="name-asc">Nama A-Z</SelectItem>
                    <SelectItem value="name-desc">Nama Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={() => {
                    clearFilters();
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-4">
        {/* Category Filter */}
        {categories.length > 0 && (
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Sort */}
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="price-low">Harga Terendah</SelectItem>
            <SelectItem value="price-high">Harga Tertinggi</SelectItem>
            <SelectItem value="name-asc">Nama A-Z</SelectItem>
            <SelectItem value="name-desc">Nama Z-A</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
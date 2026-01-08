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
import { productsUrl } from '@/lib/store-url'; // ✅ NEW IMPORT

// ==========================================
// PRODUCT FILTERS COMPONENT
// ✅ FIXED: Uses store-url helper for subdomain routing
// ==========================================

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

  // Helper to build params object
  const buildParams = (overrides: Record<string, string | null> = {}) => {
    const params: Record<string, string> = {};

    // Current values
    if (debouncedSearch) params.search = debouncedSearch;
    if (category && category !== 'all') params.category = category;
    if (sort && sort !== 'newest') params.sort = sort;

    // Apply overrides
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === null) {
        delete params[key];
      } else if (value) {
        params[key] = value;
      }
    });

    return params;
  };

  // Update URL when debounced search changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch === currentSearch) return;

    const params = buildParams({
      search: debouncedSearch || null,
    });

    // ✅ FIXED: Use smart URL helper
    router.push(productsUrl(storeSlug, params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params = buildParams({
      category: value === 'all' ? null : value,
    });
    router.push(productsUrl(storeSlug, params));
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value);
    const params = buildParams({
      sort: value === 'newest' ? null : value,
    });
    router.push(productsUrl(storeSlug, params));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    // ✅ FIXED: Use smart URL helper
    router.push(productsUrl(storeSlug));
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
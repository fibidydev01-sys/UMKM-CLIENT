'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, List } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PageHeader } from '@/components/dashboard';
import { ProductsTable, ProductsGrid, ProductsGridSkeleton } from '@/components/products';
import { productsApi, getErrorMessage } from '@/lib/api';

import type { Product } from '@/types';

type ViewMode = 'list' | 'grid';

// ============================================================================
// TYPES
// ============================================================================

interface PageState {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractCategories(products: Product[]): string[] {
  const categories = products
    .map((p) => p.category)
    .filter((c): c is string => Boolean(c));

  return [...new Set(categories)].sort();
}

function parseCategories(response: unknown): string[] | null {
  if (Array.isArray(response)) {
    return response.filter((item): item is string => typeof item === 'string');
  }
  return null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProductsPage() {
  const [state, setState] = useState<PageState>({
    products: [],
    categories: [],
    isLoading: true,
    isRefreshing: false,
    error: null,
  });
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // ✅ FIX 1: Use ref to track if initial fetch has been done
  const hasFetched = useRef(false);

  // ✅ FIX 2: Use ref to track if component is mounted (prevent state updates after unmount)
  const isMounted = useRef(true);

  const { products, categories, isLoading, isRefreshing, error } = state;

  // ✅ FIX 3: Fetch data function - NOT in useCallback to avoid dependency issues
  const fetchData = async (showFullLoading = true) => {
    // Prevent duplicate calls
    if (!isMounted.current) return;

    setState((prev) => ({
      ...prev,
      isLoading: showFullLoading ? true : prev.isLoading,
      isRefreshing: !showFullLoading,
      error: null,
    }));

    try {
      // Single API call for products
      const productsRes = await productsApi.getAll({
        limit: 100,
      });

      if (!isMounted.current) return;

      const fetchedProducts = productsRes.data;

      // Try to get categories, fallback to extracting from products
      let fetchedCategories: string[];

      try {
        const categoriesRes = await productsApi.getCategories();
        const parsed = parseCategories(categoriesRes);
        fetchedCategories = parsed ?? extractCategories(fetchedProducts);
      } catch {
        fetchedCategories = extractCategories(fetchedProducts);
      }

      if (!isMounted.current) return;

      setState({
        products: fetchedProducts,
        categories: fetchedCategories,
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    } catch (err) {
      if (!isMounted.current) return;

      console.error('[ProductsPage] Failed to fetch:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: getErrorMessage(err),
      }));
    }
  };

  // ✅ FIX 4: Initial fetch - runs ONLY ONCE
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;

    // Only fetch if not already fetched
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData(true);
    }

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
    };
  }, []); // ← Empty deps, runs once on mount

  // ✅ FIX 5: Refresh handler - manual trigger only
  const handleRefresh = async () => {
    await fetchData(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  // View mode toggle component
  const ViewToggle = () => (
    <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)}>
      <ToggleGroupItem value="list" aria-label="List view" size="sm">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );

  if (isLoading) {
    return (
      <>
        <PageHeader title="Produk" description="Kelola produk toko Anda">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </PageHeader>
        {viewMode === 'list' ? <ProductsTableSkeleton /> : <ProductsGridSkeleton />}
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Produk" description="Kelola produk toko Anda">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button asChild>
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Link>
            </Button>
          </div>
        </PageHeader>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat produk</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              hasFetched.current = false;
              fetchData(true);
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Produk" description="Kelola produk toko Anda">
        <div className="flex items-center gap-2">
          <ViewToggle />
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Link>
          </Button>
        </div>
      </PageHeader>

      {viewMode === 'list' ? (
        <ProductsTable
          products={products}
          categories={categories}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <ProductsGrid
          products={products}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}

// ============================================================================
// SKELETON - MINIMAL VIEW
// Matches minimal table: Checkbox | Name+SKU | Date (3 columns)
// ============================================================================

function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar Skeleton - hanya search */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-80" />
      </div>

      {/* Table Skeleton - 3 columns minimal */}
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              {/* Checkbox */}
              <Skeleton className="h-4 w-4 flex-shrink-0" />

              {/* Name + SKU (dengan icon dummy) */}
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Date */}
              <Skeleton className="h-4 w-24 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
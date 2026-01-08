/**
 * ============================================================================
 * PRODUCTS PAGE - FIXED VERSION
 * ============================================================================
 * Route: /dashboard/products
 * 
 * Changes:
 * - Simplified delete flow (no optimistic update)
 * - Always fetch fresh data after mutations
 * - Cache-busting with timestamp
 * ============================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { ProductsTable } from '@/components/products';
import { productsApi, getErrorMessage } from '@/lib/api';

import type { Product } from '@/types';

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

  const { products, categories, isLoading, isRefreshing, error } = state;

  // ---------------------------------------------------------------------------
  // Data Fetching - FIXED: Added timestamp for cache busting
  // ---------------------------------------------------------------------------
  const fetchData = useCallback(async (showFullLoading = true) => {
    setState((prev) => ({
      ...prev,
      isLoading: showFullLoading ? true : prev.isLoading,
      isRefreshing: !showFullLoading,
      error: null,
    }));

    try {
      // ✅ FIX: Add timestamp to bust any caching
      const productsRes = await productsApi.getAll({
        limit: 100,
        _t: Date.now(), // Cache buster
      });
      const fetchedProducts = productsRes.data;

      let fetchedCategories: string[];

      try {
        const categoriesRes = await productsApi.getCategories();
        const parsed = parseCategories(categoriesRes);
        fetchedCategories = parsed ?? extractCategories(fetchedProducts);
      } catch {
        fetchedCategories = extractCategories(fetchedProducts);
      }

      // ✅ FIX: Use functional update to ensure latest state
      setState(() => ({
        products: fetchedProducts,
        categories: fetchedCategories,
        isLoading: false,
        isRefreshing: false,
        error: null,
      }));
    } catch (err) {
      console.error('[ProductsPage] Failed to fetch:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: getErrorMessage(err),
      }));
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Handlers - SIMPLIFIED
  // ---------------------------------------------------------------------------
  const handleRefresh = useCallback(async () => {
    await fetchData(false);
  }, [fetchData]);

  // ✅ REMOVED: Optimistic update handlers (caused sync issues)
  // Now table handles delete and calls onRefresh to get fresh data

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <>
        <PageHeader title="Produk" description="Kelola produk toko Anda">
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Button>
        </PageHeader>
        <ProductsTableSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Produk" description="Kelola produk toko Anda">
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Link>
          </Button>
        </PageHeader>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat produk</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => fetchData(true)}>
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Produk" description="Kelola produk toko Anda">
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </PageHeader>

      {/* ✅ SIMPLIFIED: Only pass products, categories, and refresh handler */}
      <ProductsTable
        products={products}
        categories={categories}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
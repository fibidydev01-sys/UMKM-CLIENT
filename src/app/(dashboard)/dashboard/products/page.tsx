/**
 * ============================================================================
 * PRODUCTS PAGE
 * ============================================================================
 * Route: /dashboard/products
 * Description: Display and manage all products
 * 
 * Features:
 * - Product listing with search & filter
 * - Category filter (extracted from products)
 * - Loading skeleton
 * - Error handling with retry
 * - ✅ Instant refresh after delete (no manual refresh needed)
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
  error: string | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract unique categories from products array
 */
function extractCategories(products: Product[]): string[] {
  const categories = products
    .map((p) => p.category)
    .filter((c): c is string => Boolean(c));

  return [...new Set(categories)].sort();
}

/**
 * Safely parse categories response
 */
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
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [state, setState] = useState<PageState>({
    products: [],
    categories: [],
    isLoading: true,
    error: null,
  });

  const { products, categories, isLoading, error } = state;

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // 1. Fetch products (required)
      const productsRes = await productsApi.getAll({ limit: 100 });
      const fetchedProducts = productsRes.data;

      // 2. Fetch categories (optional, with fallback)
      let fetchedCategories: string[];

      try {
        const categoriesRes = await productsApi.getCategories();
        const parsed = parseCategories(categoriesRes);
        fetchedCategories = parsed ?? extractCategories(fetchedProducts);
      } catch {
        // API failed, extract from products
        fetchedCategories = extractCategories(fetchedProducts);
      }

      // 3. Update state
      setState({
        products: fetchedProducts,
        categories: fetchedCategories,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('[ProductsPage] Failed to fetch:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: getErrorMessage(err),
      }));
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Render: Loading
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

  // ---------------------------------------------------------------------------
  // Render: Error
  // ---------------------------------------------------------------------------
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
          <Button variant="outline" className="mt-4" onClick={fetchData}>
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Success
  // ---------------------------------------------------------------------------
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

      {/* ✅ Pass onRefresh callback for instant data refresh */}
      <ProductsTable
        products={products}
        categories={categories}
        onRefresh={fetchData}
      />
    </>
  );
}

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
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
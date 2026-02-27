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

interface PageState {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

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

export default function ProductsPage() {
  const [state, setState] = useState<PageState>({
    products: [],
    categories: [],
    isLoading: true,
    isRefreshing: false,
    error: null,
  });
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  const { products, categories, isLoading, isRefreshing, error } = state;

  const fetchData = async (showFullLoading = true) => {
    if (!isMounted.current) return;

    setState((prev) => ({
      ...prev,
      isLoading: showFullLoading ? true : prev.isLoading,
      isRefreshing: !showFullLoading,
      error: null,
    }));

    try {
      const productsRes = await productsApi.getAll({ limit: 100 });

      if (!isMounted.current) return;

      const fetchedProducts = productsRes.data;

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

  useEffect(() => {
    isMounted.current = true;
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData(true);
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleRefresh = async () => {
    await fetchData(false);
  };

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
        <PageHeader title="Products" description="Manage your store products">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add
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
        <PageHeader title="Products" description="Manage your store products">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button asChild>
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add product
              </Link>
            </Button>
          </div>
        </PageHeader>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Failed to load products</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              hasFetched.current = false;
              fetchData(true);
            }}
          >
            Try again
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Products" description="Manage your store products">
        <div className="flex items-center gap-2">
          <ViewToggle />
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add
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

function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-80" />
      </div>
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 flex-shrink-0" />
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
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
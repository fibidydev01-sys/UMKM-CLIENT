import { Suspense } from 'react';
import { productsApi } from '@/lib/api';
import {
  ProductGrid,
  ProductFilters,
  CategoryList,
  ProductPagination,
  ProductGridSkeleton,
} from '@/components/store';
import type { Metadata } from 'next';
import type { Product, PaginatedResponse } from '@/types';

// ==========================================
// STORE PRODUCTS PAGE
// ==========================================

interface ProductsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Semua Produk',
};

async function getProducts(
  slug: string,
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<PaginatedResponse<Product>> {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search as string | undefined;
  const category = searchParams.category as string | undefined;
  const sort = (searchParams.sort as string) || 'newest';

  // Map sort to API params
  let sortBy: 'name' | 'price' | 'createdAt' | 'stock' | 'updatedAt' = 'createdAt';
  let sortOrder: 'asc' | 'desc' = 'desc';

  switch (sort) {
    case 'oldest':
      sortBy = 'createdAt';
      sortOrder = 'asc';
      break;
    case 'price-asc':
      sortBy = 'price';
      sortOrder = 'asc';
      break;
    case 'price-desc':
      sortBy = 'price';
      sortOrder = 'desc';
      break;
    case 'name-asc':
      sortBy = 'name';
      sortOrder = 'asc';
      break;
    case 'name-desc':
      sortBy = 'name';
      sortOrder = 'desc';
      break;
  }

  try {
    return await productsApi.getByStore(slug, {
      page,
      limit: 12,
      search,
      category,
      sortBy,
      sortOrder,
      isActive: true,
    });
  } catch {
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    };
  }
}

async function getCategories(slug: string): Promise<string[]> {
  try {
    // This would need a public endpoint or we extract from products
    const response = await productsApi.getByStore(slug, {
      limit: 100,
      isActive: true,
    });
    const categories = new Set<string>();
    response.data.forEach((p) => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories).sort();
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const [productsResponse, categories] = await Promise.all([
    getProducts(slug, resolvedSearchParams),
    getCategories(slug),
  ]);

  const { data: products, meta } = productsResponse;
  const currentCategory = resolvedSearchParams.category as string | undefined;

  return (
    <div className="container px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Semua Produk</h1>
        <p className="text-muted-foreground">
          {meta.total} produk tersedia
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ProductFilters storeSlug={slug} categories={categories} />
      </div>

      {/* Category List */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryList
            categories={categories}
            storeSlug={slug}
            currentCategory={currentCategory}
          />
        </div>
      )}

      {/* Products Grid */}
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductGrid products={products} storeSlug={slug} />
      </Suspense>

      {/* Pagination */}
      <ProductPagination
        storeSlug={slug}
        currentPage={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
      />
    </div>
  );
}
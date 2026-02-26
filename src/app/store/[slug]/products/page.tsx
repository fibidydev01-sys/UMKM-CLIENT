import { Suspense } from 'react';
import { tenantsApi, productsApi } from '@/lib/api';
import {
  ProductGrid,
  ProductFilters,
  CategoryList,
  ProductPagination,
  ProductGridSkeleton,
} from '@/components/store';
import type { Metadata } from 'next';
import type { Product, PaginatedResponse, PublicTenant } from '@/types';

// ══════════════════════════════════════════════════════════════
// STORE PRODUCTS PAGE - v2.3 (MULTI-CURRENCY + SORT BUG FIX)
// ✅ FIX: sort key 'price-low'/'price-high' selaras dengan product-filters.tsx
// ✅ FIX: fetch tenant untuk dapat currency, pass ke ProductGrid
// ══════════════════════════════════════════════════════════════

interface ProductsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Semua Produk',
};

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

async function getProducts(
  slug: string,
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<PaginatedResponse<Product>> {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search as string | undefined;
  const category = searchParams.category as string | undefined;
  const sort = (searchParams.sort as string) || 'newest';

  let sortBy: 'name' | 'price' | 'createdAt' | 'stock' | 'updatedAt' = 'createdAt';
  let sortOrder: 'asc' | 'desc' = 'desc';

  switch (sort) {
    case 'oldest':
      sortBy = 'createdAt';
      sortOrder = 'asc';
      break;
    // ✅ FIX: gunakan 'price-low' / 'price-high' agar selaras dengan product-filters.tsx
    // (sebelumnya salah: 'price-asc' / 'price-desc' — tidak pernah match!)
    case 'price-low':
      sortBy = 'price';
      sortOrder = 'asc';
      break;
    case 'price-high':
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
    // default: newest → createdAt desc (sudah di-set di atas)
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

  // ✅ FIX: fetch tenant sekaligus untuk dapat currency
  const [tenant, productsResponse, categories] = await Promise.all([
    getTenant(slug),
    getProducts(slug, resolvedSearchParams),
    getCategories(slug),
  ]);

  const { data: products, meta } = productsResponse;
  const currentCategory = resolvedSearchParams.category as string | undefined;

  // ✅ FIX: currency dari tenant, fallback IDR
  const currency = tenant?.currency || 'IDR';

  return (
    <div className="container px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Semua Produk</h1>
        <p className="text-muted-foreground">{meta.total} produk tersedia</p>
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

      {/* ✅ FIX: pass currency ke ProductGrid */}
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductGrid
          products={products}
          storeSlug={slug}
          currency={currency}
        />
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
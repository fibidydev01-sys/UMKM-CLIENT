'use client';

import { useMemo } from 'react';
import { ProductCard } from './product-card';
import { ProductGridSkeleton } from './store-skeleton';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  storeSlug: string;
  isLoading?: boolean;
  showAddToCart?: boolean;
  columns?: 2 | 3 | 4;
}

// ✅ FIX: Memoize grid classes outside component
const GRID_COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
} as const;

// ✅ FIX: Limit for mobile devices
const MOBILE_PRODUCT_LIMIT = 12;

export function ProductGrid({
  products,
  storeSlug,
  isLoading = false,
  showAddToCart = true,
  columns = 4,
}: ProductGridProps) {
  // ✅ FIX: Memoize displayed products
  const displayProducts = useMemo(() => {
    // SSR safe check
    if (typeof window === 'undefined') return products;

    // Limit products on mobile to prevent memory issues
    const isMobile = window.innerWidth < 768;
    if (isMobile && products.length > MOBILE_PRODUCT_LIMIT) {
      return products.slice(0, MOBILE_PRODUCT_LIMIT);
    }
    return products;
  }, [products]);

  // ✅ FIX: Memoize truncation state
  const isTruncated = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 && products.length > MOBILE_PRODUCT_LIMIT;
  }, [products.length]);

  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          Tidak ada produk ditemukan
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${GRID_COLS[columns]} gap-4`}>
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            storeSlug={storeSlug}
            showAddToCart={showAddToCart}
          />
        ))}
      </div>

      {/* Show info if truncated on mobile */}
      {isTruncated && (
        <div className="mt-6 text-center md:hidden">
          <p className="text-sm text-muted-foreground">
            Menampilkan {displayProducts.length} dari {products.length} produk.
            Gunakan filter atau pagination untuk melihat lebih banyak.
          </p>
        </div>
      )}
    </>
  );
}
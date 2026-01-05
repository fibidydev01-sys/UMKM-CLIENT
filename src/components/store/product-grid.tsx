import { ProductCard } from './product-card';
import { ProductGridSkeleton } from './store-skeleton';
import type { Product } from '@/types';

// ==========================================
// PRODUCT GRID COMPONENT
// ==========================================

interface ProductGridProps {
  products: Product[];
  storeSlug: string;
  isLoading?: boolean;
  showAddToCart?: boolean;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  storeSlug,
  isLoading = false,
  showAddToCart = true,
  columns = 4,
}: ProductGridProps) {
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

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          storeSlug={storeSlug}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
}
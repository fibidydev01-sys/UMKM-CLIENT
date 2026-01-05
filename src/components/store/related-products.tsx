import { ProductGrid } from './product-grid';
import type { Product } from '@/types';

// ==========================================
// RELATED PRODUCTS COMPONENT
// ==========================================

interface RelatedProductsProps {
  products: Product[];
  storeSlug: string;
}

export function RelatedProducts({ products, storeSlug }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-6">Produk Terkait</h2>
      <ProductGrid
        products={products}
        storeSlug={storeSlug}
        columns={4}
      />
    </section>
  );
}
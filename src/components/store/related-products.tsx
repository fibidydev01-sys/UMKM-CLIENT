// ==========================================
// RELATED PRODUCTS
// ==========================================

import { ProductGrid } from './product-grid';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
  storeSlug: string;
  currency: string;
}

export function RelatedProducts({
  products,
  storeSlug,
  currency,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-6">Related products</h2>
      <ProductGrid
        products={products}
        storeSlug={storeSlug}
        currency={currency}
        columns={4}
      />
    </section>
  );
}
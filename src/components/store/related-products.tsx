// ══════════════════════════════════════════════════════════════
// RELATED PRODUCTS - v2.3 (MULTI-CURRENCY FIX)
// ✅ FIX: Terima currency prop dan pass ke ProductGrid
// ══════════════════════════════════════════════════════════════

import { ProductGrid } from './product-grid';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
  storeSlug: string;
  currency: string; // ✅ FIX: tambah currency prop
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
      <h2 className="text-xl font-semibold mb-6">Produk Terkait</h2>
      {/* ✅ FIX: pass currency ke ProductGrid */}
      <ProductGrid
        products={products}
        storeSlug={storeSlug}
        currency={currency}
        columns={4}
      />
    </section>
  );
}
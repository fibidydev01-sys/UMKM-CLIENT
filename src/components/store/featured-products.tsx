import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from './product-grid';
import type { Product } from '@/types';

// ==========================================
// FEATURED PRODUCTS SECTION
// ==========================================

interface FeaturedProductsProps {
  products: Product[];
  storeSlug: string;
  title?: string;
  showViewAll?: boolean;
}

export function FeaturedProducts({
  products,
  storeSlug,
  title = 'Produk Unggulan',
  showViewAll = true,
}: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        {showViewAll && (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/store/${storeSlug}/products`}>
              Lihat Semua
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      <ProductGrid products={products} storeSlug={storeSlug} />
    </section>
  );
}
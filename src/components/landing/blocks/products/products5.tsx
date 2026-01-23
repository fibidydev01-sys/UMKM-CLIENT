'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products5Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products5
 * Design: CATALOG - Featured large card + smaller grid
 */
export function Products5({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products5Props) {
  const displayProducts = products.slice(0, limit);
  const featuredProduct = displayProducts[0];
  const otherProducts = displayProducts.slice(1);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-16 md:py-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" size="lg" className="gap-2">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Featured + Grid Layout */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Featured Product - Large */}
        {featuredProduct && (
          <div className="lg:row-span-2">
            <div className="h-full">
              <ProductCard product={featuredProduct} storeSlug={storeSlug} />
            </div>
          </div>
        )}

        {/* Other Products - Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {otherProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
          ))}
        </div>
      </div>

      {/* Additional Products Below */}
      {otherProducts.length > 4 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          {otherProducts.slice(4).map((product) => (
            <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
          ))}
        </div>
      )}
    </section>
  );
}
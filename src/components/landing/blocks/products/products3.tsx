'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products3Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products3
 * Design: MASONRY STYLE - 3 columns with varied visual weight
 */
export function Products3({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products3Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-16 md:py-24">
      {/* Header with accent line */}
      <div className="mb-10 md:mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-1 w-12 bg-primary rounded-full" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Koleksi</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Link href={productsLink}>
              <Button variant="ghost" size="lg" className="gap-2">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Masonry-like Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className={`${index === 0 || index === 3 ? 'lg:row-span-1' : ''
              }`}
          >
            <ProductCard product={product} storeSlug={storeSlug} />
          </div>
        ))}
      </div>
    </section>
  );
}
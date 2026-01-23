'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products6Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products6
 * Design: MINIMAL LIST - Clean horizontal cards
 */
export function Products6({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products6Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-16 md:py-24">
      {/* Minimal Header */}
      <div className="max-w-3xl mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-3">{subtitle}</p>
        )}
      </div>

      {/* Two Column Grid for cleaner look */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <div key={product.id} className="border rounded-xl p-2 bg-card hover:shadow-md transition-shadow">
            <ProductCard product={product} storeSlug={storeSlug} />
          </div>
        ))}
      </div>

      {/* View All */}
      {showViewAll && (
        <div className="mt-10 md:mt-12">
          <Link href={productsLink}>
            <Button variant="outline" size="lg" className="gap-2">
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
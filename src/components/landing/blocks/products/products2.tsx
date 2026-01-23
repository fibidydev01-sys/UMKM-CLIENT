'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products2Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products2
 * Design: GRID HOVER - Scale effect on hover
 */
export function Products2({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products2Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-16 md:py-24">
      {/* Centered Header */}
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* Products Grid with Hover Effects */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="group transition-all duration-300 hover:scale-[1.02] hover:z-10"
          >
            <div className="transition-shadow duration-300 group-hover:shadow-xl rounded-xl">
              <ProductCard product={product} storeSlug={storeSlug} />
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {showViewAll && (
        <div className="text-center mt-10 md:mt-12">
          <Link href={productsLink}>
            <Button size="lg" className="gap-2">
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
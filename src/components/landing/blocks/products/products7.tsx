'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products7Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products7
 * Design: FEATURED HERO - Badge accent + 3 column grid
 */
export function Products7({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products7Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-16 md:py-24">
      {/* Centered Header with Badge */}
      <div className="text-center mb-10 md:mb-14">
        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 mr-2" />
          Produk Unggulan
        </Badge>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className={`${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
          >
            <ProductCard product={product} storeSlug={storeSlug} />
          </div>
        ))}
      </div>

      {/* Centered CTA */}
      {showViewAll && (
        <div className="text-center mt-10 md:mt-14">
          <Link href={productsLink}>
            <Button size="lg" className="gap-2 px-8">
              Jelajahi Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
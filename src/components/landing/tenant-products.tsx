'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product, TenantLandingConfig } from '@/types';

interface TenantProductsProps {
  products: Product[];
  storeSlug: string;
  config?: TenantLandingConfig['products'];
}

export function TenantProducts({ products, storeSlug, config }: TenantProductsProps) {
  const title = config?.title || 'Produk Kami';
  const subtitle = config?.subtitle || '';
  const showViewAll = config?.config?.showViewAll ?? true;
  const limit = config?.config?.limit || 8;

  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={`/store/${storeSlug}/products`}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
        ))}
      </div>
    </section>
  );
}
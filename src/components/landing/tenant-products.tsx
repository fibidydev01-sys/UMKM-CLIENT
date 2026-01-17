'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getProductsConfig } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import type { Product, TenantLandingConfig } from '@/types';

// ==========================================
// TENANT PRODUCTS COMPONENT - Decoupled
// ==========================================

interface TenantProductsProps {
  products: Product[];
  config?: TenantLandingConfig['products'];
  storeSlug?: string;
  fallbacks?: {
    title?: string;
    subtitle?: string;
    productsLink?: string;
  };
}

export function TenantProducts({ products, config, storeSlug, fallbacks = {} }: TenantProductsProps) {
  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.PRODUCTS,
    subtitle: fallbacks.subtitle || LANDING_CONSTANTS.SECTION_SUBTITLES.PRODUCTS,
  });

  const productsConfig = getProductsConfig(config);
  const showViewAll = productsConfig?.showViewAll ?? true;
  const limit = productsConfig?.limit || LANDING_CONSTANTS.PRODUCT_LIMIT_DEFAULT;

  const displayProducts = products.slice(0, limit);

  // Smart URL routing
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;
  const productsLink = urls?.products() || fallbacks.productsLink || '/products';

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
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} storeSlug={storeSlug || ''} />
        ))}
      </div>
    </section>
  );
}
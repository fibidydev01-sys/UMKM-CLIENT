'use client';

import { lazy, Suspense } from 'react';
import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getProductsConfig } from '@/lib/landing';
import { LANDING_CONSTANTS, useProductsBlock } from '@/lib/landing';
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

/**
 * 🚀 SMART DYNAMIC LOADING - AUTO-DISCOVERY ENABLED!
 *
 * NO MANUAL IMPORTS! Just add products201.tsx and it works!
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 *
 * 🚀 SUPPORTS ALL BLOCKS: products1, products2, ..., products200, products9999!
 */
export function TenantProducts({ products, config, storeSlug, fallbacks = {} }: TenantProductsProps) {
  const templateBlock = useProductsBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.PRODUCTS,
    subtitle: fallbacks.subtitle || LANDING_CONSTANTS.SECTION_SUBTITLES.PRODUCTS,
  });

  const productsConfig = getProductsConfig(config);
  const showViewAll = productsConfig?.showViewAll ?? true;
  const limit = productsConfig?.limit || LANDING_CONSTANTS.PRODUCT_LIMIT_DEFAULT;

  // Smart URL routing
  // Hook must be called unconditionally (React Hooks rules)
  const urls = useStoreUrls(storeSlug || '');
  const productsLink = storeSlug ? (urls?.products() || '/products') : (fallbacks.productsLink || '/products');

  const commonProps = {
    products,
    title,
    subtitle,
    showViewAll,
    productsLink,
    storeSlug: storeSlug || '',
    limit,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('products', '');
  const ProductsComponent = lazy(() =>
    import(`./blocks/products/products${blockNumber}`)
      .then((mod) => ({ default: mod[`Products${blockNumber}`] }))
      .catch(() => import('./blocks/products/products1').then((mod) => ({ default: mod.Products1 })))
  );

  // Render with Suspense for lazy loading
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsComponent {...commonProps} />
    </Suspense>
  );
}

function ProductsSkeleton() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

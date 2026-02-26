'use client';

// ══════════════════════════════════════════════════════════════
// TENANT PRODUCTS - v2.2
// ✅ FIX: Tambah currency prop, masuk ke commonProps
// ✅ FIX: TS2559 — cast lazy component ke ComponentType<ProductsBlockProps>
//         agar TypeScript tahu props yang diterima component dinamis
// ══════════════════════════════════════════════════════════════

import { lazy, Suspense, type ComponentType } from 'react';
import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getProductsConfig } from '@/lib/landing';
import { LANDING_CONSTANTS, useProductsBlock } from '@/lib/landing';
import type { Product, TenantLandingConfig } from '@/types';

// ── Shared props type untuk semua Products block (products1-5, dst) ───────
// Harus sinkron dengan interface di masing-masing products block
interface ProductsBlockProps {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  currency?: string;
  limit?: number;
}

// ==========================================
// TENANT PRODUCTS COMPONENT - Decoupled
// ==========================================

interface TenantProductsProps {
  products: Product[];
  config?: TenantLandingConfig['products'];
  storeSlug?: string;
  currency?: string;       // ✅ FIX: currency dari tenant
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
export function TenantProducts({
  products,
  config,
  storeSlug,
  currency = 'IDR',       // ✅ FIX: default fallback IDR
  fallbacks = {},
}: TenantProductsProps) {
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
  const productsLink = storeSlug
    ? (urls?.products() || '/products')
    : (fallbacks.productsLink || '/products');

  // ✅ FIX: currency masuk ke commonProps → diteruskan ke Products1-5 → ProductCard
  const commonProps: ProductsBlockProps = {
    products,
    title,
    subtitle,
    showViewAll,
    productsLink,
    storeSlug: storeSlug || '',
    currency,              // ✅ currency sekarang ada di sini
    limit,
  };

  // 🚀 SMART: Dynamic component loading
  // ✅ FIX TS2559: cast ke ComponentType<ProductsBlockProps> agar TypeScript
  //    tahu shape props yang diterima — tanpa ini TS anggap component = IntrinsicAttributes
  const blockNumber = block.replace('products', '');
  const ProductsComponent = lazy(() =>
    import(`./blocks/products/products${blockNumber}`)
      .then((mod) => ({
        default: mod[`Products${blockNumber}`] as ComponentType<ProductsBlockProps>,
      }))
      .catch(() =>
        import('./blocks/products/products1').then((mod) => ({
          default: mod.Products1 as ComponentType<ProductsBlockProps>,
        }))
      )
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
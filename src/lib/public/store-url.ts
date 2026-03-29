// ==========================================
// STORE URL HELPER (CLIENT-SIDE)
// src/lib/public/store-url.ts
// ==========================================

'use client';

import { useMemo } from 'react';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'fibidy.com';

// ==========================================
// INTERNAL — environment detection
// ==========================================

function isSubdomainRouting(): boolean {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return false;
  if (hostname.includes('.vercel.app')) return false;
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) return false;
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) return true;
  return true;
}




function getStoreBasePath(storeSlug: string): string {
  return isSubdomainRouting() ? '' : `/store/${storeSlug}`;
}

// ==========================================
// PUBLIC API
// ==========================================

/**
 * Generate store internal path
 * @example
 * storeUrl('warung', '/products') → '/store/warung/products' (localhost)
 * storeUrl('warung', '/products') → '/products' (subdomain/custom domain)
 */
export function storeUrl(storeSlug: string, path: string = '/'): string {
  const basePath = getStoreBasePath(storeSlug);
  const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}` || '/';
}

/**
 * Generate product detail URL
 * @example
 * productUrl('warung', 'abc123') → '/store/warung/products/abc123' (localhost)
 * productUrl('warung', 'abc123') → '/products/abc123' (subdomain/custom domain)
 */
export function productUrl(storeSlug: string, productId: string): string {
  return storeUrl(storeSlug, `/products/${productId}`);
}

/**
 * Generate products list URL with optional query params
 * @example
 * productsUrl('warung', { category: 'makanan' }) → '/products?category=makanan'
 */
export function productsUrl(
  storeSlug: string,
  params?: Record<string, string | undefined>
): string {
  const base = storeUrl(storeSlug, '/products');
  if (!params) return base;

  const filteredParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') filteredParams[key] = value;
  });

  if (Object.keys(filteredParams).length === 0) return base;
  return `${base}?${new URLSearchParams(filteredParams).toString()}`;
}

/**
 * Hook untuk generate store URLs (internal navigation)
 * @example
 * const urls = useStoreUrls('warung');
 * <Link href={urls.home}>Home</Link>
 * <Link href={urls.products()}>All Products</Link>
 * <Link href={urls.product('abc123')}>Product Detail</Link>
 */
export function useStoreUrls(storeSlug: string) {
  return useMemo(
    () => ({
      home: storeUrl(storeSlug, '/'),
      products: (params?: Record<string, string | undefined>) => productsUrl(storeSlug, params),
      product: (productId: string) => productUrl(storeSlug, productId),
      path: (path: string) => storeUrl(storeSlug, path),
    }),
    [storeSlug]
  );
}
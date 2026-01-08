// ==========================================
// STORE URL HELPER (CLIENT-SIDE)
// src/lib/store-url.ts
//
// Smart path generation for internal navigation:
// - Development (localhost): /store/{slug}/products
// - Production (subdomain): /products
//
// NOTE: Ini BERBEDA dengan getTenantUrl di seo.ts!
// - seo.ts → Full URL untuk canonical/SEO
// - store-url.ts → Path saja untuk <Link href="">
// ==========================================

'use client';

import { useMemo } from 'react';

// ==========================================
// ENVIRONMENT DETECTION
// ==========================================

/**
 * Check if currently running on subdomain
 * Returns true ONLY when on {slug}.fibidy.com
 */
export function isSubdomainRouting(): boolean {
  // Server-side: can't detect, assume based on NODE_ENV
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }

  const hostname = window.location.hostname;

  // Localhost = path-based routing
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return false;
  }

  // Vercel preview = path-based routing
  if (hostname.includes('.vercel.app')) {
    return false;
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'fibidy.com';

  // Main domain (fibidy.com, www.fibidy.com) = path-based routing
  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return false;
  }

  // Subdomain (xxx.fibidy.com) = subdomain routing!
  if (hostname.endsWith(`.${rootDomain}`)) {
    return true;
  }

  return false;
}

// ==========================================
// PATH GENERATORS
// ==========================================

/**
 * Get store base path
 * - Subdomain: "" (empty)
 * - Path-based: "/store/{slug}"
 */
export function getStoreBasePath(storeSlug: string): string {
  if (isSubdomainRouting()) {
    return ''; // No prefix needed on subdomain
  }
  return `/store/${storeSlug}`;
}

/**
 * Generate store internal path
 *
 * @example
 * // On localhost:
 * storeUrl('warung', '/products') → '/store/warung/products'
 * storeUrl('warung', '/') → '/store/warung'
 *
 * // On warung.fibidy.com:
 * storeUrl('warung', '/products') → '/products'
 * storeUrl('warung', '/') → '/'
 */
export function storeUrl(storeSlug: string, path: string = '/'): string {
  const basePath = getStoreBasePath(storeSlug);

  // Normalize path
  const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;

  // Combine base + path
  const fullPath = `${basePath}${normalizedPath}`;

  // Return '/' if empty
  return fullPath || '/';
}

/**
 * Generate product detail URL
 *
 * @example
 * productUrl('warung', 'abc123')
 * // localhost → '/store/warung/products/abc123'
 * // subdomain → '/products/abc123'
 */
export function productUrl(storeSlug: string, productId: string): string {
  return storeUrl(storeSlug, `/products/${productId}`);
}

/**
 * Generate products list URL with query params
 *
 * @example
 * productsUrl('warung', { category: 'makanan', page: '2' })
 * // localhost → '/store/warung/products?category=makanan&page=2'
 * // subdomain → '/products?category=makanan&page=2'
 */
export function productsUrl(
  storeSlug: string,
  params?: Record<string, string | undefined>
): string {
  const base = storeUrl(storeSlug, '/products');

  if (!params) return base;

  // Filter out undefined values
  const filteredParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      filteredParams[key] = value;
    }
  });

  if (Object.keys(filteredParams).length === 0) return base;

  const searchParams = new URLSearchParams(filteredParams);
  return `${base}?${searchParams.toString()}`;
}

// ==========================================
// REACT HOOK
// ==========================================

/**
 * Hook untuk generate store URLs
 * Memoized untuk performance
 *
 * @example
 * const urls = useStoreUrls('warung');
 *
 * <Link href={urls.home}>Home</Link>
 * <Link href={urls.products()}>All Products</Link>
 * <Link href={urls.products({ category: 'food' })}>Food</Link>
 * <Link href={urls.product('abc123')}>Product Detail</Link>
 */
export function useStoreUrls(storeSlug: string) {
  return useMemo(
    () => ({
      /** Store home: "/" or "/store/{slug}" */
      home: storeUrl(storeSlug, '/'),

      /** Products list with optional params */
      products: (params?: Record<string, string | undefined>) =>
        productsUrl(storeSlug, params),

      /** Single product detail */
      product: (productId: string) => productUrl(storeSlug, productId),

      /** Generic path */
      path: (path: string) => storeUrl(storeSlug, path),
    }),
    [storeSlug]
  );
}

// ==========================================
// DEBUG HELPER
// ==========================================

/**
 * Debug: Log current routing mode
 * Call this in console to check: window.__debugStoreUrl()
 */
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__debugStoreUrl = () => {
    const hostname = window.location.hostname;
    const isSubdomain = isSubdomainRouting();
    console.log({
      hostname,
      isSubdomain,
      exampleHome: storeUrl('test', '/'),
      exampleProducts: storeUrl('test', '/products'),
      exampleProduct: productUrl('test', 'abc123'),
    });
  };
}
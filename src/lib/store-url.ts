// ==========================================
// STORE URL HELPER
// src/lib/store-url.ts
//
// Smart URL generation that works for:
// - Development: localhost:3000/store/{slug}/products
// - Production: {slug}.fibidy.com/products
// ==========================================

/**
 * Check if current environment uses subdomain routing
 * - Production with subdomain = true
 * - Development (localhost) = false
 * - Direct domain access (fibidy.com) = false
 */
export function isSubdomainRouting(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: check environment
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

  // Subdomain (xxx.fibidy.com) = subdomain routing
  if (hostname.endsWith(`.${rootDomain}`)) {
    return true;
  }

  return false;
}

/**
 * Get store base path
 * - Subdomain: "" (empty, relative to root)
 * - Path-based: "/store/{slug}"
 */
export function getStoreBasePath(storeSlug: string): string {
  if (isSubdomainRouting()) {
    return '';
  }
  return `/store/${storeSlug}`;
}

/**
 * Generate store URL
 *
 * @example
 * // Development (localhost)
 * storeUrl('warung', '/products') => '/store/warung/products'
 * storeUrl('warung', '/') => '/store/warung'
 *
 * // Production (subdomain)
 * storeUrl('warung', '/products') => '/products'
 * storeUrl('warung', '/') => '/'
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
 * Generate product URL
 *
 * @example
 * // Development
 * productUrl('warung', 'abc123') => '/store/warung/products/abc123'
 *
 * // Production (subdomain)
 * productUrl('warung', 'abc123') => '/products/abc123'
 */
export function productUrl(storeSlug: string, productId: string): string {
  return storeUrl(storeSlug, `/products/${productId}`);
}

/**
 * Generate products list URL with optional query params
 *
 * @example
 * productsUrl('warung', { category: 'food', page: '2' })
 * // Dev: '/store/warung/products?category=food&page=2'
 * // Prod: '/products?category=food&page=2'
 */
export function productsUrl(
  storeSlug: string,
  params?: Record<string, string>
): string {
  const base = storeUrl(storeSlug, '/products');

  if (!params || Object.keys(params).length === 0) {
    return base;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}

// ==========================================
// REACT HOOK VERSION
// ==========================================

import { useMemo } from 'react';

/**
 * Hook to get store URL generator bound to a specific store
 *
 * @example
 * const { home, products, product } = useStoreUrls('warung');
 * <Link href={home}>Home</Link>
 * <Link href={products()}>All Products</Link>
 * <Link href={product('abc123')}>Product</Link>
 */
export function useStoreUrls(storeSlug: string) {
  return useMemo(
    () => ({
      /** Store home URL */
      home: storeUrl(storeSlug, '/'),

      /** Products list URL (with optional params) */
      products: (params?: Record<string, string>) =>
        productsUrl(storeSlug, params),

      /** Single product URL */
      product: (productId: string) => productUrl(storeSlug, productId),

      /** Generic path URL */
      path: (path: string) => storeUrl(storeSlug, path),
    }),
    [storeSlug]
  );
}
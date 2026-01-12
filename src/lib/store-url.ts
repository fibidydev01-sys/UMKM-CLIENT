// ==========================================
// STORE URL HELPER (CLIENT-SIDE)
// src/lib/store-url.ts
//
// Smart path generation for internal navigation:
// - Development (localhost): /store/{slug}/products
// - Production (subdomain): /products
//
// + NEW: getTenantFullUrl for external links
// ==========================================

'use client';

import { useMemo } from 'react';

// ==========================================
// CONSTANTS
// ==========================================

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'fibidy.com';

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

  // Main domain (fibidy.com, www.fibidy.com) = path-based routing
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return false;
  }

  // Subdomain (xxx.fibidy.com) = subdomain routing!
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return true;
  }

  return false;
}

/**
 * Check if currently in development/localhost
 */
export function isLocalhost(): boolean {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development';
  }

  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

// ==========================================
// FULL URL GENERATOR (NEW!)
// For external links / showcase cards
// ==========================================

/**
 * Get full tenant URL (for external navigation)
 * 
 * @example
 * // On localhost:
 * getTenantFullUrl('warung-busari') → '/store/warung-busari'
 * 
 * // On production (fibidy.com):
 * getTenantFullUrl('warung-busari') → 'https://warung-busari.fibidy.com'
 * 
 * // With path:
 * getTenantFullUrl('warung-busari', '/products') → 'https://warung-busari.fibidy.com/products'
 */
export function getTenantFullUrl(slug: string, path: string = '/'): string {
  // Normalize path
  const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;

  // Server-side detection
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return `https://${slug}.${ROOT_DOMAIN}${normalizedPath}`;
    }
    return `/store/${slug}${normalizedPath}`;
  }

  const hostname = window.location.hostname;

  // Localhost = path-based
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const fullPath = `/store/${slug}${normalizedPath}`;
    return fullPath || `/store/${slug}`;
  }

  // Vercel preview = path-based
  if (hostname.includes('.vercel.app')) {
    const fullPath = `/store/${slug}${normalizedPath}`;
    return fullPath || `/store/${slug}`;
  }

  // Production = subdomain
  return `https://${slug}.${ROOT_DOMAIN}${normalizedPath}`;
}

/**
 * Get tenant home URL (shorthand)
 */
export function getTenantHomeUrl(slug: string): string {
  return getTenantFullUrl(slug, '/');
}

// ==========================================
// PATH GENERATORS (Internal Navigation)
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
// REACT HOOKS
// ==========================================

/**
 * Hook untuk generate store URLs (internal navigation)
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

/**
 * Hook untuk generate tenant full URL (external navigation)
 * Useful for showcase cards, sharing, etc.
 *
 * @example
 * const tenantUrl = useTenantFullUrl('warung-busari');
 * // localhost → '/store/warung-busari'
 * // production → 'https://warung-busari.fibidy.com'
 */
export function useTenantFullUrl(slug: string) {
  return useMemo(() => getTenantFullUrl(slug), [slug]);
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
    const isLocal = isLocalhost();
    console.log({
      hostname,
      isSubdomain,
      isLocal,
      rootDomain: ROOT_DOMAIN,
      exampleHome: storeUrl('test', '/'),
      exampleProducts: storeUrl('test', '/products'),
      exampleProduct: productUrl('test', 'abc123'),
      exampleFullUrl: getTenantFullUrl('test'),
      exampleFullUrlWithPath: getTenantFullUrl('test', '/products'),
    });
  };
}
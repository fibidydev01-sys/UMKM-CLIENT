// ==========================================
// STORE URL HELPER (CLIENT-SIDE)
// src/lib/store-url.ts
//
// Smart path generation for internal navigation:
// - Development (localhost): /store/{slug}/products
// - Production (subdomain): /products
// - Production (custom domain): /products
//
// + getTenantFullUrl for external links (subdomain OR custom domain)
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

  // Custom domain (anything else not localhost/vercel) = subdomain-style routing!
  // Custom domain behaves like subdomain (no /store prefix)
  return true;
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

/**
 * Check if current URL is a custom domain
 * (not a known subdomain, not localhost, not vercel)
 */
export function isCustomDomain(): boolean {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname;

  // Not custom domain if:
  return !(
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('.vercel.app') ||
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname.endsWith(`.${ROOT_DOMAIN}`)
  );
}

// ==========================================
// FULL URL GENERATOR (UPDATED WITH CUSTOM DOMAIN SUPPORT!)
// For external links / showcase cards
// ==========================================

/**
 * Get full tenant URL (for external navigation)
 * 
 * PRIORITY:
 * 1. Custom domain (if verified) → https://tokoku.com
 * 2. Production subdomain → https://warung-busari.fibidy.com
 * 3. Development path-based → /store/warung-busari
 * 
 * @param slug - Tenant slug
 * @param path - Optional path (e.g., '/products')
 * @param customDomain - Optional custom domain (if tenant has verified custom domain)
 * 
 * @example
 * // On localhost:
 * getTenantFullUrl('warung-busari') → '/store/warung-busari'
 * 
 * // On production (fibidy.com):
 * getTenantFullUrl('warung-busari') → 'https://warung-busari.fibidy.com'
 * 
 * // With custom domain:
 * getTenantFullUrl('warung-busari', '/', 'tokoku.com') → 'https://tokoku.com'
 * 
 * // With path:
 * getTenantFullUrl('warung-busari', '/products') → 'https://warung-busari.fibidy.com/products'
 */
export function getTenantFullUrl(
  slug: string,
  path: string = '/',
  customDomain?: string | null,
): string {
  // Normalize path
  const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;

  // CLIENT-SIDE
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // If tenant has custom domain and not on localhost/vercel
    if (
      customDomain &&
      !hostname.includes('localhost') &&
      !hostname.includes('127.0.0.1') &&
      !hostname.includes('.vercel.app')
    ) {
      return `https://${customDomain}${normalizedPath}`;
    }

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

  // SERVER-SIDE
  const isProduction = process.env.NODE_ENV === 'production';

  // If tenant has custom domain (production only)
  if (isProduction && customDomain) {
    return `https://${customDomain}${normalizedPath}`;
  }

  // Production = subdomain
  if (isProduction) {
    return `https://${slug}.${ROOT_DOMAIN}${normalizedPath}`;
  }

  // Development = path-based
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/store/${slug}${normalizedPath}`;
}

/**
 * Get tenant home URL (shorthand)
 */
export function getTenantHomeUrl(slug: string, customDomain?: string | null): string {
  return getTenantFullUrl(slug, '/', customDomain);
}

/**
 * Get store share URL for social media
 * Always uses the tenant's primary URL (custom domain > subdomain)
 */
export function getStoreShareUrl(
  slug: string,
  customDomain?: string | null,
): string {
  return getTenantFullUrl(slug, '', customDomain);
}

/**
 * Get product share URL
 */
export function getProductShareUrl(
  slug: string,
  productId: string,
  customDomain?: string | null,
): string {
  return getTenantFullUrl(slug, `/products/${productId}`, customDomain);
}

// ==========================================
// PATH GENERATORS (Internal Navigation)
// ==========================================

/**
 * Get store base path
 * - Subdomain: "" (empty)
 * - Custom domain: "" (empty)
 * - Path-based: "/store/{slug}"
 */
export function getStoreBasePath(storeSlug: string): string {
  if (isSubdomainRouting()) {
    return ''; // No prefix needed on subdomain or custom domain
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
 * // On warung.fibidy.com OR tokoku.com:
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
 * // subdomain/custom → '/products/abc123'
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
 * // subdomain/custom → '/products?category=makanan&page=2'
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
 * UPDATED: Now supports custom domain parameter
 *
 * @example
 * const tenantUrl = useTenantFullUrl('warung-busari');
 * // localhost → '/store/warung-busari'
 * // production → 'https://warung-busari.fibidy.com'
 * 
 * // With custom domain:
 * const tenantUrl = useTenantFullUrl('warung-busari', 'tokoku.com');
 * // → 'https://tokoku.com'
 */
export function useTenantFullUrl(slug: string, customDomain?: string | null) {
  return useMemo(() => getTenantFullUrl(slug, '/', customDomain), [slug, customDomain]);
}

// ==========================================
// UTILITY: Get current tenant slug
// ==========================================

/**
 * Get current tenant slug from URL
 * Works on subdomain OR custom domain (if you pass tenant data)
 * 
 * Returns null if:
 * - On main domain (fibidy.com)
 * - On localhost path-based (/store/xxx)
 * - On reserved subdomain
 */
export function getCurrentTenantSlug(): string | null {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;

  // Localhost or IP
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Try to extract from path: /store/xxx
    const pathMatch = window.location.pathname.match(/^\/store\/([^\/]+)/);
    return pathMatch ? pathMatch[1] : null;
  }

  // Vercel preview
  if (hostname.includes('.vercel.app')) {
    const pathMatch = window.location.pathname.match(/^\/store\/([^\/]+)/);
    return pathMatch ? pathMatch[1] : null;
  }

  // Check if subdomain
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '');

    // Reserved subdomains
    const reserved = [
      'www', 'api', 'cdn', 'app', 'admin', 'dashboard',
      'static', 'assets', 'images', 'files', 'uploads',
      'login', 'register', 'logout', 'auth', 'oauth',
      'blog', 'help', 'support', 'docs', 'status',
      'pricing', 'about', 'contact', 'terms', 'privacy',
      'store', 'shop', 'toko', 'fibidy', 'test', 'demo',
    ];

    if (reserved.includes(subdomain.toLowerCase())) {
      return null;
    }

    // Valid subdomain pattern
    if (/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain) || /^[a-z0-9]$/.test(subdomain)) {
      return subdomain;
    }
  }

  // Custom domain: can't determine slug from URL alone
  // Caller needs to fetch tenant data from API
  return null;
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
    const isCustom = isCustomDomain();
    console.log({
      hostname,
      isSubdomain,
      isLocal,
      isCustomDomain: isCustom,
      rootDomain: ROOT_DOMAIN,
      currentSlug: getCurrentTenantSlug(),
      exampleHome: storeUrl('test', '/'),
      exampleProducts: storeUrl('test', '/products'),
      exampleProduct: productUrl('test', 'abc123'),
      exampleFullUrl: getTenantFullUrl('test'),
      exampleFullUrlWithPath: getTenantFullUrl('test', '/products'),
      exampleFullUrlCustomDomain: getTenantFullUrl('test', '/', 'tokoku.com'),
    });
  };
}
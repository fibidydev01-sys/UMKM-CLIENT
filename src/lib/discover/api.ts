// ══════════════════════════════════════════════════════════════
// DISCOVER MODULE API
// Fetch and cache logic for discover feature
// ══════════════════════════════════════════════════════════════

import type {
  TenantSitemapItem,
  TenantDetail,
  ShowcaseTenant,
  TenantSitemapResponse,
  TenantCacheEntry,
} from '@/types/discover';
import { getTenantFullUrl } from '@/lib/store-url';
import { API_URL, CACHE_DURATION, MAX_TENANTS } from './constants';

// ══════════════════════════════════════════════════════════════
// CACHE MANAGEMENT
// ══════════════════════════════════════════════════════════════

let tenantCache: TenantCacheEntry | null = null;

/**
 * Get cached tenants if valid
 * @returns Cached tenants or null if expired/missing
 */
export function getCachedTenants(): ShowcaseTenant[] | null {
  if (!tenantCache) return null;

  const now = Date.now();
  const isExpired = now - tenantCache.timestamp > CACHE_DURATION;

  if (isExpired) {
    tenantCache = null;
    return null;
  }

  return tenantCache.data;
}

/**
 * Set tenant cache
 * @param tenants - Tenants to cache
 */
export function setCachedTenants(tenants: ShowcaseTenant[]): void {
  tenantCache = {
    data: tenants,
    timestamp: Date.now(),
  };
}

/**
 * Clear tenant cache
 */
export function clearTenantCache(): void {
  tenantCache = null;
}

// ══════════════════════════════════════════════════════════════
// FETCH FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Fetch tenant sitemap (paginated list of slugs)
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: MAX_TENANTS)
 * @returns Sitemap response with tenant slugs
 */
export async function fetchTenantSitemap(
  page: number = 1,
  limit: number = MAX_TENANTS
): Promise<TenantSitemapResponse> {
  const res = await fetch(
    `${API_URL}/sitemap/tenants/paginated?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch tenant sitemap');
  }

  return res.json();
}

/**
 * Fetch tenant detail by slug
 * @param slug - Tenant slug
 * @returns Tenant detail or null if failed
 */
export async function fetchTenantBySlug(
  slug: string
): Promise<TenantDetail | null> {
  try {
    const res = await fetch(`${API_URL}/tenants/by-slug/${slug}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch all tenants (sitemap + details)
 * @param limit - Max tenants to fetch
 * @param categoryFilter - Optional category filter
 * @returns Array of showcase tenants
 */
export async function fetchAllTenants(
  limit: number = MAX_TENANTS,
  categoryFilter?: string
): Promise<ShowcaseTenant[]> {
  // Check cache first (only if no category filter)
  if (!categoryFilter) {
    const cached = getCachedTenants();
    if (cached) {
      return cached;
    }
  }

  // Fetch sitemap
  const sitemapData = await fetchTenantSitemap(1, limit);
  const tenantSlugs: TenantSitemapItem[] = sitemapData.tenants || [];

  if (tenantSlugs.length === 0) {
    return [];
  }

  // Fetch details in parallel
  const tenantDetails = await Promise.all(
    tenantSlugs.map((item) => fetchTenantBySlug(item.slug))
  );

  // Filter valid tenants
  let validTenants: ShowcaseTenant[] = tenantDetails
    .filter((t): t is TenantDetail => t !== null && !!t.id)
    .map((t) => ({
      ...t,
      url: getTenantFullUrl(t.slug),
    }));

  // Apply category filter if specified
  if (categoryFilter) {
    validTenants = validTenants.filter((t) => t.category === categoryFilter);
  }

  // Cache if no filter
  if (!categoryFilter) {
    setCachedTenants(validTenants);
  }

  return validTenants;
}

/**
 * Fetch tenants by category
 * @param category - Category key (e.g., "FASHION")
 * @param limit - Max tenants to fetch
 * @returns Array of showcase tenants in category
 */
export async function fetchTenantsByCategory(
  category: string,
  limit: number = MAX_TENANTS
): Promise<ShowcaseTenant[]> {
  return fetchAllTenants(limit, category);
}

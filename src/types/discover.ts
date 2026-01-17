// ══════════════════════════════════════════════════════════════
// DISCOVER MODULE TYPES
// Shared types for discover feature
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// TENANT TYPES
// ══════════════════════════════════════════════════════════════

/**
 * Tenant sitemap item (minimal info from paginated endpoint)
 */
export interface TenantSitemapItem {
  slug: string;
  updatedAt: string;
}

/**
 * Tenant detail (full info from tenant endpoint)
 */
export interface TenantDetail {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  whatsapp: string | null;
  phone: string | null;
  address: string | null;
  logo: string | null;
  banner: string | null;
  theme?: {
    primaryColor?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  _count?: {
    products: number;
  };
}

/**
 * Showcase tenant (tenant with computed URL)
 */
export interface ShowcaseTenant extends TenantDetail {
  url: string;
}

// ══════════════════════════════════════════════════════════════
// FILTER & SORT TYPES
// ══════════════════════════════════════════════════════════════

/**
 * Sort options for tenant listing
 */
export type SortOption = 'popular' | 'newest' | 'oldest' | 'name_asc' | 'name_desc';

// ══════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ══════════════════════════════════════════════════════════════

/**
 * Sitemap API response
 */
export interface TenantSitemapResponse {
  tenants: TenantSitemapItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Cache entry for tenant list
 */
export interface TenantCacheEntry {
  data: ShowcaseTenant[];
  timestamp: number;
}

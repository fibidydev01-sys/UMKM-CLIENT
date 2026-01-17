// ══════════════════════════════════════════════════════════════
// DISCOVER MODULE UTILITIES
// Shared utility functions for discover feature
// ══════════════════════════════════════════════════════════════

import { CATEGORY_CONFIG } from '@/config/categories';
import { Store } from 'lucide-react';
import { getInitials } from '@/lib/format'; // Use from format.ts

// Re-export for convenience
export { getInitials };

// ══════════════════════════════════════════════════════════════
// CATEGORY HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Get category label (short version)
 * @param category - Category key
 * @returns Category label or fallback to category key
 * @example getCategoryLabel('FASHION') => "Fashion"
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_CONFIG[category]?.labelShort || category;
}

/**
 * Get category color
 * @param category - Category key
 * @returns Category color hex code
 * @example getCategoryColor('FASHION') => "#ec4899"
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_CONFIG[category]?.color || '#6b7280';
}

/**
 * Get category info (full config)
 * @param category - Category key
 * @returns Category config object with defaults
 */
export function getCategoryInfo(category: string) {
  return CATEGORY_CONFIG[category] || {
    label: category,
    labelShort: category,
    color: '#6b7280',
    icon: Store,
  };
}

// ══════════════════════════════════════════════════════════════
// SLUG HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Convert category key to slug format
 * @param key - Category key (e.g., "FOOD_BEVERAGE")
 * @returns Slug format (e.g., "food-beverage")
 * @example categoryKeyToSlug('FOOD_BEVERAGE') => "food-beverage"
 */
export function categoryKeyToSlug(key: string): string {
  return key.toLowerCase().replace(/_/g, '-');
}

/**
 * Convert slug to category key format
 * @param slug - Category slug (e.g., "food-beverage")
 * @returns Category key (e.g., "FOOD_BEVERAGE")
 * @example categorySlugToKey('food-beverage') => "FOOD_BEVERAGE"
 */
export function categorySlugToKey(slug: string): string {
  return slug.toUpperCase().replace(/-/g, '_');
}

// ══════════════════════════════════════════════════════════════
// WHATSAPP HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Format WhatsApp number to wa.me URL
 * @param whatsapp - WhatsApp number (any format)
 * @returns WhatsApp URL
 * @example formatWhatsAppUrl('081234567890') => "https://wa.me/6281234567890"
 * @example formatWhatsAppUrl('+62 812-3456-7890') => "https://wa.me/6281234567890"
 */
export function formatWhatsAppUrl(whatsapp: string): string {
  const cleaned = whatsapp.replace(/\D/g, '');
  return `https://wa.me/${cleaned}`;
}

// ══════════════════════════════════════════════════════════════
// SORT HELPERS
// ══════════════════════════════════════════════════════════════

import type { ShowcaseTenant, SortOption } from '@/types/discover';

/**
 * Sort tenants by sort option
 * @param tenants - Array of tenants
 * @param sortBy - Sort option
 * @returns Sorted array (does not mutate original)
 */
export function sortTenants(
  tenants: ShowcaseTenant[],
  sortBy: SortOption
): ShowcaseTenant[] {
  return [...tenants].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name_desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'popular':
      default:
        return (b._count?.products || 0) - (a._count?.products || 0);
    }
  });
}

/**
 * Filter tenants by search query
 * @param tenants - Array of tenants
 * @param query - Search query
 * @returns Filtered array
 */
export function filterTenantsBySearch(
  tenants: ShowcaseTenant[],
  query: string
): ShowcaseTenant[] {
  if (!query) return tenants;

  const lowerQuery = query.toLowerCase();
  return tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(lowerQuery) ||
      tenant.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * ============================================================================
 * FILE: src/lib/landing/utils.ts
 * PURPOSE: Utility functions for landing page configuration
 * ============================================================================
 */

import type { TenantLandingConfig, Testimonial } from '@/types';
import { DEFAULT_LANDING_CONFIG } from './defaults';
import { LANDING_CONSTANTS } from './constants';

// ============================================================================
// NORMALIZE TESTIMONIALS - Handle nested array bug AND de-duplicate
// ============================================================================

export function normalizeTestimonials(items: unknown): Testimonial[] {
  if (!items) return [];

  let normalizedItems = items;

  // Handle nested array bug [[item]] -> [item]
  let depth = 0;
  while (
    Array.isArray(normalizedItems) &&
    normalizedItems.length > 0 &&
    Array.isArray(normalizedItems[0])
  ) {
    normalizedItems = normalizedItems[0];
    depth++;
    if (depth > LANDING_CONSTANTS.NESTED_ARRAY_MAX_DEPTH) {
      console.error('[normalizeTestimonials] Too many nested arrays!');
      return [];
    }
  }

  if (!Array.isArray(normalizedItems)) return [];

  // Filter valid items
  const validItems = (normalizedItems as Testimonial[]).filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      item.name.trim() &&
      typeof item.content === 'string' &&
      item.content.trim()
  );

  // ✅ FIX: De-duplicate by ID to prevent "duplicate key" React error
  const seen = new Set<string>();
  const uniqueItems: Testimonial[] = [];

  for (const item of validItems) {
    // Generate ID if missing
    const id = item.id || `testi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Skip if already seen
    if (seen.has(id)) {
      console.warn(`[normalizeTestimonials] Duplicate testimonial ID skipped: ${id}`);
      continue;
    }

    seen.add(id);
    uniqueItems.push({
      ...item,
      id, // Ensure ID is always present
    });
  }

  return uniqueItems;
}

// ============================================================================
// MERGE LANDING CONFIG - Deep merge with defaults
// ============================================================================

export function mergeLandingConfig(
  tenant?: Partial<TenantLandingConfig> | null
): TenantLandingConfig {
  const defaults = DEFAULT_LANDING_CONFIG;

  if (!tenant) {
    return JSON.parse(JSON.stringify(defaults));
  }

  // Get testimonial items from tenant with proper extraction
  const tenantTestimonialItems = normalizeTestimonials(tenant.testimonials?.config?.items);
  const defaultTestimonialItems = normalizeTestimonials(defaults.testimonials?.config?.items);

  // Use tenant items if available, otherwise default
  const finalTestimonialItems =
    tenantTestimonialItems.length > 0 ? tenantTestimonialItems : defaultTestimonialItems;

  const result: TenantLandingConfig = {
    enabled: tenant.enabled ?? defaults.enabled,
    template: tenant.template ?? defaults.template,
    sectionOrder: tenant.sectionOrder ?? defaults.sectionOrder, // 🚀 NEW: Preserve section order
    hero: {
      enabled: tenant.hero?.enabled ?? defaults.hero?.enabled ?? false,
      title: tenant.hero?.title ?? defaults.hero?.title,
      subtitle: tenant.hero?.subtitle ?? defaults.hero?.subtitle,
      block: tenant.hero?.block, // 🔥 NO FALLBACK - preserve user choice!
      config: {
        ...(defaults.hero?.config || {}),
        ...(tenant.hero?.config || {}),
      },
    },
    about: {
      enabled: tenant.about?.enabled ?? defaults.about?.enabled ?? false,
      title: tenant.about?.title ?? defaults.about?.title,
      subtitle: tenant.about?.subtitle ?? defaults.about?.subtitle,
      block: tenant.about?.block, // 🔥 NO FALLBACK - preserve user choice!
      config: {
        ...(defaults.about?.config || {}),
        ...(tenant.about?.config || {}),
      },
    },
    products: {
      enabled: tenant.products?.enabled ?? defaults.products?.enabled ?? false,
      title: tenant.products?.title ?? defaults.products?.title,
      subtitle: tenant.products?.subtitle ?? defaults.products?.subtitle,
      block: tenant.products?.block, // 🔥 NO FALLBACK - preserve user choice!
      config: {
        ...(defaults.products?.config || {}),
        ...(tenant.products?.config || {}),
      },
    },
    testimonials: {
      enabled: tenant.testimonials?.enabled ?? defaults.testimonials?.enabled ?? false,
      title: tenant.testimonials?.title ?? defaults.testimonials?.title,
      subtitle: tenant.testimonials?.subtitle ?? defaults.testimonials?.subtitle,
      block: tenant.testimonials?.block, // 🔥 NO FALLBACK - preserve user choice!
      config: {
        items: finalTestimonialItems,
      },
    },
    contact: {
      enabled: tenant.contact?.enabled ?? defaults.contact?.enabled ?? false,
      title: tenant.contact?.title ?? defaults.contact?.title,
      subtitle: tenant.contact?.subtitle ?? defaults.contact?.subtitle,
      block: tenant.contact?.block, // 🔥 NO FALLBACK - preserve user choice!
      config: {
        ...(defaults.contact?.config || {}),
        ...(tenant.contact?.config || {}),
      },
    },
    cta: {
      enabled: tenant.cta?.enabled ?? defaults.cta?.enabled ?? false,
      title: tenant.cta?.title ?? defaults.cta?.title,
      subtitle: tenant.cta?.subtitle ?? defaults.cta?.subtitle,
      block: tenant.cta?.block, // 🔥 NO FALLBACK - preserve user choice!
      config: {
        ...(defaults.cta?.config || {}),
        ...(tenant.cta?.config || {}),
      },
    },
  };

  return result;
}

// ============================================================================
// PREPARE CONFIG FOR SAVE - Normalize before sending to API
// ============================================================================

export function prepareConfigForSave(config: TenantLandingConfig): TenantLandingConfig {
  // 🔥 SIMPLIFIED: Just normalize testimonials, send everything else as-is!
  const result = { ...config };

  // Only normalize testimonials (needed to flatten nested arrays)
  if (result.testimonials?.config?.items) {
    result.testimonials = {
      ...result.testimonials,
      config: {
        items: normalizeTestimonials(result.testimonials.config.items),
      },
    };
  }

  return result;
}

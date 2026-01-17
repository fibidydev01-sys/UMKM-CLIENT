/**
 * ============================================================================
 * FILE: src/lib/landing/helpers.ts
 * PURPOSE: Shared helper functions for landing page display components
 * ============================================================================
 */

import type { LandingSection } from '@/types';

// ============================================================================
// EXTRACT SECTION TEXT - Reduce duplication in display components
// ============================================================================

export interface SectionTextFallbacks {
  title?: string;
  subtitle?: string;
}

export interface SectionText {
  title: string;
  subtitle: string;
}

/**
 * Extract title and subtitle from section config with fallbacks
 * Used in all TenantXxx display components to avoid code duplication
 */
export function extractSectionText(
  config: LandingSection | undefined,
  fallbacks: SectionTextFallbacks = {}
): SectionText {
  return {
    title: config?.title || fallbacks.title || '',
    subtitle: config?.subtitle || fallbacks.subtitle || '',
  };
}

/**
 * Check if a section is enabled
 */
export function isSectionEnabled(section: LandingSection | undefined): boolean {
  return section?.enabled === true;
}

/**
 * Get section config with type safety
 */
export function getSectionConfig<T = Record<string, unknown>>(
  section: LandingSection | undefined
): T | undefined {
  return section?.config as T | undefined;
}

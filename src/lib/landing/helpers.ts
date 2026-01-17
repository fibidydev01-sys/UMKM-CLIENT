/**
 * ============================================================================
 * FILE: src/lib/landing/helpers.ts
 * PURPOSE: Shared helper functions for landing page display components
 * ============================================================================
 */

import type { LandingSection, HeroSectionConfig, AboutSectionConfig, ProductsSectionConfig, ContactSectionConfig, CtaSectionConfig } from '@/types';

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

// ============================================================================
// TYPE-SAFE CONFIG EXTRACTORS - For each section type
// ============================================================================

export function getHeroConfig(section: LandingSection | undefined): HeroSectionConfig | undefined {
  return getSectionConfig<HeroSectionConfig>(section);
}

export function getAboutConfig(section: LandingSection | undefined): AboutSectionConfig | undefined {
  return getSectionConfig<AboutSectionConfig>(section);
}

export function getProductsConfig(section: LandingSection | undefined): ProductsSectionConfig | undefined {
  return getSectionConfig<ProductsSectionConfig>(section);
}

export function getContactConfig(section: LandingSection | undefined): ContactSectionConfig | undefined {
  return getSectionConfig<ContactSectionConfig>(section);
}

export function getCtaConfig(section: LandingSection | undefined): CtaSectionConfig | undefined {
  return getSectionConfig<CtaSectionConfig>(section);
}

// ============================================================================
// VALUE EXTRACTORS - Extract specific values with fallbacks
// ============================================================================

/**
 * Extract background image from hero config with fallback
 */
export function extractBackgroundImage(
  config: HeroSectionConfig | undefined,
  fallback?: string
): string | undefined {
  return config?.backgroundImage || fallback;
}

/**
 * Extract about image with fallback
 */
export function extractAboutImage(
  config: AboutSectionConfig | undefined,
  fallback?: string
): string | undefined {
  if (config?.showImage === false) return undefined;
  return config?.image || fallback;
}

/**
 * Extract CTA link with fallback
 */
export function extractCtaLink(
  config: CtaSectionConfig | undefined,
  fallback: string = '/products'
): string {
  return config?.buttonLink || fallback;
}

/**
 * Extract CTA button text with fallback
 */
export function extractCtaButtonText(
  config: CtaSectionConfig | undefined,
  fallback: string = 'Mulai Belanja'
): string {
  return config?.buttonText || fallback;
}

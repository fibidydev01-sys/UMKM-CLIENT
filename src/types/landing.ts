// ============================================================================
// FILE: src/types/landing.ts
// PURPOSE: Landing page type definitions (storefront-verified fields only)
// ============================================================================

// ==========================================
// BLOCK TYPES
// ==========================================

export type HeroBlock = `hero${number}`;
export type ProductsBlock = `products${number}`;

// ==========================================
// SECTION CONFIG INTERFACES
// ==========================================

export interface HeroSectionConfig {
  ctaText?: string; // → extractHeroData → hero{N} ctaText
  ctaLink?: string; // → extractHeroData → hero{N} ctaLink
}

export interface ProductsSectionConfig {
  limit?: number;        // → TenantProducts: config?.config?.limit
  showViewAll?: boolean; // → TenantProducts: config?.config?.showViewAll
}

// ==========================================
// SECTION INTERFACES
// ==========================================

export interface HeroSection {
  enabled?: boolean; // → store/page.tsx: landingConfig?.hero?.enabled
  title?: string;    // → extractHeroData: fallback if tenant.heroTitle empty
  subtitle?: string; // → extractHeroData: fallback if tenant.heroSubtitle empty
  block?: HeroBlock; // → TenantHero: dynamic import hero{N}
  config?: HeroSectionConfig;
}

export interface ProductsSection {
  enabled?: boolean;     // → store/page.tsx: products section toggle
  block?: ProductsBlock; // → future: dynamic import products{N}
  config?: ProductsSectionConfig;
}

// ==========================================
// MAIN CONFIG
// ==========================================

export interface TenantLandingConfig {
  enabled: boolean;
  hero?: HeroSection;
  products?: ProductsSection;
}
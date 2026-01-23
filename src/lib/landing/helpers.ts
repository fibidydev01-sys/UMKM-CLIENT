/**
 * ============================================================================
 * FILE: src/lib/landing/helpers.ts
 * PURPOSE: Shared helper functions for landing page display components
 * ============================================================================
 *
 * 🚀 UPDATED: Support for Store Information fields (tenant-level data)
 * Data priority: Tenant fields > landingConfig > defaults
 * ============================================================================
 */

import type {
  LandingSection,
  HeroSectionConfig,
  AboutSectionConfig,
  ProductsSectionConfig,
  ContactSectionConfig,
  CtaSectionConfig,
  Tenant,
  PublicTenant,
  FeatureItem,
  Testimonial
} from '@/types';

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

// ============================================================================
// ⚠️ DEPRECATED: TENANT-BASED DATA EXTRACTION
// ============================================================================
// These extraction functions are DEPRECATED and should not be used in new code.
//
// WHY DEPRECATED:
// - Creates unnecessary intermediate data layer
// - Components should access tenant props directly
// - Not aligned with unified state structure (UNIFIED-STATE-STRUCTURE.md)
//
// MIGRATION PATH:
// OLD: const aboutData = extractAboutData(tenant, config);
// NEW: <TenantAbout tenant={tenant} config={config} />
//      // Component accesses tenant.aboutTitle directly
//
// See REFACTORING-TARGETS.md for full migration guide
// ============================================================================

type TenantData = Tenant | PublicTenant;

// ============================================================================
// HERO SECTION DATA
// ============================================================================

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

/**
 * Extract Hero section data from tenant with fallbacks
 * Priority: tenant fields > landingConfig > defaults
 *
 * @deprecated This function is deprecated. Pass tenant and config directly to TenantHero component instead.
 * @see REFACTORING-TARGETS.md for migration guide
 */
export function extractHeroData(
  tenant: TenantData,
  landingConfig?: { hero?: LandingSection & { config?: HeroSectionConfig } }
): HeroData {
  const heroConfig = landingConfig?.hero;
  const config = heroConfig?.config;

  return {
    title: tenant.heroTitle || heroConfig?.title || tenant.name || '',
    subtitle: tenant.heroSubtitle || heroConfig?.subtitle || tenant.description || '',
    ctaText: tenant.heroCtaText || config?.ctaText || 'Lihat Produk',
    ctaLink: tenant.heroCtaLink || config?.ctaLink || '/products',
    backgroundImage: tenant.heroBackgroundImage || config?.backgroundImage,
  };
}

// ============================================================================
// ABOUT SECTION DATA
// ============================================================================

export interface AboutData {
  title: string;
  subtitle: string;
  content: string;
  image?: string;
  features: FeatureItem[];
}

/**
 * Extract About section data from tenant with fallbacks
 *
 * @deprecated This function is deprecated. Pass tenant and config directly to TenantAbout component instead.
 * @see REFACTORING-TARGETS.md for migration guide
 */
export function extractAboutData(
  tenant: TenantData,
  landingConfig?: { about?: LandingSection & { config?: AboutSectionConfig } }
): AboutData {
  const aboutConfig = landingConfig?.about;
  const config = aboutConfig?.config;

  return {
    title: tenant.aboutTitle || aboutConfig?.title || 'Tentang Kami',
    subtitle: tenant.aboutSubtitle || aboutConfig?.subtitle || '',
    content: tenant.aboutContent || config?.content || tenant.description || '',
    image: tenant.aboutImage || config?.image || tenant.logo,
    features: (tenant.aboutFeatures as FeatureItem[] | undefined) || config?.features || [],
  };
}

// ============================================================================
// TESTIMONIALS SECTION DATA
// ============================================================================

export interface TestimonialsData {
  title: string;
  subtitle: string;
  items: Testimonial[];
}

/**
 * Extract Testimonials section data from tenant with fallbacks
 *
 * @deprecated This function is deprecated. Pass tenant and config directly to TenantTestimonials component instead.
 * @see REFACTORING-TARGETS.md for migration guide
 */
export function extractTestimonialsData(
  tenant: TenantData,
  landingConfig?: { testimonials?: LandingSection & { config?: { items?: Testimonial[] } } }
): TestimonialsData {
  const testimonialsConfig = landingConfig?.testimonials;
  const config = testimonialsConfig?.config;

  return {
    title: tenant.testimonialsTitle || testimonialsConfig?.title || 'Testimoni',
    subtitle: tenant.testimonialsSubtitle || testimonialsConfig?.subtitle || 'Apa kata pelanggan kami',
    items: (tenant.testimonials as Testimonial[] | undefined) || config?.items || [],
  };
}

// ============================================================================
// CONTACT SECTION DATA
// ============================================================================

export interface ContactData {
  title: string;
  subtitle: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapUrl?: string;
  showMap: boolean;
  showForm: boolean;
  socialLinks?: Tenant['socialLinks'];
}

/**
 * Extract Contact section data from tenant with fallbacks
 *
 * @deprecated This function is deprecated. Pass tenant and config directly to TenantContact component instead.
 * @see REFACTORING-TARGETS.md for migration guide
 */
export function extractContactData(
  tenant: TenantData,
  landingConfig?: { contact?: LandingSection & { config?: ContactSectionConfig } }
): ContactData {
  const contactConfig = landingConfig?.contact;
  const config = contactConfig?.config;

  return {
    title: tenant.contactTitle || contactConfig?.title || 'Hubungi Kami',
    subtitle: tenant.contactSubtitle || contactConfig?.subtitle || 'Kami siap membantu Anda',
    whatsapp: tenant.whatsapp,
    email: 'email' in tenant ? tenant.email : undefined,
    phone: tenant.phone,
    address: tenant.address,
    mapUrl: tenant.contactMapUrl,
    showMap: tenant.contactShowMap ?? config?.showMap ?? false,
    showForm: tenant.contactShowForm ?? config?.showForm ?? true,
    socialLinks: tenant.socialLinks,
  };
}

// ============================================================================
// CTA SECTION DATA
// ============================================================================

export interface CtaData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle: 'primary' | 'secondary' | 'outline';
}

/**
 * Extract CTA section data from tenant with fallbacks
 *
 * @deprecated This function is deprecated. Pass tenant and config directly to TenantCta component instead.
 * @see REFACTORING-TARGETS.md for migration guide
 */
export function extractCtaData(
  tenant: TenantData,
  landingConfig?: { cta?: LandingSection & { config?: CtaSectionConfig } }
): CtaData {
  const ctaConfig = landingConfig?.cta;
  const config = ctaConfig?.config;

  return {
    title: tenant.ctaTitle || ctaConfig?.title || 'Siap Memulai?',
    subtitle: tenant.ctaSubtitle || ctaConfig?.subtitle || 'Bergabunglah dengan kami hari ini',
    buttonText: tenant.ctaButtonText || config?.buttonText || 'Mulai Sekarang',
    buttonLink: tenant.ctaButtonLink || config?.buttonLink || '/products',
    buttonStyle: tenant.ctaButtonStyle || config?.style || 'primary',
  };
}

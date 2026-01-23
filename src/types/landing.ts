// ==========================================
// LANDING PAGE TYPE DEFINITIONS
// 🚀 SYNCED WITH BACKEND VALIDATOR
// ==========================================

// ==========================================
// BLOCK TYPES (from backend)
// ==========================================

/**
 * v3.0 NUMBERING SYSTEM - AUTO-DISCOVERY ENABLED! 🚀
 * Blocks are auto-discovered from filesystem
 * No manual type updates needed when adding new blocks!
 */

// Auto-accepts any number: hero1, hero2, hero201, hero9999, etc.
export type HeroBlock = `hero${number}`;

// Auto-accepts any number: about1, about2, about201, etc.
export type AboutBlock = `about${number}`;

// Auto-accepts any number: products1, products2, products201, etc.
export type ProductsBlock = `products${number}`;

// Auto-accepts any number: testimonials1, testimonials2, testimonials201, etc.
export type TestimonialsBlock = `testimonials${number}`;

// Auto-accepts any number: contact1, contact2, contact201, etc.
export type ContactBlock = `contact${number}`;

// Auto-accepts any number: cta1, cta2, cta201, etc.
export type CtaBlock = `cta${number}`;


// ==========================================
// SECTION BASE INTERFACE
// ==========================================

export interface LandingSection<V = string> {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  block?: V;
  config?: Record<string, unknown>;
}

// ==========================================
// SECTION CONFIG INTERFACES
// ==========================================

export interface HeroSectionConfig {
  layout?: 'centered' | 'left' | 'right';
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export interface AboutSectionConfig {
  content?: string;
  showImage?: boolean;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface ProductsSectionConfig {
  displayMode?: 'featured' | 'latest' | 'all';
  limit?: number;
  showViewAll?: boolean;
}

// ==========================================
// TESTIMONIAL TYPE (EXPORTED FOR REUSE)
// ==========================================
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export interface TestimonialsSectionConfig {
  items?: Testimonial[];
}

export interface ContactSectionConfig {
  showMap?: boolean;
  showForm?: boolean;
  showSocialMedia?: boolean;
}

export interface CtaSectionConfig {
  buttonText?: string;
  buttonLink?: string;
  style?: 'primary' | 'secondary' | 'outline';
}

// ==========================================
// SECTION TYPE (for ordering)
// ==========================================

export type SectionKey = 'hero' | 'about' | 'products' | 'testimonials' | 'contact' | 'cta';

// ==========================================
// MAIN CONFIG INTERFACE
// ==========================================

export interface TenantLandingConfig {
  enabled: boolean;
  template?: string; // Template ID
  sectionOrder?: SectionKey[]; // 🚀 NEW: Drag & drop section ordering
  hero?: LandingSection<HeroBlock> & { config?: HeroSectionConfig };
  about?: LandingSection<AboutBlock> & { config?: AboutSectionConfig };
  products?: LandingSection<ProductsBlock> & { config?: ProductsSectionConfig };
  testimonials?: LandingSection<TestimonialsBlock> & { config?: TestimonialsSectionConfig };
  contact?: LandingSection<ContactBlock> & { config?: ContactSectionConfig };
  cta?: LandingSection<CtaBlock> & { config?: CtaSectionConfig };
}

// ==========================================
// DEFAULT CONFIG - Imported from @/lib/landing
// ==========================================
// DEFAULT_LANDING_CONFIG is now defined in @/lib/landing/defaults.ts
// Import it from there to avoid duplication!
//
// Example:
// import { DEFAULT_LANDING_CONFIG } from '@/lib/landing';
// ==========================================

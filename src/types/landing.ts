// ==========================================
// LANDING PAGE TYPE DEFINITIONS
// 🚀 SYNCED WITH BACKEND VALIDATOR
// ==========================================

// ==========================================
// VARIANT TYPES (from backend)
// ==========================================

export type HeroVariant =
  | 'default'
  | 'gradient-overlay'
  | 'centered-minimal'
  | 'split-screen'
  | 'video-background'
  | 'parallax'
  | 'animated-gradient'
  | 'glass-morphism';

export type AboutVariant =
  | 'default'
  | 'side-by-side'
  | 'centered'
  | 'timeline'
  | 'cards'
  | 'magazine'
  | 'storytelling';

export type ProductsVariant =
  | 'default'
  | 'grid-hover'
  | 'masonry'
  | 'carousel'
  | 'featured-hero'
  | 'catalog'
  | 'minimal-list';

export type TestimonialsVariant =
  | 'default'
  | 'card-slider'
  | 'quote-highlight'
  | 'grid-cards'
  | 'single-focus'
  | 'video-testimonials'
  | 'social-proof';

export type ContactVariant =
  | 'default'
  | 'split-form'
  | 'centered'
  | 'map-focus'
  | 'minimal'
  | 'social-focused';

export type CtaVariant =
  | 'default'
  | 'bold-center'
  | 'gradient-banner'
  | 'split-action'
  | 'floating'
  | 'minimal-line';

// ==========================================
// SECTION BASE INTERFACE
// ==========================================

export interface LandingSection<V = string> {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  variant?: V;
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
// MAIN CONFIG INTERFACE
// ==========================================

export interface TenantLandingConfig {
  enabled: boolean;
  template?: string; // Template ID
  hero?: LandingSection<HeroVariant> & { config?: HeroSectionConfig };
  about?: LandingSection<AboutVariant> & { config?: AboutSectionConfig };
  products?: LandingSection<ProductsVariant> & { config?: ProductsSectionConfig };
  testimonials?: LandingSection<TestimonialsVariant> & { config?: TestimonialsSectionConfig };
  contact?: LandingSection<ContactVariant> & { config?: ContactSectionConfig };
  cta?: LandingSection<CtaVariant> & { config?: CtaSectionConfig };
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

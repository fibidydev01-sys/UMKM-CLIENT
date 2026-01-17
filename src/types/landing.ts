// ==========================================
// LANDING PAGE TYPE DEFINITIONS
// ==========================================

export interface LandingSection {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  config?: Record<string, unknown>;
}

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

export interface TenantLandingConfig {
  enabled: boolean;
  hero?: LandingSection & { config?: HeroSectionConfig };
  about?: LandingSection & { config?: AboutSectionConfig };
  products?: LandingSection & { config?: ProductsSectionConfig };
  testimonials?: LandingSection & { config?: TestimonialsSectionConfig };
  contact?: LandingSection & { config?: ContactSectionConfig };
  cta?: LandingSection & { config?: CtaSectionConfig };
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
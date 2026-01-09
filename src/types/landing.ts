// ==========================================
// LANDING PAGE TYPE DEFINITIONS
// ==========================================

export interface LandingSection {
  enabled?: boolean;  // ✅ Changed to optional
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

export const DEFAULT_LANDING_CONFIG: TenantLandingConfig = {
  enabled: false,
  hero: {
    enabled: true,
    title: '',
    subtitle: '',
    config: {
      layout: 'centered',
      showCta: true,
      ctaText: 'Lihat Produk',
      overlayOpacity: 0.5,
    },
  },
  about: {
    enabled: false,
    title: 'Tentang Kami',
    subtitle: '',
    config: {
      showImage: true,
      features: [],
    },
  },
  products: {
    enabled: true,
    title: 'Produk Kami',
    subtitle: 'Pilihan produk terbaik untuk Anda',
    config: {
      displayMode: 'featured',
      limit: 8,
      showViewAll: true,
    },
  },
  testimonials: {
    enabled: false,
    title: 'Testimoni',
    subtitle: 'Apa kata pelanggan kami',
    config: {
      items: [],
    },
  },
  contact: {
    enabled: true,
    title: 'Hubungi Kami',
    subtitle: '',
    config: {
      showMap: false,
      showForm: false,
      showSocialMedia: true,
    },
  },
  cta: {
    enabled: false,
    title: 'Siap Berbelanja?',
    subtitle: '',
    config: {
      buttonText: 'Mulai Belanja',
      style: 'primary',
    },
  },
};
/**
 * ============================================================================
 * FILE: src/lib/landing/constants.ts
 * PURPOSE: Landing page constants - magic numbers, enums, default values
 * ============================================================================
 */

// ============================================================================
// MAGIC NUMBERS & DEFAULT VALUES
// ============================================================================

export const LANDING_CONSTANTS = {
  // Product display limits
  PRODUCT_LIMIT_DEFAULT: 8,
  PRODUCT_LIMIT_MIN: 1,
  PRODUCT_LIMIT_MAX: 24,

  // Overlay opacity
  OVERLAY_OPACITY_DEFAULT: 0.5,
  OVERLAY_OPACITY_MIN: 0,
  OVERLAY_OPACITY_MAX: 1,

  // Default texts
  CTA_TEXT_DEFAULT: 'Lihat Produk',
  CTA_BUTTON_DEFAULT: 'Mulai Belanja',

  // Section titles
  SECTION_TITLES: {
    ABOUT: 'Tentang Kami',
    PRODUCTS: 'Produk Kami',
    TESTIMONIALS: 'Testimoni',
    CONTACT: 'Hubungi Kami',
    CTA: 'Siap Berbelanja?',
  },

  // Section subtitles
  SECTION_SUBTITLES: {
    PRODUCTS: 'Pilihan produk terbaik untuk Anda',
    TESTIMONIALS: 'Apa kata pelanggan kami',
  },

  // Image folders
  IMAGE_FOLDERS: {
    TESTIMONIALS: 'fibidy/testimonials',
    HERO: 'fibidy/hero',
    ABOUT: 'fibidy/about',
  },

  // Limits
  TESTIMONIALS_MAX_DISPLAY: 6,
  NESTED_ARRAY_MAX_DEPTH: 10,
} as const;

// ============================================================================
// ENUMS & LITERAL TYPES
// ============================================================================

export const HERO_LAYOUTS = ['centered', 'left', 'right'] as const;
export type HeroLayout = (typeof HERO_LAYOUTS)[number];

export const PRODUCT_DISPLAY_MODES = ['featured', 'latest', 'all'] as const;
export type ProductDisplayMode = (typeof PRODUCT_DISPLAY_MODES)[number];

export const CTA_STYLES = ['primary', 'secondary', 'outline'] as const;
export type CtaStyle = (typeof CTA_STYLES)[number];

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
  TESTIMONIAL: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 1000,
    RATING_MIN: 1,
    RATING_MAX: 5,
  },
  SECTION: {
    TITLE_MAX_LENGTH: 200,
    SUBTITLE_MAX_LENGTH: 500,
  },
} as const;

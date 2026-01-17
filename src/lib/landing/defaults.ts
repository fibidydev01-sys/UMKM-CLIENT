/**
 * ============================================================================
 * FILE: src/lib/landing/defaults.ts
 * PURPOSE: Default landing page configuration - SINGLE SOURCE OF TRUTH!
 * ============================================================================
 */

import type { TenantLandingConfig } from '@/types';
import { LANDING_CONSTANTS, HERO_LAYOUTS, PRODUCT_DISPLAY_MODES, CTA_STYLES } from './constants';

// ============================================================================
// DEFAULT LANDING CONFIG - ALL SECTIONS & TOGGLES DISABLED BY DEFAULT!
// ============================================================================
// This is the ONLY place where DEFAULT_LANDING_CONFIG is defined.
// All other files should import from here!
// ============================================================================

export const DEFAULT_LANDING_CONFIG: TenantLandingConfig = {
  enabled: false, // ❌ Disabled by default
  hero: {
    enabled: false, // ❌ Disabled
    title: '',
    subtitle: '',
    config: {
      layout: HERO_LAYOUTS[0], // 'centered'
      showCta: false, // ❌ Disabled by default
      ctaText: LANDING_CONSTANTS.CTA_TEXT_DEFAULT, // 'Lihat Produk'
      overlayOpacity: LANDING_CONSTANTS.OVERLAY_OPACITY_DEFAULT, // 0.5
    },
  },
  about: {
    enabled: false, // ❌ Disabled
    title: LANDING_CONSTANTS.SECTION_TITLES.ABOUT, // 'Tentang Kami'
    subtitle: '',
    config: {
      showImage: false, // ❌ Disabled by default
      features: [],
    },
  },
  products: {
    enabled: false, // ❌ Disabled
    title: LANDING_CONSTANTS.SECTION_TITLES.PRODUCTS, // 'Produk Kami'
    subtitle: LANDING_CONSTANTS.SECTION_SUBTITLES.PRODUCTS, // 'Pilihan produk terbaik untuk Anda'
    config: {
      displayMode: PRODUCT_DISPLAY_MODES[0], // 'featured'
      limit: LANDING_CONSTANTS.PRODUCT_LIMIT_DEFAULT, // 8
      showViewAll: false, // ❌ Disabled by default
    },
  },
  testimonials: {
    enabled: false, // ❌ Disabled
    title: LANDING_CONSTANTS.SECTION_TITLES.TESTIMONIALS, // 'Testimoni'
    subtitle: LANDING_CONSTANTS.SECTION_SUBTITLES.TESTIMONIALS, // 'Apa kata pelanggan kami'
    config: {
      items: [],
    },
  },
  contact: {
    enabled: false, // ❌ Disabled
    title: LANDING_CONSTANTS.SECTION_TITLES.CONTACT, // 'Hubungi Kami'
    subtitle: '',
    config: {
      showMap: false, // ❌ Disabled by default
      showForm: false, // ❌ Disabled by default
      showSocialMedia: false, // ❌ Disabled by default
    },
  },
  cta: {
    enabled: false, // ❌ Disabled
    title: LANDING_CONSTANTS.SECTION_TITLES.CTA, // 'Siap Berbelanja?'
    subtitle: '',
    config: {
      buttonText: LANDING_CONSTANTS.CTA_BUTTON_DEFAULT, // 'Mulai Belanja'
      style: CTA_STYLES[0], // 'primary'
    },
  },
};

// ==========================================
// TEMPLATE DEFAULT CONTENT
// 🚀 Sample content per template for better UX
// ==========================================
// When user selects a template, they get pre-filled content
// so they can immediately see how it looks!

import type { TenantLandingConfig } from '@/types';
import type { TemplateId } from './template-types';

/**
 * Default content per template
 * Use {StoreName} and {Category} as placeholders
 */
export const TEMPLATE_DEFAULTS: Record<TemplateId, Partial<TenantLandingConfig>> = {
  'suspended-minimalist': {
    enabled: true,
    template: 'suspended-minimalist',
    hero: {
      enabled: true,
      title: 'Selamat Datang di {StoreName}',
      subtitle: 'Temukan produk berkualitas dengan harga terbaik',
      variant: 'centered-minimal',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Lihat Produk',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'Tentang Kami',
      subtitle: 'Kenali lebih dekat dengan {StoreName}',
      variant: 'centered',
      config: {
        content: 'Kami berkomitmen untuk memberikan produk terbaik dengan harga yang terjangkau. Kepuasan pelanggan adalah prioritas utama kami.',
        showImage: false,
      },
    },
    products: {
      enabled: true,
      title: 'Produk Kami',
      subtitle: 'Koleksi produk pilihan terbaik',
      variant: 'minimal-list',
      config: {
        displayMode: 'all',
        limit: 8,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: false,
      title: 'Testimoni',
      subtitle: 'Apa kata pelanggan kami',
      variant: 'default',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Hubungi Kami',
      subtitle: 'Kami siap membantu Anda',
      variant: 'minimal',
      config: {
        showMap: false,
        showForm: false,
        showSocialMedia: false,
      },
    },
    cta: {
      enabled: false,
      title: 'Siap Berbelanja?',
      subtitle: '',
      variant: 'minimal-line',
      config: {
        buttonText: 'Mulai Belanja',
        style: 'primary',
      },
    },
  },

  'modern-starter': {
    enabled: true,
    template: 'modern-starter',
    hero: {
      enabled: true,
      title: 'Semua Cita Rasa Lezat Bersama {StoreName}',
      subtitle: 'Makanan adalah seni, dan makanan adalah cinta. Kami mengantarkan kehangatan dari cita rasa terbaik langsung ke pintu rumah Anda dengan penuh kasih sayang.',
      variant: 'gradient-overlay',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Pesan Sekarang',
        ctaLink: '/products',
        overlayOpacity: 0.6,
      },
    },
    about: {
      enabled: true,
      title: 'Tentang Kami',
      subtitle: 'Cerita perjalanan kami dalam melayani Anda',
      variant: 'side-by-side',
      config: {
        content: 'Sejak 2020, kami telah melayani ribuan pelanggan dengan produk berkualitas tinggi. Kepercayaan Anda adalah aset terbesar kami.',
        showImage: true,
      },
    },
    products: {
      enabled: true,
      title: 'Menu Spesial Kami',
      subtitle: 'Pilihan menu terbaik dengan cita rasa autentik',
      variant: 'grid-hover',
      config: {
        displayMode: 'featured',
        limit: 8,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: true,
      title: 'Testimoni Pelanggan',
      subtitle: 'Apa kata mereka yang sudah mencoba',
      variant: 'card-slider',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Hubungi Kami',
      subtitle: 'Ada pertanyaan? Jangan ragu untuk menghubungi',
      variant: 'split-form',
      config: {
        showMap: false,
        showForm: true,
        showSocialMedia: true,
      },
    },
    cta: {
      enabled: true,
      title: 'Mulai Belanja Sekarang',
      subtitle: 'Jangan lewatkan penawaran spesial kami',
      variant: 'bold-center',
      config: {
        buttonText: 'Belanja Sekarang',
        style: 'primary',
      },
    },
  },

  'bold-starter': {
    enabled: true,
    template: 'bold-starter',
    hero: {
      enabled: true,
      title: 'Belanja Online Lebih Mudah dengan {StoreName}',
      subtitle: 'Gratis ongkir untuk pembelian pertama, harga termurah, kualitas terjamin 100%',
      variant: 'animated-gradient',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Mulai Belanja',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'Kenapa Pilih Kami?',
      subtitle: 'Keunggulan yang kami tawarkan',
      variant: 'magazine',
      config: {
        content: 'Produk original, harga bersaing, pengiriman cepat, dan customer service terbaik. Ribuan pelanggan telah mempercayai kami!',
        showImage: true,
        features: [
          {
            title: 'Produk Original',
            description: '100% produk asli bergaransi resmi',
          },
          {
            title: 'Pengiriman Cepat',
            description: 'Same day delivery untuk area tertentu',
          },
          {
            title: 'Customer Service 24/7',
            description: 'Tim support kami siap membantu kapan saja',
          },
        ],
      },
    },
    products: {
      enabled: true,
      title: 'Produk Terlaris',
      subtitle: 'Paling banyak dibeli bulan ini',
      variant: 'featured-hero',
      config: {
        displayMode: 'featured',
        limit: 6,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: true,
      title: 'Dipercaya Ribuan Pelanggan',
      subtitle: 'Rating 5.0 dari 1000+ review',
      variant: 'quote-highlight',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Hubungi Kami',
      subtitle: 'Customer service siap membantu Anda',
      variant: 'social-focused',
      config: {
        showMap: false,
        showForm: true,
        showSocialMedia: true,
      },
    },
    cta: {
      enabled: true,
      title: 'Dapatkan Diskon 20% Hari Ini',
      subtitle: 'Promo terbatas! Buruan checkout sekarang',
      variant: 'gradient-banner',
      config: {
        buttonText: 'Belanja Sekarang',
        style: 'primary',
      },
    },
  },

  'classic-starter': {
    enabled: true,
    template: 'classic-starter',
    hero: {
      enabled: true,
      title: '{StoreName} - Pilihan Tepat untuk Kebutuhan Anda',
      subtitle: 'Melayani dengan sepenuh hati sejak tahun 2015',
      variant: 'split-screen',
      config: {
        layout: 'left',
        showCta: true,
        ctaText: 'Lihat Katalog',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'Sejarah Kami',
      subtitle: 'Perjalanan panjang melayani pelanggan',
      variant: 'timeline',
      config: {
        content: 'Berawal dari usaha kecil, kini kami telah berkembang menjadi salah satu toko terpercaya dengan ribuan pelanggan setia.',
        showImage: true,
      },
    },
    products: {
      enabled: true,
      title: 'Katalog Produk',
      subtitle: 'Beragam pilihan untuk Anda',
      variant: 'carousel',
      config: {
        displayMode: 'all',
        limit: 10,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: true,
      title: 'Testimoni',
      subtitle: 'Pengalaman pelanggan kami',
      variant: 'grid-cards',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Lokasi & Kontak',
      subtitle: 'Kunjungi toko kami atau hubungi via online',
      variant: 'map-focus',
      config: {
        showMap: true,
        showForm: true,
        showSocialMedia: false,
      },
    },
    cta: {
      enabled: true,
      title: 'Kunjungi Toko Kami',
      subtitle: 'Atau pesan online sekarang juga',
      variant: 'split-action',
      config: {
        buttonText: 'Belanja Online',
        style: 'primary',
      },
    },
  },

  'brand-starter': {
    enabled: true,
    template: 'brand-starter',
    hero: {
      enabled: true,
      title: '{StoreName}',
      subtitle: 'Lebih dari sekedar produk, kami hadirkan pengalaman',
      variant: 'glass-morphism',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Jelajahi',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'Cerita Kami',
      subtitle: 'Brand yang dibangun dengan passion',
      variant: 'storytelling',
      config: {
        content: 'Setiap produk yang kami tawarkan memiliki cerita. Dari pemilihan bahan baku terbaik hingga proses yang penuh dedikasi, semua kami lakukan untuk Anda.',
        showImage: true,
      },
    },
    products: {
      enabled: true,
      title: 'Koleksi Terbaru',
      subtitle: 'Karya terbaik kami untuk Anda',
      variant: 'masonry',
      config: {
        displayMode: 'latest',
        limit: 9,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: true,
      title: 'Suara Pelanggan',
      subtitle: 'Mereka yang telah merasakan pengalaman bersama kami',
      variant: 'single-focus',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Mari Terhubung',
      subtitle: 'Kami ingin mendengar dari Anda',
      variant: 'centered',
      config: {
        showMap: false,
        showForm: true,
        showSocialMedia: true,
      },
    },
    cta: {
      enabled: true,
      title: 'Bergabunglah dengan Komunitas Kami',
      subtitle: 'Dapatkan update produk terbaru dan promo eksklusif',
      variant: 'floating',
      config: {
        buttonText: 'Ikuti Kami',
        style: 'outline',
      },
    },
  },

  'catalog-starter': {
    enabled: true,
    template: 'catalog-starter',
    hero: {
      enabled: true,
      title: 'Katalog Produk {StoreName}',
      subtitle: 'Temukan apa yang Anda cari',
      variant: 'default',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Lihat Semua',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: false,
      title: 'Tentang Kami',
      subtitle: '',
      variant: 'default',
    },
    products: {
      enabled: true,
      title: 'Semua Produk',
      subtitle: 'Lengkap dan terpercaya',
      variant: 'catalog',
      config: {
        displayMode: 'all',
        limit: 20,
        showViewAll: false,
      },
    },
    testimonials: {
      enabled: false,
      title: 'Testimoni',
      subtitle: '',
      variant: 'social-proof',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Kontak',
      subtitle: 'Hubungi kami untuk informasi lebih lanjut',
      variant: 'default',
      config: {
        showMap: false,
        showForm: false,
        showSocialMedia: false,
      },
    },
    cta: {
      enabled: false,
      title: 'Pesan Sekarang',
      subtitle: '',
      variant: 'default',
    },
  },

  'fresh-starter': {
    enabled: true,
    template: 'fresh-starter',
    hero: {
      enabled: true,
      title: 'Fresh, Clean, {StoreName}',
      subtitle: 'Kesederhanaan adalah kunci keindahan',
      variant: 'centered-minimal',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Explore',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'About',
      subtitle: 'What we believe in',
      variant: 'centered',
      config: {
        content: 'Less is more. We focus on quality over quantity, bringing you only the best.',
        showImage: false,
      },
    },
    products: {
      enabled: true,
      title: 'Products',
      subtitle: 'Our curated collection',
      variant: 'grid-hover',
      config: {
        displayMode: 'featured',
        limit: 6,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: false,
      title: 'Testimonials',
      subtitle: '',
      variant: 'card-slider',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Get in Touch',
      subtitle: '',
      variant: 'split-form',
      config: {
        showMap: false,
        showForm: true,
        showSocialMedia: false,
      },
    },
    cta: {
      enabled: false,
      title: 'Start Shopping',
      subtitle: '',
      variant: 'minimal-line',
    },
  },

  'elegant-starter': {
    enabled: true,
    template: 'elegant-starter',
    hero: {
      enabled: true,
      title: 'Elegance Redefined',
      subtitle: 'Experience luxury with {StoreName}',
      variant: 'parallax',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Discover',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'Our Philosophy',
      subtitle: 'Crafted with precision, delivered with care',
      variant: 'magazine',
      config: {
        content: 'Every detail matters. From the finest materials to impeccable craftsmanship, we deliver excellence.',
        showImage: true,
      },
    },
    products: {
      enabled: true,
      title: 'Signature Collection',
      subtitle: 'Timeless pieces for the discerning',
      variant: 'masonry',
      config: {
        displayMode: 'featured',
        limit: 8,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: true,
      title: 'Client Testimonials',
      subtitle: 'Trusted by connoisseurs',
      variant: 'quote-highlight',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Connect with Us',
      subtitle: 'We would love to hear from you',
      variant: 'centered',
      config: {
        showMap: false,
        showForm: true,
        showSocialMedia: true,
      },
    },
    cta: {
      enabled: true,
      title: 'Experience Excellence',
      subtitle: 'Discover our exclusive collection',
      variant: 'bold-center',
      config: {
        buttonText: 'View Collection',
        style: 'primary',
      },
    },
  },

  'dynamic-starter': {
    enabled: true,
    template: 'dynamic-starter',
    hero: {
      enabled: true,
      title: 'Bold. Dynamic. {StoreName}.',
      subtitle: 'Energy that moves you forward',
      variant: 'video-background',
      config: {
        layout: 'centered',
        showCta: true,
        ctaText: 'Get Started',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'Why We Stand Out',
      subtitle: 'Innovation meets excellence',
      variant: 'cards',
      config: {
        content: 'We are not just another store. We are your partner in success, bringing you cutting-edge products and exceptional service.',
        showImage: true,
        features: [
          {
            title: 'Innovation First',
            description: 'Always ahead with the latest trends',
          },
          {
            title: 'Quality Guaranteed',
            description: 'Every product meets our strict standards',
          },
          {
            title: 'Fast Delivery',
            description: 'Your time matters to us',
          },
        ],
      },
    },
    products: {
      enabled: true,
      title: 'Trending Now',
      subtitle: "What's hot this season",
      variant: 'featured-hero',
      config: {
        displayMode: 'featured',
        limit: 8,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: true,
      title: 'Success Stories',
      subtitle: 'Real people, real results',
      variant: 'video-testimonials',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: "Let's Connect",
      subtitle: 'Reach out to us anytime',
      variant: 'social-focused',
      config: {
        showMap: false,
        showForm: true,
        showSocialMedia: true,
      },
    },
    cta: {
      enabled: true,
      title: 'Join the Movement',
      subtitle: 'Be part of something bigger',
      variant: 'gradient-banner',
      config: {
        buttonText: 'Join Now',
        style: 'primary',
      },
    },
  },

  'professional-starter': {
    enabled: true,
    template: 'professional-starter',
    hero: {
      enabled: true,
      title: 'Professional Solutions by {StoreName}',
      subtitle: 'Trusted partner for your business needs',
      variant: 'split-screen',
      config: {
        layout: 'left',
        showCta: true,
        ctaText: 'Learn More',
        ctaLink: '/products',
      },
    },
    about: {
      enabled: true,
      title: 'About Our Company',
      subtitle: 'Expertise you can trust',
      variant: 'side-by-side',
      config: {
        content: 'With over a decade of experience, we provide professional-grade solutions that businesses rely on. Our commitment to excellence is unmatched.',
        showImage: true,
      },
    },
    products: {
      enabled: true,
      title: 'Our Solutions',
      subtitle: 'Products designed for professionals',
      variant: 'grid-hover',
      config: {
        displayMode: 'all',
        limit: 12,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: true,
      title: 'Client Feedback',
      subtitle: 'What our partners say',
      variant: 'grid-cards',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: true,
      title: 'Get in Touch',
      subtitle: 'Contact our team for inquiries',
      variant: 'map-focus',
      config: {
        showMap: true,
        showForm: true,
        showSocialMedia: false,
      },
    },
    cta: {
      enabled: true,
      title: 'Ready to Partner with Us?',
      subtitle: 'Request a consultation today',
      variant: 'split-action',
      config: {
        buttonText: 'Contact Sales',
        style: 'primary',
      },
    },
  },

  custom: {
    enabled: true,
    template: 'custom',
    hero: {
      enabled: true,
      title: 'Selamat Datang',
      subtitle: '',
      variant: 'default',
      config: {
        layout: 'centered',
        showCta: false,
      },
    },
    about: {
      enabled: false,
      title: 'Tentang Kami',
      subtitle: '',
      variant: 'default',
    },
    products: {
      enabled: true,
      title: 'Produk',
      subtitle: '',
      variant: 'default',
      config: {
        displayMode: 'all',
        limit: 8,
        showViewAll: true,
      },
    },
    testimonials: {
      enabled: false,
      title: 'Testimoni',
      subtitle: '',
      variant: 'default',
      config: {
        items: [],
      },
    },
    contact: {
      enabled: false,
      title: 'Kontak',
      subtitle: '',
      variant: 'default',
    },
    cta: {
      enabled: false,
      title: 'Call to Action',
      subtitle: '',
      variant: 'default',
    },
  },
};

/**
 * Get default content for a template
 * Replaces placeholders with actual tenant data
 */
export function getTemplateDefaults(
  templateId: TemplateId,
  tenantData?: {
    name?: string;
    category?: string;
  }
): Partial<TenantLandingConfig> {
  const defaults = TEMPLATE_DEFAULTS[templateId] || TEMPLATE_DEFAULTS['suspended-minimalist'];

  // Clone to avoid mutation
  const config = JSON.parse(JSON.stringify(defaults)) as Partial<TenantLandingConfig>;

  // Replace placeholders if tenant data provided
  if (tenantData) {
    const replacePlaceholder = (text: string | undefined): string | undefined => {
      if (!text) return text;
      return text
        .replace(/\{StoreName\}/g, tenantData.name || 'Toko Kami')
        .replace(/\{Category\}/g, tenantData.category || '');
    };

    // Replace in hero
    if (config.hero) {
      config.hero.title = replacePlaceholder(config.hero.title);
      config.hero.subtitle = replacePlaceholder(config.hero.subtitle);
    }

    // Replace in about
    if (config.about) {
      config.about.title = replacePlaceholder(config.about.title);
      config.about.subtitle = replacePlaceholder(config.about.subtitle);
      if (config.about.config?.content) {
        config.about.config.content = replacePlaceholder(config.about.config.content);
      }
    }

    // Replace in products
    if (config.products) {
      config.products.title = replacePlaceholder(config.products.title);
      config.products.subtitle = replacePlaceholder(config.products.subtitle);
    }

    // Replace in testimonials
    if (config.testimonials) {
      config.testimonials.title = replacePlaceholder(config.testimonials.title);
      config.testimonials.subtitle = replacePlaceholder(config.testimonials.subtitle);
    }

    // Replace in contact
    if (config.contact) {
      config.contact.title = replacePlaceholder(config.contact.title);
      config.contact.subtitle = replacePlaceholder(config.contact.subtitle);
    }

    // Replace in cta
    if (config.cta) {
      config.cta.title = replacePlaceholder(config.cta.title);
      config.cta.subtitle = replacePlaceholder(config.cta.subtitle);
    }
  }

  return config;
}

/**
 * Merge template defaults with existing config
 * Preserves user customizations while adding defaults for missing fields
 */
export function mergeWithTemplateDefaults(
  existingConfig: Partial<TenantLandingConfig> | null | undefined,
  templateId: TemplateId,
  tenantData?: {
    name?: string;
    category?: string;
  }
): Partial<TenantLandingConfig> {
  const defaults = getTemplateDefaults(templateId, tenantData);

  if (!existingConfig) {
    return defaults;
  }

  // Deep merge logic
  return {
    ...defaults,
    ...existingConfig,
    hero: existingConfig.hero ? { ...defaults.hero, ...existingConfig.hero } : defaults.hero,
    about: existingConfig.about ? { ...defaults.about, ...existingConfig.about } : defaults.about,
    products: existingConfig.products ? { ...defaults.products, ...existingConfig.products } : defaults.products,
    testimonials: existingConfig.testimonials ? { ...defaults.testimonials, ...existingConfig.testimonials } : defaults.testimonials,
    contact: existingConfig.contact ? { ...defaults.contact, ...existingConfig.contact } : defaults.contact,
    cta: existingConfig.cta ? { ...defaults.cta, ...existingConfig.cta } : defaults.cta,
  };
}

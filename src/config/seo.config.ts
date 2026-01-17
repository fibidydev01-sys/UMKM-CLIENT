// ==========================================
// SEO CONFIGURATION
// Subdomain-Ready Architecture
// ==========================================

// Environment
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Production domain
const PROD_DOMAIN = 'fibidy.com';
const PROD_URL = 'https://fibidy.com';

export const seoConfig = {
  // ==========================================
  // SITE INFO
  // ==========================================
  siteName: 'Fibidy',
  siteUrl: IS_PRODUCTION ? PROD_URL : APP_URL,

  // ==========================================
  // DOMAIN CONFIGURATION
  // ==========================================
  domain: IS_PRODUCTION ? PROD_DOMAIN : APP_DOMAIN,
  protocol: IS_PRODUCTION ? 'https' : 'http',
  isProduction: IS_PRODUCTION,

  /**
   * Get tenant URL based on environment
   * Production: https://{slug}.fibidy.com
   * Development: http://localhost:3000/store/{slug}
   */
  getTenantUrl: (slug: string, path: string = '') => {
    const cleanPath = path.startsWith('/') ? path : path ? `/${path}` : '';

    if (IS_PRODUCTION) {
      return `https://${slug}.${PROD_DOMAIN}${cleanPath}`;
    }
    return `${APP_URL}/store/${slug}${cleanPath}`;
  },

  /**
   * Get main platform URL
   */
  getMainUrl: (path: string = '') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${IS_PRODUCTION ? PROD_URL : APP_URL}${cleanPath}`;
  },

  // ==========================================
  // RESERVED SUBDOMAINS
  // ==========================================
  reservedSubdomains: [
    // System
    'www', 'api', 'cdn', 'app', 'admin', 'dashboard',
    'static', 'assets', 'images', 'files', 'uploads',
    // Auth
    'login', 'register', 'logout', 'auth', 'oauth',
    // Marketing
    'blog', 'help', 'support', 'docs', 'status',
    'pricing', 'about', 'contact', 'terms', 'privacy',
    // Reserved
    'store', 'shop', 'toko', 'fibidy', 'test', 'demo',
    'null', 'undefined', 'root', 'system', 'mail', 'email',
    'ftp', 'ssh', 'cpanel', 'webmail', 'ns1', 'ns2',
  ] as string[],

  // ==========================================
  // DEFAULT META
  // ==========================================
  defaultTitle: 'Fibidy - Platform Toko Online untuk UMKM Indonesia',
  titleTemplate: '%s | Fibidy',
  defaultDescription:
    'Buat toko online profesional dalam hitungan menit. Kelola produk, terima pesanan via WhatsApp, dan tingkatkan penjualan UMKM Anda. Gratis!',

  // ==========================================
  // KEYWORDS
  // ==========================================
  defaultKeywords: [
    'toko online',
    'umkm',
    'jualan online',
    'whatsapp order',
    'buat toko online gratis',
    'platform umkm',
    'toko online indonesia',
    'jualan whatsapp',
    'e-commerce umkm',
    'toko digital',
  ] as string[],

  // ==========================================
  // SOCIAL
  // ==========================================
  twitterHandle: '@fibidy_id',

  // ==========================================
  // IMAGES
  // ==========================================
  defaultOgImage: '/opengraph-image.png',
  logoUrl: '/logo.png',

  // ==========================================
  // LOCALE
  // ==========================================
  locale: 'id_ID',
  language: 'id',

  // ==========================================
  // THEME (Pink - #ec4899)
  // ==========================================
  themeColor: '#ec4899',
  backgroundColor: '#ffffff',

  // ==========================================
  // ORGANIZATION (JSON-LD)
  // ==========================================
  organization: {
    name: 'Fibidy',
    legalName: 'Fibidy Indonesia',
    url: PROD_URL,
    logo: `${PROD_URL}/logo.png`,
    foundingDate: '2024',
    address: {
      addressCountry: 'ID',
    },
    contactPoint: {
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs: [
      'https://instagram.com/fibidy_id',
      'https://twitter.com/fibidy_id',
      'https://tiktok.com/@fibidy_id',
    ],
  },
} as const;

// ==========================================
// TYPE EXPORTS
// ==========================================

export type SeoConfig = typeof seoConfig;
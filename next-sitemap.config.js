/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // ==========================================
  // BASIC CONFIGURATION
  // ==========================================
  siteUrl: 'https://www.fibidy.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  outDir: 'public',
  sitemapSize: 45000,
  changefreq: 'weekly',
  priority: 0.7,

  // ==========================================
  // EXCLUDE — semua yang bukan halaman publik
  // Public routes: / + (marketing) + (legal)
  // ==========================================
  exclude: [
    // Auth
    '/login',
    '/register',
    '/forgot-password',
    // Dashboard
    '/dashboard',
    '/dashboard/*',
    // Admin
    '/admin',
    '/admin/*',
    // Store (tenant pages - punya sitemap sendiri)
    '/store',
    '/store/*',
    // API
    '/api/*',
    // Internal
    '/_not-found',
    '/server-sitemap-index.xml',
    '/server-sitemap/*',
    '/opengraph-image',
    '/twitter-image',
  ],

  // ==========================================
  // ROBOTS.TXT
  // ==========================================
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/_next/',
          '/login',
          '/register',
          '/forgot-password',
          '/store/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/login',
          '/register',
          '/store/',
        ],
      },
      // Block scrapers
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'DataForSeoBot', disallow: '/' },
    ],
    additionalSitemaps: [
      'https://www.fibidy.com/server-sitemap-index.xml',
    ],
  },

  // ==========================================
  // TRANSFORM — priority per route
  // ==========================================
  transform: async (config, path) => {
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Tier 1 — Landing utama
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }

    // Tier 2 — Marketing pages (konversi tinggi)
    else if (path === '/about') {
      priority = 0.9;
      changefreq = 'weekly';
    }
    else if (path === '/features') {
      priority = 0.9;
      changefreq = 'weekly';
    }
    else if (path === '/pricing') {
      priority = 0.9;
      changefreq = 'weekly';
    }
    else if (path === '/how-it-works') {
      priority = 0.8;
      changefreq = 'weekly';
    }

    // Tier 3 — Supporting pages
    else if (path === '/profile') {
      priority = 0.7;
      changefreq = 'monthly';
    }
    else if (path === '/faq') {
      priority = 0.7;
      changefreq = 'weekly';
    }
    else if (path === '/contact') {
      priority = 0.6;
      changefreq = 'monthly';
    }

    // Tier 4 — Legal (penting tapi bukan konversi)
    else if (path === '/privacy' || path === '/terms') {
      priority = 0.4;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
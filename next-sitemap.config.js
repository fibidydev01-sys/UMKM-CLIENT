/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // ==========================================
  // BASIC CONFIGURATION
  // ==========================================
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://fibidy.com',

  // ==========================================
  // OUTPUT CONFIGURATION
  // ==========================================
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  // ==========================================
  // SITEMAP SPLITTING
  // Split ketika URLs > 45000 (buffer dari limit 50k)
  // ==========================================
  sitemapSize: 45000,

  // ==========================================
  // CHANGE FREQUENCY & PRIORITY DEFAULTS
  // ==========================================
  changefreq: 'daily',
  priority: 0.7,

  // ==========================================
  // EXCLUDE PATHS
  // Pages yang tidak perlu di-index
  // ==========================================
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/api',
    '/api/*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/404',
    '/500',
    '/server-sitemap-index.xml',
    '/server-sitemap/*',
  ],

  // ==========================================
  // ROBOTS.TXT CONFIGURATION
  // ==========================================
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/admin/',
          '/*.json$',
          '/private/',
          '/checkout/',
          '/cart/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      // Block SEO spam bots
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
      {
        userAgent: 'BLEXBot',
        disallow: '/',
      },
    ],

    // ==========================================
    // ADDITIONAL SITEMAPS
    // Dynamic sitemaps untuk tenant & products
    // ==========================================
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://fibidy.com'}/server-sitemap-index.xml`,
    ],
  },

  // ==========================================
  // TRANSFORM FUNCTION
  // Customize URL entries
  // ==========================================
  transform: async (config, path) => {
    // Custom priority untuk halaman tertentu
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Homepage
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Marketing pages
    else if (['/pricing', '/faq', '/about'].includes(path)) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    // Legal pages
    else if (['/terms', '/privacy'].includes(path)) {
      priority = 0.3;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
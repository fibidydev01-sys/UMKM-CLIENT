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
  changefreq: 'daily',
  priority: 0.7,

  // ==========================================
  // EXCLUDE — semua yang bukan halaman publik
  // Berdasarkan actual build output
  // ==========================================
  exclude: [
    '/login',
    '/register',
    '/forgot-password',
    '/dashboard',
    '/dashboard/*',
    '/api/*',
    '/_not-found',
    '/store/*',
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
          '/api/',
          '/_next/',
          '/login',
          '/register',
          '/forgot-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/login',
          '/register',
        ],
      },
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
  // TRANSFORM
  // ==========================================
  transform: async (config, path) => {
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/store') {
      priority = 0.9;
      changefreq = 'daily';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
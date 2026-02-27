// ==========================================
// SITE CONFIGURATION
// ==========================================

export const siteConfig = {
  name: 'Fibidy',
  description: 'Online store platform for Indonesian small businesses. Launch your store in minutes — no coding',
  tagline: 'Effortless online stores for small businesses',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://fibidy.com',
  ogImage: '/og-image.png',

  // Contact
  email: 'hello@fibidy.com',
  whatsapp: '6281234567890',

  // Social
  links: {
    instagram: 'https://instagram.com/fibidy.id',
    twitter: 'https://twitter.com/fibidy_id',
    facebook: 'https://facebook.com/fibidy.id',
  },

  // SEO
  keywords: [
    'online store',
    'small business',
    'sell online',
    'product catalog',
    'whatsapp order',
    'indonesia',
  ],

  // Creator
  creator: 'PKM Kewirausahaan Mahasiswa 2026',
}

export type SiteConfig = typeof siteConfig;
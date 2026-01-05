// ==========================================
// SITE CONFIGURATION
// ==========================================

export const siteConfig = {
  name: 'Fibidy',
  description: 'Platform toko online untuk UMKM Indonesia. Buat toko online dalam hitungan menit, tanpa coding, tanpa biaya bulanan.',
  tagline: 'Toko Online UMKM Lebih Mudah',
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
    'toko online',
    'umkm',
    'jualan online',
    'katalog produk',
    'whatsapp order',
    'indonesia',
  ],

  // Creator
  creator: 'PKM Kewirausahaan Mahasiswa 2026',
}

export type SiteConfig = typeof siteConfig;
// ══════════════════════════════════════════════════════════════
// DISCOVER PAGE - V9.0
// Dribbble-style UMKM Discovery
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { DiscoverPageClient } from './client';

// ══════════════════════════════════════════════════════════════
// METADATA
// ══════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Discover UMKM Lokal Indonesia | Fibidy',
  description:
    'Temukan berbagai UMKM lokal Indonesia. Warung makan, salon, laundry, bengkel, dan ribuan usaha lainnya. Semua punya toko online sendiri di Fibidy.',
  keywords: [
    'umkm indonesia',
    'discover umkm',
    'toko online lokal',
    'warung online',
    'jasa lokal',
    'fibidy',
  ],
  openGraph: {
    title: 'Discover UMKM Lokal Indonesia | Fibidy',
    description: 'Temukan berbagai UMKM lokal Indonesia dengan toko online sendiri.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

// ══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default function DiscoverPage() {
  return <DiscoverPageClient />;
}
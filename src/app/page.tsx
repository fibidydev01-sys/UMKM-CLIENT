// ══════════════════════════════════════════════════════════════
// HOME PAGE - V8.2
// UMKM Discover - Dribbble/Behance Style
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// ══════════════════════════════════════════════════════════════
// METADATA
// ══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Fibidy - Discover UMKM Indonesia | Toko Online Lokal',
  description:
    'Temukan berbagai UMKM lokal Indonesia. Warung makan, salon, laundry, bengkel, dan ribuan usaha lainnya. Semua punya toko online sendiri di Fibidy.',
  keywords: [
    'umkm indonesia',
    'toko online lokal',
    'discover umkm',
    'warung online',
    'jasa lokal',
    'fibidy',
  ],
  openGraph: {
    title: 'Fibidy - Discover UMKM Indonesia',
    description: 'Temukan berbagai UMKM lokal Indonesia dengan toko online sendiri.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

// ══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ══════════════════════════════════════════════════════════════
export default function HomePage() {
  redirect('/discover');
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE - V8.2
// UMKM Discover - Dribbble/Behance Style
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { LandingHeader, LandingFooter } from '@/components/platform-landing';
import { UMKMDiscoverSection } from '@/components/platform-landing/umkm-discover-section';

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
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <UMKMDiscoverSection />
      </main>
      <LandingFooter />
    </div>
  );
}
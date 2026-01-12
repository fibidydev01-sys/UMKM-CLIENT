// ══════════════════════════════════════════════════════════════
// HARGA PAGE - V8.1
// "Pilih yang Pas"
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Wallet } from 'lucide-react';
import { LandingHeader, LandingFooter } from '@/components/platform-landing';
import { Badge } from '@/components/ui/badge';

// Lazy load sections
const PricingSection = dynamic(() =>
  import('@/components/platform-landing/pricing-section').then((mod) => mod.PricingSection)
);

const FAQSection = dynamic(() =>
  import('@/components/platform-landing/faq-section').then((mod) => mod.FAQSection)
);

const CTASection = dynamic(() =>
  import('@/components/platform-landing/cta-section').then((mod) => mod.CTASection)
);

// Metadata
export const metadata: Metadata = {
  title: 'Harga Fibidy',
  description:
    'Mulai dari Rp 0. Untuk produk maupun jasa. Tanpa biaya tersembunyi, tanpa kontrak.',
  keywords: [
    'harga toko online',
    'paket fibidy',
    'toko online gratis',
    'harga umkm digital',
  ],
  openGraph: {
    title: 'Harga Fibidy',
    description: 'Mulai dari Rp 0. Tanpa biaya tersembunyi.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

// Page Component
export default function HargaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* Page Header */}
        <section className="py-20 pt-32 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium gap-2"
            >
              <Wallet className="h-4 w-4 text-primary" />
              <span>Harga</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-primary">Pilih</span> yang Pas
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Untuk produk maupun jasa. Harga sama. Gak ada biaya tersembunyi.
            </p>
          </div>
        </section>

        {/* Sections */}
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
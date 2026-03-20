// ══════════════════════════════════════════════════════════════
// HARGA PAGE — V13.1 Raycast Standard
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { Separator } from '@/components/ui/separator';

const PricingSection = dynamic(() =>
  import('@/components/marketing/pricing/pricing-section').then((mod) => mod.PricingSection)
);

const FAQSection = dynamic(() =>
  import('@/components/marketing/shared/faq-section').then((mod) => mod.FAQSection)
);

const CTASection = dynamic(() =>
  import('@/components/marketing/shared/cta-section').then((mod) => mod.CTASection)
);

export const metadata: Metadata = {
  title: 'Harga Fibidy',
  description: 'Mulai dari Rp 0. Untuk produk maupun jasa. Tanpa biaya tersembunyi, tanpa kontrak.',
  keywords: ['harga toko online', 'paket fibidy', 'toko online gratis', 'harga umkm digital'],
  openGraph: {
    title: 'Harga Fibidy',
    description: 'Mulai dari Rp 0. Tanpa biaya tersembunyi.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

export default function HargaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">

        {/* Page Header */}
        <section className="pt-36 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
                Harga
              </p>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                Pilihan yang
                <br />
                <span className="text-primary">pas buat kamu.</span>
              </h1>

              <div className="w-px h-10 bg-border/60 mb-8" />

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Untuk produk maupun jasa. Harga sama. Gak ada biaya tersembunyi.
              </p>

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        <PricingSection />
        <FAQSection />
        <CTASection />

      </main>
      <LandingFooter />
    </div>
  );
}
// ══════════════════════════════════════════════════════════════
// CARA KERJA PAGE — V13.1 Raycast Standard
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { Separator } from '@/components/ui/separator';

const HowItWorksSection = dynamic(() =>
  import('@/components/marketing/how-it-works/how-it-works-section').then((mod) => mod.HowItWorksSection)
);

const FAQSection = dynamic(() =>
  import('@/components/marketing/shared/faq-section').then((mod) => mod.FAQSection)
);

const CTASection = dynamic(() =>
  import('@/components/marketing/shared/cta-section').then((mod) => mod.CTASection)
);

export const metadata: Metadata = {
  title: 'Cara Kerja Fibidy',
  description:
    'Gampang banget. Daftar, isi produk/layanan, share. 5 menit udah punya situs online sendiri.',
  keywords: [
    'cara buat situs online',
    'cara kerja fibidy',
    'tutorial situs online umkm',
    'langkah jualan online',
  ],
  openGraph: {
    title: 'Cara Kerja Fibidy',
    description: 'Gampang banget. 5 menit udah punya situs online sendiri.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

export default function CaraKerjaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">

        {/* Page Header */}
        <section className="pt-36 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
                Cara Kerja
              </p>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                Gampang
                <br />
                <span className="text-primary">banget.</span>
              </h1>

              <div className="w-px h-10 bg-border/60 mb-8" />

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Dari daftar sampe punya situs. Ikutin aja.
              </p>

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        <HowItWorksSection />
        <FAQSection />
        <CTASection />

      </main>
      <LandingFooter />
    </div>
  );
}
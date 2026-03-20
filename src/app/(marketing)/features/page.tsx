// ══════════════════════════════════════════════════════════════
// FITUR PAGE — V13.1 Raycast Standard
// Header editorial, separator rhythm, CSS vars only
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { Separator } from '@/components/ui/separator';

const FeaturesSection = dynamic(() =>
  import('@/components/marketing/features/features-section').then((mod) => mod.FeaturesSection)
);

const CategoriesSection = dynamic(() =>
  import('@/components/marketing/features/categories-section').then((mod) => mod.CategoriesSection)
);

const CTASection = dynamic(() =>
  import('@/components/marketing/shared/cta-section').then((mod) => mod.CTASection)
);

export const metadata: Metadata = {
  title: 'Fitur Fibidy — Situs Online untuk Produk & Jasa',
  description:
    'Semua fitur untuk situsmu sendiri. Alamat sendiri, tampil di Google, checkout langsung, nol iklan, nol komisi. 41 kategori bisnis.',
  keywords: [
    'fitur toko online',
    'fitur fibidy',
    'situs online umkm',
    'kategori bisnis umkm',
  ],
  openGraph: {
    title: 'Fitur Fibidy — Situs Online untuk Produk & Jasa',
    description: 'Semua fitur untuk situsmu sendiri. Lengkap.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

export default function FiturPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">

        {/* Page Header */}
        <section className="pt-36 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              {/* Label */}
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
                Fitur
              </p>

              {/* Headline */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                Semua yang
                <br />
                <span className="text-primary">kamu butuhin.</span>
              </h1>

              {/* Vertical separator */}
              <div className="w-px h-10 bg-border/60 mb-8" />

              {/* Subtext */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Untuk produk maupun jasa. Lengkap.
              </p>

            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-border/60" />
          </div>
        </div>

        <FeaturesSection />
        <CategoriesSection />
        <CTASection />

      </main>
      <LandingFooter />
    </div>
  );
}
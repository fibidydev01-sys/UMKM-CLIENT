// ══════════════════════════════════════════════════════════════
// ABOUT PAGE - V12.0
// Fix metadata: "toko" → "situs"
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import {
  LandingHeader,
  LandingFooter,
  HeroSection,
  LogosSection,
} from '@/components/marketing';
import { BentoShowcaseSection } from '@/components/marketing/about/bento-showcase-section';

// ══════════════════════════════════════════════════════════════
// 🟠 BELOW THE FOLD - LAZY LOAD
// ══════════════════════════════════════════════════════════════
const TargetUserSection = dynamic(() =>
  import('@/components/marketing/about/target-user-section').then((mod) => mod.TargetUserSection)
);

const ProblemSection = dynamic(() =>
  import('@/components/marketing/about/problem-section').then((mod) => mod.ProblemSection)
);

const SolutionSection = dynamic(() =>
  import('@/components/marketing/about/solution-section').then((mod) => mod.SolutionSection)
);

const HonestSection = dynamic(() =>
  import('@/components/marketing/about/honest-section').then((mod) => mod.HonestSection)
);

const FAQSection = dynamic(() =>
  import('@/components/marketing/shared/faq-section').then((mod) => mod.FAQSection)
);

const CTASection = dynamic(() =>
  import('@/components/marketing/shared/cta-section').then((mod) => mod.CTASection)
);

// 🔴 HEAVIEST - Client-only
import { LazyTestimonialsSection } from '@/components/marketing/about/lazy-testimonials';

export const metadata: Metadata = {
  title: 'Tentang Fibidy — Situs Online untuk Produk & Jasa',
  description:
    'Pelajari lebih lanjut tentang Fibidy. Platform situs online untuk UMKM Indonesia. Jualan produk atau nawarin jasa semua bisa.',
  keywords: [
    'tentang fibidy',
    'apa itu fibidy',
    'situs online umkm',
    'platform jualan online',
  ],
  openGraph: {
    title: 'Tentang Fibidy — Situs Online untuk Produk & Jasa',
    description: 'Pelajari lebih lanjut tentang Fibidy. Rumah digital untuk usahamu.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">

        {/* §1.1 - Hero */}
        <HeroSection />

        {/* §1.2 - Value strip */}
        <LogosSection />

        {/* §1.2b - Bento showcase */}
        <BentoShowcaseSection />

        {/* §1.3 - Buat Siapa? */}
        <TargetUserSection />

        {/* §1.4 - Problem */}
        <ProblemSection />

        {/* §1.5 - Solusi */}
        <SolutionSection />

        {/* §1.6 - Jujur Aja Ya */}
        <HonestSection />

        {/* §1.7 - Testimoni */}
        <LazyTestimonialsSection />

        {/* §1.8 - FAQ */}
        <FAQSection />

        {/* §1.9 - CTA */}
        <CTASection />

      </main>
      <LandingFooter />
    </div>
  );
}
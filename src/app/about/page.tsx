// ══════════════════════════════════════════════════════════════
// ABOUT PAGE - V8.1
// Full landing page dengan semua sections
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import {
  LandingHeader,
  LandingFooter,
  HeroSection,
  LogosSection,
} from '@/components/platform-landing';

// ══════════════════════════════════════════════════════════════
// 🟠 BELOW THE FOLD - LAZY LOAD
// ══════════════════════════════════════════════════════════════
const TargetUserSection = dynamic(() =>
  import('@/components/platform-landing/target-user-section').then((mod) => mod.TargetUserSection)
);

const ProblemSection = dynamic(() =>
  import('@/components/platform-landing/problem-section').then((mod) => mod.ProblemSection)
);

const SolutionSection = dynamic(() =>
  import('@/components/platform-landing/solution-section').then((mod) => mod.SolutionSection)
);

const FibidyAISection = dynamic(() =>
  import('@/components/platform-landing/fibidy-ai-section').then((mod) => mod.FibidyAISection)
);

const CategoriesSection = dynamic(() =>
  import('@/components/platform-landing/categories-section').then((mod) => mod.CategoriesSection)
);

const HonestSection = dynamic(() =>
  import('@/components/platform-landing/honest-section').then((mod) => mod.HonestSection)
);

const FeaturesSection = dynamic(() =>
  import('@/components/platform-landing/features-section').then((mod) => mod.FeaturesSection)
);

const HowItWorksSection = dynamic(() =>
  import('@/components/platform-landing/how-it-works-section').then((mod) => mod.HowItWorksSection)
);

const PricingSection = dynamic(() =>
  import('@/components/platform-landing/pricing-section').then((mod) => mod.PricingSection)
);

const FAQSection = dynamic(() =>
  import('@/components/platform-landing/faq-section').then((mod) => mod.FAQSection)
);

const CTASection = dynamic(() =>
  import('@/components/platform-landing/cta-section').then((mod) => mod.CTASection)
);

// 🔴 HEAVIEST - Client-only (DottedMap + Marquee)
import { LazyTestimonialsSection } from '@/components/platform-landing/lazy-testimonials';

// ══════════════════════════════════════════════════════════════
// METADATA
// ══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Tentang Fibidy - Toko Online untuk Produk & Jasa',
  description:
    'Pelajari lebih lanjut tentang Fibidy. Platform toko online untuk UMKM Indonesia. Jualan produk atau nawarin jasa semua bisa.',
  keywords: [
    'tentang fibidy',
    'apa itu fibidy',
    'toko online umkm',
    'platform jualan online',
  ],
  openGraph: {
    title: 'Tentang Fibidy - Toko Online untuk Produk & Jasa',
    description: 'Pelajari lebih lanjut tentang Fibidy. Lebih gampang dicari.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

// ══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* ════════════════════════════════════════════════════ */}
        {/* 🔴 INSTANT - Above the Fold                         */}
        {/* ════════════════════════════════════════════════════ */}
        <HeroSection />
        <LogosSection />

        {/* ════════════════════════════════════════════════════ */}
        {/* 🟠 LAZY - Below the Fold (V8.1 Order)               */}
        {/* ════════════════════════════════════════════════════ */}

        {/* §1.3 - Buat Siapa? */}
        <TargetUserSection />

        {/* §1.4 - Pernah ngalamin ini? */}
        <ProblemSection />

        {/* §1.5 - Solusi */}
        <SolutionSection />

        {/* §1.6 - Fibidy AI */}
        <FibidyAISection />

        {/* §1.7 - 15+ Kategori */}
        <CategoriesSection />

        {/* §1.8 - Jujur Aja Ya */}
        <HonestSection />

        {/* Features */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* §1.9 - Testimoni (Heavy - Client Only) */}
        <LazyTestimonialsSection />

        {/* Pricing */}
        <PricingSection />

        {/* FAQ */}
        <FAQSection />

        {/* §1.10 - CTA */}
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
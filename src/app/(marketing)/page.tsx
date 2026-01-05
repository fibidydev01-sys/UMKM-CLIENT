import type { Metadata } from 'next';
import {
  HeroSection,
  LogosSection,
  ProblemSection,
  SolutionSection,
  HowItWorksSection,
  TestimonialHighlightSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  BlogSection,
  CTASection,
} from '@/components/platform-landing';

export const metadata: Metadata = {
  title: 'Fibidy - Platform Toko Online Gratis untuk UMKM Indonesia',
  description:
    'Buat toko online profesional dalam hitungan menit. Kelola produk, terima pesanan via WhatsApp, dan tingkatkan penjualan Anda dengan mudah. Gratis selamanya!',
  keywords: [
    'toko online gratis',
    'platform UMKM',
    'jualan online',
    'toko online Indonesia',
    'buat toko online',
    'WhatsApp order',
    'katalog online',
    'UMKM digital',
    'fibidy',
  ],
  openGraph: {
    title: 'Fibidy - Platform Toko Online Gratis untuk UMKM Indonesia',
    description: 'Buat toko online profesional dalam hitungan menit. Gratis selamanya!',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fibidy - Platform Toko Online Gratis untuk UMKM',
    description: 'Buat toko online profesional dalam hitungan menit. Gratis selamanya!',
  },
};

export default function MarketingPage() {
  return (
    <>
      {/* 1. Hero - Main CTA with DotPattern */}
      <HeroSection />

      {/* 2. Logos - Social proof & stats */}
      <LogosSection />

      {/* 3. Problem - Pain points */}
      <ProblemSection />

      {/* 4. Solution - Fibidy as answer */}
      <SolutionSection />

      {/* 5. How It Works - 3 steps */}
      <HowItWorksSection />

      {/* 6. Testimonial Highlight - Featured story */}
      <TestimonialHighlightSection />

      {/* 7. Features - BentoGrid 9 features */}
      <FeaturesSection />

      {/* 8. Testimonials - 6 UMKM with DottedMap */}
      <TestimonialsSection />

      {/* 9. Pricing - FREE + Premium Coming Soon */}
      <PricingSection />

      {/* 10. FAQ - 8 questions */}
      <FAQSection />

      {/* 11. Blog - 3 articles */}
      <BlogSection />

      {/* 12. CTA - Final conversion with DotPattern */}
      <CTASection />
    </>
  );
}
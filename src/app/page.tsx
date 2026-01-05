import type { Metadata } from 'next';
import {
  LandingHeader,
  LandingFooter,
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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <LogosSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <TestimonialHighlightSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <BlogSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
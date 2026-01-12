// ══════════════════════════════════════════════════════════════
// CARA KERJA PAGE - V8.1
// "Gampang Banget"
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Rocket } from 'lucide-react';
import { LandingHeader, LandingFooter } from '@/components/platform-landing';
import { Badge } from '@/components/ui/badge';

// Lazy load sections
const HowItWorksSection = dynamic(() =>
  import('@/components/platform-landing/how-it-works-section').then((mod) => mod.HowItWorksSection)
);

const FAQSection = dynamic(() =>
  import('@/components/platform-landing/faq-section').then((mod) => mod.FAQSection)
);

const CTASection = dynamic(() =>
  import('@/components/platform-landing/cta-section').then((mod) => mod.CTASection)
);

// Metadata
export const metadata: Metadata = {
  title: 'Cara Kerja Fibidy',
  description:
    'Gampang banget. Daftar, isi produk/layanan, share. 5 menit udah punya toko online sendiri.',
  keywords: [
    'cara buat toko online',
    'cara kerja fibidy',
    'tutorial toko online',
    'langkah jualan online',
  ],
  openGraph: {
    title: 'Cara Kerja Fibidy',
    description: 'Gampang banget. 5 menit udah punya toko online sendiri.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

// Page Component
export default function CaraKerjaPage() {
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
              <Rocket className="h-4 w-4 text-primary" />
              <span>Cara Kerja</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-primary">Gampang</span> Banget
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dari daftar sampe punya toko. Ikutin aja.
            </p>
          </div>
        </section>

        {/* Sections */}
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
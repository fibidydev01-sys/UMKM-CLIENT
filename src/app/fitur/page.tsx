// ══════════════════════════════════════════════════════════════
// FITUR PAGE - V8.1
// "Semua yang Kamu Butuhin"
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Wrench } from 'lucide-react';
import { LandingHeader, LandingFooter } from '@/components/platform-landing';
import { Badge } from '@/components/ui/badge';

// Lazy load sections
const FeaturesSection = dynamic(() =>
  import('@/components/platform-landing/features-section').then((mod) => mod.FeaturesSection)
);

const FibidyAISection = dynamic(() =>
  import('@/components/platform-landing/fibidy-ai-section').then((mod) => mod.FibidyAISection)
);

const CategoriesSection = dynamic(() =>
  import('@/components/platform-landing/categories-section').then((mod) => mod.CategoriesSection)
);

const CTASection = dynamic(() =>
  import('@/components/platform-landing/cta-section').then((mod) => mod.CTASection)
);

// Metadata
export const metadata: Metadata = {
  title: 'Fitur Fibidy',
  description:
    'Semua fitur untuk produk & jasa. Alamat sendiri, Fibidy AI bantuin nulis, checkout WhatsApp, 15+ kategori bisnis. Lengkap.',
  keywords: [
    'fitur toko online',
    'fitur fibidy',
    'fibidy ai',
    'checkout whatsapp',
    'kategori bisnis umkm',
  ],
  openGraph: {
    title: 'Fitur Fibidy',
    description: 'Semua fitur untuk produk & jasa. Lengkap.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

// Page Component
export default function FiturPage() {
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
              <Wrench className="h-4 w-4 text-primary" />
              <span>Fitur</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Semua yang <span className="text-primary">Kamu Butuhin</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Untuk produk maupun jasa. Lengkap.
            </p>
          </div>
        </section>

        {/* Sections */}
        <FeaturesSection />
        <FibidyAISection />
        <CategoriesSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
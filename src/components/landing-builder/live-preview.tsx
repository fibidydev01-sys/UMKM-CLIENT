'use client';

// ==========================================
// LIVE PREVIEW COMPONENT
// ==========================================
// mode="isolated" → Renders ONLY activeSection (editing mode)
// mode="full"     → Renders ALL sections (full preview drawer)
//
// Pure responsive - no device frame, adapts to viewport naturally
// ==========================================

import { TemplateProvider } from '@/lib/landing';
import { EyeOff } from 'lucide-react';
import {
  TenantHero,
  TenantAbout,
  TenantProducts,
  TenantTestimonials,
  TenantContact,
  TenantCta,
} from '@/components/landing';
import type { TenantLandingConfig, Product, Tenant, SectionKey } from '@/types';

// ==========================================
// TYPES
// ==========================================

type PreviewMode = 'isolated' | 'full';

interface LivePreviewProps {
  config: TenantLandingConfig;
  tenant: Tenant;
  products: Product[];
  isLoading?: boolean;
  activeSection?: SectionKey | null;
  device?: 'desktop'; // Keep for compatibility but unused
  mode?: PreviewMode;
  drawerOpen?: boolean;
  onToggleDrawer?: () => void;
}

// ==========================================
// SECTION LABELS (for disabled state)
// ==========================================

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: 'Hero',
  about: 'About',
  products: 'Products',
  testimonials: 'Testimonials',
  cta: 'CTA',
  contact: 'Contact',
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export function LivePreview({
  config,
  tenant,
  products,
  activeSection,
  mode = 'isolated',
}: LivePreviewProps) {


  // Section order
  const defaultOrder: SectionKey[] = [
    'hero', 'about', 'products', 'testimonials', 'cta', 'contact',
  ];
  const sectionOrder = config?.sectionOrder || defaultOrder;

  // Section enabled checks
  const heroEnabled = config?.hero?.enabled === true;
  const aboutEnabled = config?.about?.enabled === true;
  const productsEnabled = config?.products?.enabled === true && products.length > 0;
  const testimonialsEnabled = config?.testimonials?.enabled === true;
  const ctaEnabled = config?.cta?.enabled === true;
  const contactEnabled = config?.contact?.enabled === true;

  const enabledMap: Record<SectionKey, boolean> = {
    hero: heroEnabled,
    about: aboutEnabled,
    products: productsEnabled,
    testimonials: testimonialsEnabled,
    cta: ctaEnabled,
    contact: contactEnabled,
  };

  const hasAnySectionEnabled =
    heroEnabled || aboutEnabled || productsEnabled || testimonialsEnabled || ctaEnabled || contactEnabled;

  // Section component map
  const sectionComponents: Record<SectionKey, React.ReactNode> = {
    hero: heroEnabled ? (
      <div key="hero">
        <TenantHero config={config.hero} tenant={tenant} />
      </div>
    ) : null,
    about: aboutEnabled ? (
      <div key="about">
        <TenantAbout config={config.about} tenant={tenant} />
      </div>
    ) : null,
    products: productsEnabled ? (
      <div key="products">
        <TenantProducts
          products={products}
          config={config.products}
          storeSlug={tenant.slug}
        />
      </div>
    ) : null,
    testimonials: testimonialsEnabled ? (
      <div key="testimonials">
        <TenantTestimonials config={config.testimonials} tenant={tenant} />
      </div>
    ) : null,
    cta: ctaEnabled ? (
      <div key="cta">
        <TenantCta config={config.cta} tenant={tenant} />
      </div>
    ) : null,
    contact: contactEnabled ? (
      <div key="contact">
        <TenantContact config={config.contact} tenant={tenant} />
      </div>
    ) : null,
  };

  // ==========================================
  // ISOLATED MODE — single section, pure responsive
  // ==========================================

  if (mode === 'isolated') {
    const currentSection = activeSection || 'hero';
    const isSectionEnabled = enabledMap[currentSection];
    const sectionNode = sectionComponents[currentSection];

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <TemplateProvider initialTemplateId={config.template || 'suspended-minimalist'}>
            <div className="w-full min-h-full">
              {isSectionEnabled && sectionNode ? (
                <div className="w-full">
                  {sectionNode}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <EyeOff className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Section &quot;{SECTION_LABELS[currentSection]}&quot; belum aktif
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Aktifkan di sidebar untuk melihat preview
                  </p>
                </div>
              )}
            </div>
          </TemplateProvider>
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL MODE — all sections, responsive with container
  // ==========================================

  return (
    <TemplateProvider initialTemplateId={config.template || 'suspended-minimalist'}>
      <div className="w-full">
        {sectionOrder.map((sectionKey) => sectionComponents[sectionKey]).filter(Boolean)}

        {!hasAnySectionEnabled && (
          <div className="container mx-auto px-4">
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-2">
                Landing page belum dikonfigurasi
              </p>
              <p className="text-sm text-muted-foreground">
                Aktifkan section di panel konfigurasi
              </p>
            </div>
          </div>
        )}
      </div>
    </TemplateProvider>
  );
}
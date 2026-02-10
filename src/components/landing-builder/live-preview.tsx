'use client';

// ==========================================
// LIVE PREVIEW COMPONENT
// ==========================================
// mode="isolated" → Renders ONLY activeSection (editing mode)
// mode="full"     → Renders ALL sections (full preview drawer)
//
// BOTH modes respect the `device` prop:
// - desktop → full width
// - mobile  → 375px centered frame
// - tablet  → 768px centered frame
// ==========================================

import { useRef } from 'react';
import { TemplateProvider } from '@/lib/landing';
import { EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
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

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type PreviewMode = 'isolated' | 'full';

interface LivePreviewProps {
  config: TenantLandingConfig;
  tenant: Tenant;
  products: Product[];
  isLoading?: boolean;
  activeSection?: SectionKey | null;
  device?: DeviceType;
  mode?: PreviewMode;
  drawerOpen?: boolean;
  onToggleDrawer?: () => void;
}

// ==========================================
// DEVICE DIMENSIONS
// ==========================================

const DEVICE_DIMENSIONS: Record<DeviceType, { width: string; height: string }> = {
  mobile: { width: '375px', height: '667px' },
  tablet: { width: '768px', height: '1024px' },
  desktop: { width: '100%', height: '100%' },
};

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
  isLoading = false,
  activeSection,
  device = 'desktop',
  mode = 'isolated',
  drawerOpen = false,
  onToggleDrawer,
}: LivePreviewProps) {

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  // ISOLATED MODE — single section only
  // ==========================================

  if (mode === 'isolated') {
    const currentSection = activeSection || 'hero';
    const isSectionEnabled = enabledMap[currentSection];
    const sectionNode = sectionComponents[currentSection];

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden bg-muted/10 p-4 flex items-center justify-center">
          {/* Device Frame */}
          <div
            className="bg-background border rounded-lg shadow-lg transition-all duration-300 flex flex-col"
            style={{
              width: DEVICE_DIMENSIONS[device].width,
              height: DEVICE_DIMENSIONS[device].height,
              maxHeight: 'calc(100vh - 8rem)',
            }}
          >
            {/* Device Label (mobile/tablet only) */}
            {device !== 'desktop' && (
              <div className="px-3 py-2 border-b bg-muted/30 text-xs text-muted-foreground text-center shrink-0">
                {device === 'mobile' && '📱 Mobile'}
                {device === 'tablet' && '📱 Tablet'}
                &nbsp;({DEVICE_DIMENSIONS[device].width} × {DEVICE_DIMENSIONS[device].height})
              </div>
            )}

            {/* Scrollable Content */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden">
              <TemplateProvider initialTemplateId={config.template || 'suspended-minimalist'}>
                <div className="container px-4 py-8 space-y-8">
                  {isSectionEnabled && sectionNode ? (
                    <div className="min-h-[200px]">
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
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL MODE — all sections, with device frame
  // ==========================================

  const isDeviceFrame = device !== 'desktop';

  const sectionsContent = (
    <TemplateProvider initialTemplateId={config.template || 'suspended-minimalist'}>
      <div className="container px-4 py-8 space-y-8">
        {sectionOrder.map((sectionKey) => sectionComponents[sectionKey]).filter(Boolean)}

        {!hasAnySectionEnabled && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-2">
              Landing page belum dikonfigurasi
            </p>
            <p className="text-sm text-muted-foreground">
              Aktifkan section di panel konfigurasi
            </p>
          </div>
        )}
      </div>
    </TemplateProvider>
  );

  // Desktop → full width, no frame
  if (!isDeviceFrame) {
    return sectionsContent;
  }

  // Mobile / Tablet → centered device frame
  return (
    <div className="flex justify-center py-6 px-4 min-h-full bg-muted/10">
      <div
        className={cn(
          'bg-background border rounded-lg shadow-lg overflow-hidden transition-all duration-300',
          'flex flex-col',
        )}
        style={{
          width: DEVICE_DIMENSIONS[device].width,
          maxWidth: '100%',
        }}
      >
        {/* Device Label */}
        <div className="px-3 py-2 border-b bg-muted/30 text-xs text-muted-foreground text-center shrink-0">
          {device === 'mobile' && '📱 Mobile'}
          {device === 'tablet' && '📱 Tablet'}
          &nbsp;({DEVICE_DIMENSIONS[device].width})
        </div>

        {/* Content (no fixed height — scrolls with parent drawer) */}
        <div className="overflow-hidden">
          {sectionsContent}
        </div>
      </div>
    </div>
  );
}
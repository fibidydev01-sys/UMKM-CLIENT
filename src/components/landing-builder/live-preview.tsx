'use client';

// ==========================================
// LIVE PREVIEW COMPONENT
// Real-time preview of landing page
// ==========================================

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Tablet, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { TemplateProvider } from '@/lib/landing';
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

interface LivePreviewProps {
  config: TenantLandingConfig;
  tenant: Tenant;
  products: Product[];
  isLoading?: boolean;
  activeSection?: SectionKey | null; // 🚀 Active section for auto-scroll
  drawerOpen?: boolean; // 🚀 Drawer state for Buka button
  onToggleDrawer?: () => void; // 🚀 Toggle drawer handler
}

// ==========================================
// DEVICE WIDTHS
// ==========================================

const DEVICE_WIDTHS: Record<DeviceType, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

const DEVICE_ICONS: Record<DeviceType, React.ReactNode> = {
  mobile: <Smartphone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  desktop: <Monitor className="h-4 w-4" />,
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
  drawerOpen = false,
  onToggleDrawer,
}: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');

  // 🚀 Section refs for auto-scroll
  const sectionRefs = useRef<Record<SectionKey, HTMLDivElement | null>>({
    hero: null,
    about: null,
    products: null,
    testimonials: null,
    cta: null,
    contact: null,
  });

  // 🚀 Section order - use config.sectionOrder or default order
  const defaultOrder: SectionKey[] = [
    'hero',
    'about',
    'products',
    'testimonials',
    'cta',
    'contact',
  ];
  const sectionOrder = config?.sectionOrder || defaultOrder;

  // 🚀 Auto-scroll to active section
  useEffect(() => {
    if (!activeSection) return;

    const sectionElement = sectionRefs.current[activeSection];
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSection]);

  // Section enabled checks
  const heroEnabled = config?.hero?.enabled === true;
  const aboutEnabled = config?.about?.enabled === true;
  const productsEnabled = config?.products?.enabled === true && products.length > 0;
  const testimonialsEnabled = config?.testimonials?.enabled === true;
  const ctaEnabled = config?.cta?.enabled === true;
  const contactEnabled = config?.contact?.enabled === true;

  const hasAnySectionEnabled =
    heroEnabled || aboutEnabled || productsEnabled || testimonialsEnabled || ctaEnabled || contactEnabled;

  // 🚀 Section rendering map with refs for auto-scroll
  const sectionComponents: Record<SectionKey, React.ReactNode> = {
    hero: heroEnabled ? (
      <div key="hero" ref={(el) => (sectionRefs.current.hero = el)}>
        <TenantHero config={config.hero} tenant={tenant} />
      </div>
    ) : null,
    about: aboutEnabled ? (
      <div key="about" ref={(el) => (sectionRefs.current.about = el)}>
        <TenantAbout config={config.about} tenant={tenant} />
      </div>
    ) : null,
    products: productsEnabled ? (
      <div key="products" ref={(el) => (sectionRefs.current.products = el)}>
        <TenantProducts
          products={products}
          config={config.products}
          storeSlug={tenant.slug}
        />
      </div>
    ) : null,
    testimonials: testimonialsEnabled ? (
      <div key="testimonials" ref={(el) => (sectionRefs.current.testimonials = el)}>
        <TenantTestimonials config={config.testimonials} tenant={tenant} />
      </div>
    ) : null,
    cta: ctaEnabled ? (
      <div key="cta" ref={(el) => (sectionRefs.current.cta = el)}>
        <TenantCta config={config.cta} tenant={tenant} />
      </div>
    ) : null,
    contact: contactEnabled ? (
      <div key="contact" ref={(el) => (sectionRefs.current.contact = el)}>
        <TenantContact config={config.contact} tenant={tenant} />
      </div>
    ) : null,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Live Preview</h3>
          {/* 🚀 Active Section Name */}
          {activeSection && (
            <>
              <div className="h-5 w-px bg-border" />
              <h3 className="font-semibold capitalize">
                {activeSection === 'cta' ? 'CTA' : activeSection}
              </h3>
              {/* 🚀 Buka/Tutup Drawer Button */}
              {onToggleDrawer && (
                <>
                  <div className="h-5 w-px bg-border" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleDrawer}
                    className="h-7 px-3"
                  >
                    {drawerOpen ? 'Tutup' : 'Buka'}
                  </Button>
                </>
              )}
            </>
          )}
          {isLoading && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating...
            </Badge>
          )}
        </div>

        {/* Device Toggle */}
        <div className="flex items-center gap-2">
          {(['mobile', 'tablet', 'desktop'] as DeviceType[]).map((deviceType) => (
            <Button
              key={deviceType}
              variant={device === deviceType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice(deviceType)}
              className="gap-2"
            >
              {DEVICE_ICONS[deviceType]}
              <span className="capitalize hidden sm:inline">{deviceType}</span>
            </Button>
          ))}

          <div className="h-6 w-px bg-border mx-2" />

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={`/store/${tenant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-muted/10 p-4">
        <div
          className="mx-auto bg-background border rounded-lg shadow-sm transition-all duration-300"
          style={{
            width: DEVICE_WIDTHS[device],
            minHeight: '600px',
          }}
        >
          {/* Render landing page sections */}
          <TemplateProvider initialTemplateId={config.template || 'suspended-minimalist'}>
            <div className="container px-4 py-8 space-y-8">
              {/* 🚀 Render sections in custom order */}
              {sectionOrder.map((sectionKey) => sectionComponents[sectionKey]).filter(Boolean)}

              {/* Empty State */}
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
        </div>

        {/* Device Width Indicator */}
        {device !== 'desktop' && (
          <div className="text-center mt-2 text-xs text-muted-foreground">
            Preview width: {DEVICE_WIDTHS[device]}
          </div>
        )}
      </div>
    </div>
  );
}

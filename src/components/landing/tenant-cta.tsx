'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getCtaConfig, extractCtaLink, extractCtaButtonText } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import type { TenantLandingConfig } from '@/types';

// ==========================================
// TENANT CTA COMPONENT - Decoupled
// ==========================================

interface TenantCtaProps {
  config?: TenantLandingConfig['cta'];
  storeSlug?: string;
  fallbacks?: {
    title?: string;
    subtitle?: string;
    buttonLink?: string;
  };
}

export function TenantCta({ config, storeSlug, fallbacks = {} }: TenantCtaProps) {
  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.CTA,
    subtitle: fallbacks.subtitle,
  });

  const ctaConfig = getCtaConfig(config);
  const buttonText = extractCtaButtonText(ctaConfig, LANDING_CONSTANTS.CTA_BUTTON_DEFAULT);
  const style = ctaConfig?.style || 'primary';

  // Smart URL routing
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;
  const defaultLink = urls?.products() || fallbacks.buttonLink || '/products';
  const buttonLink = extractCtaLink(ctaConfig, defaultLink);

  const buttonVariant =
    style === 'outline' ? 'outline' : style === 'secondary' ? 'secondary' : 'default';

  return (
    <section className="py-16 my-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-2 mb-6">{subtitle}</p>
        )}
        <Link href={buttonLink}>
          <Button size="lg" variant={buttonVariant} className="gap-2 mt-4">
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
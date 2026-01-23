'use client';

import { lazy, Suspense } from 'react';
import { extractCtaData, useCtaBlock } from '@/lib/landing';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantCtaProps {
  config?: TenantLandingConfig['cta'];
  tenant: Tenant | PublicTenant;
}

/**
 * 🚀 SMART DYNAMIC LOADING - AUTO-DISCOVERY ENABLED!
 *
 * NO MANUAL IMPORTS! Just add cta201.tsx and it works!
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.ctaTitle
 * - subtitle → tenant.ctaSubtitle
 * - buttonText → tenant.ctaButtonText
 * - buttonLink → tenant.ctaButtonLink
 * - buttonStyle → tenant.ctaButtonStyle
 *
 * 🚀 SUPPORTS ALL BLOCKS: cta1, cta2, cta3, ..., cta200, cta9999!
 */
export function TenantCta({ config, tenant }: TenantCtaProps) {
  const templateBlock = useCtaBlock();
  const block = config?.block || templateBlock;

  // Extract CTA data directly from tenant (Data Contract fields)
  const ctaData = extractCtaData(tenant, config ? { cta: config } : undefined);

  const buttonVariant: 'default' | 'secondary' | 'outline' =
    ctaData.buttonStyle === 'outline' ? 'outline' :
    ctaData.buttonStyle === 'secondary' ? 'secondary' : 'default';

  const commonProps = {
    title: ctaData.title,
    subtitle: ctaData.subtitle,
    buttonText: ctaData.buttonText,
    buttonLink: ctaData.buttonLink,
    buttonVariant,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('cta', '');
  const CtaComponent = lazy(() =>
    import(`./blocks/cta/cta${blockNumber}`)
      .then((mod) => ({ default: mod[`Cta${blockNumber}`] }))
      .catch(() => import('./blocks/cta/cta1').then((mod) => ({ default: mod.Cta1 })))
  );

  // Render with Suspense for lazy loading
  return (
    <Suspense fallback={<CtaSkeleton />}>
      <CtaComponent {...commonProps} />
    </Suspense>
  );
}

function CtaSkeleton() {
  return (
    <div className="min-h-[200px] w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

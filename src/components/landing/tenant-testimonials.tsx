'use client';

import { lazy, Suspense } from 'react';
import { extractTestimonialsData, normalizeTestimonials, useTestimonialsBlock } from '@/lib/landing';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantTestimonialsProps {
  config?: TenantLandingConfig['testimonials'];
  tenant: Tenant | PublicTenant;
}

/**
 * 🚀 SMART DYNAMIC LOADING - AUTO-DISCOVERY ENABLED!
 *
 * NO MANUAL IMPORTS! Just add testimonials201.tsx and it works!
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.testimonialsTitle
 * - subtitle → tenant.testimonialsSubtitle
 * - items → tenant.testimonials
 *
 * 🚀 SUPPORTS ALL BLOCKS: testimonials1, testimonials2, ..., testimonials200!
 */
export function TenantTestimonials({ config, tenant }: TenantTestimonialsProps) {
  const templateBlock = useTestimonialsBlock();
  const block = config?.block || templateBlock;

  // Extract testimonials data directly from tenant (Data Contract fields)
  const testimonialsData = extractTestimonialsData(tenant, config ? { testimonials: config } : undefined);
  const items = normalizeTestimonials(testimonialsData.items);

  if (items.length === 0) return null;

  const commonProps = {
    items,
    title: testimonialsData.title,
    subtitle: testimonialsData.subtitle,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('testimonials', '');
  const TestimonialsComponent = lazy(() =>
    import(`./blocks/testimonials/testimonials${blockNumber}`)
      .then((mod) => ({ default: mod[`Testimonials${blockNumber}`] }))
      .catch(() => import('./blocks/testimonials/testimonials1').then((mod) => ({ default: mod.Testimonials1 })))
  );

  // Render with Suspense for lazy loading
  return (
    <Suspense fallback={<TestimonialsSkeleton />}>
      <TestimonialsComponent {...commonProps} />
    </Suspense>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

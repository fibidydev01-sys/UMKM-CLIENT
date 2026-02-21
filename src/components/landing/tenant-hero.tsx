'use client';

import { lazy, Suspense, ComponentType } from 'react';
import { extractHeroData, useHeroBlock } from '@/lib/landing';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantHeroProps {
  config?: TenantLandingConfig['hero'];
  tenant: Tenant | PublicTenant;
}

interface HeroComponentProps {
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
  eyebrow?: string;
}

/**
 * 🚀 SMART DYNAMIC LOADING - AUTO-DISCOVERY ENABLED!
 *
 * NO MANUAL IMPORTS! Just add hero201.tsx and it works!
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title       → tenant.heroTitle (fallback: tenant.name)
 * - subtitle    → tenant.heroSubtitle (fallback: tenant.description)
 * - description → tenant.description
 * - category    → tenant.category
 * - ctaText     → tenant.heroCtaText
 * - ctaLink     → tenant.heroCtaLink
 * - backgroundImage → tenant.heroBackgroundImage
 * - logo        → tenant.logo
 * - storeName   → tenant.name
 *
 * 🚀 SUPPORTS ALL BLOCKS: hero1, hero2, hero3, ..., hero200, hero9999!
 */
export function TenantHero({ config, tenant }: TenantHeroProps) {
  const templateBlock = useHeroBlock();
  const block = config?.block || templateBlock;

  // Extract hero data directly from tenant (Data Contract fields)
  const heroData = extractHeroData(tenant, config ? { hero: config } : undefined);

  const commonProps: HeroComponentProps = {
    title: heroData.title,
    subtitle: heroData.subtitle,
    description: 'description' in tenant ? tenant.description || undefined : undefined,
    category: 'category' in tenant ? tenant.category || undefined : undefined,
    ctaText: heroData.ctaText,
    ctaLink: heroData.ctaLink,
    showCta: true,
    backgroundImage: heroData.backgroundImage,
    logo: tenant.logo || undefined,
    storeName: tenant.name,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('hero', '');
  const HeroComponent = lazy(() =>
    import(`./blocks/hero/hero${blockNumber}`)
      .then((mod) => ({ default: mod[`Hero${blockNumber}`] as ComponentType<HeroComponentProps> }))
      .catch(() =>
        import('./blocks/hero/hero1').then((mod) => ({
          default: mod.Hero1 as ComponentType<HeroComponentProps>,
        }))
      )
  );

  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroComponent {...commonProps} />
    </Suspense>
  );
}

/**
 * Loading skeleton while hero component loads
 */
function HeroSkeleton() {
  return (
    <div className="h-screen w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}
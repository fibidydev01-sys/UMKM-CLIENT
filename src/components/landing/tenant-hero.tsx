'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { extractSectionText, getHeroConfig, extractBackgroundImage } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import type { TenantLandingConfig } from '@/types';

interface TenantHeroProps {
  config?: TenantLandingConfig['hero'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    logo?: string;
    storeName?: string;
  };
}

export function TenantHero({ config, fallbacks = {} }: TenantHeroProps) {
  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || fallbacks.storeName,
    subtitle: fallbacks.subtitle,
  });

  const heroConfig = getHeroConfig(config);
  const layout = heroConfig?.layout || 'centered';
  const showCta = heroConfig?.showCta ?? true;
  const ctaText = heroConfig?.ctaText || LANDING_CONSTANTS.CTA_TEXT_DEFAULT;
  const backgroundImage = extractBackgroundImage(heroConfig, fallbacks.backgroundImage);
  const overlayOpacity = heroConfig?.overlayOpacity ?? LANDING_CONSTANTS.OVERLAY_OPACITY_DEFAULT;

  const layoutClasses = {
    centered: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* ✅ OPTIMIZED: Hero Background */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0">
            <OptimizedImage
              src={backgroundImage}
              alt={fallbacks.storeName || title}
              fill
              crop="fill"
              gravity="auto"
              sizes="100vw"
              priority
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* Content */}
      <div className={`relative z-10 max-w-3xl px-6 py-12 flex flex-col gap-4 ${layoutClasses[layout]}`}>
        {/* ✅ OPTIMIZED: Logo */}
        {fallbacks.logo && (
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <OptimizedImage
              src={fallbacks.logo}
              alt={fallbacks.storeName || title}
              fill
              crop="fill"
              gravity="auto"
              className="object-cover"
            />
          </div>
        )}

        <h1 className={`text-3xl md:text-5xl font-bold ${backgroundImage ? 'text-white' : 'text-foreground'}`}>
          {title}
        </h1>

        {subtitle && (
          <p className={`text-lg md:text-xl max-w-2xl ${backgroundImage ? 'text-white/90' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        )}

        {showCta && (
          <Link href={heroConfig?.ctaLink || '/products'}>
            <Button size="lg" className="mt-4 gap-2">
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 -z-10" />
      )}
    </section>
  );
}
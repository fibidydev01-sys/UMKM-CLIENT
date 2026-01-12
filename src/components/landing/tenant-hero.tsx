'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image'; // ✅ ADD
import type { PublicTenant, TenantLandingConfig } from '@/types';

interface TenantHeroProps {
  tenant: PublicTenant;
  config?: TenantLandingConfig['hero'];
}

export function TenantHero({ tenant, config }: TenantHeroProps) {
  const title = config?.title || tenant.name;
  const subtitle = config?.subtitle || tenant.description || '';
  const layout = config?.config?.layout || 'centered';
  const showCta = config?.config?.showCta ?? true;
  const ctaText = config?.config?.ctaText || 'Lihat Produk';
  const backgroundImage = config?.config?.backgroundImage || tenant.banner;
  const overlayOpacity = config?.config?.overlayOpacity ?? 0.5;

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
              alt={tenant.name}
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
        {tenant.logo && (
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <OptimizedImage
              src={tenant.logo}
              alt={tenant.name}
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
          <Link href={config?.config?.ctaLink || '#products'}>
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
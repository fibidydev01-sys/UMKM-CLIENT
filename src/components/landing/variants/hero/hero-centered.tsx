'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import type { TenantLandingConfig } from '@/types';

interface HeroCenteredProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  overlayOpacity?: number;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Variant: Centered
 *
 * Classic centered hero with optional background image
 * Content is centered with vertical alignment
 */
export function HeroCentered({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  overlayOpacity = 0.5,
  logo,
  storeName,
}: HeroCenteredProps) {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0">
            <OptimizedImage
              src={backgroundImage}
              alt={storeName || title}
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
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 py-12 flex flex-col gap-4 text-center items-center">
        {/* Logo */}
        {logo && (
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <OptimizedImage
              src={logo}
              alt={storeName || title}
              fill
              crop="fill"
              gravity="auto"
              className="object-cover"
            />
          </div>
        )}

        <h1
          className={`text-3xl md:text-5xl font-bold ${backgroundImage ? 'text-white' : 'text-foreground'}`}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={`text-lg md:text-xl max-w-2xl ${backgroundImage ? 'text-white/90' : 'text-muted-foreground'}`}
          >
            {subtitle}
          </p>
        )}

        {showCta && (
          <Link href={ctaLink}>
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

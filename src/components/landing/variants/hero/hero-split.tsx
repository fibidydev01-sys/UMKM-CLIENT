'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface HeroSplitProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Variant: Split
 *
 * Split layout with content on left, image on right
 * Modern asymmetric design
 */
export function HeroSplit({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroSplitProps) {
  return (
    <section className="relative min-h-[500px] overflow-hidden rounded-xl">
      <div className="grid md:grid-cols-2 gap-8 items-center min-h-[500px]">
        {/* Left: Content */}
        <div className="px-8 py-12 md:py-16 space-y-6">
          {/* Logo */}
          {logo && (
            <div className="relative h-16 w-16 rounded-lg overflow-hidden border-2 border-primary/20 shadow-md">
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

          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">{subtitle}</p>
            )}
          </div>

          {showCta && (
            <Link href={ctaLink}>
              <Button size="lg" className="gap-2">
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Right: Image */}
        <div className="relative h-full min-h-[400px] md:min-h-[500px]">
          {backgroundImage ? (
            <OptimizedImage
              src={backgroundImage}
              alt={storeName || title}
              fill
              crop="fill"
              gravity="auto"
              sizes="50vw"
              priority
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          )}
        </div>
      </div>
    </section>
  );
}

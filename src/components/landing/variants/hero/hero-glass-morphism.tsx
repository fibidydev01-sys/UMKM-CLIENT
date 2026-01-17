'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

interface HeroGlassMorphismProps {
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
 * Hero Variant: Glass Morphism
 *
 * Modern glass-morphism design with blur effects
 * Beautiful gradient background with floating glass cards
 */
export function HeroGlassMorphism({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroGlassMorphismProps) {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10">
        {backgroundImage ? (
          <>
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
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-sm" />
          </>
        ) : (
          <DotPattern className={cn('opacity-20')} />
        )}
      </div>

      {/* Glass morphism card */}
      <div className="relative z-10 w-full max-w-4xl mx-6 my-12">
        <div className="backdrop-blur-xl bg-background/40 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Logo */}
          {logo && (
            <div className="relative h-20 w-20 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/30 shadow-lg backdrop-blur-sm bg-white/10">
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

          {/* Content */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-pink-600">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}

            {showCta && (
              <div className="pt-4">
                <Link href={ctaLink}>
                  <Button
                    size="lg"
                    className="gap-2 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    {ctaText}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Floating elements for extra effect */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

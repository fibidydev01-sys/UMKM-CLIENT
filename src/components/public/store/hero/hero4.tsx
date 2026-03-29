'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface Hero4Props {
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

export function Hero4({
  title,
  subtitle,
  description,
  category,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
  eyebrow,
}: Hero4Props) {
  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── BOTTOM — Text Content ── */}
      <div className="flex flex-col items-center text-center px-6 sm:px-10 pt-16 pb-10 order-1">

        {/* Logo + Badge */}
        {(storeName || logo) && (
          <div className="mb-7 flex flex-col items-center gap-3">
            {logo && (
              <Card className="relative w-14 h-14 overflow-hidden border border-border bg-card shadow-lg rounded-xl shrink-0">
                <OptimizedImage
                  src={logo}
                  alt={storeName ?? title}
                  fill
                  className="object-cover"
                />
              </Card>
            )}
            {storeName && (
              <Badge
                variant="outline"
                className="rounded-sm px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium border-border text-muted-foreground bg-transparent"
              >
                {storeName}
              </Badge>
            )}
          </div>
        )}

        {/* Eyebrow — prioritas: eyebrow prop, fallback: category */}
        {(eyebrow || category) && (
          <div className="mb-5 flex items-center gap-4 w-full max-w-xs sm:max-w-sm">
            <Separator className="flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap font-medium">
              {eyebrow ?? category}
            </span>
            <Separator className="flex-1 bg-border" />
          </div>
        )}

        {/* Title */}
        <h1 className="max-w-3xl text-[36px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-black leading-[1.0] tracking-tight text-foreground mb-4">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="max-w-lg text-base font-medium text-foreground/80 leading-snug mb-3">
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="mb-10 max-w-lg text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {!description && <div className="mb-10" />}

        {/* CTA */}
        {showCta && (
          <Link href={ctaLink}>
            <InteractiveHoverButton className="px-10 py-4 text-sm font-semibold tracking-wide">
              {ctaText}
            </InteractiveHoverButton>
          </Link>
        )}
      </div>

      {/* ── TOP — Card Image ── */}
      <div className="flex justify-center px-6 sm:px-10 pb-10 order-2">
        <div className="w-full max-w-4xl">
          <div className="overflow-hidden border border-border rounded-2xl w-full">
            <div className="aspect-video relative w-full">
              {backgroundImage ? (
                <OptimizedImage
                  src={backgroundImage}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : logo ? (
                <OptimizedImage
                  src={logo}
                  alt={title}
                  fill
                  className="object-contain p-16"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/20 font-medium">
                    No Image
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
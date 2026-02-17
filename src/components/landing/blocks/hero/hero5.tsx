'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface Hero5Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero5({
  title,
  subtitle,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero5Props) {
  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── TOP — Text Content ── */}
      <div className="flex flex-col items-center text-center px-6 sm:px-10 pt-20 pb-12">

        {/* Logo + Badge */}
        {(storeName || logo) && (
          <div className="mb-7 flex flex-col items-center gap-3">
            {logo && (
              <Card className="relative w-14 h-14 overflow-hidden border border-border bg-card shadow-lg rounded-xl shrink-0">
                <OptimizedImage
                  src={logo}
                  alt={storeName ?? 'Logo'}
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

        {/* Eyebrow */}
        <div className="mb-5 flex items-center gap-4 w-full max-w-xs sm:max-w-sm">
          <Separator className="flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap font-medium">
            Selamat Datang
          </span>
          <Separator className="flex-1 bg-border" />
        </div>

        {/* Title */}
        <h1 className="max-w-3xl text-[36px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-black leading-[1.0] tracking-tight text-foreground mb-5">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mb-10 max-w-lg text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}

        {!subtitle && <div className="mb-10" />}

        {/* CTA */}
        {showCta && (
          <Link href={ctaLink}>
            <InteractiveHoverButton className="px-10 py-4 text-sm font-semibold tracking-wide">
              Pesan Sekarang
            </InteractiveHoverButton>
          </Link>
        )}
      </div>

      {/* ── BOTTOM — Card Image centered max-w-4xl ── */}
      <div className="flex justify-center px-6 sm:px-10 pb-10 flex-1">
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
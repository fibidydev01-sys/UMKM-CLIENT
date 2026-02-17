'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface Hero2Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero2({
  title,
  subtitle,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero2Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex flex-col">

      {/* ── Main Split Grid ── */}
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 min-h-screen">

        {/* ── LEFT — Text Content ── */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-24 order-2 lg:order-1">

          {/* Logo + Store Badge */}
          {(storeName || logo) && (
            <div className="mb-8 flex items-center gap-3">
              {logo && (
                <Card className="relative w-14 h-14 overflow-hidden border border-border bg-card rounded-xl shrink-0">
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

          {/* Eyebrow — 2 separator kiri & kanan */}
          <div className="mb-5 flex items-center gap-3 max-w-[260px]">
            <Separator className="flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground whitespace-nowrap font-medium">
              Produk Kami
            </span>
            <Separator className="flex-1 bg-border" />
          </div>

          {/* Title */}
          <h1 className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground mb-6 max-w-lg">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-10">
              {subtitle}
            </p>
          )}

          {!subtitle && <div className="mb-10" />}

          {/* CTA */}
          {showCta && (
            <div>
              <Link href={ctaLink}>
                <InteractiveHoverButton className="px-9 py-4 text-sm font-semibold tracking-wide">
                  Pesan Sekarang
                </InteractiveHoverButton>
              </Link>
            </div>
          )}
        </div>

        {/* ── RIGHT — Card Image Square ── */}
        <div className="flex items-center justify-center px-8 sm:px-10 lg:px-12 py-12 lg:py-16 order-1 lg:order-2">
          <div className="w-full max-w-sm lg:max-w-none">
            <div className="overflow-hidden border border-border rounded-2xl">
              <div className="aspect-[3/4] relative w-full">
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
                    className="object-contain p-12"
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

      </div>
    </section>
  );
}
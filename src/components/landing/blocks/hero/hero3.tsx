'use client';

import Link from 'next/link';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface Hero3Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero3({
  title,
  subtitle,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero3Props) {
  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">

      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 min-h-screen">

        {/* ── LEFT — Text Content ── */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-24 order-2 lg:order-1">

          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-3 max-w-[260px]">
            <Separator className="flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground whitespace-nowrap font-medium">
              Selamat Datang
            </span>
            <Separator className="flex-1 bg-border" />
          </div>

          {/* Title */}
          <h1 className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground mb-10 max-w-lg">
            {title}
          </h1>

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

        {/* ── RIGHT — Instagram Post Card ── */}
        <div className="flex items-center justify-center px-8 sm:px-10 lg:px-12 py-12 lg:py-16 order-1 lg:order-2">
          <div className="w-full">
            <Card className="overflow-hidden border border-border bg-card rounded-2xl">

              {/* Post Header — logo + storeName */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                {logo ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0">
                    <OptimizedImage
                      src={logo}
                      alt={storeName ?? 'Logo'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted border border-border shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-foreground leading-tight">
                    {storeName ?? 'Toko Kami'}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Sponsored
                  </span>
                </div>
                <div className="ml-auto">
                  <span className="text-[18px] text-muted-foreground leading-none">···</span>
                </div>
              </div>

              {/* Post Image */}
              <div className="aspect-square relative w-full bg-muted">
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
                    className="object-contain p-10"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-4 px-4 pt-3 pb-2">
                <Heart className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                <MessageCircle className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                <Send className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>

              {/* Caption */}
              <div className="px-4 pb-4 space-y-1">
                <p className="text-[13px] text-foreground leading-relaxed">
                  <span className="font-semibold mr-1">{storeName ?? 'Toko Kami'}</span>
                  {subtitle ?? title}
                </p>
                <Badge
                  variant="outline"
                  className="rounded-sm px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase font-medium border-border text-muted-foreground bg-transparent mt-1"
                >
                  {storeName ?? 'Official'}
                </Badge>
              </div>

            </Card>
          </div>
        </div>

      </div>
    </section>
  );
}
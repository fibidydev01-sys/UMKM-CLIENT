'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';

interface Hero6Props {
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

export function Hero6({
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
}: Hero6Props) {
  return (
    <section className="relative min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">

      {/* ── LEFT — Text Panel ── */}
      <div className="relative z-10 flex flex-col justify-between lg:w-1/2 px-8 sm:px-14 pt-16 pb-12 order-1">

        {/* Top: Store identity */}
        <div className="flex items-center gap-2.5">
          {logo && (
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
              <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
            </div>
          )}
          {storeName && (
            <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-muted-foreground">
              {storeName}
            </span>
          )}
        </div>

        {/* Middle: Big title */}
        <div className="flex-1 flex flex-col justify-center py-14">

          {/* Eyebrow — prioritas: eyebrow prop, fallback: category */}
          {(eyebrow || category) && (
            <p className="mb-5 text-[10px] tracking-[0.28em] uppercase text-muted-foreground/70 font-medium">
              {eyebrow ?? category}
            </p>
          )}

          {/* Title */}
          <h1
            className="font-black leading-[1.0] tracking-tight text-foreground mb-7"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)' }}
          >
            {title}
          </h1>

          {/* Separator */}
          <div className="w-10 h-px bg-foreground/30 mb-7" />

          {/* Subtitle */}
          {subtitle && (
            <p className="max-w-xs text-base font-medium text-foreground/80 leading-snug mb-3">
              {subtitle}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed mb-9">
              {description}
            </p>
          )}

          {!description && <div className="mb-9" />}

          {/* CTA */}
          {showCta && (
            <Link href={ctaLink}>
              <InteractiveHoverButton className="px-9 py-4 text-sm font-semibold tracking-wide self-start">
                {ctaText}
              </InteractiveHoverButton>
            </Link>
          )}
        </div>

        {/* Bottom: Editorial detail */}
        <div className="flex items-center justify-between text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 font-medium">
          <span>Vol. 01</span>
          <span>2025 — 2026</span>
        </div>
      </div>

      {/* ── RIGHT — Image Panel ── */}
      <div className="relative lg:w-1/2 min-h-[50vh] lg:min-h-screen bg-muted overflow-hidden order-2">
        {backgroundImage ? (
          <OptimizedImage
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        ) : logo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="relative w-32 h-32">
              <OptimizedImage src={logo} alt={title} fill className="object-contain" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/20">No Image</span>
          </div>
        )}

        {/* Overlay badge */}
        {storeName && (
          <div className="absolute bottom-6 left-6">
            <Badge
              variant="secondary"
              className="rounded-sm px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium"
            >
              {storeName}
            </Badge>
          </div>
        )}
      </div>

    </section>
  );
}
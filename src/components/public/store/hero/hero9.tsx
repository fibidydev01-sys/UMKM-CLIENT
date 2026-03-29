'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';

interface Hero9Props {
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

export function Hero9({
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
}: Hero9Props) {
  return (
    <section className="relative min-h-screen bg-background flex flex-col items-center overflow-hidden">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top nav */}
      <div className="w-full flex items-center justify-between px-8 sm:px-14 py-7 z-10">
        <div className="flex items-center gap-2.5">
          {logo && (
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-border shrink-0">
              <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
            </div>
          )}
          {storeName && (
            <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-foreground">
              {storeName}
            </span>
          )}
        </div>
        {(eyebrow || category) && (
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-[10px] tracking-[0.15em] uppercase font-medium border-border text-muted-foreground"
          >
            {eyebrow ?? category}
          </Badge>
        )}
      </div>

      {/* Center: text */}
      <div className="flex flex-col items-center text-center px-6 sm:px-12 max-w-3xl mx-auto z-10 pt-6 pb-14">
        <h1
          className="font-black leading-[1.0] tracking-tight text-foreground mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="max-w-sm text-base font-medium text-foreground/80 leading-snug mb-3">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed mb-9">
            {description}
          </p>
        )}

        {!description && <div className="mb-9" />}

        {showCta && (
          <Link href={ctaLink}>
            <InteractiveHoverButton className="px-10 py-4 text-sm font-semibold tracking-wide">
              {ctaText}
            </InteractiveHoverButton>
          </Link>
        )}
      </div>

      {/* Stacked image cards */}
      <div
        className="relative z-10 w-full max-w-3xl px-6 sm:px-10 pb-16 flex items-end justify-center"
        style={{ minHeight: '320px' }}
      >
        {/* Back card */}
        <div
          className="absolute w-[80%] max-w-xl overflow-hidden rounded-2xl border border-border bg-muted"
          style={{
            transform: 'translateY(12px) scale(0.94) rotate(-1.5deg)',
            height: '260px',
            opacity: 0.4,
          }}
        />

        {/* Mid card */}
        <div
          className="absolute w-[88%] max-w-2xl overflow-hidden rounded-2xl border border-border bg-muted"
          style={{
            transform: 'translateY(6px) scale(0.97) rotate(0.5deg)',
            height: '290px',
            opacity: 0.65,
          }}
        />

        {/* Front card — actual image */}
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-border shadow-xl"
          style={{ height: '320px' }}
        >
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
              <div className="relative w-20 h-20">
                <OptimizedImage src={logo} alt={title} fill className="object-contain" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/20">No Image</span>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
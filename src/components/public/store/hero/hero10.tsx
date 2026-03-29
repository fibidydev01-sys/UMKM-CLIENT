'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero10Props {
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

export function Hero10({
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
}: Hero10Props) {
  const marqueeText = Array(8).fill(storeName ?? '').filter(Boolean).join(' · ');

  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Marquee ticker — top */}
      {marqueeText && (
        <div className="w-full overflow-hidden border-b border-border py-3 bg-foreground text-background shrink-0">
          <div
            className="flex gap-0 whitespace-nowrap"
            style={{ animation: 'marquee 18s linear infinite' }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase font-semibold pr-8">
              {marqueeText} &nbsp;·&nbsp; {marqueeText}
            </span>
            <span className="text-[11px] tracking-[0.3em] uppercase font-semibold pr-8" aria-hidden>
              {marqueeText} &nbsp;·&nbsp; {marqueeText}
            </span>
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* Left — Image */}
        <div className="relative lg:w-5/12 min-h-[45vh] lg:min-h-0 bg-muted overflow-hidden border-r border-border order-2 lg:order-1">
          {backgroundImage ? (
            <OptimizedImage
              src={backgroundImage}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          ) : logo ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24">
                <OptimizedImage src={logo} alt={title} fill className="object-contain" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/20">No Image</span>
            </div>
          )}

          {/* Vertical text on image left edge */}
          {storeName && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-px h-10 bg-white/30" />
              <span
                className="text-[9px] tracking-[0.35em] uppercase text-white/50 font-semibold"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {storeName}
              </span>
              <div className="w-px h-10 bg-white/30" />
            </div>
          )}
        </div>

        {/* Right — Text */}
        <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 order-1 lg:order-2">

          {/* Top logo + label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-border shrink-0">
                  <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
                </div>
              )}
              {storeName && (
                <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-foreground">
                  {storeName}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-medium hidden sm:block">
              2025 — 2026
            </span>
          </div>

          {/* Center: title */}
          <div className="py-10">
            {(eyebrow || category) && (
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-medium mb-5">
                {eyebrow ?? category}
              </p>
            )}
            <h1
              className="font-black leading-[0.92] tracking-[-0.03em] text-foreground mb-4"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)' }}
            >
              {title}
            </h1>

            {subtitle && (
              <p className="mt-3 max-w-sm text-base font-medium text-foreground/80 leading-snug">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Bottom CTA */}
          {showCta && (
            <div className="flex items-center gap-6">
              <Link href={ctaLink}>
                <InteractiveHoverButton className="px-10 py-4 text-sm font-semibold tracking-wide">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Marquee ticker — bottom */}
      {marqueeText && (
        <div className="w-full overflow-hidden border-t border-border py-3 shrink-0">
          <div
            className="flex gap-0 whitespace-nowrap"
            style={{ animation: 'marquee2 22s linear infinite' }}
          >
            <span className="text-[10px] tracking-[0.35em] uppercase font-medium text-muted-foreground pr-8">
              {marqueeText} &nbsp;·&nbsp; {marqueeText}
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase font-medium text-muted-foreground pr-8" aria-hidden>
              {marqueeText} &nbsp;·&nbsp; {marqueeText}
            </span>
          </div>
          <style>{`
            @keyframes marquee2 {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}

    </section>
  );
}
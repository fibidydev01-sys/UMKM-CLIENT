'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero8Props {
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

export function Hero8({
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
}: Hero8Props) {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex flex-col border-b border-border">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          {logo && (
            <div className="relative w-6 h-6 overflow-hidden border border-border shrink-0">
              <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
            </div>
          )}
          {storeName && (
            <span className="text-[11px] tracking-[0.18em] uppercase font-semibold text-foreground">
              {storeName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-medium">
          {(eyebrow || category) && (
            <span>{eyebrow ?? category}</span>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] divide-y lg:divide-y-0 lg:divide-x divide-border">

        {/* Left — Text */}
        <div className="flex flex-col justify-between p-6 sm:p-10 order-1">
          <div>
            {/* Counter label */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground font-medium border border-border px-2 py-0.5">
                001
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-black leading-[0.95] tracking-tight text-foreground uppercase mb-0"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
            >
              {title}
            </h1>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex flex-col gap-2">
              {subtitle && (
                <p className="max-w-xs text-sm font-medium text-foreground/80 leading-snug border-l-2 border-foreground/40 pl-4">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="max-w-xs text-xs text-muted-foreground leading-relaxed border-l-2 border-foreground/20 pl-4">
                  {description}
                </p>
              )}
            </div>
            {showCta && (
              <Link href={ctaLink}>
                <InteractiveHoverButton className="px-9 py-4 text-sm font-semibold tracking-wide shrink-0">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            )}
          </div>
        </div>

        {/* Right — Image box */}
        <div className="relative w-full lg:w-[38vw] min-h-[50vh] lg:min-h-0 bg-muted overflow-hidden order-2">
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
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/20">No Image</span>
            </div>
          )}

          {/* Corner label */}
          {storeName && (
            <div className="absolute top-4 right-4 bg-background border border-border px-2.5 py-1">
              <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-foreground">
                {storeName}
              </span>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
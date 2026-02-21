'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero24Props {
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

export function Hero24({
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
}: Hero24Props) {
  const label = eyebrow ?? category ?? '';

  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── TOP HALF: IMAGE fullwidth ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: '52vh', minHeight: '280px', flexShrink: 0 }}
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
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="relative w-24 h-24 opacity-30">
              <OptimizedImage src={logo} alt={title} fill className="object-contain" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-black/20" />

        {/* Top bar: storeName + label */}
        {(storeName || label) && (
          <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between">
            {storeName && (
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-white/70">
                {storeName}
              </span>
            )}
            {label && (
              <span className="text-[9px] tracking-[0.25em] uppercase text-white/50">
                {label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM HALF: content ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-10">

        {/* Label */}
        {label && (
          <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-3 font-medium">
            {label}
          </span>
        )}

        {/* Title */}
        <h1
          className="text-foreground font-black leading-[1.0] tracking-tight mb-5"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)' }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {(subtitle || description) && (
          <p className="text-muted-foreground max-w-sm leading-relaxed mb-2 text-sm">
            {subtitle ?? description}
          </p>
        )}

        {/* Description (if both exist) */}
        {subtitle && description && (
          <p className="text-muted-foreground/60 max-w-sm leading-relaxed mb-6 text-xs">
            {description}
          </p>
        )}

        {!subtitle && !description && <div className="mb-4" />}

        {/* CTA */}
        {showCta && ctaText && (
          <div className="mt-4">
            <Link href={ctaLink}>
              <button className="px-10 py-3 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase bg-foreground text-background hover:opacity-90 active:scale-95 transition-all">
                {ctaText}
              </button>
            </Link>
          </div>
        )}
      </div>

    </section>
  );
}
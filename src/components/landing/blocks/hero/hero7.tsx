'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero7Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero7: Fullscreen Cinematic — Image fills entire screen, dark gradient overlay, centered text.
export function Hero7({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero7Props) {
  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">

      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <OptimizedImage
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover opacity-60"
          />
        </div>
      )}

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 sm:px-14 py-8">
        <div className="flex items-center gap-2.5">
          {logo && (
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/30 shrink-0">
              <OptimizedImage src={logo} alt={storeName ?? 'Logo'} fill className="object-cover" />
            </div>
          )}
          {storeName && (
            <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-white/70">
              {storeName}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium hidden sm:block">
          Koleksi Terbaru
        </span>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-12 max-w-4xl mx-auto">

        {/* Thin top line */}
        <div className="w-px h-12 bg-white/20 mb-8" />

        <h1
          className="font-black leading-[1.0] tracking-tight text-white mb-7"
          style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="max-w-sm text-sm text-white/50 leading-relaxed mb-9 tracking-normal">
            {subtitle}
          </p>
        )}

        {showCta && (
          <Link href={ctaLink}>
            <InteractiveHoverButton className="px-10 py-4 text-sm font-semibold tracking-wide border-white/30">
              {ctaText ?? 'Pesan Sekarang'}
            </InteractiveHoverButton>
          </Link>
        )}

        {/* Bottom line */}
        <div className="w-px h-12 bg-white/20 mt-8" />
      </div>

      {/* Bottom left scroll hint */}
      <div className="absolute bottom-8 left-8 sm:left-14 z-20 flex items-center gap-3">
        <div className="w-5 h-px bg-white/20" />
        <span className="text-[9px] tracking-[0.25em] uppercase text-white/25 font-medium">Scroll</span>
      </div>

    </section>
  );
}
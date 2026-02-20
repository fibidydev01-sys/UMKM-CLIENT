'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero12Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero12: Depth Story — blurred bg, single center card sharp, clean typography.
export function Hero12({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero12Props) {
  return (
    <section className="relative min-h-screen bg-[#e8e4df] flex flex-col items-center overflow-hidden">

      {/* ── BLURRED BG ── */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={backgroundImage}
            alt=""
            fill
            className="object-cover scale-110"
            style={{ filter: 'blur(40px) brightness(0.9) saturate(0.6)' }}
          />
          <div className="absolute inset-0 bg-[#e8e4df]/65" />
        </div>
      )}

      {/* ── TOP LABEL ── */}
      <div className="relative z-10 mt-10 mb-4">
        <span className="text-[10px] tracking-[0.28em] text-zinc-400 font-medium uppercase">
          Koleksi Unggulan
        </span>
      </div>

      {/* ── TITLE ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 mb-8 max-w-2xl">
        <h1
          className="font-black leading-[1.0] tracking-tight text-zinc-900"
          style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
        >
          {title}
        </h1>
      </div>

      {/* ── SINGLE CENTER CARD ── */}
      <div className="relative z-10 mb-8">
        <div
          className="relative overflow-hidden rounded-2xl border border-white/60 shadow-2xl"
          style={{
            width: 'clamp(200px, 45vw, 300px)',
            height: 'clamp(280px, 62vw, 420px)',
          }}
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
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
              <div className="relative w-24 h-24">
                <OptimizedImage src={logo} alt={title} fill className="object-contain" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
              <span className="text-zinc-400 text-xs tracking-widest uppercase">No Image</span>
            </div>
          )}

          {/* Floating username tag */}
          <div className="absolute top-[28%] left-1/2 -translate-x-1/2 z-10">
            <div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg shadow-lg"
              style={{ background: 'rgba(30,30,30,0.70)', backdropFilter: 'blur(8px)' }}
            >
              {logo && (
                <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                  <OptimizedImage src={logo} alt={storeName ?? 'Store'} fill className="object-cover" />
                </div>
              )}
              <span className="text-white text-[11px] font-medium tracking-wide whitespace-nowrap">
                {storeName
                  ? storeName.toLowerCase().replace(/\s+/g, '.')
                  : 'your.store'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: subtitle + store name + CTA ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 sm:px-16 max-w-md pb-14 gap-4">
        {subtitle && (
          <p className="text-sm text-zinc-600 leading-relaxed">
            {subtitle}
          </p>
        )}

        <span className="text-[10px] tracking-[0.25em] text-amber-500 font-medium uppercase">
          — {storeName ?? 'Store'} —
        </span>

        {showCta && (
          <Link href={ctaLink} className="mt-2">
            <InteractiveHoverButton className="px-10 py-3.5 text-sm font-semibold tracking-wide">
              {ctaText ?? 'Pesan Sekarang'}
            </InteractiveHoverButton>
          </Link>
        )}
      </div>

    </section>
  );
}
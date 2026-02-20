'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { ArrowUpRight } from 'lucide-react';

interface Hero21Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero21: Clean editorial — max negative space, bold title + subtitle,
// full-width image with glass caption bar. Zero hardcode, monochrome.
export function Hero21({
  title,
  subtitle,
  ctaText = 'Pesan Sekarang',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero21Props) {
  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: '#080808',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-6xl mx-auto px-5 sm:px-8 py-8 gap-6">

        {/* ── TITLE ROW ── */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            {/* Store label */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[9px] tracking-[0.35em] uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}
              >
                {storeName ?? 'Store'} · Collection
              </span>
              <div className="w-12 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Title solid */}
            <h1
              className="font-black leading-[0.88]"
              style={{
                fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
                color: '#ffffff',
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                className="mt-3 text-sm max-w-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 300 }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* CTA */}
          {showCta && (
            <Link href={ctaLink} className="shrink-0">
              <button
                className="flex items-center gap-2 px-7 py-3 text-[10px] tracking-[0.22em] uppercase transition-all hover:bg-white hover:text-black active:scale-95"
                style={{
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'rgba(255,255,255,0.7)',
                  background: 'transparent',
                  fontWeight: 300,
                }}
              >
                {ctaText}
                <ArrowUpRight size={11} />
              </button>
            </Link>
          )}
        </div>

        {/* ── BIG IMAGE ── */}
        <div
          className="relative w-full overflow-hidden flex-1"
          style={{ minHeight: 'clamp(200px, 45vh, 480px)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {backgroundImage ? (
            <OptimizedImage
              src={backgroundImage}
              alt={title}
              fill
              priority
              className="object-cover grayscale contrast-110"
            />
          ) : logo ? (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0f0f0f' }}>
              <div className="relative w-28 h-28 grayscale opacity-30">
                <OptimizedImage src={logo} alt={title} fill className="object-contain" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0" style={{ background: '#111111' }} />
          )}

          {/* Glass caption bar */}
          <div
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-5 py-3.5"
            style={{
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 w-fit"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontWeight: 300,
                }}
              >
                Terbaru
              </span>
              <p className="font-bold text-sm mt-0.5" style={{ color: '#ffffff' }}>
                {title}
              </p>
              {subtitle && (
                <p
                  className="text-[11px] max-w-md truncate"
                  style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <Link href={ctaLink}>
              <div
                className="w-9 h-9 flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                style={{ background: '#ffffff' }}
              >
                <ArrowUpRight size={15} style={{ color: '#000000' }} />
              </div>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM: thin rule + store info ── */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-[8px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 300 }}
          >
            {storeName ?? 'Store'} · Premium Collection
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <span
              className="text-[8px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 300 }}
            >
              Est. Quality
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
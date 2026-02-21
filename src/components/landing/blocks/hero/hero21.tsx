'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero21Props {
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

export function Hero21({
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
}: Hero21Props) {
  const label = eyebrow ?? category ?? '';

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
            {/* Store + label */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[9px] tracking-[0.35em] uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}
              >
                {storeName ? `${storeName}${label ? ` · ${label}` : ''}` : label}
              </span>
              <div className="w-12 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Title */}
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


          </div>

          {/* CTA */}
          {showCta && ctaText && (
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
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
              {label && (
                <span
                  className="text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 w-fit"
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontWeight: 300,
                  }}
                >
                  {label}
                </span>
              )}
              <p className="font-bold text-sm mt-0.5" style={{ color: '#ffffff' }}>
                {title}
              </p>
              {(subtitle || description) && (
                <p
                  className="text-[11px] max-w-md truncate"
                  style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
                >
                  {subtitle ?? description}
                </p>
              )}
            </div>

            <Link href={ctaLink}>
              <div
                className="w-9 h-9 flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
                style={{ background: '#ffffff' }}
              >
                <svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 10L10 1M10 1H3M10 1V8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* ── BOTTOM strip ── */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-[8px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 300 }}
          >
            {storeName ? `${storeName}${label ? ` · ${label}` : ''}` : label}
          </span>
          {description && subtitle && (
            <span
              className="text-[8px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 300 }}
            >
              {description}
            </span>
          )}
        </div>

      </div>
    </section>
  );
}
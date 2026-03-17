'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero22Props {
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

export function Hero22({
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
}: Hero22Props) {
  const label = eyebrow ?? category ?? '';
  const words = title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const topLine = words.slice(0, mid).join(' ');
  const botLine = words.slice(mid).join(' ');

  return (
    <section
      className="relative w-full min-h-screen flex flex-col sm:flex-row overflow-hidden"
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

      {/* ── LEFT: Full-bleed image ── */}
      <div className="relative w-full sm:w-1/2 min-h-[50vw] sm:min-h-screen shrink-0">
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
            <div className="relative w-32 h-32 grayscale opacity-30">
              <OptimizedImage src={logo} alt={title} fill className="object-contain" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: '#111111' }} />
        )}

        {/* Right-side fade into dark panel */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{ background: 'linear-gradient(to right, transparent 60%, #080808 100%)' }}
        />

        {/* Bottom fade on mobile */}
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, #080808 100%)' }}
        />

        {/* Image index label */}
        {storeName && (
          <div className="absolute bottom-5 left-5 z-10">
            <span
              className="text-[8px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}
            >
              01 / {storeName}
            </span>
          </div>
        )}
      </div>

      {/* ── RIGHT: Editorial text panel ── */}
      <div
        className="relative z-10 w-full sm:w-1/2 flex flex-col justify-between px-8 sm:px-12 py-10 sm:py-14"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >

        {/* Top: store + label */}
        <div className="flex items-center gap-3 mb-auto">
          <span
            className="text-[9px] tracking-[0.35em] uppercase"
            style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}
          >
            {storeName ? `${storeName}${label ? ` · ${label}` : ''}` : label}
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Center: big title */}
        <div className="flex-1 flex flex-col justify-center py-10">

          {/* Ghost watermark storeName */}
          {storeName && (
            <div
              className="select-none pointer-events-none mb-1"
              style={{
                fontSize: 'clamp(0.6rem, 1.2vw, 0.85rem)',
                color: 'transparent',
                WebkitTextStroke: '0.5px rgba(255,255,255,0.1)',
                fontWeight: 900,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              {storeName}
            </div>
          )}

          {/* Title solid */}
          <h1
            className="font-black leading-[0.88]"
            style={{
              fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            {topLine}
          </h1>

          {/* Title ghost outline */}
          {botLine && (
            <h1
              className="font-black leading-[0.88] select-none"
              style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.25)',
                letterSpacing: '-0.03em',
              }}
            >
              {botLine}
            </h1>
          )}

          {/* Thin rule */}
          <div className="w-10 h-px my-6" style={{ background: 'rgba(255,255,255,0.18)' }} />

          {/* Subtitle */}
          {(subtitle || description) && (
            <p
              className="text-xs leading-relaxed max-w-[240px]"
              style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 300, letterSpacing: '0.01em' }}
            >
              {subtitle ?? description}
            </p>
          )}
        </div>

        {/* Bottom: CTA + vertical scroll line */}
        <div className="flex items-end justify-between mt-auto">
          {showCta && ctaText && (
            <Link href={ctaLink}>
              <button
                className="flex items-center gap-2.5 px-7 py-3 text-[10px] tracking-[0.22em] uppercase transition-all hover:bg-white hover:text-black active:scale-95"
                style={{
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'rgba(255,255,255,0.7)',
                  background: 'transparent',
                  fontWeight: 300,
                }}
              >
                {ctaText}
                <svg width="10" height="10" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Link>
          )}

          {/* Vertical scroll line */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-px h-10"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.25))' }}
            />
            <span
              className="text-[7px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}
            >
              {label || '·'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
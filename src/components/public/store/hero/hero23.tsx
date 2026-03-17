'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero23Props {
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

export function Hero23({
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
}: Hero23Props) {
  const label = eyebrow ?? category ?? '';
  const words = title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const topLine = words.slice(0, mid).join(' ');
  const botLine = words.slice(mid).join(' ');

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background: '#0a0a0a',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* ── FULLSCREEN BG IMAGE ── */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <>
            <OptimizedImage
              src={backgroundImage}
              alt={title}
              fill
              priority
              className="object-cover object-center grayscale contrast-110"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
              }}
            />
          </>
        ) : logo ? (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#111' }}>
            <div className="relative w-40 h-40 grayscale opacity-15">
              <OptimizedImage src={logo} alt={title} fill className="object-contain" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Noise texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── TOP: store label + thin rule ── */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 pt-7 flex items-center gap-4">
        <span
          className="text-[9px] tracking-[0.35em] uppercase shrink-0"
          style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
        >
          {storeName ? `${storeName}${label ? ` · ${label}` : ''}` : label}
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* ── TOP RIGHT: Ghost watermark ── */}
      {storeName && (
        <div
          className="absolute top-2 right-4 z-10 pointer-events-none select-none leading-none font-black"
          style={{
            fontSize: 'clamp(4rem, 14vw, 11rem)',
            letterSpacing: '-0.04em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.06)',
          }}
          aria-hidden
        >
          {storeName}
        </div>
      )}

      {/* ── FAR RIGHT: Dot pagination ── */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2">
        <span
          className="text-[9px] font-semibold mb-1"
          style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}
        >
          01
        </span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === 0 ? '6px' : '5px',
              height: i === 0 ? '6px' : '5px',
              background: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
        <span
          className="text-[9px] font-semibold mt-1"
          style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}
        >
          05
        </span>
      </div>

      {/* ── BOTTOM LEFT: Title + subtitle + CTA ── */}
      <div className="absolute bottom-12 left-6 sm:left-10 z-20" style={{ maxWidth: 'min(520px, 70vw)' }}>

        {/* Title solid */}
        <h1
          className="font-black leading-[0.9]"
          style={{
            fontSize: 'clamp(2.6rem, 8vw, 6.5rem)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
          }}
        >
          {topLine}
        </h1>

        {/* Title ghost */}
        {botLine && (
          <h1
            className="font-black leading-[0.9] select-none"
            style={{
              fontSize: 'clamp(2.6rem, 8vw, 6.5rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.3)',
              letterSpacing: '-0.03em',
            }}
          >
            {botLine}
          </h1>
        )}

        {/* Divider */}
        <div className="my-5 w-12 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />

        {/* Category label */}
        {label && (
          <span
            className="inline-block mb-3 text-[8px] tracking-[0.3em] uppercase px-2 py-1"
            style={{
              color: 'rgba(255,255,255,0.45)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontWeight: 300,
            }}
          >
            {label}
          </span>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-xs leading-relaxed mb-2"
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 300,
              maxWidth: '280px',
              letterSpacing: '0.01em',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p
            className="text-[11px] leading-relaxed mb-6"
            style={{
              color: 'rgba(255,255,255,0.28)',
              fontWeight: 300,
              maxWidth: '280px',
              letterSpacing: '0.01em',
            }}
          >
            {description}
          </p>
        )}
        {subtitle && !description && <div className="mb-6" />}

        {/* CTA */}
        {showCta && ctaText && (
          <Link href={ctaLink}>
            <button
              className="flex items-center gap-2.5 px-7 py-3 text-[10px] tracking-[0.22em] uppercase transition-all hover:bg-white hover:text-black active:scale-95"
              style={{
                border: '1px solid rgba(255,255,255,0.35)',
                color: '#ffffff',
                background: 'transparent',
                fontWeight: 400,
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

      {/* ── BOTTOM RIGHT: Scroll hint ── */}
      <div className="absolute bottom-7 right-12 z-20 flex flex-col items-center gap-2">
        <div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.3))' }}
        />
        <span
          className="text-[8px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}
        >
          {label || '·'}
        </span>
      </div>

    </section>
  );
}
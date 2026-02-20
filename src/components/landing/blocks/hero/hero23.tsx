'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { ArrowUpRight } from 'lucide-react';

interface Hero23Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero23: Monochrome Premium — fullscreen BG, editorial bottom-left title,
// ghost storeName watermark, minimal scroll indicator. Zero hardcode.
export function Hero23({
  title,
  subtitle,
  ctaText = 'Pesan Sekarang',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  storeName,
}: Hero23Props) {
  const words = title.split(' ');
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
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover object-center grayscale contrast-110"
          />
          {/* Gradient overlays for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
            }}
          />
        </div>
      )}

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
          {storeName ?? 'Store'} · Collection
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* ── TOP RIGHT: Ghost decorative storeName watermark ── */}
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
        {storeName ?? 'STORE'}
      </div>

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

        {/* Title — solid + ghost outline split */}
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

        {/* Thin divider */}
        <div className="my-5 w-12 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-xs leading-relaxed mb-6"
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

        {/* CTA */}
        {showCta && (
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
              <ArrowUpRight size={11} />
            </button>
          </Link>
        )}
      </div>

      {/* ── BOTTOM RIGHT: Scroll hint ── */}
      <div
        className="absolute bottom-7 right-12 z-20 flex flex-col items-center gap-2"
      >
        <div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.3))' }}
        />
        <span
          className="text-[8px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}
        >
          Scroll
        </span>
      </div>

    </section>
  );
}
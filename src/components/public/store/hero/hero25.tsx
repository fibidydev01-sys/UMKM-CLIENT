'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero25Props {
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

export function Hero25({
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
}: Hero25Props) {
  const label = eyebrow ?? category ?? '';
  const words = title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const topLine = words.slice(0, mid).join(' ');
  const botLine = words.slice(mid).join(' ');

  const marqueeChunk = [storeName, label, ctaText].filter(Boolean).join(' · ');
  const marqueeText = Array(8).fill(`— ${marqueeChunk} `).join('');

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: '#0a0a0a',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* ── FULL BACKGROUND IMAGE ── */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <>
            <OptimizedImage
              src={backgroundImage}
              alt={title}
              fill
              priority
              className="object-cover grayscale contrast-110"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)' }}
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

      {/* Horizontal rule */}
      <div
        className="absolute top-[72px] left-0 right-0 z-10 pointer-events-none"
        style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-10 pt-16 pb-4">

        {/* Store + label */}
        <div className="w-full flex items-center gap-3 mb-4 sm:mb-6">
          <span
            className="text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {storeName ? `${storeName}${label ? ` · ${label}` : ''}` : label}
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Title solid */}
        <h1
          className="w-full text-left font-black leading-[0.9]"
          style={{
            fontSize: 'clamp(2.4rem, 8.5vw, 7rem)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
          }}
        >
          {topLine}
        </h1>

        {/* Title ghost */}
        <h1
          className="w-full text-left font-black leading-[0.9] select-none mt-1"
          style={{
            fontSize: 'clamp(2.4rem, 8.5vw, 7rem)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.35)',
            letterSpacing: '-0.03em',
          }}
        >
          {botLine || topLine}
        </h1>

        {/* Bottom row — subtitle + CTA */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mt-8 sm:mt-12">
          <div className="flex flex-col gap-2 max-w-xs">
            {(subtitle || description) && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.01em' }}
              >
                {subtitle ?? description}
              </p>
            )}
            {subtitle && description && (
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.01em' }}
              >
                {description}
              </p>
            )}
          </div>

          {showCta && ctaText && (
            <Link href={ctaLink} className="shrink-0">
              <button
                className="flex items-center gap-3 px-8 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase transition-all hover:bg-white hover:text-black active:scale-95"
                style={{
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#ffffff',
                  background: 'transparent',
                }}
              >
                {ctaText}
                <svg width="12" height="12" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="w-full mt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
      </div>

      {/* ── MARQUEE ── */}
      <div
        className="relative z-20 overflow-hidden py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {[1, 2].map((k) => (
            <span
              key={k}
              className="text-[9px] font-semibold tracking-[0.3em] uppercase pr-12"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
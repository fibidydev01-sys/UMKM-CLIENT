'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';


interface Hero20Props {
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

export function Hero20({
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
}: Hero20Props) {
  const label = eyebrow ?? category ?? '';
  const words = title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const lineA = words.slice(0, mid).join(' ');
  const lineB = words.slice(mid).join(' ');

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 sm:px-10 py-12"
      style={{
        background: '#080808',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        }}
      />

      {/* ── PILL TAGS ── */}
      {label && (
        <div className="relative z-10 flex flex-wrap justify-center gap-2 mb-6">
          <div
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.18em] uppercase"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {label}
          </div>
        </div>
      )}

      {/* ── MAIN GLASS CARD ── */}
      <div
        className="relative z-10 w-full flex flex-col lg:flex-row overflow-hidden"
        style={{
          maxWidth: 'min(1000px, 95vw)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* LEFT: Image panel */}
        <div
          className="relative lg:w-[45%] shrink-0 overflow-hidden"
          style={{ minHeight: 'clamp(320px, 60vw, 600px)' }}
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

          {/* Right fade into card */}
          <div
            className="absolute inset-0 pointer-events-none hidden lg:block"
            style={{ background: 'linear-gradient(to right, transparent 60%, rgba(10,10,10,0.6) 100%)' }}
          />

          {/* Image index label */}
          <div className="absolute bottom-4 left-4 z-10">
            <span
              className="text-[8px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}
            >
              01 / {storeName ?? ''}
            </span>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block w-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* RIGHT: Content */}
        <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-14">

          {/* Top */}
          <div>
            {/* Store label */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[9px] tracking-[0.35em] uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}
              >
                {storeName ? `${storeName}${label ? ` · ${label}` : ''}` : label}
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Title solid */}
            <h1
              className="font-black leading-[0.88] mb-1"
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                color: '#ffffff',
                letterSpacing: '-0.04em',
              }}
            >
              {lineA}
            </h1>

            {/* Title ghost outline */}
            {lineB && (
              <h1
                className="font-black leading-[0.88] select-none"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                  letterSpacing: '-0.04em',
                }}
              >
                {lineB}
              </h1>
            )}

            {/* Thin rule */}
            <div className="w-8 h-px my-6" style={{ background: 'rgba(255,255,255,0.15)' }} />

            {/* Subtitle */}
            {(subtitle || description) && (
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 300, letterSpacing: '0.01em' }}
              >
                {subtitle ?? description}
              </p>
            )}
          </div>

          {/* Bottom: CTA */}
          <div className="flex flex-col gap-5 mt-8">
            {showCta && ctaText && (
              <Link href={ctaLink}>
                <button
                  className="w-full flex items-center justify-center gap-2.5 py-4 text-[10px] tracking-[0.22em] uppercase transition-all hover:bg-white hover:text-black active:scale-[0.99]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: 'rgba(255,255,255,0.7)',
                    background: 'transparent',
                    fontWeight: 300,
                  }}
                >
                  {ctaText} ↗
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>


      {/* ── BOTTOM 3 EMPTY BOXES ── */}
      <div
        className="relative z-10 flex gap-3 mt-3 w-full"
        style={{ maxWidth: 'min(1000px, 95vw)' }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-12"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </div>

    </section>
  );
}
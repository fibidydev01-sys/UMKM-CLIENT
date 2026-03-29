'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero19Props {
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

export function Hero19({
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
}: Hero19Props) {
  const label = eyebrow ?? category ?? '';
  const words = title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const lineA = words.slice(0, mid).join(' ');
  const lineB = words.slice(mid).join(' ');

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: '#0d0d0d', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >

      {/* ── FULL BLEED BG IMAGE ── */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <div className="absolute inset-0" style={{ filter: 'grayscale(1) brightness(0.38)' }}>
            <OptimizedImage
              src={backgroundImage}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        ) : logo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40 opacity-10">
              <OptimizedImage src={logo} alt={title} fill className="object-contain" />
            </div>
          </div>
        ) : null}

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)',
          }}
        />

        {/* Bottom heavy fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: 'linear-gradient(to top, #0d0d0d 0%, transparent 100%)' }}
        />

        {/* Top fade */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: 'linear-gradient(to bottom, #0d0d0d 0%, transparent 100%)' }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.055] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* ── TOPBAR ── */}
      <div className="relative z-10 flex items-center justify-between px-7 sm:px-12 pt-8">
        <div className="flex items-center gap-2.5">
          {logo && (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/15">
              <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
            </div>
          )}
          {storeName && (
            <span
              className="text-white/70 font-semibold tracking-[0.2em] uppercase"
              style={{ fontSize: '10px' }}
            >
              {storeName}
            </span>
          )}
        </div>

        {label && (
          <span
            className="font-medium tracking-[0.35em] uppercase"
            style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}
          >
            {label}
          </span>
        )}
      </div>

      {/* ── SPACER ── */}
      <div className="flex-1" />

      {/* ── MAIN CONTENT — bottom anchored ── */}
      <div className="relative z-10 px-7 sm:px-12 pb-12">

        {/* Eyebrow */}
        {label && (
          <div className="flex items-center gap-3 mb-5">
            <div className="w-5 h-px bg-white/25" />
            <span
              className="tracking-[0.4em] uppercase font-medium"
              style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}
            >
              {label}
            </span>
          </div>
        )}

        {/* TITLE — two lines, second line ghosted */}
        <div className="mb-7">
          <h1
            className="text-white font-black leading-[0.88] tracking-[-0.04em] block"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            {lineA}
          </h1>
          {lineB && (
            <h1
              className="font-black leading-[0.88] tracking-[-0.04em] block"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.22)',
              }}
            >
              {lineB}
            </h1>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-7" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">

          {/* Subtitle + description */}
          <div className="flex flex-col gap-2 max-w-[38ch]">
            {subtitle && (
              <p
                className="leading-[1.75]"
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em' }}
              >
                {subtitle}
              </p>
            )}
            {description && (
              <p
                className="leading-[1.75]"
                style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.01em' }}
              >
                {description}
              </p>
            )}
          </div>

          {/* CTA + store mark */}
          <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
            {showCta && ctaText && (
              <Link href={ctaLink}>
                <InteractiveHoverButton
                  className="px-7 py-3 text-[10px] tracking-[0.28em] uppercase font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                  } as React.CSSProperties}
                >
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            )}
            {storeName && (
              <span
                className="tracking-[0.35em] uppercase"
                style={{ fontSize: '8px', color: 'rgba(255,255,255,0.18)' }}
              >
                {storeName}
              </span>
            )}
          </div>

        </div>
      </div>

    </section>
  );
}
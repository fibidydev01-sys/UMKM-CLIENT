'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero18Props {
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

export function Hero18({
  title,
  subtitle,
  description,
  category,
  ctaText = 'Shop Now',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
  eyebrow,
}: Hero18Props) {
  const label = eyebrow ?? category ?? '';

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        background: '#0c0a09',
        fontFamily: "'DM Mono', 'Fira Mono', monospace",
      }}
    >

      {/* ── SUNSET GRAIN OVERLAY ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 70% 30%, rgba(220,100,40,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(180,60,20,0.10) 0%, transparent 65%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")
          `,
          backgroundSize: 'cover, cover, 256px 256px',
          mixBlendMode: 'normal',
        }}
      />

      {/* ── SCANLINES ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)',
          backgroundSize: '100% 3px',
        }}
      />

      {/* ─────────────────────────────────
          TOPBAR
      ───────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-7 pb-5 border-b border-white/[0.07]">

        {/* Logo + storeName */}
        <div className="flex items-center gap-3">
          {logo && (
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20">
              <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
            </div>
          )}
          {storeName && (
            <span
              className="text-white/90 font-bold tracking-[0.18em] uppercase text-[11px]"
            >
              {storeName}
            </span>
          )}
        </div>

        {/* Label / eyebrow */}
        {label && (
          <span
            className="text-[9px] tracking-[0.35em] uppercase font-medium px-3 py-1.5 rounded-full border border-white/10"
            style={{ color: '#d97040' }}
          >
            {label}
          </span>
        )}
      </div>

      {/* ─────────────────────────────────
          MAIN LAYOUT — 3-column asymmetric
      ───────────────────────────────── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2.2fr_1fr] min-h-0">

        {/* ── LEFT RAIL ── */}
        <div className="hidden lg:flex flex-col justify-between px-8 py-10 border-r border-white/[0.06]">

          {/* Vertical storeName */}
          {storeName && (
            <div
              className="flex items-center gap-4"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              <span className="text-white/20 text-[9px] tracking-[0.5em] uppercase">{storeName}</span>
              <div className="flex-1 h-px bg-white/10 w-px" style={{ height: '60px', width: '1px' }} />
            </div>
          )}

          {/* Category tag */}
          {label && (
            <div
              className="self-start text-[9px] tracking-[0.4em] uppercase font-medium"
              style={{ color: 'rgba(217,112,64,0.7)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {label}
            </div>
          )}
        </div>

        {/* ── CENTER: IMAGE + TITLE OVERLAY ── */}
        <div className="relative flex flex-col overflow-hidden min-h-[520px] lg:min-h-0">

          {/* Full bleed image */}
          <div className="absolute inset-0">
            {backgroundImage ? (
              <>
                <div className="absolute inset-0" style={{ filter: 'saturate(0.2) sepia(0.5) brightness(0.55)' }}>
                  <OptimizedImage
                    src={backgroundImage}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                {/* Sunset duotone overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(160deg, rgba(220,90,30,0.35) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)',
                    mixBlendMode: 'multiply',
                  }}
                />
              </>
            ) : logo ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="relative w-28 h-28 opacity-30">
                  <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#1a1410]" />
            )}

            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>

          {/* Content on top of image */}
          <div className="relative z-10 mt-auto px-7 sm:px-10 pb-10 pt-16 flex flex-col gap-4">

            {/* Eyebrow line */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-px" style={{ background: 'rgba(217,112,64,0.7)' }} />
              {label && (
                <span className="text-[9px] tracking-[0.45em] uppercase font-medium" style={{ color: 'rgba(217,112,64,0.8)' }}>
                  {label}
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1
              className="text-white font-black leading-[0.88] tracking-[-0.04em]"
              style={{
                fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
                fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif",
                textShadow: '0 2px 40px rgba(0,0,0,0.6)',
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                className="text-white/50 text-[12px] leading-[1.75] max-w-[46ch]"
                style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.02em' }}
              >
                {subtitle}
              </p>
            )}

            {/* CTA */}
            {showCta && ctaText && (
              <div className="mt-2">
                <Link href={ctaLink}>
                  <InteractiveHoverButton
                    className="text-[11px] tracking-[0.25em] uppercase font-semibold px-7 py-3"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(217,112,64,0.5)',
                      color: 'rgba(217,112,64,0.9)',
                    } as React.CSSProperties}
                  >
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </div>
            )}
          </div>

          {/* Corner notch decoration */}
          <div
            className="absolute top-5 right-5 w-10 h-10 border-t border-r"
            style={{ borderColor: 'rgba(217,112,64,0.25)' }}
          />
          <div
            className="absolute bottom-5 left-5 w-6 h-6 border-b border-l"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          />
        </div>

        {/* ── RIGHT RAIL ── */}
        <div className="hidden lg:flex flex-col justify-between px-8 py-10 border-l border-white/[0.06]">

          {/* Description */}
          {description && (
            <p
              className="text-white/30 text-[10px] leading-[1.9] tracking-wide max-w-[20ch]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {description}
            </p>
          )}

          {/* Logo badge */}
          {logo && (
            <div className="flex flex-col items-center gap-2 self-end">
              <div
                className="relative w-12 h-12 rounded-full overflow-hidden border"
                style={{ borderColor: 'rgba(217,112,64,0.25)' }}
              >
                <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
              </div>
              {storeName && (
                <span className="text-[8px] tracking-[0.3em] uppercase text-white/20">{storeName}</span>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ─────────────────────────────────
          BOTTOM BAR
      ───────────────────────────────── */}
      <div
        className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-4 border-t border-white/[0.07]"
      >
        <span className="text-[8px] text-white/20 tracking-[0.35em] uppercase">
          {storeName ?? ''}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(217,112,64,0.6)' }} />
          <span className="text-[8px] text-white/20 tracking-[0.25em] uppercase">
            {label}
          </span>
        </div>
      </div>

    </section>
  );
}
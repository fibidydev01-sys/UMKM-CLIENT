'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';

interface Hero19Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero19: Y2K Retro — chunky Antonio/Bebas display font, pink brand colors from globals,
// chrome-ish gradient accents, star ✦ decorations, bold pill badges, distorted deco text,
// silver/holographic vibe meets UMKM Indonesia warmth.
export function Hero19({
  title,
  subtitle,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero19Props) {
  const titleWords = title.split(' ');
  const half = Math.ceil(titleWords.length / 2);
  const line1 = titleWords.slice(0, half).join(' ');
  const line2 = titleWords.slice(half).join(' ');

  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── Y2K GRID LINES (decorative) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── BIG DECORATIVE BG TEXT ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
        aria-hidden
      >
        <span
          className="text-primary/5 font-black select-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(8rem, 28vw, 22rem)',
            fontFamily: 'var(--font-antonio), var(--font-bebas-neue), Impact, sans-serif',
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          {storeName ?? 'STORE'}
        </span>
      </div>

      {/* ── TOP BAR ── */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-8 pb-0">
        <div className="flex items-center gap-2.5">
          {logo && (
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-primary/30 shrink-0">
              <OptimizedImage src={logo} alt={storeName ?? 'Store'} fill className="object-cover" />
            </div>
          )}
          <span
            className="text-foreground font-black tracking-tight"
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              fontFamily: 'var(--font-antonio), sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            {storeName ?? 'STORE'}
          </span>
        </div>

        {/* Y2K star badges */}
        <div className="flex items-center gap-2">
          {['✦ NEW', '✦ HOT'].map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full border-2 border-primary text-primary"
              style={{ fontFamily: 'var(--font-antonio), sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center px-6 sm:px-10 py-8 gap-8">

        {/* LEFT: Typography */}
        <div className="flex-1 flex flex-col justify-center gap-6">

          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), oklch(0.808 0.151 343.198))',
                color: 'white',
                fontFamily: 'var(--font-antonio), sans-serif',
              }}
            >
              ✦ Koleksi Terbaru ✦
            </div>
          </div>

          {/* MASSIVE Y2K title */}
          <div>
            <h1
              className="text-foreground leading-[0.85] tracking-[-0.04em]"
              style={{
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontFamily: 'var(--font-antonio), var(--font-bebas-neue), Impact, sans-serif',
                fontWeight: 900,
              }}
            >
              {line1}
            </h1>
            {line2 && (
              <h1
                className="leading-[0.85] tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(4rem, 12vw, 10rem)',
                  fontFamily: 'var(--font-antonio), var(--font-bebas-neue), Impact, sans-serif',
                  fontWeight: 900,
                  // Chrome/holographic gradient on line 2
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, oklch(0.808 0.151 343.198) 40%, oklch(0.718 0.202 349.761) 70%, var(--color-primary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {line2}
              </h1>
            )}
          </div>

          {/* Subtitle with Caveat handwriting font */}
          {subtitle && (
            <p
              className="text-muted-foreground max-w-sm leading-relaxed"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                fontFamily: 'var(--font-caveat), cursive',
              }}
            >
              ✦ {subtitle}
            </p>
          )}

          {/* Y2K pill features */}
          <div className="flex flex-wrap gap-2">
            {['🚀 Fast Delivery', '💎 Premium', '🔒 Aman', '⭐ 4.9 Rating'].map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wide border border-primary/20"
                style={{ fontFamily: 'var(--font-antonio), sans-serif' }}
              >
                {item}
              </Badge>
            ))}
          </div>

          {/* CTA */}
          {showCta && (
            <div className="flex items-center gap-4 mt-2">
              <Link href={ctaLink}>
                <button
                  className="relative px-10 py-4 rounded-full font-black text-sm tracking-widest uppercase text-white overflow-hidden transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, oklch(0.496 0.265 354.308) 100%)',
                    fontFamily: 'var(--font-antonio), sans-serif',
                    letterSpacing: '0.15em',
                    boxShadow: '0 4px 24px oklch(0.656 0.241 354.308 / 0.4)',
                  }}
                >
                  {/* Shine effect */}
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%)',
                    }}
                  />
                  ✦ Pesan Sekarang ✦
                </button>
              </Link>

              <Link href={ctaLink} className="text-primary font-bold text-sm tracking-wide hover:underline"
                style={{ fontFamily: 'var(--font-antonio), sans-serif' }}>
                Lihat Semua →
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT: Image with Y2K frame */}
        <div className="relative lg:w-[42%] flex-shrink-0 flex items-center justify-center">

          {/* Outer decorative ring */}
          <div
            className="absolute inset-[-12px] rounded-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), oklch(0.808 0.151 343.198), var(--color-primary))',
              opacity: 0.15,
            }}
          />

          {/* Star decorations */}
          {[
            { top: '-16px', right: '-8px', size: '2rem' },
            { bottom: '10%', left: '-20px', size: '1.5rem' },
            { top: '20%', right: '-24px', size: '1.2rem' },
          ].map((pos, i) => (
            <span
              key={i}
              className="absolute text-primary pointer-events-none font-black z-10"
              style={{ ...pos, fontSize: pos.size, fontFamily: 'sans-serif' }}
              aria-hidden
            >
              ✦
            </span>
          ))}

          {/* Main image card */}
          <div
            className="relative overflow-hidden bg-muted w-full"
            style={{
              borderRadius: '24px',
              aspectRatio: '4/5',
              maxWidth: 'min(380px, 80vw)',
              border: '3px solid',
              borderColor: 'oklch(0.808 0.151 343.198 / 0.4)',
              boxShadow: '0 20px 60px oklch(0.656 0.241 354.308 / 0.25)',
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
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <div className="relative w-28 h-28">
                  <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <span className="text-primary/30 text-xs tracking-widest uppercase font-black"
                  style={{ fontFamily: 'var(--font-antonio), sans-serif' }}>
                  No Image
                </span>
              </div>
            )}

            {/* Y2K gradient overlay bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24"
              style={{
                background: 'linear-gradient(to top, oklch(0.656 0.241 354.308 / 0.6), transparent)',
              }}
            />

            {/* Floating store name tag on image */}
            <div
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
            >
              <span
                className="text-white font-black text-sm tracking-wide"
                style={{ fontFamily: 'var(--font-antonio), sans-serif', letterSpacing: '0.1em' }}
              >
                {storeName ?? 'STORE'}
              </span>
              <span className="text-white/80 font-black text-xs" style={{ fontFamily: 'var(--font-antonio), sans-serif' }}>
                ✦ 2025
              </span>
            </div>
          </div>

          {/* Floating mini stats card */}
          <div
            className="absolute -bottom-4 -right-4 sm:-right-8 bg-background border-2 border-primary/20 rounded-2xl px-4 py-3 shadow-xl z-10"
          >
            <p className="text-primary font-black text-xl leading-none"
              style={{ fontFamily: 'var(--font-antonio), sans-serif' }}>
              10K+
            </p>
            <p className="text-muted-foreground text-[10px] tracking-widest uppercase font-bold mt-0.5"
              style={{ fontFamily: 'var(--font-antonio), sans-serif' }}>
              Happy Customers
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM MARQUEE ── */}
      <div
        className="relative z-10 overflow-hidden py-3 border-t border-border"
        style={{ background: 'var(--color-primary)' }}
      >
        <div
          className="flex whitespace-nowrap gap-0"
          style={{ animation: 'marquee 20s linear infinite' }}
        >
          {Array(6).fill(null).map((_, i) => (
            <span
              key={i}
              className="text-white text-[11px] font-black tracking-[0.3em] uppercase pr-10"
              style={{ fontFamily: 'var(--font-antonio), sans-serif' }}
            >
              ✦ {storeName ?? 'STORE'} &nbsp; ✦ KOLEKSI TERBARU &nbsp; ✦ FREE ONGKIR &nbsp; ✦ TERPERCAYA &nbsp;
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
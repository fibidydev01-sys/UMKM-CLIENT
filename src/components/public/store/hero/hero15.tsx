'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface Hero15Props {
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

export function Hero15({
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
}: Hero15Props) {
  return (
    <section className="relative min-h-screen bg-slate-700 flex flex-col items-center overflow-hidden">

      {/* ── BLURRED BG ── */}
      <div className="absolute inset-0 z-0">
        {(backgroundImage || logo) && (
          <div className="absolute inset-0 scale-110 overflow-hidden">
            <OptimizedImage
              src={(backgroundImage ?? logo)!}
              alt=""
              fill
              className="object-cover blur-2xl scale-110"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* ── TITLE + SUBTITLE ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 pt-12 pb-6">
        {(eyebrow || category) && (
          <p className="text-[10px] tracking-[0.28em] uppercase text-white/50 font-medium mb-4">
            {eyebrow ?? category}
          </p>
        )}
        <h1 className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-white drop-shadow-lg mb-4 max-w-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base font-medium text-white/80 leading-snug max-w-sm mb-2">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-sm text-white/60 leading-relaxed max-w-sm">
            {description}
          </p>
        )}
      </div>

      {/* ── 3 PHONE FRAMES ── */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center py-2">
        <div className="flex flex-row items-center justify-center">

          {/* ── LEFT PHONE ── */}
          <Card
            className="relative shrink-0 overflow-hidden border border-white/20 shadow-xl bg-white"
            style={{
              width: 'clamp(80px, 17vw, 130px)',
              borderRadius: '16px',
              transformOrigin: 'center center',
              transform: 'rotate(-10deg)',
              marginRight: 'clamp(-20px, -4vw, -32px)',
              filter: 'brightness(0.5) saturate(0.35)',
              zIndex: 1,
            }}
          >
            <AspectRatio ratio={9 / 16}>
              {backgroundImage ? (
                <OptimizedImage
                  src={backgroundImage}
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-black/60 rounded-full z-10" />
            </AspectRatio>
          </Card>

          {/* ── CENTER PHONE ── */}
          <Card
            className="relative shrink-0 overflow-hidden border-2 border-white/30 shadow-2xl bg-white"
            style={{
              width: 'clamp(180px, 44vw, 300px)',
              borderRadius: '30px',
              zIndex: 3,
            }}
          >
            <AspectRatio ratio={9 / 16}>
              {backgroundImage ? (
                <OptimizedImage
                  src={backgroundImage}
                  alt={title}
                  fill
                  priority
                  className="object-cover object-center"
                />
              ) : logo ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="relative w-20 h-20">
                    <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <span className="text-zinc-300 text-xs tracking-widest uppercase">No Image</span>
                </div>
              )}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/70 rounded-full z-10" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/30 rounded-full z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent z-10" />

              {showCta && (
                <div className="absolute bottom-7 left-0 right-0 flex justify-center z-20 px-4">
                  <Link href={ctaLink}>
                    <InteractiveHoverButton className="px-9 py-4 text-sm font-semibold tracking-wide">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                </div>
              )}
            </AspectRatio>
          </Card>

          {/* ── RIGHT PHONE ── */}
          <Card
            className="relative shrink-0 overflow-hidden border border-white/20 shadow-xl bg-white"
            style={{
              width: 'clamp(80px, 17vw, 130px)',
              borderRadius: '16px',
              transformOrigin: 'center center',
              transform: 'rotate(10deg)',
              marginLeft: 'clamp(-20px, -4vw, -32px)',
              filter: 'brightness(0.5) saturate(0.35)',
              zIndex: 1,
            }}
          >
            <AspectRatio ratio={9 / 16}>
              {backgroundImage ? (
                <OptimizedImage
                  src={backgroundImage}
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-black/60 rounded-full z-10" />
            </AspectRatio>
          </Card>

        </div>
      </div>

      {/* ── BOTTOM ── */}
      <div className="relative z-10 flex flex-col items-center pb-10 pt-4 gap-2">
        {storeName && (
          <>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-sm text-white/70 font-bold tracking-wide">
                {storeName}, Indonesia.
              </span>
            </div>
            <p className="text-white/25 text-[10px] tracking-[0.15em] italic">
              curated by {storeName}
            </p>
          </>
        )}
      </div>

    </section>
  );
}
'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface Hero13Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero13: IG Post Card — blurred bg, single clean Instagram-style post card center.
export function Hero13({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero13Props) {
  const handle = storeName
    ? storeName.toLowerCase().replace(/\s+/g, '_') + '_'
    : 'your.store_';

  return (
    <section className="relative min-h-screen bg-zinc-100 flex flex-col overflow-hidden">

      {/* ── BLURRED BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <div className="absolute inset-0 scale-110 overflow-hidden">
            <OptimizedImage
              src={backgroundImage}
              alt=""
              fill
              className="object-cover blur-2xl brightness-75 saturate-50"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-400" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ── TOP LEFT: Big Title ── */}
      <div className="relative z-10 px-7 pt-12 pb-0">
        <h1
          className="font-black text-white leading-[1.0] tracking-tight drop-shadow-lg"
          style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-sm font-medium mt-1.5 drop-shadow max-w-xs">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── TOP RIGHT: Badge ── */}
      <div className="absolute top-10 right-7 z-20">
        <span className="text-white font-semibold text-sm tracking-wide drop-shadow">Terbaru</span>
      </div>

      {/* ── CENTER: Instagram Post Card ── */}
      <div className="relative z-10 flex justify-center items-center flex-1 px-6 py-6">
        <div
          className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/40"
          style={{ maxWidth: 'min(360px, 85vw)' }}
        >
          {/* Card header */}
          <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-zinc-100">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shrink-0 bg-zinc-100">
              {logo ? (
                <OptimizedImage src={logo} alt={storeName ?? 'Store'} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-500 text-xs font-bold">
                  {storeName?.charAt(0) ?? 'S'}
                </div>
              )}
            </div>
            <span className="text-[13px] font-semibold text-zinc-800 tracking-tight">{handle}</span>
          </div>

          {/* Card image */}
          <div className="relative w-full aspect-square bg-zinc-100">
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={title}
                fill
                priority
                className="object-cover"
              />
            ) : logo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-zinc-300 text-xs tracking-widest uppercase">No Image</span>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-zinc-100">
            <div className="flex items-center gap-5">
              <Heart className="w-5 h-5 text-zinc-700" strokeWidth={1.8} />
              <MessageCircle className="w-5 h-5 text-zinc-700" strokeWidth={1.8} />
              <Send className="w-5 h-5 text-zinc-700" strokeWidth={1.8} />
            </div>
            <Bookmark className="w-5 h-5 text-zinc-700" strokeWidth={1.8} />
          </div>

          {/* CTA inside card */}
          {showCta && (
            <div className="px-4 pb-4">
              <Link href={ctaLink}>
                <InteractiveHoverButton className="w-full py-3 text-xs font-semibold tracking-wide text-center">
                  {ctaText ?? 'Pesan Sekarang'}
                </InteractiveHoverButton>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM: barcode + store name ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 pb-10 gap-3">
        <div className="flex gap-px items-end opacity-50">
          {[3, 1, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 3, 1, 2, 1, 3, 2].map((h, i) => (
            <div
              key={i}
              className="bg-white"
              style={{ width: i % 3 === 0 ? '3px' : '1.5px', height: `${h * 4 + 10}px` }}
            />
          ))}
        </div>
        <p className="text-white/40 text-[11px] font-medium tracking-[0.15em] uppercase">
          {storeName ?? 'your.store'}
        </p>
      </div>

    </section>
  );
}
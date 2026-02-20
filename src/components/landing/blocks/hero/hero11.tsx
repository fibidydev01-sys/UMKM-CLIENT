'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero11Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero11: Gen Z Floating Cards — fullscreen bg image, overlaid floating UI widgets
export function Hero11({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero11Props) {
  return (
    <section className="relative min-h-screen bg-zinc-900 overflow-hidden select-none">

      {/* ── BACKGROUND IMAGE ── */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <OptimizedImage
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* ── DECORATIVE: Big vertical text right side ── */}
      <div
        className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10 leading-none font-black text-white/10 pointer-events-none hidden sm:block"
        style={{ fontSize: 'clamp(5rem, 12vw, 11rem)', writingMode: 'vertical-rl' }}
        aria-hidden
      >
        {storeName ?? 'STORE'}
      </div>

      {/* ── TOP LEFT: Title ── */}
      <div className="absolute top-10 left-6 sm:left-10 z-20 max-w-[55%]">
        <h1
          className="font-black leading-[1.0] tracking-tight text-white drop-shadow-lg"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-xs text-white/70 leading-relaxed max-w-xs font-medium drop-shadow">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── TOP RIGHT: Pill badge ── */}
      <div className="absolute top-10 right-6 sm:right-14 z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-white/20">
          <span className="text-[11px] font-semibold tracking-wide text-zinc-800 whitespace-nowrap">
            Koleksi Terbaru
          </span>
        </div>
      </div>

      {/* ── CENTER-RIGHT: Floating product card ── */}
      <div className="absolute right-[10%] sm:right-[15%] top-1/2 -translate-y-[60%] z-20 hidden md:block">
        <div className="w-44 bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-40 bg-white/10 overflow-hidden">
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={title}
                fill
                className="object-cover scale-110"
              />
            ) : logo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/20 text-xs">No Image</span>
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="text-[10px] font-bold text-white/90 truncate">{storeName ?? 'Store'}</p>
            <p className="text-[9px] text-white/50 mt-0.5 leading-tight line-clamp-2">
              {subtitle ?? 'Produk pilihan terbaik untuk kamu'}
            </p>
            <div className="flex gap-1 mt-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Profile card ── */}
      <div className="absolute bottom-8 left-6 sm:left-10 z-20 w-72 sm:w-80">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
              {logo ? (
                <OptimizedImage src={logo} alt={storeName ?? 'Store'} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {storeName?.charAt(0) ?? 'S'}
                </div>
              )}
            </div>
            {/* Name + verified */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-white truncate">{storeName ?? 'Store'}</span>
                <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] text-white/50 font-medium">
                @{(storeName ?? 'store').toLowerCase().replace(/\s+/g, '')}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-3 text-[11px] text-white/70 leading-relaxed line-clamp-3">
            {subtitle ?? 'Toko online terpercaya dengan produk berkualitas tinggi. Belanja sekarang dan dapatkan pengiriman cepat!'}
          </p>

          {/* Social icons + CTA */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div className="flex gap-3 text-white/40">
              {/* Instagram */}
              <svg className="w-3.5 h-3.5 hover:text-white/80 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              {/* TikTok */}
              <svg className="w-3.5 h-3.5 hover:text-white/80 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
              </svg>
              {/* Location */}
              <svg className="w-3.5 h-3.5 hover:text-white/80 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            {showCta && (
              <Link href={ctaLink}>
                <button className="text-[10px] font-bold bg-white text-zinc-900 px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors tracking-wide">
                  {ctaText ?? 'Pesan'} →
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM RIGHT: Location pill ── */}
      <div className="absolute bottom-8 right-6 sm:right-10 z-20">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg">
          <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-[10px] font-medium text-white/70">Indonesia</span>
        </div>
      </div>

    </section>
  );
}
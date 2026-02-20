'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero17Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero17: Newspaper Swiss Grid — editorial broadsheet layout
export function Hero17({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero17Props) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const titleWords = title.split(' ');
  const half = Math.ceil(titleWords.length / 2);
  const line1 = titleWords.slice(0, half).join(' ');
  const line2 = titleWords.slice(half).join(' ');

  const subLeft = subtitle
    ? subtitle.slice(0, Math.ceil(subtitle.length / 2))
    : 'Setiap produk dirancang dengan penuh perhatian untuk memastikan kualitas terbaik sampai ke tangan Anda.';
  const subRight = subtitle
    ? subtitle.slice(Math.ceil(subtitle.length / 2))
    : 'Kami berkomitmen menghadirkan pengalaman belanja yang menyenangkan dengan layanan cepat dan terpercaya.';

  return (
    <section className="relative min-h-screen bg-[#f5f0e8] flex flex-col overflow-hidden">

      {/* ══ TOP MASTHEAD ══ */}
      <div className="border-b-4 border-zinc-900 px-6 sm:px-10 pt-8 pb-3">
        <div className="flex items-end justify-between gap-4">

          {/* Left: issue info */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-medium">
              Vol. I — No. 01
            </span>
            <span className="text-[10px] tracking-[0.2em] text-zinc-400">
              {dateStr}
            </span>
          </div>

          {/* Center: Logo + Store name */}
          <div className="flex flex-col items-center gap-1 flex-1">
            {logo && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-900">
                <OptimizedImage src={logo} alt={storeName ?? 'Store'} fill className="object-cover" />
              </div>
            )}
            <h2
              className="text-zinc-900 font-black tracking-tight leading-none text-center"
              style={{ fontSize: 'clamp(1.4rem, 4vw, 2.5rem)' }}
            >
              {storeName ?? 'The Store'}
            </h2>
          </div>

          {/* Right: tagline */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-medium text-right">
              Koleksi Terbaru
            </span>
            <span className="text-[10px] text-zinc-400 text-right">
              Indonesia
            </span>
          </div>
        </div>
      </div>

      {/* Thin rule */}
      <div className="border-b border-zinc-400 mx-6 sm:mx-10" />

      {/* ══ MAIN GRID ══ */}
      <div className="flex-1 grid grid-cols-12 gap-0 border-b border-zinc-300 mx-6 sm:mx-10">

        {/* ── COL 1-8: Headline + image ── */}
        <div className="col-span-12 md:col-span-8 border-r border-zinc-300 pr-0 md:pr-6 pt-6 pb-6 flex flex-col gap-5">

          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-zinc-900" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-zinc-600 font-semibold">
              Edisi Unggulan
            </span>
          </div>

          {/* BIG HEADLINE */}
          <div>
            <h1
              className="text-zinc-900 font-black leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
            >
              {line1}
            </h1>
            {line2 && (
              <h1
                className="text-zinc-900 font-black leading-[0.88] tracking-tight italic"
                style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
              >
                {line2}
              </h1>
            )}
          </div>

          {/* Image */}
          <div className="relative w-full overflow-hidden bg-zinc-200" style={{ aspectRatio: '16/9' }}>
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={title}
                fill
                priority
                className="object-cover brightness-95 saturate-90"
              />
            ) : logo ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                <div className="relative w-24 h-24">
                  <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-zinc-400 text-xs tracking-widest uppercase">No Image</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 px-3 py-1.5">
              <p className="text-white/80 text-[10px] tracking-wide italic">
                {storeName ?? 'Store'} — Koleksi Pilihan Terbaik
              </p>
            </div>
          </div>

          {/* 2-col text */}
          <div className="grid grid-cols-2 gap-5 border-t border-zinc-300 pt-4">
            <p className="text-zinc-700 text-[12px] leading-[1.7]">{subLeft}</p>
            <p className="text-zinc-700 text-[12px] leading-[1.7]">{subRight}</p>
          </div>
        </div>

        {/* ── COL 9-12: Sidebar ── */}
        <div className="col-span-12 md:col-span-4 pl-0 md:pl-6 pt-6 pb-6 flex flex-col gap-5 border-t md:border-t-0 border-zinc-300">

          <div className="border-b border-zinc-900 pb-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-900 font-bold">
              Sorotan
            </span>
          </div>

          {/* Sidebar image */}
          <div className="relative w-full bg-zinc-200" style={{ aspectRatio: '1/1' }}>
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={title}
                fill
                className="object-cover brightness-90 saturate-50"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                <span className="text-zinc-400 text-xs">No Image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h3
              className="text-zinc-900 font-bold leading-tight"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
            >
              {title}
            </h3>
            <p className="text-zinc-500 text-[11px] leading-[1.7]">
              {subtitle ?? 'Temukan produk impianmu di sini. Kualitas premium, harga terjangkau.'}
            </p>
          </div>

          <div className="border-t border-zinc-300 pt-4 flex flex-col gap-3">
            {[
              { label: 'Produk Tersedia', val: '200+' },
              { label: 'Pelanggan Puas', val: '10K+' },
              { label: 'Rating Toko', val: '4.9 ★' },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-baseline justify-between border-b border-zinc-200 pb-2">
                <span className="text-[10px] text-zinc-500 tracking-wide uppercase">{label}</span>
                <span className="text-[13px] font-black text-zinc-900">{val}</span>
              </div>
            ))}
          </div>

          {showCta && (
            <Link href={ctaLink} className="mt-auto">
              <InteractiveHoverButton className="w-full py-3 text-xs font-semibold tracking-wide text-center">
                {ctaText ?? 'Pesan Sekarang'}
              </InteractiveHoverButton>
            </Link>
          )}
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-3 border-t border-zinc-300">
        <span className="text-[9px] text-zinc-400 tracking-[0.2em] uppercase">
          ©{now.getFullYear()} {storeName ?? 'Store'} — All rights reserved
        </span>
        <span className="text-[9px] text-zinc-400 tracking-[0.2em] italic">
          Diterbitkan di Indonesia
        </span>
      </div>

    </section>
  );
}
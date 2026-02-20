'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Star, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

interface Hero18Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero18: Bento Grid — asymmetric cells, image cell, title cell, badge cell,
// stats cell, CTA cell. Modern, clean, dense but airy.
export function Hero18({
  title,
  subtitle,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero18Props) {
  return (
    <section className="relative min-h-screen bg-zinc-50 flex flex-col justify-center px-4 sm:px-8 py-10 overflow-hidden">

      {/* Subtle dot grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── TOP: Store identity ── */}
      <div className="relative z-10 flex items-center justify-between mb-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          {logo && (
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-zinc-200 shrink-0">
              <OptimizedImage src={logo} alt={storeName ?? 'Store'} fill className="object-cover" />
            </div>
          )}
          <span className="text-[12px] font-bold tracking-tight text-zinc-800">
            {storeName ?? 'Store'}
          </span>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px] tracking-widest uppercase font-semibold px-3 py-1 border-zinc-300 text-zinc-500">
          Koleksi 2025
        </Badge>
      </div>

      {/* ── BENTO GRID ── */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto grid gap-3"
        style={{
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto',
        }}
      >

        {/* CELL A: Big image — col 1-7, row 1-2 */}
        <div
          className="relative overflow-hidden rounded-2xl bg-zinc-200 border border-zinc-200"
          style={{ gridColumn: '1 / 8', gridRow: '1 / 3', minHeight: '320px' }}
        >
          {backgroundImage ? (
            <OptimizedImage src={backgroundImage} alt={title} fill priority className="object-cover" />
          ) : logo ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
              <div className="relative w-24 h-24">
                <OptimizedImage src={logo} alt={title} fill className="object-contain" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
              <span className="text-zinc-400 text-xs tracking-widest uppercase">No Image</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Label bottom */}
          <div className="absolute bottom-4 left-4">
            <span className="text-white/70 text-[10px] tracking-[0.3em] uppercase font-medium">
              {storeName ?? 'Store'} — Featured
            </span>
          </div>
        </div>

        {/* CELL B: Title — col 8-12, row 1 */}
        <div
          className="relative rounded-2xl bg-zinc-900 p-5 flex flex-col justify-between overflow-hidden"
          style={{ gridColumn: '8 / 13', gridRow: '1 / 2' }}
        >
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            }}
          />
          <div className="relative z-10">
            <span className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-medium">
              ✦ Headline
            </span>
            <h1
              className="mt-2 text-white font-black leading-[0.9] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontFamily: 'Georgia, serif' }}
            >
              {title}
            </h1>
          </div>
          <div className="relative z-10 flex items-center gap-2 mt-4">
            <div className="w-4 h-px bg-zinc-500" />
            <span className="text-zinc-400 text-[10px] tracking-[0.2em] uppercase font-medium">
              {storeName ?? 'Store'}
            </span>
          </div>
        </div>

        {/* CELL C: Rating badge — col 8-9, row 2 */}
        <div
          className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col items-center justify-center gap-1"
          style={{ gridColumn: '8 / 10', gridRow: '2 / 3' }}
        >
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-2xl font-black text-amber-600" style={{ fontFamily: 'Georgia, serif' }}>4.9</span>
          <span className="text-[9px] text-amber-500 tracking-[0.2em] uppercase font-semibold">Rating</span>
        </div>

        {/* CELL D: Orders stat — col 10-11, row 2 */}
        <div
          className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col items-center justify-center gap-1"
          style={{ gridColumn: '10 / 12', gridRow: '2 / 3' }}
        >
          <span className="text-2xl font-black text-emerald-600" style={{ fontFamily: 'Georgia, serif' }}>10K+</span>
          <span className="text-[9px] text-emerald-500 tracking-[0.2em] uppercase font-semibold">Orders</span>
        </div>

        {/* CELL E: Small logo/brand — col 12, row 2 */}
        <div
          className="rounded-2xl bg-zinc-100 border border-zinc-200 p-3 flex items-center justify-center"
          style={{ gridColumn: '12 / 13', gridRow: '2 / 3' }}
        >
          {logo ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
              <OptimizedImage src={logo} alt={storeName ?? 'S'} fill className="object-cover" />
            </div>
          ) : (
            <span className="text-xl font-black text-zinc-400">{storeName?.charAt(0) ?? 'S'}</span>
          )}
        </div>

        {/* CELL F: Subtitle text — col 1-5, row 3 */}
        <div
          className="rounded-2xl bg-white border border-zinc-200 p-5 flex flex-col justify-between"
          style={{ gridColumn: '1 / 6', gridRow: '3 / 4' }}
        >
          <p className="text-zinc-600 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            {subtitle ?? 'Produk pilihan terbaik dengan kualitas premium, dikirim langsung ke pintu rumahmu dengan cepat dan aman.'}
          </p>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
            <ShieldCheck size={12} className="text-zinc-400" />
            <span>Terpercaya & Bergaransi</span>
          </div>
        </div>

        {/* CELL G: Delivery badge — col 6-8, row 3 */}
        <div
          className="rounded-2xl bg-sky-50 border border-sky-200 p-5 flex flex-col justify-between"
          style={{ gridColumn: '6 / 9', gridRow: '3 / 4' }}
        >
          <Truck size={22} className="text-sky-500" />
          <div>
            <p className="text-sky-700 font-bold text-sm leading-tight">Free Ongkir</p>
            <p className="text-sky-400 text-[10px] mt-0.5 tracking-wide">Seluruh Indonesia</p>
          </div>
        </div>

        {/* CELL H: CTA — col 9-12, row 3 */}
        {showCta && (
          <div
            className="rounded-2xl bg-zinc-900 p-5 flex flex-col justify-between overflow-hidden relative"
            style={{ gridColumn: '9 / 13', gridRow: '3 / 4' }}
          >
            <span className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase font-medium">
              Mulai Belanja
            </span>
            <div className="flex items-end justify-between mt-3">
              <Link href={ctaLink}>
                <button className="flex items-center gap-2 bg-white text-zinc-900 rounded-xl px-4 py-2.5 text-[11px] font-bold tracking-wide hover:bg-zinc-100 transition-colors">
                  Pesan Sekarang
                  <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
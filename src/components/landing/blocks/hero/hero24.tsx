'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero24Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

// Hero24: Half Split — top half = image, bottom half = white,
// product image overlaps the split line center.
export function Hero24({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero24Props) {
  const titleWords = title.split(' ');
  const half = Math.ceil(titleWords.length / 2);
  const labelText = titleWords.slice(0, half).join(' ');
  const mainTitle = titleWords.slice(half).join(' ') || title;

  return (
    <section className="relative min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── TOP HALF: IMAGE fullwidth ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: '52vh', minHeight: '280px', flexShrink: 0 }}
      >
        {/* BG image fills entire top half */}
        {backgroundImage ? (
          <OptimizedImage
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-black/20" />



      </div>

      {/* ── BOTTOM HALF: White content ── */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-10"
      >

        {/* Big slim title — 1 line */}
        <h1
          className="text-foreground font-black leading-[1.0] tracking-tight mb-5"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="text-muted-foreground max-w-sm leading-relaxed mb-6 text-sm">
            {subtitle}
          </p>
        )}

        {showCta && (
          <Link href={ctaLink}>
            <button className="px-10 py-3 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase bg-foreground text-background hover:opacity-90 active:scale-95 transition-all">
              {ctaText ?? 'Pesan Sekarang'}
            </button>
          </Link>
        )}
      </div>

    </section>
  );
}
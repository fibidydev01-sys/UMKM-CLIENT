'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Menu, Home, MessageCircle, Instagram, ShoppingBag } from 'lucide-react';

interface Hero16Props {
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

export function Hero16({
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
}: Hero16Props) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="relative min-h-screen bg-stone-700 flex flex-col overflow-hidden">

      {/* ── BG ── */}
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

      {/* ── RIGHT SIDEBAR: Lucide icons ── */}
      <div className="absolute right-4 sm:right-7 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-5">
        {[
          { Icon: Menu, label: 'menu' },
          { Icon: Home, label: 'home' },
          { Icon: MessageCircle, label: 'wa' },
          { Icon: Instagram, label: 'ig' },
          { Icon: ShoppingBag, label: 'shop' },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <Icon size={18} strokeWidth={1.6} />
          </button>
        ))}
      </div>

      {/* ── RIGHT SIDEBAR: Vertical label ── */}
      <div
        className="absolute right-0 top-1/2 z-10 hidden sm:flex items-center"
        style={{ transform: 'translateY(-50%) translateX(calc(100% - 18px)) rotate(90deg)', transformOrigin: 'left center' }}
      >
        <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase font-medium whitespace-nowrap">
          Daily Instagram Stories_
        </span>
      </div>

      {/* ── TITLE ── */}
      <div className="relative z-10 flex items-center gap-3 px-7 pt-10 pb-0">
        <div className="w-[4px] rounded-full bg-white shrink-0" style={{ height: 'clamp(40px, 8vw, 70px)' }} />
        <h1
          className="font-black text-white leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
        >
          {title}
        </h1>
      </div>

      {/* ── CENTER: card ── */}
      <div className="relative z-10 flex justify-center items-center flex-1 px-6 py-6">
        <div
          className="relative bg-white shadow-2xl w-full"
          style={{ maxWidth: 'min(320px, 78vw)', borderRadius: '28px', overflow: 'hidden' }}
        >
          {/* IMAGE */}
          <div className="relative overflow-hidden" style={{ height: 'clamp(200px, 48vw, 320px)' }}>
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-stone-400" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {(eyebrow || category) && (
              <div className="absolute top-4 left-0 right-0 flex justify-center">
                <span className="text-white/70 text-[10px] tracking-[0.25em] font-medium uppercase">
                  {eyebrow ?? category}
                </span>
              </div>
            )}
          </div>

          {/* BOTTOM: white area */}
          <div className="px-5 pt-4 pb-5">
            <p className="text-stone-400 text-[9px] tracking-[0.1em] mb-2 text-right">
              {dateStr}
            </p>
            {subtitle && (
              <p className="text-stone-800 text-sm font-medium leading-snug mb-2">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-stone-600 leading-relaxed mb-4 text-xs">
                {description}
              </p>
            )}
            {!description && <div className="mb-4" />}
            {showCta && (
              <Link href={ctaLink}>
                <InteractiveHoverButton className="w-full py-3 text-xs font-semibold tracking-wide text-center">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Copyright ── */}
      {storeName && (
        <div className="relative z-10 flex justify-center pb-8">
          <span className="text-white/25 text-[10px] tracking-[0.15em]">
            ©{now.getFullYear()} — {storeName} | all rights reserved
          </span>
        </div>
      )}

    </section>
  );
}
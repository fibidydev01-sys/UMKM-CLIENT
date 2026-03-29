'use client';

import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hero17Props {
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

export function Hero17({
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
}: Hero17Props) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <section className="relative min-h-screen bg-[#f5f0e8] flex flex-col overflow-hidden">

      {/* ══ MASTHEAD ══ */}
      <div className="border-b-4 border-zinc-900 px-6 sm:px-12 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">

          {/* Left: date */}
          <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-medium">
            {dateStr}
          </span>

          {/* Center: storeName */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {logo && (
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-zinc-900">
                <OptimizedImage src={logo} alt={storeName ?? title} fill className="object-cover" />
              </div>
            )}
            {storeName && (
              <h2 className="text-zinc-900 font-black tracking-tight leading-none text-center"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}>
                {storeName}
              </h2>
            )}
          </div>

          {/* Right: eyebrow/category */}
          <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-medium text-right">
            {eyebrow ?? category ?? ''}
          </span>
        </div>
      </div>

      {/* ══ MAIN GRID ══ */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 mx-6 sm:mx-12 border-b border-zinc-300">

        {/* LEFT: Headline + fullwidth image */}
        <div className="md:col-span-8 border-r border-zinc-300 pr-0 md:pr-8 pt-8 pb-8 flex flex-col gap-6">

          {/* Eyebrow */}
          {(eyebrow || category) && (
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span className="text-[10px] tracking-[0.35em] uppercase text-zinc-500 font-semibold">
                {eyebrow ?? category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-zinc-900 font-black leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>
            {title}
          </h1>

          {/* Main image */}
          <div className="relative w-full overflow-hidden bg-zinc-200 rounded-sm" style={{ aspectRatio: '3/2' }}>
            {backgroundImage ? (
              <OptimizedImage src={backgroundImage} alt={title} fill priority className="object-cover" />
            ) : logo ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                <div className="relative w-24 h-24">
                  <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-zinc-300 text-xs tracking-widest uppercase">No Image</span>
              </div>
            )}
          </div>

          {/* Subtitle + description full text below image */}
          {(subtitle || description) && (
            <div className="border-t border-zinc-300 pt-5 flex flex-col gap-2">
              {subtitle && (
                <p className="text-zinc-800 text-sm font-medium leading-relaxed">{subtitle}</p>
              )}
              {description && (
                <p className="text-zinc-600 text-[13px] leading-[1.8]">{description}</p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="md:col-span-4 pl-0 md:pl-8 pt-8 pb-8 flex flex-col gap-6 border-t md:border-t-0 border-zinc-200">

          {/* Sidebar square image */}
          <div className="relative w-full overflow-hidden bg-zinc-200 rounded-sm" style={{ aspectRatio: '1/1' }}>
            {backgroundImage ? (
              <OptimizedImage src={backgroundImage} alt={title} fill className="object-cover" />
            ) : logo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <OptimizedImage src={logo} alt={title} fill className="object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                <span className="text-zinc-300 text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Title repeat + description */}
          <div className="flex flex-col gap-3 border-t border-zinc-300 pt-4">
            <h3 className="text-zinc-900 font-bold leading-tight text-lg">{title}</h3>
            {description && (
              <p className="text-zinc-500 text-[11px] leading-[1.7]">{description}</p>
            )}
          </div>

          {/* Separator */}
          <div className="border-t border-zinc-300" />

          {/* CTA pushed to bottom */}
          {showCta && (
            <Link href={ctaLink} className="mt-auto">
              <InteractiveHoverButton className="w-full py-3 text-xs font-semibold tracking-wide text-center">
                {ctaText}
              </InteractiveHoverButton>
            </Link>
          )}
        </div>

      </div>

      {/* ══ FOOTER ══ */}
      {storeName && (
        <div className="flex items-center px-6 sm:px-12 py-3">
          <span className="text-[9px] text-zinc-400 tracking-[0.2em] uppercase">
            ©{now.getFullYear()} {storeName}
          </span>
        </div>
      )}

    </section>
  );
}
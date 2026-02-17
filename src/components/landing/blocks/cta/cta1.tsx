'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Cta1Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta1
 * Design: INLINE SPLIT
 *
 * Horizontal dua kolom:
 * - Kiri: eyebrow label + judul besar
 * - Kanan: subtitle + CTA link arrow
 * Compact, announcement-bar feel, cocok di tengah halaman.
 */
export function Cta1({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: Cta1Props) {
  return (
    <section className="py-14 md:py-20 my-8">

      {/* Top rule */}
      <div className="h-px bg-foreground mb-10 md:mb-14" />

      {/* Split layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">

        {/* Left: label + title */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
            Mulai Sekarang
          </p>
          <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        {/* Right: subtitle + CTA */}
        <div className="flex flex-col items-start md:items-end gap-6 md:pb-2">
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs md:text-right">
              {subtitle}
            </p>
          )}
          <Link
            href={buttonLink}
            className="group inline-flex items-center gap-3 text-sm font-medium text-foreground
                       hover:text-foreground/60 transition-colors duration-200"
          >
            <span className="border-b border-foreground/30 group-hover:border-transparent transition-colors duration-200 pb-px">
              {buttonText}
            </span>
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full
                         border border-foreground/20 transition-all duration-200
                         group-hover:bg-foreground group-hover:border-foreground group-hover:text-background"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="h-px bg-border/60 mt-10 md:mt-14" />

    </section>
  );
}
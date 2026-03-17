'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Cta5Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta5
 * Design: SIDE ACCENT
 *
 * - Vertical accent bar kiri thick (konsisten dengan products3)
 * - Layout asimetris: teks kiri 2/3, CTA kanan 1/3
 * - Label mono + judul besar + subtitle stacked di kiri
 * - Button pojok kanan bawah, aligned ke baseline judul
 * - Border top + bottom sebagai framing
 */
export function Cta5({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: Cta5Props) {
  return (
    <section className="py-14 md:py-20 my-8">

      {/* Top rule */}
      <div className="h-px bg-border mb-10 md:mb-14" />

      {/* Main layout */}
      <div className="flex gap-6 md:gap-8 items-stretch">

        {/* Vertical accent bar — konsisten dengan products3 */}
        <div className="w-0.5 bg-foreground rounded-full shrink-0" />

        {/* Content: full width, split internal */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-end">

          {/* Left: label + title + subtitle */}
          <div className="space-y-3">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Tunggu Apa Lagi
            </p>
            <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm pt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: CTA stacked bottom */}
          <div className="flex flex-col items-start md:items-end justify-end gap-3 md:pb-1">

            {/* Counter decoration */}
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40">
              01 / CTA
            </span>

            <Link
              href={buttonLink}
              className="group inline-flex items-center gap-3 text-sm font-medium
                         text-foreground hover:text-foreground/60 transition-colors duration-200"
            >
              <span className="border-b border-foreground/30 group-hover:border-transparent
                               transition-colors duration-200 pb-px">
                {buttonText}
              </span>
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full
                           border border-foreground/20 transition-all duration-200
                           group-hover:bg-foreground group-hover:border-foreground
                           group-hover:text-background"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom rule */}
      <div className="h-px bg-border mt-10 md:mt-14" />

    </section>
  );
}
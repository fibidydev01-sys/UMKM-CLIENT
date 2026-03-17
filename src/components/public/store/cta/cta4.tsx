'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Cta4Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta4
 * Design: MINIMAL STACKED
 *
 * - Centered, whitespace lega, zero decoration
 * - Judul besar stacked dengan subtitle di bawah
 * - CTA = text link dengan underline animasi, bukan button
 * - Cocok jadi section penutup halaman
 * - Sangat minimal, bicara lewat tipografi saja
 */
export function Cta4({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: Cta4Props) {
  return (
    <section className="py-24 md:py-36 my-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">

        {/* Eyebrow */}
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
          ✦ &nbsp; Ayo Mulai &nbsp; ✦
        </p>

        {/* Title */}
        <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black leading-[1.0] tracking-tight text-foreground">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        )}

        {/* CTA — pure text link, no button */}
        <div className="pt-2">
          <Link
            href={buttonLink}
            className="group inline-flex items-center gap-3 text-base font-medium text-foreground
                       hover:text-foreground/60 transition-colors duration-200"
          >
            <span className="border-b-2 border-foreground group-hover:border-foreground/30
                             transition-colors duration-200 pb-0.5">
              {buttonText}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
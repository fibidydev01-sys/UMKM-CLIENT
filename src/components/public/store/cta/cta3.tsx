'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Cta3Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta3
 * Design: STACKED STATEMENT
 *
 * - Judul oversized full-width, teks terpotong di edge (clipped) → dramatic
 * - Garis pembagi horizontal tegas di tengah
 * - Bawah: label kiri + subtitle tengah + CTA kanan (3-col)
 * - No animation, no marquee — pure typographic impact
 */
export function Cta3({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: Cta3Props) {
  return (
    <section className="py-8 md:py-12 my-4 overflow-hidden">

      {/* ── Top rule ── */}
      <div className="h-px bg-foreground mb-5 md:mb-6" />

      {/* ── Oversized title ── */}
      {/*
        fluid font-size via clamp: min 48px, preferred 10vw, max 120px
        Teks melebar penuh container → typographic statement
      */}
      <div className="mb-5 md:mb-6">
        <h2
          className="font-black tracking-tight text-foreground leading-[0.9] uppercase"
          style={{ fontSize: 'clamp(32px, 6vw, 72px)' }}
        >
          {title}
        </h2>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-foreground mb-5 md:mb-6" />

      {/* ── Bottom row: 3-col ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">

        {/* Col 1: eyebrow label */}
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
            Hubungi Kami
          </p>
        </div>

        {/* Col 2: subtitle */}
        <div className="sm:text-center">
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Col 3: CTA */}
        <div className="sm:flex sm:justify-end">
          <Link
            href={buttonLink}
            className="group inline-flex items-center gap-3 text-sm font-medium
                       text-foreground hover:text-foreground/60 transition-colors duration-200"
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

    </section>
  );
}
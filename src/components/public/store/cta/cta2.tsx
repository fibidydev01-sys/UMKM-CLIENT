'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Cta2Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta2
 * Design: FULL BORDER BOX
 *
 * Kotak besar dengan border tegas foreground.
 * Teks centered, corner label di pojok, button outline → filled on hover.
 * Brutalist-clean, statement visual kuat.
 */
export function Cta2({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: Cta2Props) {
  return (
    <section className="py-14 md:py-20 my-8">
      <div className="relative border-2 border-foreground rounded-2xl px-8 sm:px-14 md:px-20 py-14 md:py-20">

        {/* Corner label — top left */}
        <div className="absolute top-5 left-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
            Penawaran
          </span>
        </div>

        {/* Corner decoration — top right */}
        <div className="absolute top-5 right-6">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40">
            ✦
          </span>
        </div>

        {/* Center content */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-[36px] sm:text-[42px] lg:text-[56px] font-black leading-[1.0] tracking-tight text-foreground">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {subtitle}
            </p>
          )}

          {/* CTA Button — outline flip */}
          <div className="pt-2">
            <Link
              href={buttonLink}
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full
                         border-2 border-foreground text-sm font-medium text-foreground
                         hover:bg-foreground hover:text-background
                         transition-all duration-200"
            >
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Bottom corner label */}
        <div className="absolute bottom-5 right-6">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40">
            ✦
          </span>
        </div>

      </div>
    </section>
  );
}
'use client';

// ══════════════════════════════════════════════════════════════
// SOLUTION SECTION — V13.3
// Auto-cycle contrast rows nyala pink setiap 3 detik + hover override
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const contrasts = [
  {
    before: 'Belum ada\nsitusnya.',
    after: 'Situs online kamu,\nsiap.',
  },
  {
    before: 'Pembeli ga tau\nharus ke mana.',
    after: 'Satu link.\nLangsung order.',
  },
  {
    before: 'Modal gede\nbuat mulai.',
    after: 'Gratis.\nLangsung jalan.',
  },
];

export function SolutionSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % contrasts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4">

        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Solusinya
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-4">
            Gimana kalau kamu punya
            <br />
            <span className="text-primary font-mono text-3xl md:text-4xl">usaha-kamu.fibidy.com</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Satu link. Semua ada. Dimanapun, kapanpun.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {contrasts.map((item, index) => {
            const isActive = hoveredIndex !== null
              ? hoveredIndex === index
              : activeIndex === index;

            return (
              <div key={index}>
                <Separator className="bg-border/60" />
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-0 py-9 md:py-11 cursor-default"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Before */}
                  <div className="flex items-start gap-5 pr-0 md:pr-12 pb-6 md:pb-0">
                    <span className={cn(
                      'text-[10px] font-semibold uppercase tracking-widest pt-2.5 w-20 shrink-0 transition-colors duration-500',
                      isActive ? 'text-muted-foreground/50' : 'text-muted-foreground/25'
                    )}>
                      Tanpa Fibidy
                    </span>
                    <p className={cn(
                      'text-xl md:text-2xl font-black whitespace-pre-line leading-tight line-through tracking-tight transition-colors duration-500',
                      isActive ? 'text-muted-foreground/40 decoration-muted-foreground/20' : 'text-muted-foreground/15 decoration-muted-foreground/10'
                    )}>
                      {item.before}
                    </p>
                  </div>

                  {/* After */}
                  <div className="flex items-start gap-5 pl-0 md:pl-12 md:border-l border-border/40">
                    <span className={cn(
                      'text-[10px] font-semibold uppercase tracking-widest pt-2.5 w-20 shrink-0 transition-colors duration-500',
                      isActive ? 'text-primary' : 'text-primary/30'
                    )}>
                      Dengan Fibidy
                    </span>
                    <p className={cn(
                      'text-xl md:text-2xl font-black whitespace-pre-line leading-tight tracking-tight transition-colors duration-500',
                      isActive ? 'text-foreground' : 'text-foreground/30'
                    )}>
                      {item.after}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <Separator className="bg-border/60" />
        </div>

        <div className="max-w-4xl mx-auto mt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xl md:text-2xl font-black tracking-tight">
              Rumah digital kamu.
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Fibidy yang siapin. Kamu yang jalanin.
            </p>
          </div>
          <Button size="lg" asChild className="shrink-0 h-12 px-8">
            <Link href="/register">
              Buat Situs Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
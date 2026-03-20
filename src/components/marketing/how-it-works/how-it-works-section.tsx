'use client';

// ══════════════════════════════════════════════════════════════
// HOW IT WORKS SECTION — V13.3
// Timeline vertical line antara angka, auto-cycle + hover override
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    number: '01',
    title: 'Daftar & pilih kategori.',
    description: 'Langsung dapat namakamu.fibidy.com',
    tag: null,
  },
  {
    number: '02',
    title: 'Atur tampilan & deskripsi.',
    description: 'Tulis deskripsi situsmu sesuka hati. Bisa diedit kapanpun.',
    tag: null,
  },
  {
    number: '03',
    title: 'Tambahin produk atau layanan.',
    description: 'Upload foto. Tulis nama. Isi harga.',
    tag: '30 detik per item',
  },
  {
    number: '04',
    title: 'Share alamat situsmu.',
    description: 'Makin banyak yang tau, makin banyak yang mampir.',
    tag: null,
  },
  {
    number: '05',
    title: 'Terima order atau booking.',
    description: 'Order & booking langsung masuk ke kamu.',
    tag: null,
  },
];

export function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Langkah-langkah
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Dari daftar sampe punya situs.
            </h2>
          </div>

          {/* Steps dengan timeline */}
          <div className="relative">
            {steps.map((step, index) => {
              const isActive = hoveredIndex !== null
                ? hoveredIndex === index
                : activeIndex === index;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step.number}
                  className="grid grid-cols-[56px_1fr_auto] md:grid-cols-[88px_1fr_auto] items-start gap-6 cursor-default"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Number + vertical line */}
                  <div className="flex flex-col items-center">
                    {/* Number */}
                    <span className={cn(
                      'text-5xl md:text-6xl font-black select-none leading-none tabular-nums transition-colors duration-500 py-8 md:py-10',
                      isActive ? 'text-primary' : 'text-muted-foreground/20'
                    )}>
                      {step.number}
                    </span>

                    {/* Vertical connector line — semua kecuali last */}
                    {!isLast && (
                      <div className={cn(
                        'w-px flex-1 min-h-[24px] transition-colors duration-500',
                        isActive ? 'bg-primary/40' : 'bg-border/40'
                      )} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="py-8 md:py-10">
                    <h3 className={cn(
                      'text-2xl md:text-3xl font-black tracking-tight mb-1 leading-tight transition-colors duration-500',
                      isActive ? 'text-foreground' : 'text-foreground/50'
                    )}>
                      {step.title}
                    </h3>
                    <p className={cn(
                      'text-sm leading-relaxed transition-colors duration-500',
                      isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                    )}>
                      {step.description}
                    </p>
                  </div>

                  {/* Tag */}
                  <div className="py-8 md:py-10 flex items-start">
                    {step.tag && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'hidden md:inline-flex text-xs font-normal shrink-0 transition-all duration-500',
                          isActive
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-muted/40 text-muted-foreground/30 border-border/20'
                        )}
                      >
                        {step.tag}
                      </Badge>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          <Separator className="bg-border/60" />

          {/* CTA */}
          <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xl font-black tracking-tight">Siap mulai?</p>
              <p className="text-muted-foreground text-sm mt-1">Gratis mulai. Langsung bisa pakai.</p>
            </div>
            <Button size="lg" asChild className="shrink-0 h-12 px-8">
              <Link href="/register">
                Mulai Sekarang — Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
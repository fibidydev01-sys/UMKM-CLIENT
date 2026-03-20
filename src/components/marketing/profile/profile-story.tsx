'use client';

// ══════════════════════════════════════════════════════════════
// PROFIL STORY — V13.3 Raycast Standard
// Auto-cycle timeline rows + hover override
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const TIMELINE = [
  {
    number: '01',
    date: 'Januari 2026',
    title: 'Fibidy mulai beroperasi.',
    desc: 'Lahir dari keresahan melihat UMKM lokal Madiun kesulitan masuk ke ekosistem digital. Platform dibangun dari nol dengan semangat memberdayakan pelaku usaha kecil.',
    done: true,
  },
  {
    number: '02',
    date: 'Maret 2026',
    title: 'NIB terbit resmi.',
    desc: 'Perizinan Berusaha Berbasis Risiko Rendah diterbitkan oleh sistem OSS Kementerian Investasi RI. Fibidy kini beroperasi secara legal dan tercatat resmi di negara.',
    done: true,
  },
  {
    number: '03',
    date: 'Segera',
    title: 'Ekspansi ke seluruh Indonesia.',
    desc: 'Roadmap kami mencakup ribuan UMKM dari Sabang sampai Merauke. Platform multi-tenant yang bisa disesuaikan untuk setiap kebutuhan pelaku usaha.',
    done: false,
  },
];

export function ProfilStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TIMELINE.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Cerita kami
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Dari mana Fibidy dimulai.
            </h2>
          </div>

          {TIMELINE.map((item, index) => {
            const isActive = hoveredIndex !== null
              ? hoveredIndex === index
              : activeIndex === index;
            const isLast = index === TIMELINE.length - 1;

            return (
              <div key={item.number}>
                <div
                  className="relative grid grid-cols-[56px_1fr_auto] md:grid-cols-[88px_1fr_160px] items-start gap-6 cursor-default"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Number + vertical line */}
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      'text-5xl md:text-6xl font-black select-none leading-none tabular-nums transition-colors duration-500 py-8 md:py-10',
                      isActive ? 'text-primary' : 'text-muted-foreground/20'
                    )}>
                      {item.number}
                    </span>
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
                      'text-2xl md:text-3xl font-black tracking-tight mb-2 leading-tight transition-colors duration-500',
                      isActive ? 'text-foreground' : 'text-foreground/50'
                    )}>
                      {item.title}
                    </h3>
                    <p className={cn(
                      'text-sm leading-relaxed transition-colors duration-500',
                      isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                    )}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="hidden md:flex py-8 md:py-10 justify-end">
                    <p className={cn(
                      'text-sm text-right transition-colors duration-500',
                      isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                    )}>
                      {item.date}
                    </p>
                  </div>
                </div>

                {/* Date mobile */}
                <p className={cn(
                  'md:hidden text-xs pb-8 -mt-6 transition-colors duration-500',
                  isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                )}>
                  {item.date}
                </p>
              </div>
            );
          })}

          <Separator className="bg-border/60" />

        </div>
      </div>
    </section>
  );
}
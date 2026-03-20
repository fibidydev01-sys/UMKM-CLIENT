'use client';

// ══════════════════════════════════════════════════════════════
// PROFIL VISI MISI — V13.3 Raycast Standard
// Auto-cycle numbered rows + hover override
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ITEMS = [
  {
    number: '01',
    label: 'Visi',
    title: 'UMKM Indonesia berdaya digital.',
    desc: 'Menjadi platform toko online terpercaya yang memberdayakan setiap pelaku usaha kecil dan menengah Indonesia.',
  },
  {
    number: '02',
    label: 'Misi',
    title: 'Sederhanakan digitalisasi.',
    desc: 'Infrastruktur digital yang mudah, terjangkau, dan handal — sehingga UMKM bisa fokus jualan, bukan urusan teknis.',
  },
  {
    number: '03',
    label: 'Nilai',
    title: 'Jujur, cepat, pro-UMKM.',
    desc: 'Transparansi harga, kemudahan akses, dan dukungan nyata bagi pelaku usaha — bukan janji kosong.',
  },
];

export function ProfilVisiMisi() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ITEMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Visi, misi & nilai
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Kenapa Fibidy ada.
            </h2>
          </div>

          {ITEMS.map((item, index) => {
            const isActive = hoveredIndex !== null
              ? hoveredIndex === index
              : activeIndex === index;
            const isLast = index === ITEMS.length - 1;

            return (
              <div key={item.number}>
                <div
                  className="grid grid-cols-[56px_1fr_auto] md:grid-cols-[88px_1fr_100px] items-start gap-6 cursor-default"
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

                  {/* Label */}
                  <div className="hidden md:flex py-8 md:py-10 justify-end items-start">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs font-normal shrink-0 transition-all duration-500',
                        isActive
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-muted/40 text-muted-foreground/30 border-border/20'
                      )}
                    >
                      {item.label}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}

          <Separator className="bg-border/60" />

        </div>
      </div>
    </section>
  );
}
'use client';

// ══════════════════════════════════════════════════════════════
// HONEST SECTION — V13.3
// Auto-cycle statements nyala pink setiap 3 detik + hover override
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';

const statements = [
  { text: 'Ga perlu nunggu sempurna.' },
  { text: 'Ga perlu modal gede.' },
  { text: 'Ga perlu ngerti teknologi.' },
  { text: 'Dimanapun kamu berada. Kapanpun kamu mau.' },
];

export function HonestSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % statements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Jujur aja ya
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Jualan apapun
              <br />
              <span className="text-primary">Tempatnya di sini.</span>
            </h2>
          </div>

          {statements.map((s, index) => {
            const isActive = hoveredIndex !== null
              ? hoveredIndex === index
              : activeIndex === index;

            return (
              <div key={index}>
                <Separator className="bg-border/60" />
                <div
                  className="py-8 md:py-10 cursor-default"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <p className={cn(
                    'text-2xl md:text-4xl font-black tracking-tight leading-tight transition-colors duration-500',
                    isActive ? 'text-primary' : 'text-muted-foreground/25'
                  )}>
                    {s.text}
                  </p>
                </div>
              </div>
            );
          })}
          <Separator className="bg-border/60" />

          <div className="mt-14 flex flex-col gap-3">
            <p className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Kamu cukup tau apa yang mau kamu jual.
            </p>
            <p className="text-2xl md:text-3xl font-black text-primary tracking-tight leading-tight">
              Rumah digital kamu Fibidy yang siapin.
            </p>
            <p className="text-lg text-muted-foreground mt-2 font-medium">
              Kamu yang jalanin dimanapun, kapanpun.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
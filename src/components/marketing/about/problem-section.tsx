'use client';

// ══════════════════════════════════════════════════════════════
// PROBLEM SECTION — V13.3
// Auto-cycle angka nyala pink setiap 3 detik + hover override
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';

const problems = [
  {
    number: '01',
    statement: 'Produk kamu\nlayak ditemukan.',
    sub: 'Situs kamu tempatnya.',
  },
  {
    number: '02',
    statement: 'Pembeli\nmau order.',
    sub: 'Situsmu jawabannya.',
  },
];

export function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % problems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4">

        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Pernah ngalamin ini?
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
            Masalahnya selalu sama.
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {problems.map((problem, index) => {
            const isActive = hoveredIndex !== null
              ? hoveredIndex === index
              : activeIndex === index;

            return (
              <div key={problem.number}>
                <Separator className="bg-border/60" />
                <div
                  className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr_300px] items-start md:items-center gap-6 py-9 md:py-11 cursor-default"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className={cn(
                    'text-5xl md:text-6xl font-black select-none leading-none pt-1 tabular-nums transition-colors duration-500',
                    isActive ? 'text-primary' : 'text-muted-foreground/20'
                  )}>
                    {problem.number}
                  </span>

                  <h3 className={cn(
                    'text-2xl md:text-4xl font-black whitespace-pre-line leading-tight tracking-tight transition-colors duration-500',
                    isActive ? 'text-foreground' : 'text-foreground/50'
                  )}>
                    {problem.statement}
                  </h3>

                  <p className={cn(
                    'hidden md:block text-sm text-right leading-relaxed transition-colors duration-500',
                    isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                  )}>
                    {problem.sub}
                  </p>
                </div>

                <p className={cn(
                  'md:hidden text-sm pb-9 -mt-5 transition-colors duration-500',
                  isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                )}>
                  {problem.sub}
                </p>
              </div>
            );
          })}
          <Separator className="bg-border/60" />
        </div>

        <div className="max-w-4xl mx-auto mt-14">
          <p className="text-xl md:text-2xl font-bold tracking-tight">
            Solusinya simpel {' '}
            <span className="text-muted-foreground font-normal">
              kamu butuh rumah digital sendiri.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
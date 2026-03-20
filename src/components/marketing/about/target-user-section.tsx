'use client';

// ══════════════════════════════════════════════════════════════
// TARGET USER SECTION — V13.3
// Auto-cycle angka nyala pink setiap 3 detik
// Hover override: row yang di-hover langsung nyala
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const targetUsers = [
  {
    number: '01',
    title: 'Jualan Produk.',
    categories: ['Warung', 'Toko Kue', 'Sembako', 'Bakeri'],
    description: 'Produk kamu. Harga kamu. Pembeli langsung tau.',
  },
  {
    number: '02',
    title: 'Nawarin Jasa.',
    categories: ['Bengkel', 'Laundry', 'Salon', 'Barbershop'],
    description: 'Layanan kamu. Tarif kamu. Pembeli langsung booking.',
  },
  {
    number: '03',
    title: 'Dua-duanya.',
    categories: ['Kedai Kopi', 'Catering', 'Pet Shop', 'Gym'],
    description: 'Satu situs. Semua ada.',
  },
];

export function TargetUserSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-cycle setiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % targetUsers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Untuk siapa
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Buat siapa Fibidy?
            </h2>
          </div>

          {/* Rows */}
          <div className="max-w-4xl mx-auto">
            {targetUsers.map((user, index) => {
              // Hover override, fallback ke auto-cycle
              const isActive = hoveredIndex !== null
                ? hoveredIndex === index
                : activeIndex === index;

              return (
                <div key={user.number}>
                  <Separator className="bg-border/60" />
                  <div
                    className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr_240px] items-start md:items-center gap-6 py-9 md:py-11 transition-all duration-300 cursor-default"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >

                    {/* Number — nyala pink saat active */}
                    <span className={cn(
                      'text-5xl md:text-6xl font-black select-none leading-none pt-1 tabular-nums transition-colors duration-500',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground/20'
                    )}>
                      {user.number}
                    </span>

                    {/* Title + Badges */}
                    <div>
                      <h3 className={cn(
                        'text-2xl md:text-3xl font-black tracking-tight mb-3 leading-tight transition-colors duration-500',
                        isActive ? 'text-foreground' : 'text-foreground/60'
                      )}>
                        {user.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.categories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="secondary"
                            className={cn(
                              'text-xs font-normal rounded-full px-3 py-1 transition-all duration-500',
                              isActive
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-muted/40 text-muted-foreground border-border/40'
                            )}
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Description desktop */}
                    <p className={cn(
                      'hidden md:block text-sm text-right leading-relaxed transition-colors duration-500',
                      isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                    )}>
                      {user.description}
                    </p>

                  </div>

                  {/* Description mobile */}
                  <p className={cn(
                    'md:hidden text-sm pb-9 -mt-5 transition-colors duration-500',
                    isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                  )}>
                    {user.description}
                  </p>
                </div>
              );
            })}
            <Separator className="bg-border/60" />
          </div>

        </div>
      </div>
    </section>
  );
}
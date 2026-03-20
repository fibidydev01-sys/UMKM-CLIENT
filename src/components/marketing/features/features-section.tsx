'use client';

// ══════════════════════════════════════════════════════════════
// FEATURES SECTION — V13.3
// Auto-cycle numbered rows nyala pink setiap 3 detik + hover override
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    number: '01',
    title: 'Alamat situsmu sendiri.',
    description: 'namakamu.fibidy.com — rumah digitalmu, identitasmu.',
    tag: 'Domain',
  },
  {
    number: '02',
    title: 'Tampil di Google.',
    description: 'Makin lengkap info produknya, makin gampang ditemuin.',
    tag: 'SEO',
  },
  {
    number: '03',
    title: 'Checkout langsung.',
    description: 'Pelanggan pilih produk, tap pesan — langsung masuk ke kamu.',
    tag: 'Checkout',
  },
  {
    number: '04',
    title: 'Nol iklan.',
    description: 'Situsmu bersih. Pelanggan fokus ke produk kamu.',
    tag: 'Clean',
  },
  {
    number: '05',
    title: 'Nol komisi.',
    description: 'Semua uang dari penjualan — milik kamu.',
    tag: '0%',
  },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {features.map((feature, index) => {
            const isActive = hoveredIndex !== null
              ? hoveredIndex === index
              : activeIndex === index;

            return (
              <div key={feature.number}>
                <Separator className="bg-border/60" />
                <div
                  className="grid grid-cols-[56px_1fr_auto] md:grid-cols-[88px_1fr_auto] items-center gap-6 py-9 md:py-11 cursor-default"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Number */}
                  <span className={cn(
                    'text-5xl md:text-6xl font-black select-none leading-none tabular-nums transition-colors duration-500',
                    isActive ? 'text-primary' : 'text-muted-foreground/20'
                  )}>
                    {feature.number}
                  </span>

                  {/* Content */}
                  <div>
                    <h3 className={cn(
                      'text-2xl md:text-3xl font-black tracking-tight mb-1 leading-tight transition-colors duration-500',
                      isActive ? 'text-foreground' : 'text-foreground/50'
                    )}>
                      {feature.title}
                    </h3>
                    <p className={cn(
                      'text-sm leading-relaxed transition-colors duration-500',
                      isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                    )}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Tag */}
                  <Badge
                    variant="secondary"
                    className={cn(
                      'hidden md:inline-flex text-xs font-normal shrink-0 transition-all duration-500',
                      isActive
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-muted/40 text-muted-foreground/30 border-border/20'
                    )}
                  >
                    {feature.tag}
                  </Badge>
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
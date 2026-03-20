'use client';

import Image from 'next/image';

// ══════════════════════════════════════════════════════════════
// BENTO SHOWCASE SECTION — V13.0 Raycast Standard
// Clean bento grid, border tipis, CSS vars only
// ══════════════════════════════════════════════════════════════

function BentoCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoShowcaseSection() {
  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">

          {/* Kiri atas — Pain statement */}
          <BentoCard className="p-10 flex items-center min-h-[140px]">
            <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Sudah saatnya
              <br />
              <span className="text-muted-foreground/50">punya rumah digital.</span>
            </p>
          </BentoCard>

          {/* Kanan atas — Gain statement */}
          <BentoCard
            className="p-10 flex items-center min-h-[140px]"
            style={{ background: `hsl(var(--primary) / 0.08)`, borderColor: `hsl(var(--primary) / 0.2)` } as React.CSSProperties}
          >
            <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Jangan Khawatir
              <br />
              <span className="text-primary/70">Bisa edit kapan aja.</span>
            </p>
          </BentoCard>

          {/* Kiri bawah — Sad */}
          <BentoCard className="relative aspect-square overflow-hidden flex items-center justify-center p-8 bg-muted/30">
            <div className="absolute top-5 left-5 z-10">
              <div className="bg-background/90 backdrop-blur-sm border border-border/60 text-foreground text-sm font-semibold px-4 py-2.5 rounded-xl max-w-[200px] leading-snug">
                Belum punya situs sendiri?
              </div>
            </div>
            <div className="relative w-full aspect-square rounded-full overflow-hidden">
              <Image src="/marketing-hero/sad.png" alt="Sad" fill className="object-cover" priority />
            </div>
          </BentoCard>

          {/* Kanan bawah — Happy */}
          <BentoCard className="relative aspect-square overflow-hidden flex items-center justify-center p-8 bg-muted/20">
            <div className="absolute bottom-5 right-5 z-10">
              <div className="bg-background/90 backdrop-blur-sm border border-border/60 text-foreground text-sm font-semibold px-4 py-2.5 rounded-xl max-w-[200px] leading-snug">
                Situsmu. Kendalimu.
              </div>
            </div>
            <div className="relative w-full aspect-square rounded-full overflow-hidden">
              <Image src="/marketing-hero/happy.png" alt="Happy" fill className="object-cover" priority />
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
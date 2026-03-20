'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WordRotate } from '@/components/ui/word-rotate';

// ══════════════════════════════════════════════════════════════
// HERO SECTION — V13.0 Raycast Standard
// Bold typographic hero, radial glow accent, CSS vars only
// ══════════════════════════════════════════════════════════════

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 overflow-hidden">

      {/* Radial glow — primary color bloom, Raycast style */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--primary) / 0.12) 0%, transparent 70%)`,
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Fade bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge pill */}
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Dari 0 Pelanggan Ke 1 Pelanggan
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] mb-8">
            BANGUN SITUS
            <br />
            <span className="text-primary">
              <WordRotate
                words={['SEMUDAH ITU.', 'TANPA RIBET.', 'DARI HP KAMU.', 'MULAI HARI INI.']}
              />
            </span>
          </h1>

          {/* Separator */}
          <div className="w-px h-12 bg-border/60 mx-auto mb-8" />

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground mb-3 max-w-xl mx-auto leading-relaxed">
            Rasakan sendiri dalam hitungan menit.
            Kelola produk, atur tampilan, edit sesuka hati.
          </p>

          {/* Micro trust */}
          <p className="text-sm text-muted-foreground mb-12 tracking-wide">
            Gratis mulai · Tanpa ngoding · Langsung bisa jualan
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="text-base px-8 h-12 shadow-lg"
              style={{ boxShadow: `0 0 32px hsl(var(--primary) / 0.25)` }}
            >
              <Link href="/register">
                Buat Situs Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-6 border-border/60 bg-background/40 backdrop-blur-sm">
              <Link href="/how-it-works">Lihat cara kerja</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
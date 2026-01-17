'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WordRotate } from '@/components/ui/word-rotate';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting
// ══════════════════════════════════════════════════════════════

const rotatingWords = [
  'Lebih Gampang Dicari',
  'Punya Alamat Sendiri',
  'Ada Fibidy AI',
  'Checkout WhatsApp',
];

const highlights = [
  'Gratis selamanya',
  'Setup 5 menit',
  'Tanpa kartu kredit',
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden">
      {/* ════════════════════════════════════════════════════════ */}
      {/* BACKGROUND EFFECTS - CSS Only (No DotPattern)           */}
      {/* ════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-0" />

      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* ════════════════════════════════════════════════════════ */}
      {/* CONTENT                                                  */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - V8.1 (Icon instead of emoji) */}
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium gap-2 animate-fade-in"
          >
            <Store className="h-4 w-4 text-primary" />
            <span>Untuk UMKM Produk & Jasa</span>
          </Badge>

          {/* Headline - V8.1 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Toko Online yang
            <br className="hidden sm:block" />
            <span className="text-primary">
              <WordRotate words={rotatingWords} />
            </span>
          </h1>

          {/* Subheadline - V8.1 */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Mau jualan produk atau nawarin jasa semua bisa.
            <br className="hidden md:block" />
            Daftar, dapat alamat toko sendiri.
            <br className="hidden md:block" />
            Bingung mau nulis apa? Ada Fibidy AI.
          </p>

          {/* CTA - V8.1 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button size="lg" asChild className="text-base px-8 h-12 shadow-lg shadow-primary/25">
              <Link href="/register">
                Buat Toko Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Micro-copy under CTA - V8.1 */}
          <p className="text-sm text-muted-foreground mb-10">
            Langsung dapat alamat toko sendiri
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* BROWSER MOCKUP                                           */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-pink-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50" />

          {/* Browser window */}
          <div className="relative rounded-xl border bg-background/80 backdrop-blur shadow-2xl overflow-hidden">
            {/* Browser header */}
            <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background rounded-md px-4 py-1 text-xs text-muted-foreground border">
                  namakamu.fibidy.com
                </div>
              </div>
            </div>

            {/* Browser content - CSS dots instead of DotPattern */}
            <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.1) 1px, transparent 0)`,
                  backgroundSize: '16px 16px',
                }}
              />
              <div className="text-center relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium">Preview Toko Kamu</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Produk, jasa, atau dua-duanya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
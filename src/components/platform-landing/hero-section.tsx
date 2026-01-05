'use client';

import Link from 'next/link';
import { ArrowRight, Play, CheckCircle2, Sparkles, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DotPattern } from '@/components/ui/dot-pattern';
import { WordRotate } from '@/components/ui/word-rotate';
import { cn } from '@/lib/cn';

const rotatingWords = [
  'Profesional',
  'Modern',
  'Gratis',
  'Mudah',
];

const highlights = [
  'Gratis selamanya',
  'Setup 5 menit',
  'Tanpa kartu kredit',
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          'absolute inset-0 z-0 fill-primary/20',
          '[mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,white,transparent)]'
        )}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-0" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium gap-2 animate-fade-in"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Platform UMKM #1 di Indonesia</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Buat Toko Online{' '}
            <span className="text-primary">
              <WordRotate words={rotatingWords} />
            </span>
            <br className="hidden sm:block" />
            dalam Hitungan Menit
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Platform all-in-one untuk UMKM Indonesia. Kelola produk, terima
            pesanan via WhatsApp, dan tingkatkan penjualan tanpa perlu coding.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button size="lg" asChild className="text-base px-8 h-12 shadow-lg shadow-primary/25">
              <Link href="/register">
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base h-12">
              <Link href="#how-it-works">
                <Play className="mr-2 h-4 w-4" />
                Lihat Cara Kerja
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-pink-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50" />
          <div className="relative rounded-xl border bg-background/80 backdrop-blur shadow-2xl overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background rounded-md px-4 py-1 text-xs text-muted-foreground border">
                  fibidy.com/store/toko-anda
                </div>
              </div>
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center relative overflow-hidden">
              <DotPattern
                width={16}
                height={16}
                cx={1}
                cy={1}
                cr={0.5}
                className="absolute inset-0 fill-muted-foreground/10"
              />
              <div className="text-center relative z-10">
                <Store className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Preview Dashboard</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Kelola toko Anda dengan mudah</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

// ══════════════════════════════════════════════════════════════
// CTA SECTION — V13.1 Raycast Standard
// Inverted dark, oversized headline, separator, CSS vars only
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function CTASection() {
  return (
    <section className="py-24 md:py-36 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <Separator className="bg-background/10 mb-16" />

          {/* Main statement */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            Siap jualan?
            <br />
            <span className="text-background/30">
              Semudah itu.
            </span>
          </h2>

          <div className="w-px h-10 bg-background/20 mb-8" />

          <p className="text-lg text-background/60 max-w-md leading-relaxed mb-14">
            Isi produk kamu. Publish. Bagikan.
            <br />
            5 menit udah punya alamat sendiri.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
            <Button
              size="lg"
              asChild
              className="text-base px-8 h-12 bg-background text-foreground hover:bg-background/90 font-semibold"
            >
              <Link href="/register">
                Buat Situs Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-12 px-6 text-background/50 hover:text-background hover:bg-background/10 font-medium"
            >
              <Link href="/how-it-works">Lihat cara kerja</Link>
            </Button>
          </div>

          <Separator className="bg-background/10 mb-14" />

          {/* Honest pledge */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <p className="text-[11px] text-background/40 uppercase tracking-widest font-semibold">
              Janji kami
            </p>
            <blockquote className="text-lg md:text-xl font-black tracking-tight text-background/70 leading-relaxed">
              &ldquo;Kami ga janji kamu bakal laku.
              <br />
              Kami janji kamu ga akan dibohongin.&rdquo;
            </blockquote>
          </div>

        </div>
      </div>
    </section>
  );
}
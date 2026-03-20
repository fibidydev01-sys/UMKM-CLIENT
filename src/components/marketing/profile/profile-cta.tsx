'use client';

// ══════════════════════════════════════════════════════════════
// PROFIL CTA — V13.1 Raycast Standard
// Inverted dark section, separator rhythm, CSS vars only
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ProfilCta() {
  return (
    <section className="py-24 md:py-36 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <Separator className="bg-background/10 mb-16" />

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            Siap punya situs
            <br />
            <span className="text-background/30">digitalmu sendiri?</span>
          </h2>

          <div className="w-px h-10 bg-background/20 mb-8" />

          <p className="text-lg text-background/60 max-w-md leading-relaxed mb-12">
            Bergabung dengan UMKM Indonesia yang sudah percaya Fibidy.
            Gratis mulai, upgrade kapan saja.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button
              size="lg"
              asChild
              className="text-base px-8 h-12 bg-background text-foreground hover:bg-background/90 font-semibold"
            >
              <Link href="/register">
                Mulai Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-12 px-6 text-background/50 hover:text-background hover:bg-background/10 font-medium"
            >
              <Link href="/features">Lihat Fitur</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
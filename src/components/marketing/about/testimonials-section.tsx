'use client';

// ══════════════════════════════════════════════════════════════
// TESTIMONIALS SECTION — V13.3
// Avatar pakai User icon dari lucide-react
// ══════════════════════════════════════════════════════════════

import { Separator } from '@/components/ui/separator';
import { Star, User } from 'lucide-react';

const testimonial = {
  content: 'Dulu ga punya situs sendiri. Sekarang produk saya rapi di satu tempat bisa diedit kapanpun, dimanapun, sesuka hati. Rasanya beda, lebih serius, lebih dipercaya.',
  name: 'Dek Asy',
  role: 'Reseller pengguna pertama Fibidy',
  rating: 5,
};

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Baru launching
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              Kami baru. Tapi mereka udah coba.
            </h2>
          </div>

          <Separator className="bg-border/60" />

          <div className="py-14 md:py-16">

            {/* Stars */}
            <div className="flex gap-1 mb-10">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl md:text-4xl font-black leading-tight tracking-tight mb-12">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center gap-4">
              {/* User icon avatar */}
              <div className="h-11 w-11 rounded-full border border-border bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>

          </div>

          <Separator className="bg-border/60" />

        </div>
      </div>
    </section>
  );
}
// ══════════════════════════════════════════════════════════════
// CTA SECTION - V8.1 Copywriting (No DotPattern, No Emojis)
// "Siap Punya Alamat Usaha yang Lebih Gampang Dicari?"
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import {
  ArrowRight,
  Rocket,
  Home,
  Bot,
  Ban,
  Handshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (Icons instead of emojis)
// ══════════════════════════════════════════════════════════════

const benefits = [
  {
    icon: Home,
    text: 'Alamat sendiri',
  },
  {
    icon: Bot,
    text: 'Fibidy AI bantuin',
  },
  {
    icon: Ban,
    text: 'Tanpa iklan',
  },
  {
    icon: Handshake,
    text: 'Bareng-bareng',
  },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* ════════════════════════════════════════════════════════ */}
      {/* BACKGROUND (CSS dots instead of DotPattern)              */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-pink-600" />

      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(ellipse at center, white, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, white, transparent 70%)',
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* ════════════════════════════════════════════════════════ */}
      {/* CONTENT                                                  */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-8">
            <Rocket className="h-8 w-8" />
          </div>

          {/* Headline - V8.1 */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Siap Punya Alamat Usaha yang Lebih Gampang Dicari?
          </h2>

          {/* Copy - V8.1 */}
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Mau jualan produk atau nawarin jasa semua bisa.
            <br /><br />
            Kami siapin tokonya.
            <br />
            Fibidy AI bantuin nulis.
            <br />
            Kamu isi produk atau layanannya.
            <br /><br />
            <span className="font-semibold">Tanpa iklan. Bareng-bareng.</span>
          </p>

          {/* Benefits (Icons instead of emojis) */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-2 text-sm opacity-90"
              >
                <benefit.icon className="h-4 w-4 flex-shrink-0" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-base px-8 h-12 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Link href="/register">
                Buat Toko Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base h-12 border-white/30 bg-white/10 hover:bg-white/20 text-white"
            >
              <Link href="/login">Sudah punya akun? Masuk</Link>
            </Button>
          </div>

          {/* Micro-copy */}
          <p className="text-sm opacity-70">
            5 menit udah punya alamat sendiri.
          </p>

          {/* Secondary Links */}
          <div className="mt-8 flex items-center justify-center gap-4 text-sm opacity-70">
            <span>atau eksplor dulu:</span>
            <Link href="/about" className="hover:opacity-100 underline underline-offset-4">
              Tentang
            </Link>
            <Link href="/fitur" className="hover:opacity-100 underline underline-offset-4">
              Fitur
            </Link>
            <Link href="/harga" className="hover:opacity-100 underline underline-offset-4">
              Harga
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
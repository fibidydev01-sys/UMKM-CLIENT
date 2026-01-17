// ══════════════════════════════════════════════════════════════
// SOLUTION SECTION - V8.1 Copywriting
// "Gimana Kalau Punya Alamat Usaha Sendiri?"
// ══════════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { ArrowRight, X, Check, Frown, Smile, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting
// ══════════════════════════════════════════════════════════════

const beforeItems = [
  'Gak punya alamat usaha tetap',
  'Cuma andalin story WA',
  'Orang baru susah nemuin',
  'Order/booking sering ketuker',
  'Bingung mau nulis apa',
];

const afterItems = [
  'Punya alamat sendiri',
  'Orang lebih gampang nemuin',
  'Order/booking langsung ke WhatsApp',
  'Ada sistem yang rapi',
  'Fibidy AI bantuin nulis',
];

// ══════════════════════════════════════════════════════════════
// SIMPLE HIGHLIGHT COMPONENT (replaces Highlighter)
// ══════════════════════════════════════════════════════════════

function SimpleHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 -inset-x-1 bg-primary/20 -skew-y-1 rounded"
        aria-hidden="true"
      />
    </span>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function SolutionSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* ════════════════════════════════════════════════════ */}
          {/* LEFT - MAIN COPY                                     */}
          {/* ════════════════════════════════════════════════════ */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Solusi
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Gimana Kalau Punya{' '}
              <SimpleHighlight>Alamat Usaha Sendiri?</SimpleHighlight>
            </h2>

            {/* Main Copy - V8.1 */}
            <div className="text-muted-foreground space-y-4 mb-8 leading-relaxed">
              <p>Bayangin gini:</p>

              <p>
                Kamu punya alamat yang bisa dishare.
                <br />
                <strong className="text-foreground">namakamu.fibidy.com</strong>
              </p>

              <p>
                Orang buka, langsung liat apa yang kamu tawarkan.
                <br />
                Produk? Ada harganya.
                <br />
                Jasa? Ada tarifnya.
                <br />
                Paket? Ada detailnya.
              </p>

              <p>
                Mau pesen atau booking? Klik, langsung ke WhatsApp.
              </p>

              <p>
                Bingung nulis deskripsi?
                <br />
                <strong className="text-foreground">Fibidy AI bantuin cariin kata-katanya.</strong>
              </p>

              <p className="text-foreground font-medium">
                Makin lengkap infonya, makin gampang orang nemuin kamu.
              </p>
            </div>

            <Button size="lg" asChild>
              <Link href="/register">
                Buat Toko Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* RIGHT - BEFORE/AFTER                                 */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            {/* BEFORE Card */}
            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Frown className="h-6 w-6 text-red-500" />
                <span>Sebelum</span>
              </h3>
              <ul className="space-y-3">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AFTER Card */}
            <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Smile className="h-6 w-6 text-green-500" />
                <span>Sesudah</span>
              </h3>
              <ul className="space-y-3">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
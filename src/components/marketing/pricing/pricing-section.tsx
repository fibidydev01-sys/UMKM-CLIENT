'use client';

// ══════════════════════════════════════════════════════════════
// PRICING SECTION — V13.3 Raycast Standard
// Popular card: radial glow menyebar dari tengah
// CSS vars only
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib';

const plans = [
  {
    name: 'Starter',
    price: 'Rp 0',
    priceNote: 'per bulan',
    description: 'Buat yang baru mulai.',
    popular: false,
    comingSoon: false,
    features: [
      { text: 'Alamat situsmu sendiri', included: true },
      { text: '30 produk/layanan', included: true },
      { text: 'Max 3 varian tampilan situs', included: true },
      { text: 'Checkout langsung', included: true },
      { text: 'Tanpa iklan', included: true },
      { text: 'Edit dimanapun, kapanpun', included: true },
      { text: 'Produk unlimited', included: false },
      { text: 'Domain sendiri', included: false },
      { text: 'Tanpa tulisan Fibidy', included: false },
    ],
    cta: 'Buat Situs Sekarang',
    href: '/register',
  },
  {
    name: 'Business',
    price: 'Segera',
    priceNote: 'hadir',
    description: 'Buat yang mau lebih serius.',
    popular: true,
    comingSoon: true,
    badge: 'Segera Hadir',
    features: [
      { text: 'Semua di Starter', included: true },
      { text: 'Produk unlimited', included: true },
      { text: 'Semua varian tampilan', included: true },
      { text: 'Domain sendiri', included: true },
      { text: 'Tanpa tulisan Fibidy', included: true },
      { text: 'Support prioritas', included: true },
    ],
    cta: 'Segera Hadir',
    href: '/register',
  },
];

const trustItems = [
  'Gratis mulai',
  'Tidak perlu kontrak',
  'Upgrade kapan saja',
  'Pembayaran aman',
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {plans.map((plan) => (
              <div key={plan.name} className="relative group">

                {plan.popular ? (
                  /* ── POPULAR CARD ── */
                  <div
                    className="relative rounded-2xl border border-primary/20 p-8 flex flex-col gap-6 h-full overflow-hidden"
                    style={{
                      /* Radial glow menyebar dari tengah — putih/pink di pusat */
                      background: `
                        radial-gradient(
                          ellipse 100% 80% at 50% 40%,
                          hsl(var(--primary) / 0.13) 0%,
                          hsl(var(--primary) / 0.06) 40%,
                          transparent 70%
                        ),
                        hsl(var(--card))
                      `,
                    }}
                  >
                    {/* Glow blob di tengah atas — floating light */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
                      style={{ background: `hsl(var(--primary))` }}
                    />

                    {/* Subtle shine sweep saat hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(
                          ellipse 120% 60% at 50% 0%,
                          hsl(var(--primary) / 0.08) 0%,
                          transparent 60%
                        )`,
                      }}
                    />

                    <CardContent plan={plan} />
                  </div>
                ) : (
                  /* ── REGULAR CARD ── */
                  <div className="rounded-2xl border border-border/60 bg-card p-8 flex flex-col gap-6 h-full">
                    <CardContent plan={plan} />
                  </div>
                )}

              </div>
            ))}
          </div>

          <Separator className="bg-border/60" />

          {/* Trust strip */}
          <div className="pt-8 flex flex-wrap gap-x-10 gap-y-2">
            {trustItems.map((item) => (
              <span key={item} className="text-sm text-muted-foreground">
                {item}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function CardContent({ plan }: { plan: typeof plans[number] }) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black tracking-tight">{plan.name}</h3>
          {plan.badge && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              {plan.badge}
            </span>
          )}
        </div>

        <div className={cn(
          'text-5xl font-black tracking-tight mb-1',
          plan.comingSoon ? 'text-muted-foreground/30' : 'text-foreground'
        )}>
          {plan.comingSoon ? '—' : plan.price}
        </div>
        <div className="text-xs text-muted-foreground mb-3 tracking-wide">
          {plan.comingSoon ? 'harga menyusul' : plan.priceNote}
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <Separator className="bg-border/60" />

      <ul className="space-y-3 flex-1">
        {plan.features.map((feature, index) => (
          <li
            key={index}
            className={cn(
              'flex items-center gap-3 text-sm',
              !feature.included && 'text-muted-foreground/30'
            )}
          >
            {feature.included
              ? <Check className="h-3.5 w-3.5 text-primary shrink-0" />
              : <X className="h-3.5 w-3.5 text-muted-foreground/20 shrink-0" />
            }
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      <Button
        className="w-full h-11 text-sm font-semibold"
        variant={plan.popular ? 'default' : 'outline'}
        size="lg"
        asChild={!plan.comingSoon}
        disabled={plan.comingSoon}
      >
        {plan.comingSoon ? (
          <span>{plan.cta}</span>
        ) : (
          <Link href={plan.href}>
            {plan.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        )}
      </Button>
    </>
  );
}
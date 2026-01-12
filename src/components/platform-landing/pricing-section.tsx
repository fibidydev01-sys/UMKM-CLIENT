// ══════════════════════════════════════════════════════════════
// PRICING SECTION - V8.1 Copywriting
// Starter (Free) + Business (Coming Soon)
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import {
  Check,
  X,
  Rocket,
  Crown,
  Clock,
  Lock,
  CreditCard,
  RefreshCw,
  FileX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface PricingFeature {
  text: string;
  included: boolean;
  isHeader?: boolean;
}

interface PricingPlan {
  name: string;
  icon: React.ElementType;
  price: string;
  priceNote: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  href: string;
  popular: boolean;
  comingSoon: boolean;
  badge?: string;
}

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting
// ══════════════════════════════════════════════════════════════

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    icon: Rocket,
    price: 'Rp 0',
    priceNote: '/bulan',
    description: 'Buat yang baru mulai',
    popular: false,
    comingSoon: false,
    features: [
      { text: 'Alamat sendiri (namakamu.fibidy.com)', included: true },
      { text: 'Pilih dari 15+ kategori bisnis', included: true },
      { text: 'Sampe 50 produk/layanan', included: true },
      { text: 'Order/booking ke WhatsApp', included: true },
      { text: 'Data 200 pelanggan/klien', included: true },
      { text: 'Struk dasar', included: true },
      { text: 'Fibidy AI bantuin nulis', included: true },
      { text: 'Tanpa iklan', included: true },
      { text: 'Support email', included: true },
      { text: 'Produk/layanan unlimited', included: false },
      { text: 'Custom domain (tokoku.com)', included: false },
      { text: 'Hapus tulisan Fibidy', included: false },
    ],
    cta: 'Buat Toko Sekarang',
    href: '/register',
  },
  {
    name: 'Business',
    icon: Crown,
    price: 'Rp 149.000',
    priceNote: '/bulan',
    description: 'Buat yang mau lebih serius',
    popular: true,
    comingSoon: true,
    badge: 'Segera Hadir',
    features: [
      { text: 'Semua di Starter, plus:', included: true, isHeader: true },
      { text: 'Produk/layanan unlimited', included: true },
      { text: 'Pelanggan/klien unlimited', included: true },
      { text: 'Alamat sendiri (tokoku.com)', included: true },
      { text: 'Tanpa tulisan Fibidy', included: true },
      { text: 'Laporan lengkap', included: true },
      { text: 'Export data', included: true },
      { text: 'Struk pake logo sendiri', included: true },
      { text: 'Support prioritas', included: true },
    ],
    cta: 'Daftar Waiting List',
    href: '/register?waitlist=business',
  },
];

// Trust badges data with icons
const trustBadges = [
  { icon: Lock, text: 'Pembayaran Aman' },
  { icon: CreditCard, text: 'Berbagai Metode Bayar' },
  { icon: RefreshCw, text: 'Bisa Upgrade Kapan Saja' },
  { icon: FileX, text: 'Tanpa Kontrak' },
];

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            Harga
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Pilih yang <span className="text-primary">Pas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Untuk produk maupun jasa. Harga sama. Gak ada biaya tersembunyi.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* PRICING CARDS                                        */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col transition-all duration-300',
                plan.popular
                  ? 'border-primary shadow-xl shadow-primary/10'
                  : 'border-border hover:border-primary/50 hover:shadow-lg'
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1 shadow-lg gap-1">
                    {plan.comingSoon ? (
                      <Clock className="h-3 w-3" />
                    ) : null}
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 pt-8">
                {/* Icon */}
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4',
                  plan.popular ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <plan.icon className={cn(
                    'h-7 w-7',
                    plan.popular ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold">{plan.name}</h3>

                {/* Price */}
                <div className="mt-4 mb-2">
                  <div className={cn(
                    'text-4xl font-bold',
                    plan.comingSoon ? 'text-muted-foreground' : 'text-foreground'
                  )}>
                    {plan.price}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {plan.priceNote}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={cn(
                        'flex items-start gap-3 text-sm',
                        !feature.included && 'text-muted-foreground/50',
                        feature.isHeader && 'font-medium text-foreground'
                      )}
                    >
                      {feature.isHeader ? (
                        <span className="text-primary">→</span>
                      ) : feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  asChild={!plan.comingSoon}
                  disabled={plan.comingSoon}
                >
                  {plan.comingSoon ? (
                    <span className="cursor-not-allowed">
                      <Clock className="mr-2 h-4 w-4" />
                      {plan.cta}
                    </span>
                  ) : (
                    <Link href={plan.href}>{plan.cta}</Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* TRUST BADGES (Icons instead of emojis)               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <badge.icon className="h-4 w-4 text-primary" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Punya pertanyaan tentang harga?{' '}
            <Link href="#faq" className="text-primary hover:underline">
              Lihat FAQ
            </Link>{' '}
            atau{' '}
            <Link href="/contact" className="text-primary hover:underline">
              hubungi kami
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
import Link from 'next/link';
import {
  Check,
  X,
  Sparkles,
  Rocket,
  Crown,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

interface PricingFeature {
  text: string;
  included: boolean;
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

const plans: PricingPlan[] = [
  {
    name: 'Gratis',
    icon: Rocket,
    price: 'Rp 0',
    priceNote: 'Selamanya gratis',
    description: 'Cocok untuk memulai bisnis online',
    popular: false,
    comingSoon: false,
    features: [
      { text: 'Toko online dengan subdomain', included: true },
      { text: 'Hingga 50 produk', included: true },
      { text: 'Order via WhatsApp', included: true },
      { text: 'Dashboard dasar', included: true },
      { text: 'Manajemen pelanggan', included: true },
      { text: 'Support via email', included: true },
      { text: 'Branding Fibidy', included: true },
      { text: 'Custom domain', included: false },
      { text: 'Landing page builder', included: false },
      { text: 'Analytics lengkap', included: false },
      { text: 'Hapus branding', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Mulai Gratis',
    href: '/register',
  },
  {
    name: 'Premium',
    icon: Crown,
    price: 'Coming Soon',
    priceNote: 'Segera hadir',
    description: 'Untuk bisnis yang ingin berkembang lebih cepat',
    popular: true,
    comingSoon: true,
    badge: 'Segera Hadir',
    features: [
      { text: 'Semua fitur Gratis', included: true },
      { text: 'Produk unlimited', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Landing page builder', included: true },
      { text: 'Analytics lengkap', included: true },
      { text: 'Hapus branding Fibidy', included: true },
      { text: 'Export data pelanggan', included: true },
      { text: 'Priority support 24/7', included: true },
      { text: 'Multiple admin', included: true },
      { text: 'Integrasi marketplace', included: true },
      { text: 'Laporan keuangan', included: true },
      { text: 'Promo & diskon tools', included: true },
    ],
    cta: 'Daftar Waiting List',
    href: '/register?waitlist=premium',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            💰 Harga
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Mulai <span className="text-primary">Gratis</span>, Upgrade Kapan Saja
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tidak ada biaya tersembunyi. Pakai gratis selamanya atau upgrade untuk fitur lebih lengkap.
          </p>
        </div>

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
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1 shadow-lg gap-1">
                    {plan.comingSoon ? (
                      <Clock className="h-3 w-3" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 pt-8">
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4',
                  plan.popular ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <plan.icon className={cn(
                    'h-7 w-7',
                    plan.popular ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>

                <h3 className="text-2xl font-bold">{plan.name}</h3>

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

                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={cn(
                        'flex items-start gap-3 text-sm',
                        !feature.included && 'text-muted-foreground/50'
                      )}
                    >
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  asChild
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

        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <TrustBadge icon="🔒" text="Pembayaran Aman" />
            <TrustBadge icon="💳" text="Berbagai Metode Bayar" />
            <TrustBadge icon="🔄" text="Bisa Upgrade Kapan Saja" />
            <TrustBadge icon="❌" text="Tanpa Kontrak" />
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

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Store,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Highlighter } from '@/components/ui/highlighter';

const benefits = [
  'Toko online profesional dengan subdomain sendiri',
  'Sistem order terintegrasi WhatsApp',
  'Dashboard untuk kelola produk & pelanggan',
  'Laporan penjualan real-time',
  'Gratis selamanya untuk fitur dasar',
];

const highlights = [
  {
    icon: Store,
    title: 'Toko Instan',
    description: 'Online dalam 5 menit',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Optimal di semua device',
  },
  {
    icon: TrendingUp,
    title: 'Tingkatkan Omzet',
    description: 'Rata-rata naik 200%',
  },
];

export function SolutionSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Solusi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Semua yang Anda Butuhkan{' '}
              <Highlighter>dalam Satu Platform</Highlighter>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Fibidy mengubah cara UMKM berjualan online. Tidak perlu skill teknis,
              tidak perlu modal besar. Cukup 5 menit, toko online profesional Anda
              sudah siap menerima pesanan.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" asChild>
              <Link href="/register">
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 p-6 rounded-xl bg-background border shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
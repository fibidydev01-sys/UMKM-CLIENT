import {
  Store,
  MessageCircle,
  Package,
  Users,
  BarChart3,
  Smartphone,
  Palette,
  Zap,
  Shield,
} from 'lucide-react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { cn } from '@/lib/cn';

const features = [
  {
    Icon: Store,
    name: 'Toko Online Instan',
    description: 'Buat toko online profesional dalam 5 menit. Tanpa coding, tanpa ribet.',
    className: 'md:col-span-2',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />
    ),
  },
  {
    Icon: MessageCircle,
    name: 'Order via WhatsApp',
    description: 'Pelanggan checkout langsung ke WhatsApp dengan detail pesanan lengkap.',
    className: 'md:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
    ),
  },
  {
    Icon: Package,
    name: 'Kelola Produk',
    description: 'Tambah produk unlimited dengan foto, harga, stok, dan kategori.',
    className: 'md:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
    ),
  },
  {
    Icon: Users,
    name: 'Database Pelanggan',
    description: 'Data pelanggan tersimpan otomatis. Mudah follow up untuk promo.',
    className: 'md:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
    ),
  },
  {
    Icon: BarChart3,
    name: 'Laporan & Analytics',
    description: 'Pantau omzet, produk terlaris, dan performa toko dari dashboard.',
    className: 'md:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
    ),
  },
  {
    Icon: Smartphone,
    name: 'Mobile Friendly',
    description: 'Toko Anda tampil sempurna di HP, tablet, dan desktop.',
    className: 'md:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
    ),
  },
  {
    Icon: Palette,
    name: 'Kustomisasi Tampilan',
    description: 'Sesuaikan warna, logo, dan banner sesuai brand Anda.',
    className: 'md:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent" />
    ),
  },
  {
    Icon: Zap,
    name: 'Loading Super Cepat',
    description: 'Optimized performance. Pelanggan tidak kabur karena lemot.',
    className: 'md:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Fitur
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Semua yang Anda Butuhkan untuk{' '}
            <span className="text-primary">Sukses Jualan Online</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fitur lengkap yang dirancang khusus untuk UMKM Indonesia.
            Mudah digunakan, powerful untuk bisnis Anda.
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              Icon={feature.Icon}
              name={feature.name}
              description={feature.description}
              className={feature.className}
              background={feature.background}
              href="#"
              cta="Pelajari"
            />
          ))}
        </BentoGrid>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Dan masih banyak fitur lainnya yang akan terus kami kembangkan!
          </p>
        </div>
      </div>
    </section>
  );
}
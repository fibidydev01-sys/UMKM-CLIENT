// ══════════════════════════════════════════════════════════════
// FEATURES SECTION - V8.1 Copywriting
// 8 Features dengan BentoGrid layout
// ══════════════════════════════════════════════════════════════

import {
  Home,
  FolderOpen,
  Search,
  Bot,
  MessageCircle,
  Receipt,
  Users,
  Settings,
  Ban,
} from 'lucide-react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';

// ══════════════════════════════════════════════════════════════
// DATA - V8.1 Copywriting (8 Features)
// ══════════════════════════════════════════════════════════════

const features = [
  {
    Icon: Home,
    name: 'Alamat Sendiri',
    description: 'Bukan numpang, ini punya kamu. Daftar, langsung dapat: namakamu.fibidy.com. Mau jualan produk? Bisa. Nawarin jasa? Bisa. Dua-duanya? Bisa juga.',
    className: 'md:col-span-2',
    href: '/fitur#alamat',
    cta: 'Pelajari',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
    ),
  },
  {
    Icon: FolderOpen,
    name: '15+ Kategori Bisnis',
    description: 'Fibidy menyesuaikan. Pilih kategori pas daftar. Label-nya otomatis: "Produk" bisa jadi "Menu", "Layanan", "Paket", "Kamar".',
    className: 'md:col-span-1',
    href: '/fitur#kategori',
    cta: 'Pelajari',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
    ),
  },
  {
    Icon: Search,
    name: 'Lebih Gampang Dicari',
    description: 'Google bisa nemuin kamu. Toko di Fibidy dibuat biar Google lebih gampang nemuin. Makin lengkap info produk/layanannya, makin gampang orang nemuin.',
    className: 'md:col-span-1',
    href: '/fitur#seo',
    cta: 'Pelajari',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
    ),
  },
  {
    Icon: Bot,
    name: 'Fibidy AI',
    description: 'Bantuin nulis yang bikin bingung. Deskripsi usaha, caption produk/layanan, pesan follow-up, ide promo. Tinggal ceritain, Fibidy AI kasih pilihan.',
    className: 'md:col-span-1',
    href: '/fitur#ai',
    cta: 'Pelajari',
    isHighlight: true,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-primary/5 to-transparent" />
    ),
  },
  {
    Icon: MessageCircle,
    name: 'Order/Booking WhatsApp',
    description: 'Langsung masuk, familiar. Pelanggan pilih produk/layanan, klik "Pesan", langsung masuk ke WhatsApp kamu. Detailnya udah lengkap.',
    className: 'md:col-span-1',
    href: '/fitur#whatsapp',
    cta: 'Pelajari',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
    ),
  },
  {
    Icon: Receipt,
    name: 'Kasir + Struk',
    description: 'Order rapi, nota profesional. Order masuk? Masukin ke sistem. Generate struk otomatis. Cocok buat orderan banyak, catering, booking service.',
    className: 'md:col-span-1',
    href: '/fitur#kasir',
    cta: 'Pelajari',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
    ),
  },
  {
    Icon: Users,
    name: 'Data Pelanggan/Klien',
    description: 'Inget siapa yang beli/booking apa. Setiap transaksi, datanya kesimpen. Nama, nomor, alamat, history, catetan khusus. Bisa follow-up lebih personal.',
    className: 'md:col-span-1',
    href: '/fitur#pelanggan',
    cta: 'Pelajari',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
    ),
  },
  {
    Icon: Settings,
    name: 'Fitur Sesuai Kategori',
    description: 'Beda bisnis, beda kebutuhan. RETAIL: Stok, Hutang, Kasir. SERVICE: Booking, Tracking, Membership. F&B: Menu, Pre-order, Kasir.',
    className: 'md:col-span-1',
    href: '/fitur#kategori',
    cta: 'Pelajari',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent" />
    ),
  },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* ════════════════════════════════════════════════════ */}
        {/* HEADER                                               */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Fitur
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Semua yang <span className="text-primary">Kamu Butuhin</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Untuk produk maupun jasa. Lengkap.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* BENTO GRID                                           */}
        {/* ════════════════════════════════════════════════════ */}
        <BentoGrid className="max-w-6xl mx-auto">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              Icon={feature.Icon}
              name={feature.name}
              description={feature.description}
              className={feature.className}
              background={feature.background}
              href={feature.href}
              cta={feature.cta}
            />
          ))}
        </BentoGrid>

        {/* ════════════════════════════════════════════════════ */}
        {/* NO ADS BANNER                                        */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-900/50 text-center">
            <Ban className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-bold text-lg mb-2">Tanpa Iklan</h3>
            <p className="text-muted-foreground text-sm">
              Toko kamu bersih. Gak ada iklan nempel.
              <br />
              Pelanggan fokus ke produk/layanan kamu, bukan ke iklan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

// ══════════════════════════════════════════════════════════════
// CATEGORIES SECTION — V13.2
// 41 kategori bahasa Indonesia, tampil 5 dulu + expand semua
// Inline data — no import dari category config
// ══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';
import { ChevronDown } from 'lucide-react';

const categories = [
  // Food & Drink
  { label: 'Restoran', group: 'Makanan & Minuman' },
  { label: 'Kafe & Kedai Kopi', group: 'Makanan & Minuman' },
  { label: 'Bakeri & Toko Kue', group: 'Makanan & Minuman' },
  { label: 'Pesan Antar Makanan', group: 'Makanan & Minuman' },
  { label: 'Catering', group: 'Makanan & Minuman' },
  { label: 'Jajanan & Makanan Kaki Lima', group: 'Makanan & Minuman' },
  // Health & Beauty
  { label: 'Salon Rambut', group: 'Kesehatan & Kecantikan' },
  { label: 'Barbershop', group: 'Kesehatan & Kecantikan' },
  { label: 'Salon Kuku', group: 'Kesehatan & Kecantikan' },
  { label: 'Spa & Pijat', group: 'Kesehatan & Kecantikan' },
  { label: 'Klinik Skincare', group: 'Kesehatan & Kecantikan' },
  { label: 'Apotek', group: 'Kesehatan & Kecantikan' },
  { label: 'Gym & Fitness', group: 'Kesehatan & Kecantikan' },
  // Retail
  { label: 'Fashion & Pakaian', group: 'Retail' },
  { label: 'Sepatu & Alas Kaki', group: 'Retail' },
  { label: 'Elektronik & Gadget', group: 'Retail' },
  { label: 'Sembako & Minimarket', group: 'Retail' },
  { label: 'Kosmetik & Kecantikan', group: 'Retail' },
  { label: 'Perabot & Rumah Tangga', group: 'Retail' },
  // Home Services
  { label: 'Jasa Kebersihan', group: 'Layanan Rumah' },
  { label: 'Tukang Ledeng & Sanitasi', group: 'Layanan Rumah' },
  { label: 'Instalasi Listrik', group: 'Layanan Rumah' },
  { label: 'Service AC & Elektronik', group: 'Layanan Rumah' },
  { label: 'Taman & Landscaping', group: 'Layanan Rumah' },
  { label: 'Jasa Pindahan', group: 'Layanan Rumah' },
  { label: 'Desain Interior', group: 'Layanan Rumah' },
  // Automotive
  { label: 'Bengkel Mobil', group: 'Otomotif' },
  { label: 'Bengkel Motor', group: 'Otomotif' },
  { label: 'Cuci Mobil & Detailing', group: 'Otomotif' },
  { label: 'Toko Spare Part', group: 'Otomotif' },
  // Lifestyle
  { label: 'Agen Perjalanan', group: 'Gaya Hidup' },
  { label: 'Hotel & Penginapan', group: 'Gaya Hidup' },
  { label: 'Fotografi & Videografi', group: 'Gaya Hidup' },
  { label: 'Venue & Gedung Acara', group: 'Gaya Hidup' },
  { label: 'Les & Kursus', group: 'Gaya Hidup' },
  // Professional
  { label: 'Laundry', group: 'Jasa Profesional' },
  { label: 'Penjahit & Konveksi', group: 'Jasa Profesional' },
  { label: 'Pet Shop', group: 'Jasa Profesional' },
  { label: 'Grooming Hewan', group: 'Jasa Profesional' },
  { label: 'Percetakan & Sablon', group: 'Jasa Profesional' },
  { label: 'Kost & Sewa Properti', group: 'Jasa Profesional' },
];

const PREVIEW_COUNT = 5;

export function CategoriesSection() {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? categories : categories.slice(0, PREVIEW_COUNT);

  return (
    <section id="kategori" className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Kategori
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-3">
              41 kategori bisnis.
            </h2>
            <p className="text-muted-foreground text-lg">
              Produk, jasa, atau dua-duanya.
            </p>
          </div>

          <Separator className="bg-border/60" />

          {/* Category list */}
          <div>
            {visible.map((cat, index) => (
              <div key={cat.label}>
                <div className="flex items-center justify-between py-4 md:py-5 group cursor-default">
                  {/* Number + Label */}
                  <div className="flex items-center gap-6">
                    <span className="text-[11px] font-medium tabular-nums text-muted-foreground/40 w-6 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {cat.label}
                    </span>
                  </div>
                  {/* Group tag */}
                  <span className="hidden md:block text-xs text-muted-foreground/50 shrink-0">
                    {cat.group}
                  </span>
                </div>
                {/* Separator hanya kalau bukan item terakhir visible */}
                {index < visible.length - 1 && (
                  <Separator className="bg-border/40" />
                )}
              </div>
            ))}
          </div>

          {/* Selengkapnya / Sembunyikan */}
          <Separator className="bg-border/60" />
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'w-full flex items-center justify-between py-5 group',
              'text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300'
            )}
          >
            <span>
              {expanded
                ? 'Sembunyikan'
                : `Selengkapnya — ${categories.length - PREVIEW_COUNT} kategori lainnya`
              }
            </span>
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-300',
              expanded ? 'rotate-180' : 'rotate-0'
            )} />
          </button>
          <Separator className="bg-border/60" />

          {/* Closing */}
          <div className="pt-10">
            <p className="text-lg text-muted-foreground">
              Gak nemu kategori kamu?{' '}
              <span className="text-foreground font-semibold">
                Ada opsi &quot;Lainnya&quot;.
              </span>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
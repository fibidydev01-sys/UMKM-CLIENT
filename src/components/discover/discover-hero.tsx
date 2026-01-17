// ══════════════════════════════════════════════════════════════
// DISCOVER HERO - V10.8 FINAL
// Feature: Tabs filter Popular tags (4 categories per type)
// ══════════════════════════════════════════════════════════════

'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Store,
  Package,
  Wrench,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiscoverSearch } from './discover-search';
import { cn } from '@/lib/cn';
import { CATEGORY_CONFIG } from '@/config/categories';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type TabType = 'umkm' | 'produk' | 'jasa';

interface DiscoverHeroProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string | null) => void;
  onTabChange?: (tab: TabType) => void;
  searchQuery?: string;
  activeTab?: TabType;
}

// ══════════════════════════════════════════════════════════════
// DATA - Category mapping by type (4 each)
// ══════════════════════════════════════════════════════════════

const tabs = [
  { id: 'umkm' as TabType, label: 'UMKM', icon: Store, description: 'Toko & Usaha' },
  { id: 'produk' as TabType, label: 'Produk', icon: Package, description: 'Barang & Item' },
  { id: 'jasa' as TabType, label: 'Jasa', icon: Wrench, description: 'Layanan & Service' },
];

// Mapping kategori berdasarkan tipe (4 per tipe)
const CATEGORIES_BY_TYPE: Record<TabType, string[]> = {
  // UMKM - Toko & Usaha fisik
  umkm: [
    'WARUNG_KELONTONG',  // Warung
    'TOKO_BANGUNAN',     // Bangunan
    'KEDAI_KOPI',        // Kopi
    'APOTEK',            // Apotek
  ],
  // Produk - Barang yang dijual
  produk: [
    'TOKO_KUE',          // Kue
    'PETSHOP',           // Pet
    'PERCETAKAN',        // Print
    'TOKO_BANGUNAN',     // Bangunan (material)
  ],
  // Jasa - Layanan & Service
  jasa: [
    'BENGKEL_MOTOR',     // Bengkel
    'SALON_BARBERSHOP',  // Salon
    'LAUNDRY',           // Laundry
    'CATERING',          // Catering
  ],
};

// Placeholder text per tab
const SEARCH_PLACEHOLDERS: Record<TabType, string> = {
  umkm: 'Cari warung, toko, kedai...',
  produk: 'Cari makanan, kue, produk...',
  jasa: 'Cari bengkel, salon, laundry...',
};

function categoryKeyToSlug(key: string): string {
  return key.toLowerCase().replace(/_/g, '-');
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function DiscoverHero({
  onSearch,
  onTabChange,
  searchQuery = '',
  activeTab = 'umkm',
}: DiscoverHeroProps) {

  // Get categories based on active tab
  const popularCategories = useMemo(() => {
    return CATEGORIES_BY_TYPE[activeTab] || CATEGORIES_BY_TYPE.umkm;
  }, [activeTab]);

  const handleTabClick = useCallback((tabId: TabType) => {
    onTabChange?.(tabId);
  }, [onTabChange]);

  return (
    <section className="relative pt-20 pb-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] opacity-50 pointer-events-none hidden lg:block -z-10">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-pink-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Discover
              <br />
              <span className="text-primary">UMKM Lokal</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Temukan berbagai usaha lokal Indonesia. Warung, salon, bengkel,
              dan ribuan UMKM lainnya.
            </p>

            {/* ══════════════════════════════════════════════════ */}
            {/* TABS - Click to filter categories                  */}
            {/* ══════════════════════════════════════════════════ */}
            <div className="flex items-center gap-2 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-foreground text-background shadow-lg'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div id="hero-search" className="mb-4 relative z-40">
              <DiscoverSearch
                size="hero"
                placeholder={SEARCH_PLACEHOLDERS[activeTab]}
                defaultValue={searchQuery}
                onSearch={onSearch}
                showSuggestions={true}
              />
            </div>

            {/* ══════════════════════════════════════════════════ */}
            {/* POPULAR TAGS - Dynamic based on active tab (4)     */}
            {/* ══════════════════════════════════════════════════ */}
            <div className="flex flex-wrap items-center gap-2 relative z-10">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {popularCategories.map((catKey) => {
                const category = CATEGORY_CONFIG[catKey];
                if (!category) return null;
                return (
                  <Link
                    key={catKey}
                    href={`/discover/${categoryKeyToSlug(catKey)}`}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full border',
                      'bg-background hover:bg-muted hover:border-primary/50',
                      'transition-colors duration-200',
                      'flex items-center gap-1.5'
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.labelShort}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT CONTENT - SHOWCASE */}
          <div className="hidden lg:block relative z-0">
            <div className="relative aspect-square max-w-md ml-auto">
              {/* Showcase Cards Preview */}
              <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4">
                {/* Card 1 */}
                <div className="bg-background rounded-2xl shadow-xl border overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center">
                    <Store className="h-8 w-8 text-primary/50" />
                  </div>
                  <div className="p-3">
                    <div className="h-2 w-20 bg-muted rounded mb-2" />
                    <div className="h-2 w-14 bg-muted/60 rounded" />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-background rounded-2xl shadow-xl border overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Package className="h-8 w-8 text-blue-500/50" />
                  </div>
                  <div className="p-3">
                    <div className="h-2 w-16 bg-muted rounded mb-2" />
                    <div className="h-2 w-12 bg-muted/60 rounded" />
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-background rounded-2xl shadow-xl border overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-orange-500/50" />
                  </div>
                  <div className="p-3">
                    <div className="h-2 w-18 bg-muted rounded mb-2" />
                    <div className="h-2 w-10 bg-muted/60 rounded" />
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-background rounded-2xl shadow-xl border overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300 mt-4">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Store className="h-8 w-8 text-green-500/50" />
                  </div>
                  <div className="p-3">
                    <div className="h-2 w-14 bg-muted rounded mb-2" />
                    <div className="h-2 w-16 bg-muted/60 rounded" />
                  </div>
                </div>
              </div>

              {/* Badge overlay */}
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full px-4 py-2 shadow-lg border flex items-center gap-2 z-[5]">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Discover</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-muted/80 to-muted/40 border flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">
                <Badge variant="secondary" className="mr-2 text-xs">BARU</Badge>
                Punya UMKM?
              </p>
              <p className="text-sm text-muted-foreground">
                Daftarkan usahamu dan tampil di sini. Gratis!
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0 rounded-full gap-1">
            <Link href="/register">
              Buat Toko
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
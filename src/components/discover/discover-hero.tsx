// ══════════════════════════════════════════════════════════════
// DISCOVER HERO - V17.0 (DropdownMenu + No Icons)
// Changed: Using DropdownMenu with modal={false} to prevent scroll lock
// Changed: z-index lower than header
// Changed: Max 3 categories
// ══════════════════════════════════════════════════════════════

'use client';

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Store,
  Package,
  Wrench,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiscoverSearch } from './discover-search';
import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, CATEGORY_GROUPS, getCategoriesByGroup } from '@/config/categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type TabType = 'KULINER' | 'RUMAH_TAMAN' | 'OTOMOTIF' | 'KESEHATAN_KECANTIKAN' | 'TRAVEL_HIBURAN' | 'BELANJA' | 'LAINNYA';

interface DiscoverHeroProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string | null) => void;
  onTabChange?: (tab: TabType) => void;
  searchQuery?: string;
  activeTab?: TabType;
}

// ══════════════════════════════════════════════════════════════
// DATA - 7 Category Groups
// ══════════════════════════════════════════════════════════════

// Convert CATEGORY_GROUPS to tabs format
const tabs = Object.values(CATEGORY_GROUPS).map(group => ({
  id: group.key as TabType,
  label: group.label,
  emoji: group.emoji,
  icon: group.icon,
  color: group.color,
}));

// Get top 3 categories per group for popular section
function getPopularCategoriesForGroup(groupKey: string): string[] {
  const categories = getCategoriesByGroup(groupKey);
  return categories.slice(0, 3).map(cat => cat.key);
}

// Placeholder text per group
const SEARCH_PLACEHOLDERS: Record<TabType, string> = {
  KULINER: 'Cari restoran, warung, cafe...',
  RUMAH_TAMAN: 'Cari kontraktor, tukang, cleaning...',
  OTOMOTIF: 'Cari bengkel, cuci mobil, dealer...',
  KESEHATAN_KECANTIKAN: 'Cari salon, barbershop, spa...',
  TRAVEL_HIBURAN: 'Cari wisata, hotel, venue...',
  BELANJA: 'Cari fashion, gadget, kelontong...',
  LAINNYA: 'Cari laundry, petshop, kursus...',
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
  activeTab = 'KULINER',
}: DiscoverHeroProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Get top 3 categories for the active group
  const popularCategories = useMemo(() => {
    return getPopularCategoriesForGroup(activeTab);
  }, [activeTab]);

  const handleTabClick = useCallback((tabId: TabType) => {
    onTabChange?.(tabId);
  }, [onTabChange]);

  // Check scroll arrows visibility
  const checkScrollArrows = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScrollArrows();
    container.addEventListener('scroll', checkScrollArrows, { passive: true });
    window.addEventListener('resize', checkScrollArrows);
    return () => {
      container.removeEventListener('scroll', checkScrollArrows);
      window.removeEventListener('resize', checkScrollArrows);
    };
  }, [checkScrollArrows, activeTab]);

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: -150, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
  }, []);

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
            {/* DROPDOWN - DropdownMenu with modal={false}         */}
            {/* z-30: Lower than header (z-50)                     */}
            {/* ══════════════════════════════════════════════════ */}
            <div className="mb-6 relative z-30">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 bg-background border-2 rounded-full px-4 py-2 font-medium shadow-sm hover:shadow-md transition-shadow">
                    {tabs.find(t => t.id === activeTab)?.label}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-xl border-2 shadow-xl min-w-[180px]">
                  {tabs.map((tab) => (
                    <DropdownMenuItem
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className="cursor-pointer rounded-lg flex items-center justify-between"
                    >
                      {tab.label}
                      {activeTab === tab.id && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
            {/* POPULAR TAGS - No Icons, Gradient Arrows           */}
            {/* Max 3 categories per group                          */}
            {/* ══════════════════════════════════════════════════ */}
            <div className="relative flex items-center min-w-0">
              {showLeftArrow && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 z-10 h-8 w-8 flex items-center justify-center bg-gradient-to-r from-background via-background to-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}

              <div
                ref={scrollContainerRef}
                className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-1"
              >
                {popularCategories.map((catKey) => {
                  const category = CATEGORY_CONFIG[catKey];
                  if (!category) return null;
                  return (
                    <Link
                      key={catKey}
                      href={`/discover/${categoryKeyToSlug(catKey)}`}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200',
                        'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {category.labelShort}
                    </Link>
                  );
                })}
              </div>

              {showRightArrow && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 z-10 h-8 w-8 flex items-center justify-center bg-gradient-to-l from-background via-background to-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
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
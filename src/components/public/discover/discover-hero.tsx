// ══════════════════════════════════════════════════════════════
// DISCOVER HERO - V18.4
// Changed: Hamburger + Search ditaruh di tengah
// ══════════════════════════════════════════════════════════════

'use client';

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, Menu } from 'lucide-react';
import { DiscoverSearch } from './discover-search';
import { cn } from '@/lib';
import { CATEGORY_CONFIG, CATEGORY_GROUPS, getCategoriesByGroup } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TabType = 'KULINER' | 'RUMAH_TAMAN' | 'OTOMOTIF' | 'KESEHATAN_KECANTIKAN' | 'TRAVEL_HIBURAN' | 'BELANJA' | 'LAINNYA';

interface DiscoverHeroProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string | null) => void;
  onTabChange?: (tab: TabType) => void;
  searchQuery?: string;
  activeTab?: TabType;
}

const tabs = Object.values(CATEGORY_GROUPS).map(group => ({
  id: group.key as TabType,
  label: group.label,
}));

function getPopularCategoriesForGroup(groupKey: string): string[] {
  return getCategoriesByGroup(groupKey).slice(0, 3).map(cat => cat.key);
}

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

export function DiscoverHero({
  onSearch,
  onTabChange,
  searchQuery = '',
  activeTab = 'KULINER',
}: DiscoverHeroProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const popularCategories = useMemo(() => getPopularCategoriesForGroup(activeTab), [activeTab]);

  const handleTabClick = useCallback((tabId: TabType) => {
    onTabChange?.(tabId);
  }, [onTabChange]);

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

      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">

          {/* Search Bar + Hamburger — centered */}
          <div id="hero-search" className="mb-4 relative z-40 flex items-center gap-2">
            <div className="flex-1">
              <DiscoverSearch
                size="hero"
                placeholder={SEARCH_PLACEHOLDERS[activeTab]}
                defaultValue={searchQuery}
                onSearch={onSearch}
                showSuggestions={true}
              />
            </div>

            {/* Hamburger Dropdown */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center bg-background border-2 rounded-full p-3 shadow-sm hover:shadow-md transition-shadow shrink-0">
                  <Menu className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-2 shadow-xl min-w-[180px]">
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

          {/* Popular Tags */}
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
      </div>
    </section>
  );
}
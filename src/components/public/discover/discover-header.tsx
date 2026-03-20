// ══════════════════════════════════════════════════════════════
// DISCOVER HEADER - V11.4
// Removed: Logo, Fibidy, Masuk, Buat Toko, Mobile Sheet
// Kept: Search bar only (always visible, outside any sheet)
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { DiscoverSearch } from './discover-search';
import { cn } from '@/lib';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface DiscoverHeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  heroSearchId?: string;
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function DiscoverHeader({
  onSearch,
  searchQuery = '',
  heroSearchId = 'hero-search',
}: DiscoverHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);

  const showHeaderSearch = isScrolled && !heroSearchVisible;

  // ════════════════════════════════════════════════════════════
  // INTERSECTION OBSERVER
  // ════════════════════════════════════════════════════════════

  useEffect(() => {
    const heroSearchElement = document.getElementById(heroSearchId);

    if (!heroSearchElement) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroSearchVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setHeroSearchVisible(entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px',
      }
    );

    observer.observe(heroSearchElement);

    return () => {
      observer.disconnect();
    };
  }, [heroSearchId]);

  // ════════════════════════════════════════════════════════════
  // SCROLL DETECTION
  // ════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 transition-all duration-300',
        'z-50',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-sm border-b h-16'
          : 'bg-background/80 backdrop-blur-sm h-16'
      )}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-center h-full">

          {/* ══════════════════════════════════════════════════ */}
          {/* SEARCH BAR                                         */}
          {/* Only visible when hero search is OUT OF VIEW       */}
          {/* ══════════════════════════════════════════════════ */}
          <div
            className={cn(
              'w-full max-w-lg transition-all duration-300',
              showHeaderSearch
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            )}
          >
            <DiscoverSearch
              size="default"
              placeholder="Cari UMKM..."
              defaultValue={searchQuery}
              onSearch={onSearch}
              showSuggestions={true}
            />
          </div>

        </div>
      </div>
    </header>
  );
}
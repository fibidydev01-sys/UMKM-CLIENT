// ══════════════════════════════════════════════════════════════
// DISCOVER HEADER - V11.1 (Cleaned & Refactored)
// Removed: Explore and Lainnya navigation dropdowns
// Simplified: Mobile menu to only show search and CTA buttons
// Fixed: Search appears when hero search hidden OR on pages without hero
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DiscoverSearch } from './discover-search';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface DiscoverHeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  /**
   * ID of the hero search element to observe
   * Header search will only show when this element is NOT visible
   */
  heroSearchId?: string;
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function DiscoverHeader({
  onSearch,
  searchQuery = '',
  heroSearchId = 'hero-search', // Default ID to look for
}: DiscoverHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Header search should ONLY show when:
  // 1. User has scrolled (for styling)
  // 2. Hero search is NOT visible (completely out of viewport)
  const showHeaderSearch = isScrolled && !heroSearchVisible;

  // ════════════════════════════════════════════════════════════
  // INTERSECTION OBSERVER - Detect when hero search is visible
  // ════════════════════════════════════════════════════════════

  useEffect(() => {
    // Find the hero search element
    const heroSearchElement = document.getElementById(heroSearchId);

    if (!heroSearchElement) {
      // If no hero search found (e.g., category pages), show header search
      setHeroSearchVisible(false);
      return;
    }

    // Create observer that triggers when element leaves viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hero search is visible if ANY part is in viewport
          // Header search shows when hero is COMPLETELY out of view
          setHeroSearchVisible(entry.isIntersecting);
        });
      },
      {
        // Root is viewport
        root: null,
        // Trigger when element starts to leave (0 = any part visible)
        threshold: 0,
        // Account for fixed header height (64px)
        rootMargin: '-64px 0px 0px 0px',
      }
    );

    observer.observe(heroSearchElement);

    return () => {
      observer.disconnect();
    };
  }, [heroSearchId]);

  // ════════════════════════════════════════════════════════════
  // SCROLL DETECTION (for header background styling)
  // ════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Set initial value
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
        <div className="flex items-center justify-between h-full gap-4">
          {/* ══════════════════════════════════════════════════ */}
          {/* LOGO                                               */}
          {/* ══════════════════════════════════════════════════ */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span
              className={cn(
                'font-bold text-xl transition-all duration-300',
                showHeaderSearch ? 'hidden lg:block' : 'block'
              )}
            >
              Fibidy
            </span>
          </Link>

          {/* ══════════════════════════════════════════════════ */}
          {/* SEARCH BAR                                         */}
          {/* Only visible when hero search is OUT OF VIEW       */}
          {/* ══════════════════════════════════════════════════ */}
          <div
            className={cn(
              'flex-1 max-w-md transition-all duration-300 hidden md:block',
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

          {/* ══════════════════════════════════════════════════ */}
          {/* DESKTOP NAVIGATION                                 */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Navigation Menu removed - cleaned up */}

          {/* ══════════════════════════════════════════════════ */}
          {/* CTA BUTTONS                                        */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full px-4">
              <Link href="/register">Buat Toko</Link>
            </Button>
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* MOBILE MENU                                        */}
          {/* ══════════════════════════════════════════════════ */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>

              {/* Mobile Logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Fibidy</span>
              </div>

              {/* Mobile Search */}
              <div className="mb-6">
                <DiscoverSearch
                  size="default"
                  placeholder="Cari UMKM..."
                  defaultValue={searchQuery}
                  onSearch={(q) => {
                    onSearch?.(q);
                    setIsOpen(false);
                  }}
                  showSuggestions={false}
                />
              </div>

              {/* Mobile CTA */}
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Buat Toko
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
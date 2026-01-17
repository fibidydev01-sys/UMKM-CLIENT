// ══════════════════════════════════════════════════════════════
// DISCOVER HEADER - V10.3
// Fixed: Search ONLY appears when hero search is completely hidden
// Uses IntersectionObserver for accurate detection
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { DiscoverSearch } from './discover-search';
import { cn } from '@/lib/cn';
import { getCategoryList } from '@/config/categories';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface DiscoverHeaderProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string | null) => void;
  searchQuery?: string;
  selectedCategory?: string | null;
  /** 
   * ID of the hero search element to observe
   * Header search will only show when this element is NOT visible
   */
  heroSearchId?: string;
}

// ══════════════════════════════════════════════════════════════
// STATIC NAV DATA
// ══════════════════════════════════════════════════════════════

const moreItems = [
  { label: 'Tentang', href: '/about', description: 'Pelajari lebih lanjut tentang Fibidy' },
  { label: 'Fitur', href: '/fitur', description: 'Semua fitur untuk produk & jasa' },
  { label: 'Cara Kerja', href: '/cara-kerja', description: 'Gampang banget, 5 menit jadi' },
  { label: 'Harga', href: '/harga', description: 'Mulai dari Rp 0, tanpa biaya tersembunyi' },
];

const quickLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontak', href: '/contact' },
  { label: 'Privasi', href: '/privacy' },
];

function categoryKeyToSlug(key: string): string {
  return key.toLowerCase().replace(/_/g, '-');
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function DiscoverHeader({
  onSearch,
  onCategorySelect,
  searchQuery = '',
  selectedCategory = null,
  heroSearchId = 'hero-search', // Default ID to look for
}: DiscoverHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const categories = getCategoryList();

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
      // If no hero search element found, observer callback will handle state
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

  // ════════════════════════════════════════════════════════════
  // HANDLERS
  // ════════════════════════════════════════════════════════════

  const handleCategorySelect = useCallback(
    (categoryKey: string | null) => {
      onCategorySelect?.(categoryKey);
      if (categoryKey) {
        router.push(`/discover/${categoryKeyToSlug(categoryKey)}`, { scroll: false });
      } else {
        router.push('/discover', { scroll: false });
      }
    },
    [onCategorySelect, router]
  );

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
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* EXPLORE DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] lg:w-[600px] p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Kategori UMKM
                      </h3>
                      <Link
                        href="/discover"
                        className="text-xs text-primary hover:underline"
                      >
                        Lihat Semua
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {categories.slice(0, 12).map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <NavigationMenuLink asChild key={cat.key}>
                            <Link
                              href={`/discover/${categoryKeyToSlug(cat.key)}`}
                              className={cn(
                                'flex items-center gap-3 p-3 rounded-lg',
                                'hover:bg-accent transition-colors',
                                'group'
                              )}
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                                style={{ backgroundColor: `${cat.color}15` }}
                              >
                                <Icon
                                  className="h-4 w-4"
                                  style={{ color: cat.color }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {cat.labelShort}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        );
                      })}
                    </div>

                    {categories.length > 12 && (
                      <div className="mt-4 pt-4 border-t text-center">
                        <Link
                          href="/discover"
                          className="text-sm text-primary hover:underline"
                        >
                          +{categories.length - 12} kategori lainnya
                        </Link>
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* LAINNYA DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Lainnya</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <div className="grid gap-2">
                      {moreItems.map((item) => (
                        <NavigationMenuLink asChild key={item.href}>
                          <Link
                            href={item.href}
                            className="block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
                      {quickLinks.map((link) => (
                        <NavigationMenuLink asChild key={link.href}>
                          <Link
                            href={link.href}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

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

              <nav className="flex flex-col gap-1">
                {/* Kategori Section */}
                <p className="text-sm font-semibold text-muted-foreground mb-2 px-3">
                  Explore Kategori
                </p>

                {/* All Categories */}
                <button
                  onClick={() => {
                    handleCategorySelect(null);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors',
                    !selectedCategory
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-accent'
                  )}
                >
                  <Store className="h-4 w-4" />
                  <span>Semua Kategori</span>
                </button>

                {/* Category List */}
                <div className="max-h-64 overflow-y-auto space-y-0.5 mt-1">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          handleCategorySelect(cat.key);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left transition-colors',
                          selectedCategory === cat.key
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-accent'
                        )}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0"
                          style={{ color: cat.color }}
                        />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Lainnya Section */}
                <div className="border-t my-4" />
                <p className="text-sm font-semibold text-muted-foreground mb-2 px-3">
                  Lainnya
                </p>
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile CTA */}
                <div className="flex flex-col gap-2 mt-6 pt-4 border-t">
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
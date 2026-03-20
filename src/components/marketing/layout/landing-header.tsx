'use client';

// ══════════════════════════════════════════════════════════════
// LANDING HEADER — V13.1 Revised
// Desktop: nav kiri | CTA kanan
// Mobile: hamburger kiri | Masuk kanan
// No brand/logo text
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib';

const navItems = [
  { label: 'Jelajahi', href: '/discover' },
  { label: 'Tentang', href: '/about' },
  { label: 'Fitur', href: '/features' },
  { label: 'Cara Kerja', href: '/how-it-works' },
  { label: 'Harga', href: '/pricing' },
  { label: 'Profil', href: '/profile' },
];

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* DESKTOP — Nav kiri */}
          <NavigationMenu className="hidden md:flex" delayDuration={0}>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-sm font-medium text-foreground/70 hover:text-foreground bg-transparent hover:bg-transparent focus:bg-transparent transition-colors'
                    )}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* MOBILE — Hamburger kiri */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-border">
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <div className="flex flex-col gap-1 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button asChild className="w-full h-10">
                      <Link href="/register" onClick={() => setIsOpen(false)}>Daftar</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* DESKTOP — CTA kanan */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-sm font-medium text-foreground/70 hover:text-foreground"
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild size="sm" className="h-9 px-5 text-sm font-semibold">
              <Link href="/register">Daftar</Link>
            </Button>
          </div>

          {/* MOBILE — Masuk kanan */}
          <Button
            variant="ghost"
            asChild
            className="md:hidden text-sm font-semibold text-foreground/80 hover:text-foreground h-9 px-3"
          >
            <Link href="/login">Masuk</Link>
          </Button>

        </div>
      </div>
    </header>
  );
}
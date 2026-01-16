'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/cn';

// ══════════════════════════════════════════════════════════════
// NAVIGATION DATA - V8.1 Copywriting (UPDATED)
// ══════════════════════════════════════════════════════════════

const features = [
  {
    title: 'Alamat Sendiri',
    href: '/fitur#alamat',
    description: 'namakamu.fibidy.com bukan numpang, ini punya kamu.',
  },
  {
    title: 'Fibidy AI',
    href: '/fitur#ai',
    description: 'Bantuin nulis deskripsi, caption, promo.',
  },
  {
    title: 'Order/Booking WhatsApp',
    href: '/fitur#whatsapp',
    description: 'Langsung masuk ke WhatsApp, familiar.',
  },
  {
    title: '15+ Kategori',
    href: '/fitur#kategori',
    description: 'Produk, jasa, atau dua-duanya.',
  },
];

// UPDATED: Tambah About
const navItems = [
  { label: 'Tentang', href: '/about' },
  { label: 'Fitur', href: '/fitur' },
  { label: 'Cara Kerja', href: '/cara-kerja' },
  { label: 'Harga', href: '/harga' },
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg shadow-sm border-b'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* ════════════════════════════════════════════════════ */}
          {/* LOGO                                                 */}
          {/* ════════════════════════════════════════════════════ */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Fibidy</span>
          </Link>

          {/* ════════════════════════════════════════════════════ */}
          {/* DESKTOP NAVIGATION - HOVER ENABLED                   */}
          {/* ════════════════════════════════════════════════════ */}
          <NavigationMenu className="hidden md:flex" delayDuration={0}>
            <NavigationMenuList>
              {/* About Link (NEW) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/about">Tentang</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Fitur Dropdown - Opens on Hover */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="data-[state=open]:bg-accent/50">
                  Fitur
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {features.map((feature) => (
                      <li key={feature.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={feature.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {feature.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {feature.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Cara Kerja */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/cara-kerja">Cara Kerja</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Harga */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/harga">Harga</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* ════════════════════════════════════════════════════ */}
          {/* DESKTOP CTA                                          */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Buat Toko</Link>
            </Button>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/* MOBILE MENU                                          */}
          {/* ════════════════════════════════════════════════════ */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>

              {/* Mobile Logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Fibidy</span>
              </div>

              <nav className="flex flex-col gap-2">
                {/* Main Nav Links */}
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Fitur Section */}
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm font-semibold text-muted-foreground mb-2 px-3">
                    Fitur Unggulan
                  </p>
                  {features.map((feature) => (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                    >
                      {feature.title}
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
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
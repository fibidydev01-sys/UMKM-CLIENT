'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, Menu, ChevronDown } from 'lucide-react';
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

const features = [
  {
    title: 'Toko Online Instan',
    href: '#features',
    description: 'Buat toko online profesional dalam 5 menit tanpa coding.',
  },
  {
    title: 'Order via WhatsApp',
    href: '#features',
    description: 'Terima pesanan langsung ke WhatsApp dengan detail lengkap.',
  },
  {
    title: 'Kelola Produk',
    href: '#features',
    description: 'Tambah produk unlimited dengan foto, harga, dan kategori.',
  },
  {
    title: 'Dashboard Analytics',
    href: '#features',
    description: 'Pantau omzet dan performa toko dari dashboard.',
  },
];

const navItems = [
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Harga', href: '#pricing' },
  { label: 'Testimoni', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

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

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Fibidy</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Fitur</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {features.map((feature) => (
                      <li key={feature.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={feature.href}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection(feature.href);
                            }}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {feature.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {feature.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Daftar Gratis</Link>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <div className="flex items-center gap-2 mb-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Fibidy</span>
              </div>
              <nav className="flex flex-col gap-2">
                <div className="mb-2">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Fitur</p>
                  {features.map((feature) => (
                    <button
                      key={feature.title}
                      onClick={() => scrollToSection(feature.href)}
                      className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                    >
                      {feature.title}
                    </button>
                  ))}
                </div>
                <div className="border-t pt-4">
                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className="block w-full text-left px-3 py-3 rounded-md font-medium hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register">Daftar Gratis</Link>
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
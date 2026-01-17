'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from './cart-sheet';
import { useStoreUrls } from '@/lib/store-url';
import { cn } from '@/lib/cn';
import type { PublicTenant } from '@/types';

// ==========================================
// STORE HEADER
// ==========================================

interface StoreHeaderProps {
  tenant: PublicTenant;
}

export function StoreHeader({ tenant }: StoreHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const urls = useStoreUrls(tenant.slug);

  // ✅ FIX: No type annotation
  const landingConfig = tenant.landingConfig;

  // Check what data exists
  const hasAbout = !!landingConfig?.about?.config?.content || !!tenant.description;
  const hasContact = !!tenant.address || !!tenant.whatsapp || !!tenant.phone;

  // ✅ FIX: Stable check without calling normalizeTestimonials (avoids Date.now/Math.random hydration issue)
  const hasTestimonials = useMemo(() => {
    const items = landingConfig?.testimonials?.config?.items;
    if (!items || !Array.isArray(items)) return false;
    // Check if any valid testimonials exist (without normalizing IDs)
    return items.some(
      (item: any) =>
        item &&
        typeof item === 'object' &&
        typeof item.name === 'string' &&
        item.name.trim() !== '' &&
        typeof item.content === 'string' &&
        item.content.trim() !== ''
    );
  }, [landingConfig?.testimonials?.config?.items]);

  // Build nav items
  const navItems = [
    { label: 'Beranda', href: urls.home, show: true },
    { label: 'Tentang', href: urls.path('/about'), show: hasAbout },
    { label: 'Produk', href: urls.products(), show: true },
    { label: 'Testimoni', href: urls.path('/testimonials'), show: hasTestimonials },
    { label: 'Kontak', href: urls.path('/contact'), show: hasContact },
  ].filter(item => item.show);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={urls.home} className="flex items-center gap-3">
          {tenant.logo ? (
            <Image
              src={tenant.logo}
              alt={tenant.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {tenant.name.charAt(0)}
              </span>
            </div>
          )}
          <span className="font-semibold text-lg hidden sm:block">
            {tenant.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== urls.home && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* ✅ FIX: CartSheet without props (check your actual component) */}
          <CartSheet tenant={tenant} />

          {/* WhatsApp Button - Desktop */}
          {tenant.whatsapp && (
            <Button asChild size="sm" className="hidden sm:flex">
              <a
                href={`https://wa.me/${tenant.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== urls.home && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 text-base font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* WhatsApp - Mobile */}
                {tenant.whatsapp && (
                  <a
                    href={`https://wa.me/${tenant.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-4 py-3 bg-green-500 text-white text-center font-medium rounded-lg"
                  >
                    Hubungi via WhatsApp
                  </a>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
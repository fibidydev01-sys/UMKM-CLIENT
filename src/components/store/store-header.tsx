'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Store, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { CartSheet } from './cart-sheet';
import { useStoreUrls } from '@/lib/store-url';
import { cn } from '@/lib/utils';
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

  const navItems = [
    { label: 'Beranda', href: urls.home },
    { label: 'Tentang', href: urls.path('/about') },
    { label: 'Produk', href: urls.products() },
    { label: 'Lacak Pesanan', href: urls.path('/track') },
    { label: 'Testimoni', href: urls.path('/testimonials') },
    { label: 'Kontak', href: urls.path('/contact') },
  ];

  const contactInfo = [
    { label: 'WhatsApp', value: tenant.whatsapp, type: 'whatsapp' as const },
    { label: 'Telepon', value: tenant.phone, type: 'phone' as const },
    { label: 'Email', value: 'email' in tenant ? tenant.email : undefined, type: 'email' as const },
    { label: 'Alamat', value: tenant.address, type: 'address' as const },
  ].filter(item => item.value);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
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

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {/* BERANDA - DENGAN DROPDOWN */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  pathname === urls.home && 'bg-primary/10 text-primary'
                )}
              >
                Beranda
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href={urls.home}
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-4 no-underline outline-none transition-colors select-none hover:bg-accent focus:shadow-md md:p-6"
                      >
                        {tenant.logo ? (
                          <Image
                            src={tenant.logo}
                            alt={tenant.name}
                            width={60}
                            height={60}
                            className="rounded-full object-cover mb-2"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <span className="text-2xl font-bold text-primary">
                              {tenant.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="mb-2 text-lg font-medium sm:mt-4">
                          {tenant.name}
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          {tenant.tagline || 'Selamat datang di toko kami'}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href={urls.path('/about')} title="Tentang Kami" icon={<Users className="h-4 w-4" />}>
                    Kenali lebih dalam tentang bisnis kami
                  </ListItem>
                  <ListItem href={urls.path('/testimonials')} title="Testimoni" icon={<Store className="h-4 w-4" />}>
                    Lihat testimoni pelanggan kami
                  </ListItem>
                  <ListItem href={urls.path('/contact')} title="Hubungi Kami" icon={<Mail className="h-4 w-4" />}>
                    Kontak dan informasi lokasi
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* PRODUK */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname.startsWith(urls.products()) && 'bg-primary/10 text-primary'
                )}
              >
                <Link href={urls.products()}>Produk</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* LACAK PESANAN */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname.startsWith(urls.path('/track')) && 'bg-primary/10 text-primary'
                )}
              >
                <Link href={urls.path('/track')}>Lacak Pesanan</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* KONTAK - DROPDOWN */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  pathname === urls.path('/contact') && 'bg-primary/10 text-primary'
                )}
              >
                Kontak
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-1">{tenant.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Hubungi kami melalui
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {contactInfo.map((info) => (
                      <div
                        key={info.label}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{info.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 break-words">
                            {info.type === 'whatsapp' && (
                              <a
                                href={`https://wa.me/${info.value.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                {info.value}
                              </a>
                            )}
                            {info.type === 'phone' && (
                              <a
                                href={`tel:${info.value}`}
                                className="hover:text-primary transition-colors"
                              >
                                {info.value}
                              </a>
                            )}
                            {info.type === 'email' && (
                              <a
                                href={`mailto:${info.value}`}
                                className="hover:text-primary transition-colors"
                              >
                                {info.value}
                              </a>
                            )}
                            {info.type === 'address' && info.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Link
                      href={urls.path('/contact')}
                      className="text-sm text-primary hover:underline"
                    >
                      Lihat Halaman Kontak →
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <CartSheet tenant={tenant} />

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

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-4">
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

function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

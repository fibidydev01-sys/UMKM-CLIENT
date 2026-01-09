'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from './cart-sheet';
import { StoreNav } from './store-nav';
import { useIsAuthenticated } from '@/stores';
import { useStoreUrls } from '@/lib/store-url';
import type { PublicTenant } from '@/types';

// ==========================================
// STORE HEADER COMPONENT
// ==========================================

interface StoreHeaderProps {
  tenant: PublicTenant;
}

export function StoreHeader({ tenant }: StoreHeaderProps) {
  const isAuthenticated = useIsAuthenticated();

  // Smart URLs - auto-detects subdomain vs localhost
  const urls = useStoreUrls(tenant.slug);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <StoreNav tenant={tenant} />
            </SheetContent>
          </Sheet>

          {/* Logo & Store Name */}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="font-semibold text-lg leading-tight">
                {tenant.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {tenant.category.replace(/_/g, ' ')}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={urls.home}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Beranda
          </Link>
          <Link
            href={urls.products()}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Produk
          </Link>
        </nav>

        {/* Right: Dashboard (if logged in) + Cart */}
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
          )}

          {/* ✅ FIXED: Pass tenant object instead of separate props */}
          <CartSheet tenant={tenant} />
        </div>
      </div>
    </header>
  );
}
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Package, Phone, MapPin, Info, MessageSquare, Users } from 'lucide-react';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { formatPhone } from '@/lib/format';
import { useStoreUrls } from '@/lib/store-url';
import { normalizeTestimonials } from '@/lib/landing';
import { cn } from '@/lib/cn';
import type { PublicTenant } from '@/types';

// ==========================================
// STORE NAVIGATION (Mobile Sidebar)
// ==========================================

interface StoreNavProps {
  tenant: PublicTenant;
}

export function StoreNav({ tenant }: StoreNavProps) {
  const pathname = usePathname();
  const urls = useStoreUrls(tenant.slug);

  // ✅ FIX: No type annotation
  const landingConfig = tenant.landingConfig;

  // Check what data exists
  const hasAbout = !!landingConfig?.about?.config?.content || !!tenant.description;
  const hasContact = !!tenant.address || !!tenant.whatsapp || !!tenant.phone;
  const hasTestimonials = normalizeTestimonials(
    landingConfig?.testimonials?.config?.items
  ).length > 0;

  // Build nav items based on available data
  const navItems = [
    { href: urls.home, label: 'Beranda', icon: Home, show: true },
    { href: urls.path('/about'), label: 'Tentang Kami', icon: Info, show: hasAbout },
    { href: urls.products(), label: 'Semua Produk', icon: Package, show: true },
    { href: urls.path('/testimonials'), label: 'Testimoni', icon: Users, show: hasTestimonials },
    { href: urls.path('/contact'), label: 'Kontak', icon: MessageSquare, show: hasContact },
  ].filter(item => item.show);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SheetHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          {tenant.logo ? (
            <Image
              src={tenant.logo}
              alt={tenant.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
              {tenant.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <SheetTitle className="text-left">{tenant.name}</SheetTitle>
            <p className="text-xs text-muted-foreground">
              {tenant.category.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </SheetHeader>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== urls.home && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* Store Info */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Informasi Toko</h3>

        {tenant.whatsapp && (
          <a
            href={`https://wa.me/${tenant.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            {formatPhone(tenant.whatsapp)}
          </a>
        )}

        {tenant.address && (
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{tenant.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}
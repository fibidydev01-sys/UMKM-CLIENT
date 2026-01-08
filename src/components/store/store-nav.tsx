'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Package, Phone, MapPin } from 'lucide-react';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { formatPhone } from '@/lib/format';
import { useStoreUrls } from '@/lib/store-url'; // ✅ Import hook
import type { PublicTenant } from '@/types';

// ==========================================
// STORE NAVIGATION (Mobile Sidebar)
// ✅ Uses smart URL helper for dev/prod compatibility
// ==========================================

interface StoreNavProps {
  tenant: PublicTenant;
}

export function StoreNav({ tenant }: StoreNavProps) {
  // ✅ Smart URLs
  const urls = useStoreUrls(tenant.slug);

  const navItems = [
    { href: urls.home, label: 'Beranda', icon: Home },
    { href: urls.products(), label: 'Semua Produk', icon: Package },
  ];

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
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
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
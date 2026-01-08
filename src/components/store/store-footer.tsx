'use client';

import Link from 'next/link';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPhone } from '@/lib/format';
import { siteConfig } from '@/config/site';
import { useStoreUrls } from '@/lib/store-url'; // ✅ NEW IMPORT
import type { PublicTenant } from '@/types';

// ==========================================
// STORE FOOTER COMPONENT
// ✅ FIXED: Uses store-url helper for subdomain routing
// ==========================================

interface StoreFooterProps {
  tenant: PublicTenant;
}

export function StoreFooter({ tenant }: StoreFooterProps) {
  const currentYear = new Date().getFullYear();

  // ✅ Smart URLs
  const urls = useStoreUrls(tenant.slug);

  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Store Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{tenant.name}</h3>
            {tenant.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tenant.description}
              </p>
            )}

            <Button asChild className="mt-4">
              <a
                href={`https://wa.me/${tenant.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Hubungi Kami
              </a>
            </Button>
          </div>

          {/* Quick Links - ✅ FIXED */}
          <div className="space-y-4">
            <h3 className="font-semibold">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={urls.home}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href={urls.products()}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Semua Produk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Kontak</h3>
            <ul className="space-y-3">
              {tenant.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${tenant.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {formatPhone(tenant.whatsapp)}
                  </a>
                </li>
              )}
              {tenant.phone && tenant.phone !== tenant.whatsapp && (
                <li>
                  <a
                    href={`tel:${tenant.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {formatPhone(tenant.phone)}
                  </a>
                </li>
              )}
              {tenant.address && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{tenant.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} {tenant.name}. Hak cipta dilindungi.
          </p>
          <p>
            Dibuat dengan{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              {siteConfig.name}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
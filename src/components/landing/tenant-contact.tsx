'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import type { PublicTenant, TenantLandingConfig } from '@/types';

interface TenantContactProps {
  tenant: PublicTenant;
  config?: TenantLandingConfig['contact'];
}

export function TenantContact({ tenant, config }: TenantContactProps) {
  const title = config?.title || 'Hubungi Kami';
  const subtitle = config?.subtitle || '';

  const whatsappLink = tenant.whatsapp
    ? `https://wa.me/${tenant.whatsapp}?text=${encodeURIComponent(`Halo ${tenant.name}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Contact Card */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {/* WhatsApp */}
              {tenant.whatsapp && (
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors dark:bg-green-950/30 dark:hover:bg-green-950/50"
                >
                  <div className="flex-shrink-0 p-3 bg-green-500 rounded-full">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{tenant.whatsapp}</p>
                  </div>
                </a>
              )}

              {/* Phone */}
              {tenant.phone && (
                <a
                  href={`tel:${tenant.phone}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Telepon</p>
                    <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                  </div>
                </a>
              )}

              {/* Address */}
              {tenant.address && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Alamat</p>
                    <p className="text-sm text-muted-foreground">{tenant.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            {whatsappLink && (
              <div className="mt-6 text-center">
                <Button asChild size="lg" className="gap-2">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chat via WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreUrls } from '@/lib/store-url'; // ✅ NEW IMPORT
import type { TenantLandingConfig } from '@/types';

// ==========================================
// TENANT CTA COMPONENT
// ✅ FIXED: Uses store-url helper for subdomain routing
// ==========================================

interface TenantCtaProps {
  storeSlug: string;
  config?: TenantLandingConfig['cta'];
}

export function TenantCta({ storeSlug, config }: TenantCtaProps) {
  // ✅ Smart URLs
  const urls = useStoreUrls(storeSlug);

  const title = config?.title || 'Siap Berbelanja?';
  const subtitle = config?.subtitle || '';
  const buttonText = config?.config?.buttonText || 'Mulai Belanja';
  const style = config?.config?.style || 'primary';

  // ✅ FIXED: Use smart URL as default, or custom link if provided
  const buttonLink = config?.config?.buttonLink || urls.products();

  const buttonVariant =
    style === 'outline' ? 'outline' : style === 'secondary' ? 'secondary' : 'default';

  return (
    <section className="py-16 my-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-2 mb-6">{subtitle}</p>
        )}
        <Link href={buttonLink}>
          <Button size="lg" variant={buttonVariant} className="gap-2 mt-4">
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
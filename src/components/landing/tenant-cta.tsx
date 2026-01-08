'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeUrl } from '@/lib/store-url'; // ✅ Import helper
import type { TenantLandingConfig } from '@/types';

// ==========================================
// TENANT CTA COMPONENT
// ✅ Uses smart URL helper for dev/prod compatibility
// ==========================================

interface TenantCtaProps {
  storeSlug: string;
  config?: TenantLandingConfig['cta'];
}

export function TenantCta({ storeSlug, config }: TenantCtaProps) {
  const title = config?.title || 'Siap Berbelanja?';
  const subtitle = config?.subtitle || '';
  const buttonText = config?.config?.buttonText || 'Mulai Belanja';
  const style = config?.config?.style || 'primary';

  // ✅ Smart URL - use config link or default to products
  const buttonLink = config?.config?.buttonLink || storeUrl(storeSlug, '/products');

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
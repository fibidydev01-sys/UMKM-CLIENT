import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PublicTenant } from '@/types';

// ==========================================
// STORE HERO COMPONENT
// Banner section with CTA
// ==========================================

interface StoreHeroProps {
  tenant: PublicTenant;
}

export function StoreHero({ tenant }: StoreHeroProps) {
  if (tenant.banner) {
    return (
      <section className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden bg-muted">
        <Image
          src={tenant.banner}
          alt={tenant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {tenant.name}
          </h1>
          {tenant.description && (
            <p className="mt-2 text-white/80 max-w-2xl line-clamp-2">
              {tenant.description}
            </p>
          )}
          <Button
            asChild
            className="mt-4"
            size="lg"
          >
            <a
              href={`https://wa.me/${tenant.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Hubungi Kami
            </a>
          </Button>
        </div>
      </section>
    );
  }

  // No banner - simple hero
  return (
    <section className="text-center py-12 px-4 bg-gradient-to-b from-primary/5 to-transparent rounded-xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        Selamat Datang di {tenant.name}
      </h1>
      {tenant.description && (
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          {tenant.description}
        </p>
      )}
      <Button asChild size="lg">
        <a
          href={`https://wa.me/${tenant.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Hubungi Kami
        </a>
      </Button>
    </section>
  );
}
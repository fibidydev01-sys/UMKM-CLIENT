'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStoreUrls } from '@/lib/store-url';
import type { PublicTenant } from '@/types';

interface StoreHeroProps {
  tenant: PublicTenant;
}

export function StoreHero({ tenant }: StoreHeroProps) {
  const urls = useStoreUrls(tenant.slug);

  return (
    <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Selamat Datang di{' '}
              <span className="text-primary">{tenant.name}</span>
            </h1>
            {tenant.description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {tenant.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={urls.products()}>Lihat Produk</Link>
            </Button>
            {tenant.whatsapp && (
              <Button size="lg" variant="outline" asChild>
                <a
                  href={`https://wa.me/${tenant.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi Kami
                </a>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-2xl font-bold text-primary">100+</p>
              <p className="text-sm text-muted-foreground">Produk</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Pelanggan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden">
          {tenant.banner ? (
            <Image
              src={tenant.banner}
              alt={tenant.name}
              fill
              className="object-cover"
              priority
            />
          ) : tenant.logo ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Image
                src={tenant.logo}
                alt={tenant.name}
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-6xl font-bold text-muted-foreground">
                {tenant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
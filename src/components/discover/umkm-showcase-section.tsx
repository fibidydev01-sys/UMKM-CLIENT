// ══════════════════════════════════════════════════════════════
// UMKM SHOWCASE SECTION
// Display registered tenants as clickable cards
// Links to subdomain: {slug}.fibidy.com
// ══════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Store,
  Package,
  ArrowRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getTenantFullUrl } from '@/lib/store-url';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface TenantSitemapItem {
  slug: string;
  updatedAt: string;
}

interface TenantDetail {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  _count?: {
    products: number;
  };
}

interface ShowcaseTenant extends TenantDetail {
  url: string;
}

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const MAX_TENANTS = 12;

// Category display mapping
const CATEGORY_LABELS: Record<string, string> = {
  'WARUNG_KELONTONG': 'Warung Kelontong',
  'TOKO_BANGUNAN': 'Toko Bangunan',
  'TOKO_ELEKTRONIK': 'Toko Elektronik',
  'BENGKEL': 'Bengkel',
  'SALON_KECANTIKAN': 'Salon Kecantikan',
  'LAUNDRY': 'Laundry',
  'WARUNG_MAKAN': 'Warung Makan',
  'CATERING': 'Catering',
  'KEDAI_KOPI': 'Kedai Kopi',
  'TOKO_KUE': 'Toko Kue & Bakery',
  'APOTEK': 'Apotek',
  'KONTER_HP': 'Konter HP',
  'RENTAL_KENDARAAN': 'Rental',
  'STUDIO_FOTO': 'Studio Foto',
  'PRINTING': 'Printing',
  'PET_SHOP': 'Pet Shop',
  'AC_SERVICE': 'Service AC',
  'RESTORAN': 'Restoran',
  'OTHER': 'Lainnya',
};

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

function getInitials(name?: string | null): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ══════════════════════════════════════════════════════════════
// SKELETON LOADER
// ══════════════════════════════════════════════════════════════

function TenantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="h-24 w-full" />
        <div className="p-4 pt-8 relative">
          <Skeleton className="absolute -top-6 left-4 h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════
// TENANT CARD COMPONENT
// ══════════════════════════════════════════════════════════════

interface TenantCardProps {
  tenant: ShowcaseTenant;
}

function TenantCard({ tenant }: TenantCardProps) {
  const productCount = tenant._count?.products || 0;

  return (
    <Link
      href={tenant.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
        <CardContent className="p-0">
          {/* Banner */}
          <div className="relative h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-pink-500/20 overflow-hidden">
            {tenant.banner ? (
              <Image
                src={tenant.banner}
                alt={`${tenant.name} banner`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Store className="h-8 w-8 text-primary/30" />
              </div>
            )}

            {/* External link indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-background/80 backdrop-blur rounded-full p-1">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 pt-8 relative">
            {/* Avatar */}
            <div className="absolute -top-6 left-4">
              <div className="h-12 w-12 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-md">
                {tenant.logo ? (
                  <Image
                    src={tenant.logo}
                    alt={tenant.name || 'Logo'}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    {getInitials(tenant.name)}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {tenant.name || 'Unnamed Store'}
                </h3>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {getCategoryLabel(tenant.category)}
                </Badge>
              </div>

              {tenant.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {tenant.description}
                </p>
              )}

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Package className="h-3 w-3" />
                <span>{productCount} produk</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function UMKMShowcaseSection() {
  const [tenants, setTenants] = useState<ShowcaseTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTenants() {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Get tenant slugs from sitemap
        const sitemapRes = await fetch(
          `${API_URL}/sitemap/tenants/paginated?page=1&limit=${MAX_TENANTS}`
        );

        if (!sitemapRes.ok) {
          throw new Error('Failed to fetch tenant list');
        }

        const sitemapData = await sitemapRes.json();
        const tenantSlugs: TenantSitemapItem[] = sitemapData.tenants || [];

        if (tenantSlugs.length === 0) {
          setTenants([]);
          return;
        }

        // Step 2: Fetch detail for each tenant
        const tenantDetails = await Promise.all(
          tenantSlugs.map(async (item) => {
            try {
              const detailRes = await fetch(
                `${API_URL}/tenants/by-slug/${item.slug}`
              );
              if (!detailRes.ok) return null;
              return await detailRes.json();
            } catch {
              return null;
            }
          })
        );

        // Step 3: Filter out failed fetches and add URLs
        const validTenants: ShowcaseTenant[] = tenantDetails
          .filter((t): t is TenantDetail => t !== null && t.id)
          .map((t) => ({
            ...t,
            url: getTenantFullUrl(t.slug),
          }));

        setTenants(validTenants);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Gagal memuat data toko');
      } finally {
        setLoading(false);
      }
    }

    fetchTenants();
  }, []);

  // Don't render if no tenants and not loading
  if (!loading && tenants.length === 0 && !error) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-medium gap-2"
          >
            <Store className="h-4 w-4 text-primary" />
            <span>UMKM Showcase</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Toko yang Sudah <span className="text-primary">Bergabung</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lihat berbagai UMKM yang sudah punya alamat sendiri di Fibidy
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <TenantCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Tenant Grid */}
        {!loading && !error && tenants.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {tenants.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Mau toko kamu juga tampil di sini?
              </p>
              <Button asChild size="lg">
                <Link href="/register">
                  Buat Toko Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
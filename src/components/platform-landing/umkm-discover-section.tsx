// ══════════════════════════════════════════════════════════════
// UMKM DISCOVER SECTION
// Dribbble/Behance Style Showcase
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
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
const MAX_TENANTS = 24;

const CATEGORY_LABELS: Record<string, string> = {
  'WARUNG_KELONTONG': 'Warung Kelontong',
  'TOKO_BANGUNAN': 'Toko Bangunan',
  'TOKO_ELEKTRONIK': 'Elektronik',
  'BENGKEL': 'Bengkel',
  'SALON_KECANTIKAN': 'Salon',
  'LAUNDRY': 'Laundry',
  'WARUNG_MAKAN': 'Warung Makan',
  'CATERING': 'Catering',
  'KEDAI_KOPI': 'Kedai Kopi',
  'TOKO_KUE': 'Bakery',
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
// SKELETON LOADER - Dribbble Style
// ══════════════════════════════════════════════════════════════

function TenantCardSkeleton() {
  return (
    <div className="group">
      {/* Image Container */}
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />

      {/* Footer */}
      <div className="flex items-center gap-3 mt-3 px-1">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TENANT CARD - Dribbble Style
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
      {/* Image Container - Dribbble Style */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted">
        {/* Banner Image */}
        {tenant.banner ? (
          <Image
            src={tenant.banner}
            alt={tenant.name || 'Store'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-pink-500/20 flex items-center justify-center">
            <Store className="h-12 w-12 text-primary/40" />
          </div>
        )}

        {/* Hover Overlay - Info slides up */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {/* Description */}
            {tenant.description && (
              <p className="text-white/90 text-sm line-clamp-2 mb-3">
                {tenant.description}
              </p>
            )}

            {/* Stats Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  {getCategoryLabel(tenant.category)}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Package className="h-3.5 w-3.5" />
                <span>{productCount} produk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Badge - Always visible */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Footer - Avatar & Name (Dribbble style) */}
      <div className="flex items-center gap-3 mt-3 px-1">
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-background">
          {tenant.logo ? (
            <Image
              src={tenant.logo}
              alt={tenant.name || 'Logo'}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-muted-foreground">
              {getInitials(tenant.name)}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-medium text-sm text-foreground truncate flex-1 group-hover:text-primary transition-colors">
          {tenant.name || 'Unnamed Store'}
        </h3>

        {/* Product Count - subtle */}
        <span className="text-xs text-muted-foreground shrink-0">
          {productCount} items
        </span>
      </div>
    </Link>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function UMKMDiscoverSection() {
  const [tenants, setTenants] = useState<ShowcaseTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tenants
  useEffect(() => {
    async function fetchTenants() {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Get tenant slugs
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

        // Step 3: Filter and add URLs
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

  // Filter tenants by search
  const filteredTenants = tenants.filter((tenant) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tenant.name?.toLowerCase().includes(query) ||
      tenant.description?.toLowerCase().includes(query) ||
      tenant.category?.toLowerCase().includes(query)
    );
  });

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* ══════════════════════════════════════════════════════ */}
        {/* HEADER - Discover Style                               */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="mb-8 md:mb-12">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Discover</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Temukan UMKM
                <span className="text-primary"> Lokal</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Jelajahi berbagai usaha lokal yang sudah online di Fibidy
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari toko atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-full bg-muted/50 border-0 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {!loading && tenants.length > 0 && (
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{tenants.length} UMKM terdaftar</span>
              <span>•</span>
              <span>{tenants.reduce((acc, t) => acc + (t._count?.products || 0), 0)} total produk</span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* CONTENT                                                */}
        {/* ══════════════════════════════════════════════════════ */}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <TenantCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
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

        {/* Empty State */}
        {!loading && !error && filteredTenants.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">
              {searchQuery ? 'Tidak ada hasil' : 'Belum ada toko'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `Tidak ditemukan toko dengan kata kunci "${searchQuery}"`
                : 'Jadilah yang pertama membuat toko di Fibidy!'
              }
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Reset Pencarian
              </Button>
            ) : (
              <Button asChild>
                <Link href="/register">
                  Buat Toko Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Tenant Grid - Dribbble Style */}
        {!loading && !error && filteredTenants.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredTenants.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>

            {/* CTA Banner */}
            <div className="mt-16 md:mt-24">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary via-primary to-pink-500 p-8 md:p-12">
                {/* Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      Punya Usaha?
                    </h3>
                    <p className="text-white/80 text-lg">
                      Buat toko online kamu dan tampil di sini. Gratis!
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg shrink-0"
                  >
                    <Link href="/register">
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
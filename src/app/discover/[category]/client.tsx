'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Store,
  Package,
  ArrowRight,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DiscoverHeader,
  CategoryFilterBar,
  MinimalFooter,
  TenantPreviewDrawer,
} from '@/components/discover';
import type { ShowcaseTenant } from '@/types/discover';
import { CATEGORY_CONFIG } from '@/config/categories';
import {
  fetchTenantsByCategory,
  getCategoryLabel,
  getInitials,
  categoryKeyToSlug,
  sortTenants,
  MAX_TENANTS_CATEGORY,
} from '@/lib/discover';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface CategoryPageClientProps {
  categoryKey: string;
  categorySlug: string;
  isDynamic?: boolean; // true if category is dynamic (not predefined)
}

// ══════════════════════════════════════════════════════════════
// SKELETON LOADER
// ══════════════════════════════════════════════════════════════

function TenantCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
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
// TENANT CARD - Dribbble Style (with onClick for Drawer)
// ══════════════════════════════════════════════════════════════

interface TenantCardProps {
  tenant: ShowcaseTenant;
  onClick?: (tenant: ShowcaseTenant) => void;
}

function TenantCard({ tenant, onClick }: TenantCardProps) {
  const productCount = tenant._count?.products || 0;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(tenant);
    }
  };

  return (
    <Link
      href={tenant.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted">
        {tenant.heroBackgroundImage ? (
          <Image
            src={tenant.heroBackgroundImage}
            alt={tenant.name || 'Store'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-pink-500/20 flex items-center justify-center">
            <Store className="h-12 w-12 text-primary/40" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {tenant.description && (
              <p className="text-white/90 text-sm line-clamp-2 mb-3">
                {tenant.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                {getCategoryLabel(tenant.category)}
              </Badge>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Package className="h-3.5 w-3.5" />
                <span>{productCount} produk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-3 px-1">
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
        <h3 className="font-medium text-sm text-foreground truncate flex-1 group-hover:text-primary transition-colors">
          {tenant.name || 'Unnamed Store'}
        </h3>
        <span className="text-xs text-muted-foreground shrink-0">
          {productCount} items
        </span>
      </div>
    </Link>
  );
}

// ══════════════════════════════════════════════════════════════
// CATEGORY HERO - ✅ FIXED: Handle undefined category
// ══════════════════════════════════════════════════════════════

interface CategoryHeroProps {
  category: typeof CATEGORY_CONFIG[string] | null;
  categoryKey: string;
  tenantCount: number;
}

function CategoryHero({ category, categoryKey, tenantCount }: CategoryHeroProps) {
  // ✅ SAFE: Use default values for dynamic categories
  const Icon = category?.icon || Store;
  const label = category?.label || categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const description = category?.description || 'Kategori dinamis dari database';
  const color = category?.color || '#6b7280';
  const productLabel = category?.labels.product || 'Produk';
  const priceLabel = category?.labels.price || 'Harga';

  return (
    <section className="pt-20 pb-8 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Discover
        </Link>

        {/* Category Info */}
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-8 w-8" style={{ color: color }} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{label}</h1>
            <p className="text-muted-foreground mb-3">{description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                <strong className="text-foreground">{tenantCount}</strong> UMKM terdaftar
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {productLabel}: {priceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN CLIENT COMPONENT - ✅ FIXED: Safe category access
// ══════════════════════════════════════════════════════════════

export function CategoryPageClient({ categoryKey, categorySlug, isDynamic }: CategoryPageClientProps) {
  const router = useRouter();

  // ✅ SAFE: Get category config (might be null for dynamic categories)
  const category = CATEGORY_CONFIG[categoryKey] || null;

  // State
  const [tenants, setTenants] = useState<ShowcaseTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer State
  const [selectedTenant, setSelectedTenant] = useState<ShowcaseTenant | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ════════════════════════════════════════════════════════════
  // FETCH TENANTS
  // ════════════════════════════════════════════════════════════

  useEffect(() => {
    async function loadTenants() {
      try {
        setLoading(true);
        setError(null);

        // Use centralized fetch from lib/discover
        const validTenants = await fetchTenantsByCategory(
          categoryKey,
          MAX_TENANTS_CATEGORY
        );

        setTenants(validTenants);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Gagal memuat data toko');
      } finally {
        setLoading(false);
      }
    }

    loadTenants();
  }, [categoryKey]);

  // ════════════════════════════════════════════════════════════
  // FILTER & SORT
  // ════════════════════════════════════════════════════════════

  const filteredTenants = (() => {
    let result = tenants;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tenant) =>
          tenant.name?.toLowerCase().includes(query) ||
          tenant.description?.toLowerCase().includes(query)
      );
    }

    // Apply sort: default to popular (by product count)
    result = sortTenants(result, 'popular');

    return result;
  })();

  // ════════════════════════════════════════════════════════════
  // HANDLERS
  // ════════════════════════════════════════════════════════════

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategorySelect = useCallback(
    (newCategory: string | null) => {
      if (newCategory === null) {
        router.push('/discover');
      } else if (newCategory !== categoryKey) {
        router.push(`/discover/${categoryKeyToSlug(newCategory)}`);
      }
    },
    [categoryKey, router]
  );

  const handleCardClick = useCallback((tenant: ShowcaseTenant) => {
    setSelectedTenant(tenant);
    setDrawerOpen(true);
  }, []);

  const handleTenantSelect = useCallback((tenant: ShowcaseTenant) => {
    setSelectedTenant(tenant);
  }, []);

  // ✅ SAFE: Get category display values
  const categoryLabel = category?.label || categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const categoryColor = category?.color || '#6b7280';
  const CategoryIcon = category?.icon || Store;

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <DiscoverHeader
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      <main className="flex-1">
        {/* Category Hero - ✅ Pass category safely */}
        <CategoryHero
          category={category}
          categoryKey={categoryKey}
          tenantCount={tenants.length}
        />

        {/* Category Navigation (Sticky) */}
        <CategoryFilterBar
          selectedCategory={categoryKey}
          onCategorySelect={handleCategorySelect}
          isSticky={true}
        />

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <TenantCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filteredTenants.length === 0 && (
              <div className="text-center py-20">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ backgroundColor: `${categoryColor}20` }}
                >
                  <CategoryIcon className="h-8 w-8" style={{ color: categoryColor }} />
                </div>
                <h3 className="font-semibold mb-2">
                  {searchQuery ? 'Tidak ada hasil' : `Belum ada ${categoryLabel}`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? `Tidak ditemukan UMKM dengan kata kunci "${searchQuery}"`
                    : `Jadilah ${categoryLabel} pertama di Fibidy!`}
                </p>
                {searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Reset Pencarian
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/register">
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {/* Grid */}
            {!loading && !error && filteredTenants.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredTenants.map((tenant) => (
                  <TenantCard key={tenant.id} tenant={tenant} onClick={handleCardClick} />
                ))}
              </div>
            )}

            {/* Load More */}
            {!loading && !error && filteredTenants.length >= 20 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  <Loader2 className="mr-2 h-4 w-4" />
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <MinimalFooter />

      {/* Tenant Preview Drawer */}
      <TenantPreviewDrawer
        tenant={selectedTenant}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        tenantUrl={selectedTenant?.url || ''}
        allTenants={tenants}
        onTenantSelect={handleTenantSelect}
      />
    </div>
  );
}

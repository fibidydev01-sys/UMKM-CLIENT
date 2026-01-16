// ══════════════════════════════════════════════════════════════
// DISCOVER PAGE CLIENT - V11.0 REFACTORED
// Components extracted to separate files
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Store, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DiscoverHeader,
  DiscoverHero,
  CategoryFilterBar,
  DiscoverFooter,
  TenantPreviewDrawer,
  TenantCard,
  TenantCardSkeleton,
  SearchResultsHeader,
  NoResults,
} from '@/components/discover';
import type { ShowcaseTenant } from '@/components/discover';
import { CATEGORY_CONFIG } from '@/config/categories';
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
  whatsapp: string | null;
  phone: string | null;
  address: string | null;
  logo: string | null;
  banner: string | null;
  theme?: {
    primaryColor?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  _count?: {
    products: number;
  };
}

type SortOption = 'popular' | 'newest' | 'oldest' | 'name_asc' | 'name_desc';
type TabType = 'umkm' | 'produk' | 'jasa';

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const MAX_TENANTS = 24;
const CACHE_KEY = 'fibidy_discover_tenants';
const CACHE_DURATION = 5 * 60 * 1000;

// ══════════════════════════════════════════════════════════════
// CACHE HELPERS
// ══════════════════════════════════════════════════════════════

interface CacheData {
  tenants: ShowcaseTenant[];
  timestamp: number;
}

function getCachedTenants(): ShowcaseTenant[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const data: CacheData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data.tenants;
  } catch {
    return null;
  }
}

function setCachedTenants(tenants: ShowcaseTenant[]): void {
  if (typeof window === 'undefined') return;
  try {
    const data: CacheData = { tenants, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

function getCategoryLabel(category: string): string {
  return CATEGORY_CONFIG[category]?.labelShort || category;
}

function getCategoryColor(category: string): string {
  return CATEGORY_CONFIG[category]?.color || '#6b7280';
}

// ══════════════════════════════════════════════════════════════
// MAIN CLIENT COMPONENT
// ══════════════════════════════════════════════════════════════

export function DiscoverPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('q') || '';

  // State
  const [tenants, setTenants] = useState<ShowcaseTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [activeTab, setActiveTab] = useState<TabType>('umkm');

  // Drawer State
  const [selectedTenant, setSelectedTenant] = useState<ShowcaseTenant | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync search query with URL
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // ════════════════════════════════════════════════════════════
  // FETCH TENANTS
  // ════════════════════════════════════════════════════════════

  useEffect(() => {
    async function fetchTenants() {
      const cachedTenants = getCachedTenants();
      if (cachedTenants) {
        setTenants(cachedTenants);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const sitemapRes = await fetch(
          `${API_URL}/sitemap/tenants/paginated?page=1&limit=${MAX_TENANTS}`
        );

        if (!sitemapRes.ok) throw new Error('Failed to fetch tenant list');

        const sitemapData = await sitemapRes.json();
        const tenantSlugs: TenantSitemapItem[] = sitemapData.tenants || [];

        if (tenantSlugs.length === 0) {
          setTenants([]);
          return;
        }

        const tenantDetails = await Promise.all(
          tenantSlugs.map(async (item) => {
            try {
              const detailRes = await fetch(`${API_URL}/tenants/by-slug/${item.slug}`);
              if (!detailRes.ok) return null;
              return await detailRes.json();
            } catch {
              return null;
            }
          })
        );

        const validTenants: ShowcaseTenant[] = tenantDetails
          .filter((t): t is TenantDetail => t !== null && t.id)
          .map((t) => ({
            ...t,
            url: getTenantFullUrl(t.slug),
          }));

        setCachedTenants(validTenants);
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

  // ════════════════════════════════════════════════════════════
  // FILTER & SORT TENANTS
  // ════════════════════════════════════════════════════════════

  const filteredTenants = tenants
    .filter((tenant) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tenant.name?.toLowerCase().includes(query) ||
          tenant.description?.toLowerCase().includes(query) ||
          tenant.category?.toLowerCase().includes(query) ||
          getCategoryLabel(tenant.category).toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedCategory && tenant.category !== selectedCategory) return false;
      if (selectedColor) {
        const categoryColor = getCategoryColor(tenant.category);
        if (categoryColor !== selectedColor) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return -1;
        case 'oldest':
          return 1;
        case 'name_asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name_desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'popular':
        default:
          return (b._count?.products || 0) - (a._count?.products || 0);
      }
    });

  // ════════════════════════════════════════════════════════════
  // HANDLERS
  // ════════════════════════════════════════════════════════════

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query) {
        router.push(`/discover?q=${encodeURIComponent(query)}`, { scroll: false });
      } else {
        router.push('/discover', { scroll: false });
      }
    },
    [router]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    router.push('/discover', { scroll: false });
  }, [router]);

  const handleCategorySelect = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handleColorSelect = useCallback((color: string | null) => {
    setSelectedColor(color);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleCardClick = useCallback((tenant: ShowcaseTenant) => {
    setSelectedTenant(tenant);
    setDrawerOpen(true);
  }, []);

  const handleTenantSelect = useCallback((tenant: ShowcaseTenant) => {
    setSelectedTenant(tenant);
  }, []);

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════

  const isSearchMode = !!searchQuery;
  const hasResults = filteredTenants.length > 0;

  const getFilterDescription = () => {
    const parts: string[] = [];
    if (selectedCategory) parts.push(`Kategori: ${getCategoryLabel(selectedCategory)}`);
    if (selectedColor) parts.push(`Warna: ${selectedColor}`);
    return parts.join(' • ');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <DiscoverHeader
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      <main className="flex-1">
        {/* Conditional Hero or Search Results Header */}
        {isSearchMode ? (
          <SearchResultsHeader
            query={searchQuery}
            resultCount={filteredTenants.length}
            onClear={handleClearSearch}
          />
        ) : (
          <DiscoverHero
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
            onTabChange={handleTabChange}
            searchQuery={searchQuery}
            activeTab={activeTab}
          />
        )}

        {/* Filter Bar */}
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          isSticky={true}
        />

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Stats & Filter Info */}
            {!loading && filteredTenants.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                <span>{filteredTenants.length} UMKM ditemukan</span>
                {(selectedCategory || selectedColor) && (
                  <>
                    <span>•</span>
                    <span>{getFilterDescription()}</span>
                    <button
                      onClick={() => {
                        handleCategorySelect(null);
                        handleColorSelect(null);
                      }}
                      className="text-primary hover:underline"
                    >
                      Reset Filter
                    </button>
                  </>
                )}
              </div>
            )}

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
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* No Results (Search Mode) */}
            {!loading && !error && isSearchMode && !hasResults && (
              <NoResults query={searchQuery} onClear={handleClearSearch} />
            )}

            {/* Empty State (Not Search Mode) */}
            {!loading && !error && !isSearchMode && filteredTenants.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Store className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">
                  {selectedCategory || selectedColor ? 'Tidak ada hasil' : 'Belum ada toko'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory || selectedColor
                    ? 'Tidak ada UMKM yang cocok dengan filter.'
                    : 'Jadilah yang pertama membuat toko di Fibidy!'}
                </p>
                {selectedCategory || selectedColor ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedColor(null);
                    }}
                  >
                    Reset Filter
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

            {/* Tenant Grid */}
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
      <DiscoverFooter />

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
// ══════════════════════════════════════════════════════════════
// DISCOVER PAGE CLIENT - V13.0 (7 Category Groups)
// Updated to use new 7 category groups instead of UMKM/Produk/Jasa
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
  DiscoverFooter,
  TenantPreviewDrawer,
  TenantCard,
  TenantCardSkeleton,
  SearchResultsHeader,
  NoResults,
} from '@/components/discover';
import type { ShowcaseTenant } from '@/types/discover';
import {
  fetchAllTenants,
  getCategoryLabel,
  sortTenants,
  CACHE_DURATION,
} from '@/lib/discover';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type TabType = 'KULINER' | 'RUMAH_TAMAN' | 'OTOMOTIF' | 'KESEHATAN_KECANTIKAN' | 'TRAVEL_HIBURAN' | 'BELANJA' | 'LAINNYA';

// ══════════════════════════════════════════════════════════════
// BROWSER CACHE (sessionStorage)
// ══════════════════════════════════════════════════════════════

const CACHE_KEY = 'fibidy_discover_tenants';

interface CacheData {
  tenants: ShowcaseTenant[];
  timestamp: number;
}

function getBrowserCachedTenants(): ShowcaseTenant[] | null {
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

function setBrowserCachedTenants(tenants: ShowcaseTenant[]): void {
  if (typeof window === 'undefined') return;
  try {
    const data: CacheData = { tenants, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
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
  const [activeTab, setActiveTab] = useState<TabType>('KULINER');

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
    async function loadTenants() {
      // Check browser cache first
      const cachedTenants = getBrowserCachedTenants();
      if (cachedTenants) {
        setTenants(cachedTenants);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use centralized fetch from lib/discover
        const validTenants = await fetchAllTenants();

        setBrowserCachedTenants(validTenants);
        setTenants(validTenants);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Gagal memuat data toko');
      } finally {
        setLoading(false);
      }
    }

    loadTenants();
  }, []);

  // ════════════════════════════════════════════════════════════
  // FILTER & SORT TENANTS
  // ════════════════════════════════════════════════════════════

  const filteredTenants = (() => {
    let result = tenants;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((tenant) => {
        const matchesSearch =
          tenant.name?.toLowerCase().includes(query) ||
          tenant.description?.toLowerCase().includes(query) ||
          tenant.category?.toLowerCase().includes(query) ||
          getCategoryLabel(tenant.category).toLowerCase().includes(query);
        return matchesSearch;
      });
    }

    // Default sort: popular (by product count)
    result = sortTenants(result, 'popular');

    return result;
  })();

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <DiscoverHeader
        onSearch={handleSearch}
        searchQuery={searchQuery}
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
            onTabChange={handleTabChange}
            searchQuery={searchQuery}
            activeTab={activeTab}
          />
        )}

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Stats */}
            {!loading && filteredTenants.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                <span>{filteredTenants.length} UMKM ditemukan</span>
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
                <h3 className="font-semibold mb-2">Belum ada toko</h3>
                <p className="text-muted-foreground mb-6">
                  Jadilah yang pertama membuat toko di Fibidy!
                </p>
                <Button asChild>
                  <Link href="/register">
                    Buat Toko Sekarang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
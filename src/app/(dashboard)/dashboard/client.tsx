// ══════════════════════════════════════════════════════════════
// DASHBOARD CLIENT - Profile + Products Only
// Avatar + Store info, Products Section
// ✅ CLEANED: Removed customers & orders tabs and components
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, LayoutGrid, List, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTenant } from '@/hooks';
import { productsApi, getErrorMessage } from '@/lib/api';
import { subscriptionApi, type SubscriptionInfo } from '@/lib/api/subscription';
import { ProductsTable, ProductsGrid, ProductsGridSkeleton } from '@/components/products';
import { UpgradeModal } from '@/components/dashboard/upgrade-modal';

import type { Product } from '@/types';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type ViewMode = 'list' | 'grid';

// ══════════════════════════════════════════════════════════════
// MAIN DASHBOARD CLIENT
// ══════════════════════════════════════════════════════════════

export function DashboardClient() {
  const { tenant } = useTenant();
  const [planInfo, setPlanInfo] = useState<SubscriptionInfo | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  useEffect(() => {
    subscriptionApi.getMyPlan().then(setPlanInfo).catch(() => { });
  }, []);

  const showUpgradeModal = (message: string) => {
    setUpgradeMessage(message);
    setUpgradeOpen(true);
  };

  return (
    <div>
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        description={upgradeMessage}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* PROFILE SECTION - Avatar + Store Info                    */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 mb-8">
        {/* Avatar */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-border bg-muted overflow-hidden shrink-0">
          {tenant?.logo ? (
            <Image
              src={tenant.logo}
              alt={tenant.name || 'Store logo'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <Store className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Store Name + Description */}
        <div className="min-w-0 flex-1">
          {tenant ? (
            <>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                {tenant.name}
              </h1>
              {tenant.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {tenant.description}
                </p>
              )}
            </>
          ) : (
            <>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-60" />
            </>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* PRODUCTS SECTION                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <ProductsTabContent
        isAtLimit={planInfo?.isAtLimit?.products}
        onAtLimit={() =>
          showUpgradeModal(
            `Batas ${planInfo?.limits.maxProducts} Postingan tercapai. Upgrade ke Business untuk produk unlimited.`
          )
        }
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB HEADER - View toggle + Action button
// ══════════════════════════════════════════════════════════════

function TabHeader({
  viewMode,
  onViewModeChange,
  actionHref,
  actionLabel,
  disabled,
  onAtLimit,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  actionHref: string;
  actionLabel: string;
  disabled?: boolean;
  onAtLimit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(v) => v && onViewModeChange(v as ViewMode)}
      >
        <ToggleGroupItem value="list" aria-label="List view" size="sm">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {disabled ? (
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      ) : onAtLimit ? (
        <Button onClick={onAtLimit}>
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      ) : (
        <Button asChild>
          <Link href={actionHref}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ERROR BLOCK
// ══════════════════════════════════════════════════════════════

function ErrorBlock({
  message,
  error,
  onRetry,
}: {
  message: string;
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
      <p className="text-destructive font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-1">{error}</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Coba Lagi
      </Button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS TAB CONTENT
// ══════════════════════════════════════════════════════════════

function ProductsTabContent({
  isAtLimit,
  onAtLimit,
}: {
  isAtLimit?: boolean;
  onAtLimit?: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  const fetchData = async (showFullLoading = true) => {
    if (!isMounted.current) return;
    if (showFullLoading) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const res = await productsApi.getAll({ limit: 100 });
      if (!isMounted.current) return;
      setProducts(res.data);

      // Extract categories from products
      const cats = [
        ...new Set(res.data.map((p) => p.category).filter((c): c is string => Boolean(c))),
      ].sort();
      setCategories(cats);
    } catch (err) {
      if (!isMounted.current) return;
      setError(getErrorMessage(err));
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData(true);
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <TabHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          actionHref="/dashboard/products/new"
          actionLabel="Tambah Produk"
          disabled
        />
        <ProductsGridSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <ErrorBlock
        message="Gagal memuat produk"
        error={error}
        onRetry={() => {
          hasFetched.current = false;
          fetchData(true);
        }}
      />
    );
  }

  return (
    <>
      <TabHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actionHref="/dashboard/products/new"
        actionLabel="Tambah"
        onAtLimit={isAtLimit ? onAtLimit : undefined}
      />
      {viewMode === 'list' ? (
        <ProductsTable
          products={products}
          categories={categories}
          isRefreshing={isRefreshing}
          onRefresh={() => fetchData(false)}
        />
      ) : (
        <ProductsGrid
          products={products}
          isRefreshing={isRefreshing}
          onRefresh={() => fetchData(false)}
        />
      )}
    </>
  );
}
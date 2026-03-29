// ══════════════════════════════════════════════════════════════
// DASHBOARD CLIENT - Profile + Products Only
// Avatar + Store info, Products Grid only
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Store } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTenant } from '@/hooks';
import { productsApi, getErrorMessage } from '@/lib/api';
import { subscriptionApi, type SubscriptionInfo } from '@/lib/api/subscription';
import { ProductsGrid, ProductsGridSkeleton } from '@/components/dashboard/products';
import { UpgradeModal } from '@/components/dashboard/shared/upgrade-modal';

import type { Product } from '@/types';

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
            `You've reached the ${planInfo?.limits.maxProducts} product limit. Upgrade to Business for unlimited products.`
          )
        }
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ERROR BLOCK
// ══════════════════════════════════════════════════════════════

function ErrorBlock({
  message,
  error,
}: {
  message: string;
  error: string;
}) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
      <p className="text-destructive font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-1">{error}</p>
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  // silent=true → pakai isRefreshing (grid dim), tidak blank screen
  const fetchData = useCallback(async (silent = false) => {
    if (!isMounted.current) return;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await productsApi.getAll({ limit: 100 });
      if (!isMounted.current) return;
      setProducts(res.data);
    } catch (err) {
      if (!isMounted.current) return;
      setError(getErrorMessage(err));
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);

  // Callback yang di-pass ke ProductsGrid sebagai onRefresh
  // Saat delete/toggle selesai, ini yang dipanggil → re-fetch tanpa blank screen
  const handleRefresh = useCallback(() => fetchData(true), [fetchData]);

  if (isLoading) {
    return <ProductsGridSkeleton />;
  }

  if (error) {
    return (
      <ErrorBlock
        message="Failed to load products"
        error={error}
      />
    );
  }

  return (
    <ProductsGrid
      products={products}
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      isAtLimit={isAtLimit}
      onAtLimit={onAtLimit}
    />
  );
}
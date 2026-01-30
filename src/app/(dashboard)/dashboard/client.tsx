// ══════════════════════════════════════════════════════════════
// DASHBOARD CLIENT - Profile + Sticky Tabs (Facebook/Instagram style)
// Hero background + Avatar from tenant settings
// Tabs: Produk, Pelanggan, Pesanan
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Users, ShoppingCart, Plus, LayoutGrid, List, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { useTenant } from '@/hooks';
import { productsApi, customersApi, ordersApi, getErrorMessage } from '@/lib/api';
import { ProductsTable, ProductsGrid, ProductsGridSkeleton } from '@/components/products';
import { CustomersTable, CustomersGrid, CustomersGridSkeleton } from '@/components/customers';
import { OrdersTable, OrdersGrid, OrdersGridSkeleton } from '@/components/orders';

import type { Product, Customer, OrderListItem } from '@/types';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type TabType = 'products' | 'customers' | 'orders';
type ViewMode = 'list' | 'grid';

const TABS = [
  { id: 'products' as const, label: 'Produk', icon: Package },
  { id: 'customers' as const, label: 'Pelanggan', icon: Users },
  { id: 'orders' as const, label: 'Pesanan', icon: ShoppingCart },
];

// ══════════════════════════════════════════════════════════════
// MAIN DASHBOARD CLIENT
// ══════════════════════════════════════════════════════════════

export function DashboardClient() {
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState<TabType>('products');

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* PROFILE SECTION - Hero Background + Avatar              */}
      {/* Breaks out of container padding for full-width          */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="-mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-8 lg:-mt-8">
        {/* Hero Background */}
        <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 overflow-hidden">
          {tenant?.heroBackgroundImage ? (
            <Image
              src={tenant.heroBackgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-muted" />
          )}
        </div>

        {/* Avatar + Store Info */}
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex items-end gap-4 -mt-10 sm:-mt-12 md:-mt-14">
            {/* Avatar */}
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full border-4 border-background bg-muted overflow-hidden shrink-0 shadow-md">
              {tenant?.logo ? (
                <Image
                  src={tenant.logo}
                  alt={tenant.name || 'Store logo'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-muted">
                  <Store className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Store Name + Description */}
            <div className="pb-1 sm:pb-2 min-w-0 flex-1">
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
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS - Produk, Pelanggan, Pesanan                */}
      {/* Sticks to top of scroll container when scrolling        */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 mt-4">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB CONTENT                                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="mt-6">
        {activeTab === 'products' && <ProductsTabContent />}
        {activeTab === 'customers' && <CustomersTabContent />}
        {activeTab === 'orders' && <OrdersTabContent />}
      </div>
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
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  actionHref: string;
  actionLabel: string;
  disabled?: boolean;
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

function ProductsTabContent() {
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
        actionLabel="Tambah Produk"
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

// ══════════════════════════════════════════════════════════════
// CUSTOMERS TAB CONTENT
// ══════════════════════════════════════════════════════════════

function CustomersTabContent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
      const res = await customersApi.getAll({ limit: 100 });
      if (!isMounted.current) return;
      setCustomers(res.data);
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
          actionHref="/dashboard/customers/new"
          actionLabel="Tambah Pelanggan"
          disabled
        />
        <CustomersGridSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <ErrorBlock
        message="Gagal memuat pelanggan"
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
        actionHref="/dashboard/customers/new"
        actionLabel="Tambah Pelanggan"
      />
      {viewMode === 'list' ? (
        <CustomersTable customers={customers} onRefresh={() => fetchData(false)} />
      ) : (
        <CustomersGrid
          customers={customers}
          isRefreshing={isRefreshing}
          onRefresh={() => fetchData(false)}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// ORDERS TAB CONTENT
// ══════════════════════════════════════════════════════════════

function OrdersTabContent() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
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
      const res = await ordersApi.getAll({ limit: 100 });
      if (!isMounted.current) return;
      setOrders(res.data);
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
          actionHref="/dashboard/orders/new"
          actionLabel="Buat Pesanan"
          disabled
        />
        <OrdersGridSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <ErrorBlock
        message="Gagal memuat pesanan"
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
        actionHref="/dashboard/orders/new"
        actionLabel="Buat Pesanan"
      />
      {viewMode === 'list' ? (
        <OrdersTable orders={orders} onRefresh={() => fetchData(false)} />
      ) : (
        <OrdersGrid
          orders={orders}
          isRefreshing={isRefreshing}
          onRefresh={() => fetchData(false)}
        />
      )}
    </>
  );
}

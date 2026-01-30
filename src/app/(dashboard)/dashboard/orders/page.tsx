// src/app/(dashboard)/dashboard/orders/page.tsx
// Route: /dashboard/orders
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PageHeader } from '@/components/dashboard';
import { OrdersTable, OrdersGrid, OrdersGridSkeleton } from '@/components/orders';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersApi, getErrorMessage } from '@/lib/api';
import type { OrderListItem } from '@/types';

type ViewMode = 'list' | 'grid';

// ==========================================
// ORDERS LIST PAGE (Client Component)
// ==========================================

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Fetch orders
  const fetchData = async (showFullLoading = true) => {
    if (!isMounted.current) return;

    if (showFullLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const response = await ordersApi.getAll({ limit: 100 });
      if (!isMounted.current) return;
      setOrders(response.data);
    } catch (err) {
      if (!isMounted.current) return;
      console.error('Failed to fetch orders:', err);
      setError(getErrorMessage(err));
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  };

  // Fetch on mount - runs ONLY ONCE
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

  // Refresh handler
  const handleRefresh = async () => {
    await fetchData(false);
  };

  // View mode toggle component
  const ViewToggle = () => (
    <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)}>
      <ToggleGroupItem value="list" aria-label="List view" size="sm">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Pesanan" description="Kelola pesanan masuk">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pesanan
            </Button>
          </div>
        </PageHeader>
        {viewMode === 'list' ? <TableSkeleton /> : <OrdersGridSkeleton />}
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader title="Pesanan" description="Kelola pesanan masuk">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button asChild>
              <Link href="/dashboard/orders/new">
                <Plus className="h-4 w-4 mr-2" />
                Buat Pesanan
              </Link>
            </Button>
          </div>
        </PageHeader>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat pesanan</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              hasFetched.current = false;
              fetchData(true);
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Pesanan" description="Kelola pesanan masuk">
        <div className="flex items-center gap-2">
          <ViewToggle />
          <Button asChild>
            <Link href="/dashboard/orders/new">
              <Plus className="h-4 w-4 mr-2" />
              Buat Pesanan
            </Link>
          </Button>
        </div>
      </PageHeader>

      {viewMode === 'list' ? (
        <OrdersTable orders={orders} onRefresh={handleRefresh} />
      ) : (
        <OrdersGrid
          orders={orders}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}

// ==========================================
// SKELETON COMPONENT - MINIMAL VIEW
// Matches minimal table: Checkbox | No. Pesanan | Pelanggan | Tanggal (4 columns)
// ==========================================

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar Skeleton - hanya search (status filters dihapus) */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-64" />
      </div>

      {/* Table Skeleton - 4 columns minimal */}
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              {/* Checkbox */}
              <Skeleton className="h-4 w-4 flex-shrink-0" />

              {/* Order Number */}
              <Skeleton className="h-4 w-28 flex-shrink-0" />

              {/* Customer Name */}
              <Skeleton className="h-4 flex-1" />

              {/* Date */}
              <Skeleton className="h-4 w-32 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
// src/app/(dashboard)/dashboard/orders/page.tsx
// Route: /dashboard/orders
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard';
import { OrdersTable } from '@/components/orders';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersApi, getErrorMessage } from '@/lib/api';
import type { OrderListItem } from '@/types';

// ==========================================
// ORDERS LIST PAGE (Client Component)
// ==========================================

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getAll({ limit: 100 });
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Pesanan" description="Kelola pesanan masuk">
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Buat Pesanan
          </Button>
        </PageHeader>
        <TableSkeleton />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader title="Pesanan" description="Kelola pesanan masuk">
          <Button asChild>
            <Link href="/dashboard/orders/new">
              <Plus className="h-4 w-4 mr-2" />
              Buat Pesanan
            </Link>
          </Button>
        </PageHeader>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat pesanan</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchData}>
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Pesanan" description="Kelola pesanan masuk">
        <Button asChild>
          <Link href="/dashboard/orders/new">
            <Plus className="h-4 w-4 mr-2" />
            Buat Pesanan
          </Link>
        </Button>
      </PageHeader>

      <OrdersTable orders={orders} onRefresh={fetchData} />
    </>
  );
}

// ==========================================
// SKELETON COMPONENT
// ✅ FINAL: Sama persis dengan Customers Page
// ==========================================

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[160px]" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

// src/app/(dashboard)/dashboard/orders/[id]/page.tsx
// Route: /dashboard/orders/[id]
// ✅ FIXED: Client Component with proper authentication

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/dashboard';
import { OrderDetail } from '@/components/orders';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ordersApi, getErrorMessage } from '@/lib/api';
import type { Order } from '@/types';

// ==========================================
// ORDER DETAIL PAGE (Client Component)
// ==========================================

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Client-side fetch = localStorage accessible = token sent!
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await ordersApi.getById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Detail Pesanan" description="Memuat data..." />
        <OrderDetailSkeleton />
      </>
    );
  }

  // Error / Not Found state
  if (error || !order) {
    return (
      <>
        <PageHeader
          title="Pesanan Tidak Ditemukan"
          description={error || 'Data pesanan tidak ditemukan'}
        />
        <Button variant="outline" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Pesanan
          </Link>
        </Button>
      </>
    );
  }

  // ✅ Render OrderDetail with fetched data
  return (
    <>
      <PageHeader
        title={`Pesanan #${order.orderNumber}`}
        description="Detail informasi pesanan"
      />
      <OrderDetail order={order} />
    </>
  );
}

// ==========================================
// SKELETON COMPONENT
// ==========================================

function OrderDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Status Management */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
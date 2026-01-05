'use client';

// src/app/(dashboard)/dashboard/orders/new/page.tsx
// Route: /dashboard/orders/new
// ✅ FIXED: Client Component with proper authentication

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/dashboard';
import { OrderForm } from '@/components/orders';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { productsApi, customersApi, getErrorMessage } from '@/lib/api';
import type { Product, Customer } from '@/types';

// ==========================================
// CREATE ORDER PAGE (Client Component)
// ==========================================

export default function NewOrderPage() {
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get('customer') || undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Client-side fetch = localStorage accessible = token sent!
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [productsRes, customersRes] = await Promise.all([
          productsApi.getAll({ limit: 100, isActive: true }),
          customersApi.getAll({ limit: 100 }),
        ]);

        setProducts(productsRes.data);
        setCustomers(customersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Buat Pesanan"
          description="Buat pesanan baru untuk pelanggan"
        />
        <NewOrderSkeleton />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader
          title="Buat Pesanan"
          description="Buat pesanan baru untuk pelanggan"
        />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat data</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  // ✅ Render OrderForm with fetched data
  return (
    <>
      <PageHeader
        title="Buat Pesanan"
        description="Buat pesanan baru untuk pelanggan"
      />
      <OrderForm
        products={products}
        customers={customers}
        initialCustomerId={initialCustomerId}
      />
    </>
  );
}

// ==========================================
// SKELETON COMPONENT
// ==========================================

function NewOrderSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Products */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                  <Skeleton className="h-12 w-32" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-28" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
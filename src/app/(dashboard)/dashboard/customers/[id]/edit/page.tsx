'use client';

// src/app/(dashboard)/dashboard/customers/[id]/page.tsx
// Route: /dashboard/customers/[id]
// Purpose: View customer detail
// Refactored: Thin wrapper using CustomerDetail component

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerDetail } from '@/components/customers';
import { useCustomer } from '@/hooks';

// ==========================================
// CUSTOMER DETAIL PAGE (Client Component)
// ==========================================

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Client-side fetch
  const { customer, isLoading, error } = useCustomer(id);

  // Loading state
  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  // Error / Not Found state
  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-2">Pelanggan Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-4">
          {error || 'Data tidak ditemukan'}
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Pelanggan
          </Link>
        </Button>
      </div>
    );
  }

  // Render CustomerDetail component
  return <CustomerDetail customer={customer} showHeader />;
}

// ==========================================
// SKELETON COMPONENT
// ==========================================

function CustomerDetailSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
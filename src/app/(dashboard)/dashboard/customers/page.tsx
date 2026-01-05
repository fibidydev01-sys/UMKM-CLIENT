// src/app/(dashboard)/dashboard/customers/page.tsx
// Route: /dashboard/customers
// ✅ FIXED: Client component with proper authentication
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard';
import { CustomersTable } from '@/components/customers';
import { Skeleton } from '@/components/ui/skeleton';
import { customersApi, getErrorMessage } from '@/lib/api';
import type { Customer } from '@/types';

// ==========================================
// CUSTOMERS LIST PAGE (Client Component)
// ==========================================

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await customersApi.getAll({ limit: 100 });
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
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
        <PageHeader title="Pelanggan" description="Kelola data pelanggan Anda">
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pelanggan
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
        <PageHeader title="Pelanggan" description="Kelola data pelanggan Anda">
          <Button asChild>
            <Link href="/dashboard/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pelanggan
            </Link>
          </Button>
        </PageHeader>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat pelanggan</p>
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
      <PageHeader title="Pelanggan" description="Kelola data pelanggan Anda">
        <Button asChild>
          <Link href="/dashboard/customers/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pelanggan
          </Link>
        </Button>
      </PageHeader>

      <CustomersTable customers={customers} />
    </>
  );
}

// ==========================================
// SKELETON COMPONENT
// ==========================================

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-80" />
      </div>
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-9 w-9 rounded-full" />
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
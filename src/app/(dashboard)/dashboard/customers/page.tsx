// src/app/(dashboard)/dashboard/customers/page.tsx
// Route: /dashboard/customers
// ✅ FIXED: Client component with proper authentication
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PageHeader } from '@/components/dashboard';
import { CustomersTable, CustomersGrid, CustomersGridSkeleton } from '@/components/customers';
import { Skeleton } from '@/components/ui/skeleton';
import { customersApi, getErrorMessage } from '@/lib/api';
import type { Customer } from '@/types';

type ViewMode = 'list' | 'grid';

// ==========================================
// CUSTOMERS LIST PAGE (Client Component)
// ==========================================

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Fetch customers
  const fetchData = async (showFullLoading = true) => {
    if (!isMounted.current) return;

    if (showFullLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const response = await customersApi.getAll({ limit: 100 });
      if (!isMounted.current) return;
      setCustomers(response.data);
    } catch (err) {
      if (!isMounted.current) return;
      console.error('Failed to fetch customers:', err);
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
        <PageHeader title="Pelanggan" description="Kelola data pelanggan Anda">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pelanggan
            </Button>
          </div>
        </PageHeader>
        {viewMode === 'list' ? <TableSkeleton /> : <CustomersGridSkeleton />}
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader title="Pelanggan" description="Kelola data pelanggan Anda">
          <div className="flex items-center gap-2">
            <ViewToggle />
            <Button asChild>
              <Link href="/dashboard/customers/new">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pelanggan
              </Link>
            </Button>
          </div>
        </PageHeader>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat pelanggan</p>
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
      <PageHeader title="Pelanggan" description="Kelola data pelanggan Anda">
        <div className="flex items-center gap-2">
          <ViewToggle />
          <Button asChild>
            <Link href="/dashboard/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pelanggan
            </Link>
          </Button>
        </div>
      </PageHeader>

      {viewMode === 'list' ? (
        <CustomersTable customers={customers} onRefresh={handleRefresh} />
      ) : (
        <CustomersGrid
          customers={customers}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}

// ==========================================
// SKELETON COMPONENT - MINIMAL VIEW
// Matches minimal table: Checkbox | Avatar+Name+Phone | Terdaftar (3 columns)
// ==========================================

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar Skeleton - hanya search */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-80" />
      </div>

      {/* Table Skeleton - 3 columns minimal */}
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              {/* Checkbox */}
              <Skeleton className="h-4 w-4 flex-shrink-0" />

              {/* Avatar + Name + Phone */}
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>

              {/* Terdaftar Date */}
              <Skeleton className="h-4 w-24 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
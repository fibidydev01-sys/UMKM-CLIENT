'use client';

// src/app/(dashboard)/dashboard/customers/[id]/edit/page.tsx
// Route: /dashboard/customers/[id]/edit
// Purpose: Edit existing customer

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/dashboard';
import { CustomerForm } from '@/components/customers';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCustomer } from '@/hooks';

// ==========================================
// EDIT CUSTOMER PAGE (Client Component)
// ==========================================

export default function EditCustomerPage() {
  const params = useParams();
  const id = params.id as string;

  // ✅ Client-side fetch = localStorage accessible = token sent!
  const { customer, isLoading, error } = useCustomer(id);

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Edit Pelanggan" description="Memuat data..." />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </>
    );
  }

  // Error / Not Found state
  if (error || !customer) {
    return (
      <>
        <PageHeader
          title="Pelanggan Tidak Ditemukan"
          description={error || 'Data tidak ditemukan'}
        />
        <Button variant="outline" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Pelanggan
          </Link>
        </Button>
      </>
    );
  }

  // ✅ Render existing CustomerForm component with fetched data!
  return (
    <>
      <PageHeader
        title="Edit Pelanggan"
        description={`Mengedit: ${customer.name}`}
      />
      <CustomerForm customer={customer} />
    </>
  );
}
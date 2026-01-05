// src/app/(dashboard)/dashboard/customers/new/page.tsx
// Route: /dashboard/customers/new
// Purpose: Create new customer form

import { PageHeader } from '@/components/dashboard';
import { CustomerForm } from '@/components/customers';
import type { Metadata } from 'next';

// ==========================================
// CREATE CUSTOMER PAGE
// ==========================================

export const metadata: Metadata = {
  title: 'Tambah Pelanggan',
};

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        title="Tambah Pelanggan"
        description="Tambah pelanggan baru ke database Anda"
      />

      <CustomerForm />
    </>
  );
}

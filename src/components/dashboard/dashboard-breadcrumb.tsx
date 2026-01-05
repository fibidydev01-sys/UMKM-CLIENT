// src/components/dashboard/dashboard-breadcrumb.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// ==========================================
// DASHBOARD BREADCRUMB
// Auto-generates breadcrumb from pathname
// ==========================================

// Mapping untuk label yang lebih readable
const LABEL_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Produk',
  customers: 'Pelanggan',
  orders: 'Pesanan',
  settings: 'Pengaturan',
  new: 'Tambah Baru',
  edit: 'Edit',
  store: 'Toko',
};

function formatLabel(segment: string): string {
  // Check mapping first
  if (LABEL_MAP[segment.toLowerCase()]) {
    return LABEL_MAP[segment.toLowerCase()];
  }

  // Check if it's a UUID or ID (skip formatting)
  if (segment.match(/^[0-9a-f-]{36}$/i) || segment.match(/^[0-9]+$/)) {
    return 'Detail';
  }

  // Capitalize first letter
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  // Split pathname and filter empty strings
  const segments = pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = formatLabel(segment);
    const isLast = index === segments.length - 1;

    return {
      href,
      label,
      isLast,
    };
  });

  // Don't show breadcrumb if only one segment (e.g., /dashboard)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <Fragment key={item.href}>
            {/* Separator - SEBELUM item (kecuali item pertama) */}
            {index > 0 && <BreadcrumbSeparator />}

            {/* Breadcrumb Item */}
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
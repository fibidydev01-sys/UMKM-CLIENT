'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';
import { useStoreUrls } from '@/lib/store-url'; // ✅ NEW IMPORT

// ==========================================
// STORE BREADCRUMB COMPONENT
// ✅ FIXED: Uses store-url helper for subdomain routing
// ==========================================

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface StoreBreadcrumbProps {
  items: BreadcrumbItemData[];
  storeSlug: string;
  storeName: string;
}

export function StoreBreadcrumb({
  items,
  storeSlug,
  storeName,
}: StoreBreadcrumbProps) {
  // ✅ Smart URLs
  const urls = useStoreUrls(storeSlug);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home - ✅ FIXED */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={urls.home} className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{storeName}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic Items */}
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-[200px] truncate">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
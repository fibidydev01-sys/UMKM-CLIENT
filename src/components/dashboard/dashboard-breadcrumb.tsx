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

const LABEL_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  settings: 'Settings',
  'landing-builder': 'Landing Builder',
  onboarding: 'Store Setup',
  subscription: 'Subscription',
  new: 'New',
  edit: 'Edit',
  store: 'Store',
  toko: 'Store',
  channels: 'Channels',
  pembayaran: 'Payment',
  pengiriman: 'Shipping',
  seo: 'SEO',
  about: 'About',
  contact: 'Contact',
  testimonials: 'Testimonials',
  cta: 'Call to Action',
  'hero-section': 'Hero Section',
};

function formatLabel(segment: string): string {
  if (LABEL_MAP[segment.toLowerCase()]) {
    return LABEL_MAP[segment.toLowerCase()];
  }

  if (segment.match(/^[0-9a-f-]{36}$/i) || segment.match(/^[0-9]+$/)) {
    return 'Detail';
  }

  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

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

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
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
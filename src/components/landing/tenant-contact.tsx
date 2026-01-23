'use client';

import { lazy, Suspense } from 'react';
import { extractContactData, useContactBlock } from '@/lib/landing';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantContactProps {
  config?: TenantLandingConfig['contact'];
  tenant: Tenant | PublicTenant;
}

/**
 * Tenant Contact Component
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.contactTitle
 * - subtitle → tenant.contactSubtitle
 * - whatsapp → tenant.whatsapp
 * - phone → tenant.phone
 * - email → tenant.email
 * - address → tenant.address
 * - storeName → tenant.name
 * - mapUrl → tenant.contactMapUrl
 * - showMap → tenant.contactShowMap
 * - showForm → tenant.contactShowForm
 *
 * 🚀 BLOCK VARIANTS:
 * - contact1 → Default
 * - contact2 → Split Layout
 * - contact3 → Centered
 * - contact4 → Map Focus
 * - contact5 → Minimal
 * - contact6 → Social Focused
 * - contact7 → Card Grid
 */
export function TenantContact({ config, tenant }: TenantContactProps) {
  const templateBlock = useContactBlock();
  const block = config?.block || templateBlock;

  // Extract contact data directly from tenant (Data Contract fields)
  const contactData = extractContactData(tenant, config ? { contact: config } : undefined);

  const commonProps = {
    title: contactData.title,
    subtitle: contactData.subtitle,
    whatsapp: contactData.whatsapp,
    phone: contactData.phone,
    email: contactData.email,
    address: contactData.address,
    storeName: tenant.name,
    mapUrl: contactData.mapUrl,
    showMap: contactData.showMap,
    showForm: contactData.showForm,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('contact', '');
  const ContactComponent = lazy(() =>
    import(`./blocks/contact/contact${blockNumber}`)
      .then((mod) => ({ default: mod[`Contact${blockNumber}`] }))
      .catch(() => import('./blocks/contact/contact1').then((mod) => ({ default: mod.Contact1 })))
  );

  // Render with Suspense for lazy loading
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactComponent {...commonProps} />
    </Suspense>
  );
}

function ContactSkeleton() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

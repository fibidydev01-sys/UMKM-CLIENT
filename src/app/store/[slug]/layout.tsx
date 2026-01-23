import { tenantsApi } from '@/lib/api';
import { StoreHeader, StoreFooter, StoreNotFound } from '@/components/store';
import { LocalBusinessSchema } from '@/components/seo';
import { TemplateProvider } from '@/lib/landing';
import { generateThemeCSS } from '@/lib/theme';
import { createTenantMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import type { PublicTenant } from '@/types';

// ==========================================
// STORE LAYOUT
// Wraps all store pages for a specific tenant
// 🚀 NOW WITH TEMPLATE PROVIDER!
// ==========================================

// ✅ FIX: Force dynamic rendering to prevent stale tenant data cache
export const dynamic = 'force-dynamic';

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Theme color mapping moved to @/lib/theme

// Fetch tenant data (server-side)
async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    const tenant = await tenantsApi.getBySlug(slug);
    return tenant;
  } catch {
    return null;
  }
}

// ==========================================
// GENERATE METADATA (Enhanced with SEO)
// ==========================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    return {
      title: 'Toko Tidak Ditemukan',
      description: 'Toko yang Anda cari tidak ditemukan atau sudah tidak aktif.',
      robots: { index: false, follow: false },
    };
  }

  // Use enhanced metadata generator from lib/seo.ts
  return createTenantMetadata({
    tenant: {
      name: tenant.name,
      slug: tenant.slug,
      description: tenant.description,
      logo: tenant.logo,
      heroBackgroundImage: tenant.heroBackgroundImage,
      metaTitle: tenant.metaTitle,
      metaDescription: tenant.metaDescription,
    },
  });
}

// ==========================================
// STORE LAYOUT COMPONENT
// ==========================================

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  // Show not found if tenant doesn't exist or inactive
  if (!tenant || tenant.status !== 'ACTIVE') {
    return <StoreNotFound slug={slug} />;
  }

  // Get theme color from tenant
  const primaryHex = tenant.theme?.primaryColor || '';

  // Get template ID from tenant config (if available)
  const landingConfig = tenant.landingConfig as { template?: string } | null;
  const templateId = landingConfig?.template || 'suspended-minimalist';

  return (
    <>
      {/* ==========================================
          INJECT TENANT THEME CSS VARIABLES
          Override --primary for this store
      ========================================== */}
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(primaryHex) }} />

      <div className="tenant-theme flex min-h-screen flex-col">
        {/* ==========================================
            LOCAL BUSINESS SCHEMA (JSON-LD)
            Per-tenant structured data for Google
        ========================================== */}
        <LocalBusinessSchema
          tenant={{
            name: tenant.name,
            slug: tenant.slug,
            description: tenant.description,
            category: tenant.category,
            whatsapp: tenant.whatsapp || '',
            phone: tenant.phone,
            address: tenant.address,
            logo: tenant.logo,
            heroBackgroundImage: tenant.heroBackgroundImage,
            socialLinks: tenant.socialLinks,
          }}
        />

        <StoreHeader tenant={tenant} />

        {/* 🚀 WRAP CHILDREN WITH TEMPLATE PROVIDER */}
        <main className="flex-1">
          <TemplateProvider initialTemplateId={templateId}>
            {children}
          </TemplateProvider>
        </main>

        <StoreFooter tenant={tenant} />
      </div>
    </>
  );
}

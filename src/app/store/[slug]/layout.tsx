import { tenantsApi } from '@/lib/api';
import { StoreHeader, StoreFooter, StoreNotFound } from '@/components/store';
import { LocalBusinessSchema } from '@/components/seo';
import { TemplateProvider } from '@/lib/landing';
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

// ==========================================
// THEME COLOR MAPPING
// Predefined OKLCH values for each theme color
// ==========================================
const THEME_OKLCH_MAP: Record<string, { light: string; dark: string }> = {
  // Sky/Default
  '#0ea5e9': {
    light: 'oklch(0.685 0.169 237.323)',
    dark: 'oklch(0.746 0.16 232.661)',
  },
  // Emerald
  '#10b981': {
    light: 'oklch(0.696 0.17 162.48)',
    dark: 'oklch(0.765 0.177 163.223)',
  },
  // Rose
  '#f43f5e': {
    light: 'oklch(0.645 0.246 16.439)',
    dark: 'oklch(0.712 0.194 13.428)',
  },
  // Amber
  '#f59e0b': {
    light: 'oklch(0.769 0.188 70.08)',
    dark: 'oklch(0.822 0.165 68.293)',
  },
  // Violet
  '#8b5cf6': {
    light: 'oklch(0.606 0.25 292.717)',
    dark: 'oklch(0.702 0.183 293.541)',
  },
  // Orange
  '#f97316': {
    light: 'oklch(0.705 0.213 47.604)',
    dark: 'oklch(0.762 0.182 50.939)',
  },
};

// Default pink (from your globals.css)
const DEFAULT_THEME = {
  light: 'oklch(0.656 0.241 354.308)',
  dark: 'oklch(0.718 0.202 349.761)',
};

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
      banner: tenant.banner,
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
  const primaryHex = tenant.theme?.primaryColor?.toLowerCase() || '';

  // Get OKLCH values from map, or use default pink
  const themeColors = THEME_OKLCH_MAP[primaryHex] || DEFAULT_THEME;

  // Get template ID from tenant config (if available)
  const landingConfig = tenant.landingConfig as { template?: string } | null;
  const templateId = landingConfig?.template || 'suspended-minimalist';

  return (
    <>
      {/* ==========================================
          INJECT TENANT THEME CSS VARIABLES
          Override --primary for this store
      ========================================== */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Light Mode */
            .tenant-theme {
              --primary: ${themeColors.light};
              --ring: ${themeColors.light};
              --sidebar-primary: ${themeColors.light};
              --sidebar-ring: ${themeColors.light};
              --chart-1: ${themeColors.light};
            }

            /* Dark Mode */
            .dark .tenant-theme,
            .tenant-theme.dark {
              --primary: ${themeColors.dark};
              --ring: ${themeColors.dark};
              --sidebar-primary: ${themeColors.dark};
              --sidebar-ring: ${themeColors.dark};
              --chart-1: ${themeColors.dark};
            }
          `,
        }}
      />

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
            banner: tenant.banner,
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

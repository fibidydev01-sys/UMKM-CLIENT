import { tenantsApi } from '@/lib/api';
import { StoreHeader, StoreFooter, StoreNotFound } from '@/components/store';
import { LocalBusinessSchema } from '@/components/seo';
import { TemplateProvider } from '@/lib/landing';
import { generateThemeCSS } from '@/lib/theme';
import { createTenantMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import type { PublicTenant } from '@/types';

export const dynamic = 'force-dynamic';

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    const tenant = await tenantsApi.getBySlug(slug);
    return tenant;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    return {
      title: 'Store Not Found',
      description: 'The store you are looking for does not exist or is no longer active.',
      robots: { index: false, follow: false },
    };
  }

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

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant || tenant.status !== 'ACTIVE') {
    return <StoreNotFound slug={slug} />;
  }

  const primaryHex = tenant.theme?.primaryColor || '';
  const landingConfig = tenant.landingConfig as { template?: string } | null;
  const templateId = landingConfig?.template || 'suspended-minimalist';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(primaryHex) }} />

      <div className="tenant-theme flex min-h-screen flex-col">
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
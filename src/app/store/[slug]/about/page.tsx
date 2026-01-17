import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tenantsApi } from '@/lib/api';
import { TenantAbout } from '@/components/landing';
import { BreadcrumbSchema, generateTenantBreadcrumbs } from '@/components/seo';
import type { PublicTenant } from '@/types';

// ==========================================
// ABOUT PAGE
// ==========================================

interface AboutPageProps {
  params: Promise<{ slug: string }>;
}

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    return { title: 'Not Found' };
  }

  // ✅ FIX: No type annotation
  const landingConfig = tenant.landingConfig;
  const aboutContent = landingConfig?.about?.config?.content;
  const description = aboutContent
    ? String(aboutContent).slice(0, 160)
    : tenant.description || `Tentang ${tenant.name}`;

  return {
    title: `Tentang Kami | ${tenant.name}`,
    description,
    openGraph: {
      title: `Tentang ${tenant.name}`,
      description,
      images: tenant.banner ? [tenant.banner] : tenant.logo ? [tenant.logo] : [],
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    notFound();
  }

  // ✅ FIX: No type annotation
  const landingConfig = tenant.landingConfig;
  const aboutConfig = landingConfig?.about;

  const breadcrumbs = [
    ...generateTenantBreadcrumbs({ name: tenant.name, slug: tenant.slug }),
    { name: 'Tentang Kami', url: `/store/${slug}/about` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="container px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {aboutConfig?.title || 'Tentang Kami'}
          </h1>
          {aboutConfig?.subtitle && (
            <p className="text-lg text-muted-foreground">
              {aboutConfig.subtitle}
            </p>
          )}
        </div>

        {/* About Content */}
        {aboutConfig?.config ? (
          <TenantAbout
            config={aboutConfig}
            fallbacks={{
              content: tenant.description || undefined,
              image: tenant.banner || undefined,
            }}
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert">
              {tenant.description ? (
                <p>{tenant.description}</p>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    Informasi tentang bisnis belum ditambahkan
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
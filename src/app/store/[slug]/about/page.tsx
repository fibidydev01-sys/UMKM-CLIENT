import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { tenantsApi } from '@/lib/api';
import { TenantAbout } from '@/components/landing';
import { BreadcrumbSchema, generateTenantBreadcrumbs } from '@/components/seo';
import type { PublicTenant } from '@/types';

// ==========================================
// ABOUT PAGE - FULL WIDTH
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

  const landingConfig = tenant.landingConfig;
  const aboutContent = landingConfig?.about?.config?.content;
  const description = aboutContent
    ? String(aboutContent).slice(0, 160)
    : tenant.description || `About ${tenant.name}`;

  return {
    title: `About Us | ${tenant.name}`,
    description,
    openGraph: {
      title: `About ${tenant.name}`,
      description,
      images: tenant.heroBackgroundImage ? [tenant.heroBackgroundImage] : tenant.logo ? [tenant.logo] : [],
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    notFound();
  }

  const landingConfig = tenant.landingConfig;
  const aboutConfig = landingConfig?.about;

  const breadcrumbs = [
    ...generateTenantBreadcrumbs({ name: tenant.name, slug: tenant.slug }),
    { name: 'About Us', url: `/store/${slug}/about` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Full width — no container wrapper */}
      <div className="w-full">
        <Suspense fallback={<AboutSkeleton />}>
          <TenantAbout
            config={aboutConfig}
            tenant={tenant}
          />
        </Suspense>
      </div>
    </>
  );
}

// Loading skeleton
function AboutSkeleton() {
  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <div className="h-10 bg-muted rounded-lg w-2/3 mx-auto" />
            <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto" />
          </div>

          {/* Grid skeleton */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="aspect-[4/4] bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-full" />
              <div className="h-6 bg-muted rounded w-5/6" />
              <div className="h-6 bg-muted rounded w-4/6" />

              <div className="space-y-3 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-muted rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
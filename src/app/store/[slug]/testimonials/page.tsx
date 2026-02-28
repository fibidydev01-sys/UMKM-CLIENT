import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tenantsApi } from '@/lib/api';
import { normalizeTestimonials } from '@/lib/landing';
import { TenantTestimonials } from '@/components/landing';
import { BreadcrumbSchema, generateTenantBreadcrumbs } from '@/components/seo';
import type { PublicTenant, Testimonial } from '@/types';

// ==========================================
// TESTIMONIALS PAGE
// ==========================================

interface TestimonialsPageProps {
  params: Promise<{ slug: string }>;
}

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: TestimonialsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    return { title: 'Not Found' };
  }

  return {
    title: `Reviews & Testimonials | ${tenant.name}`,
    description: `Read customer reviews and testimonials for ${tenant.name}. See what shoppers are saying.`,
    openGraph: {
      title: `${tenant.name} Reviews`,
      description: `Customer testimonials for ${tenant.name}`,
      images: tenant.heroBackgroundImage ? [tenant.heroBackgroundImage] : tenant.logo ? [tenant.logo] : [],
    },
  };
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    notFound();
  }

  const landingConfig = tenant.landingConfig;
  const testimonialConfig = landingConfig?.testimonials;
  const testimonialItems = normalizeTestimonials(tenant.testimonials as Testimonial[] | undefined);

  const breadcrumbs = [
    ...generateTenantBreadcrumbs({ name: tenant.name, slug: tenant.slug }),
    { name: 'Testimonials', url: `/store/${slug}/testimonials` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="container px-4 py-8">
        {testimonialItems.length > 0 ? (
          <TenantTestimonials
            config={testimonialConfig}
            tenant={tenant}
          />
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No testimonials yet</p>
          </div>
        )}
      </div>
    </>
  );
}
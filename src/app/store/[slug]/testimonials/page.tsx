import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tenantsApi } from '@/lib/api';
import { normalizeTestimonials } from '@/lib/landing';
import { TenantTestimonials } from '@/components/landing';
import { BreadcrumbSchema, generateTenantBreadcrumbs } from '@/components/seo';
import { Star } from 'lucide-react';
import type { PublicTenant } from '@/types';

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
    title: `Testimoni & Review | ${tenant.name}`,
    description: `Baca testimoni dan review pelanggan ${tenant.name}. Lihat pengalaman customer yang sudah berbelanja.`,
    openGraph: {
      title: `Review ${tenant.name}`,
      description: `Testimoni pelanggan ${tenant.name}`,
      images: tenant.banner ? [tenant.banner] : tenant.logo ? [tenant.logo] : [],
    },
  };
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    notFound();
  }

  // ✅ FIX: No type annotation
  const landingConfig = tenant.landingConfig;
  const testimonialConfig = landingConfig?.testimonials;
  const testimonialItems = normalizeTestimonials(testimonialConfig?.config?.items);

  // Calculate stats
  const totalReviews = testimonialItems.length;
  const avgRating = totalReviews > 0
    ? (testimonialItems.reduce((acc, t) => acc + (t.rating || 5), 0) / totalReviews).toFixed(1)
    : '0';

  const breadcrumbs = [
    ...generateTenantBreadcrumbs({ name: tenant.name, slug: tenant.slug }),
    { name: 'Testimoni', url: `/store/${slug}/testimonials` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="container px-4 py-8 space-y-8">
        {/* Page Header with Stats */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {testimonialConfig?.title || 'Testimoni Pelanggan'}
          </h1>
          {testimonialConfig?.subtitle && (
            <p className="text-lg text-muted-foreground mb-6">
              {testimonialConfig.subtitle}
            </p>
          )}

          {/* Stats */}
          {totalReviews > 0 && (
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(Number(avgRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg">{avgRating}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {totalReviews} review
              </span>
            </div>
          )}
        </div>

        {/* Testimonials Content */}
        {totalReviews > 0 ? (
          <TenantTestimonials
            config={{
              ...testimonialConfig,
              config: {
                items: testimonialItems,
              },
            }}
          />
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">
              Belum ada testimoni
            </p>
          </div>
        )}
      </div>
    </>
  );
}
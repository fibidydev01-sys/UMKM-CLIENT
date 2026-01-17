import { notFound } from 'next/navigation';
import { tenantsApi, productsApi } from '@/lib/api';
import { normalizeTestimonials } from '@/lib/landing';
import {
  TenantHero,
  TenantAbout,
  TenantProducts,
  TenantTestimonials,
  TenantContact,
  TenantCta,
} from '@/components/landing';
import {
  BreadcrumbSchema,
  ProductListSchema,
  generateTenantBreadcrumbs,
} from '@/components/seo';
import type { PublicTenant, Product } from '@/types';

// ==========================================
// STORE HOMEPAGE - CUSTOM LANDING ONLY
// ==========================================

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

async function getProducts(slug: string, limit = 8): Promise<Product[]> {
  try {
    const response = await productsApi.getByStore(slug, {
      isActive: true,
      limit,
    });
    return response.data;
  } catch {
    return [];
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    notFound();
  }

  // ✅ FIX: No type annotation, let TypeScript infer
  const landingConfig = tenant.landingConfig;
  const breadcrumbs = generateTenantBreadcrumbs({
    name: tenant.name,
    slug: tenant.slug,
  });

  // Fetch products
  const productLimit = (landingConfig?.products?.config?.limit as number) || 8;
  const products = await getProducts(slug, productLimit);

  // Testimonials
  const testimonialItems = normalizeTestimonials(landingConfig?.testimonials?.config?.items);
  const testimonialsEnabled = landingConfig?.testimonials?.enabled === true;
  const hasTestimonials = testimonialsEnabled && testimonialItems.length > 0;

  // Check if any section is enabled
  const hasAnySectionEnabled =
    landingConfig?.hero?.enabled ||
    landingConfig?.about?.enabled ||
    landingConfig?.products?.enabled ||
    hasTestimonials ||
    landingConfig?.cta?.enabled ||
    landingConfig?.contact?.enabled;

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {products.length > 0 && (
        <ProductListSchema
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            images: p.images,
          }))}
          tenant={{ name: tenant.name, slug: tenant.slug }}
          listName={`Produk ${tenant.name}`}
        />
      )}

      <div className="container px-4 py-8 space-y-8">
        {landingConfig?.hero?.enabled && (
          <TenantHero tenant={tenant} config={landingConfig.hero} />
        )}

        {landingConfig?.about?.enabled && (
          <TenantAbout tenant={tenant} config={landingConfig.about} />
        )}

        {landingConfig?.products?.enabled && products.length > 0 && (
          <TenantProducts
            products={products}
            storeSlug={slug}
            config={landingConfig.products}
          />
        )}

        {hasTestimonials && (
          <TenantTestimonials
            config={{
              ...landingConfig?.testimonials,
              config: {
                items: testimonialItems,
              },
            }}
          />
        )}

        {landingConfig?.cta?.enabled && (
          <TenantCta storeSlug={slug} config={landingConfig.cta} />
        )}

        {landingConfig?.contact?.enabled && (
          <TenantContact tenant={tenant} config={landingConfig.contact} />
        )}

        {!hasAnySectionEnabled && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-2">
              Landing page belum dikonfigurasi
            </p>
            <p className="text-sm text-muted-foreground">
              Aktifkan section di Dashboard &gt; Settings &gt; Landing
            </p>
          </div>
        )}
      </div>
    </>
  );
}
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

// ✅ FIX: Force dynamic rendering to prevent stale landing config cache
export const dynamic = 'force-dynamic';

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

  // 🔥 DEBUG: Log what we're reading from database
  console.group(`🏪 [STORE PAGE] ${slug}`);
  console.log('📥 Landing Config from DB (JSON):', JSON.stringify(landingConfig, null, 2));
  console.log('🎯 HERO SECTION:', JSON.stringify(landingConfig?.hero, null, 2));
  console.log('📊 Sections enabled:', {
    hero: landingConfig?.hero?.enabled,
    about: landingConfig?.about?.enabled,
    products: landingConfig?.products?.enabled,
    testimonials: landingConfig?.testimonials?.enabled,
    cta: landingConfig?.cta?.enabled,
    contact: landingConfig?.contact?.enabled,
  });
  console.groupEnd();

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

      {/* TemplateProvider now in layout.tsx - no need to wrap here */}
      <div className="container px-4 py-8 space-y-8">
        {landingConfig?.hero?.enabled && (
          <TenantHero
            config={landingConfig.hero}
            fallbacks={{
              title: tenant.name,
              subtitle: tenant.description,
              backgroundImage: tenant.banner || undefined,
              logo: tenant.logo || undefined,
              storeName: tenant.name,
            }}
          />
        )}

        {landingConfig?.about?.enabled && (
          <TenantAbout
            config={landingConfig.about}
            fallbacks={{
              content: tenant.description || undefined,
              image: tenant.banner || undefined,
            }}
          />
        )}

        {landingConfig?.products?.enabled && products.length > 0 && (
          <TenantProducts
            products={products}
            config={landingConfig.products}
            storeSlug={slug}
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
          <TenantCta config={landingConfig.cta} storeSlug={slug} />
        )}

        {landingConfig?.contact?.enabled && (
          <TenantContact
            config={landingConfig.contact}
            fallbacks={{
              whatsapp: tenant.whatsapp || null,
              phone: tenant.phone || null,
              address: tenant.address || null,
              storeName: tenant.name,
            }}
          />
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

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
import type { PublicTenant, Product, Testimonial, SectionKey } from '@/types';

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

  // Check if testimonials has items (for conditional rendering)
  const testimonialItems = normalizeTestimonials(tenant.testimonials as Testimonial[] | undefined);
  const testimonialsEnabled = landingConfig?.testimonials?.enabled === true;
  const hasTestimonials = testimonialsEnabled && testimonialItems.length > 0;

  // 🚀 Section order - use config.sectionOrder or default order
  const defaultOrder: SectionKey[] = ['hero', 'about', 'products', 'testimonials', 'cta', 'contact'];
  const sectionOrder = landingConfig?.sectionOrder || defaultOrder;

  // Section enabled checks
  const heroEnabled = true; // Hero always enabled (critical: logo + heroBackgroundImage)
  const aboutEnabled = landingConfig?.about?.enabled === true;
  const productsEnabled = landingConfig?.products?.enabled === true && products.length > 0;
  const ctaEnabled = landingConfig?.cta?.enabled === true;
  const contactEnabled = landingConfig?.contact?.enabled === true;

  // Check if any section is enabled
  const hasAnySectionEnabled =
    heroEnabled || aboutEnabled || productsEnabled || hasTestimonials || ctaEnabled || contactEnabled;

  // 🚀 Section rendering map
  const sectionComponents: Record<SectionKey, React.ReactNode> = {
    hero: heroEnabled ? (
      <TenantHero key="hero" config={landingConfig?.hero} tenant={tenant} />
    ) : null,
    about: aboutEnabled ? (
      <TenantAbout key="about" config={landingConfig?.about} tenant={tenant} />
    ) : null,
    products: productsEnabled ? (
      <TenantProducts key="products" products={products} config={landingConfig?.products} storeSlug={slug} />
    ) : null,
    testimonials: hasTestimonials ? (
      <TenantTestimonials key="testimonials" config={landingConfig?.testimonials} tenant={tenant} />
    ) : null,
    cta: ctaEnabled ? (
      <TenantCta key="cta" config={landingConfig?.cta} tenant={tenant} />
    ) : null,
    contact: contactEnabled ? (
      <TenantContact key="contact" config={landingConfig?.contact} tenant={tenant} />
    ) : null,
  };

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
        {/* 🚀 Render sections in custom order (from drag & drop) */}
        {sectionOrder.map((sectionKey) => sectionComponents[sectionKey]).filter(Boolean)}

        {/* Empty State */}
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

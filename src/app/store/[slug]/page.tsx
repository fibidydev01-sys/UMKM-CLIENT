import { notFound } from 'next/navigation';
import { tenantsApi, productsApi } from '@/lib/api';
// Existing store components (fallback)
import { StoreHero, FeaturedProducts } from '@/components/store';
// New landing components
import {
  TenantHero,
  TenantAbout,
  TenantProducts,
  TenantTestimonials,
  TenantContact,
  TenantCta,
} from '@/components/landing';
// SEO Components
import {
  BreadcrumbSchema,
  ProductListSchema,
  generateTenantBreadcrumbs,
} from '@/components/seo';
import type {
  PublicTenant,
  Product,
  Testimonial,
} from '@/types';

// ==========================================
// HELPER: Flatten nested array untuk testimonials
// ==========================================
function flattenTestimonialItems(items: unknown): Testimonial[] {
  if (!items) return [];

  let result = items;

  // Flatten nested arrays [[item]] -> [item]
  while (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
    result = result[0];
  }

  if (!Array.isArray(result)) return [];

  return result.filter(
    (item): item is Testimonial =>
      item &&
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      item.name.trim() !== '' &&
      typeof item.content === 'string' &&
      item.content.trim() !== ''
  );
}

// ==========================================
// STORE HOMEPAGE
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

async function getFeaturedProducts(slug: string): Promise<Product[]> {
  try {
    const response = await productsApi.getByStore(slug, {
      isActive: true,
      isFeatured: true,
      limit: 8,
    });
    return response.data;
  } catch {
    return [];
  }
}

async function getLatestProducts(slug: string): Promise<Product[]> {
  try {
    const response = await productsApi.getByStore(slug, {
      isActive: true,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 8,
    });
    return response.data;
  } catch {
    return [];
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

  // ==========================================
  // LANGSUNG PAKAI DATA DARI DB - GA ADA DEFAULT!
  // ==========================================
  const landingConfig = tenant.landingConfig;

  // Generate breadcrumbs for SEO
  const breadcrumbs = generateTenantBreadcrumbs({
    name: tenant.name,
    slug: tenant.slug,
  });

  // ==========================================
  // MODE 1: DEFAULT VIEW (tidak ada config atau tidak enabled)
  // ==========================================
  if (!landingConfig?.enabled) {
    const [featuredProducts, latestProducts] = await Promise.all([
      getFeaturedProducts(slug),
      getLatestProducts(slug),
    ]);

    const allProducts = [...featuredProducts, ...latestProducts].filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

    return (
      <>
        <BreadcrumbSchema items={breadcrumbs} />
        {allProducts.length > 0 && (
          <ProductListSchema
            products={allProducts.map((p) => ({
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

        <div className="container px-4 py-8 space-y-12">
          <StoreHero tenant={tenant} />

          {featuredProducts.length > 0 && (
            <FeaturedProducts
              products={featuredProducts}
              storeSlug={slug}
              title="Produk Unggulan"
            />
          )}

          {latestProducts.length > 0 && (
            <FeaturedProducts
              products={latestProducts}
              storeSlug={slug}
              title="Produk Terbaru"
            />
          )}

          {featuredProducts.length === 0 && latestProducts.length === 0 && (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-2">
                Belum ada produk tersedia
              </p>
              <p className="text-sm text-muted-foreground">
                Hubungi penjual untuk informasi lebih lanjut
              </p>
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // MODE 2: CUSTOM LANDING PAGE
  // Langsung pakai nilai dari DB, GA ADA FALLBACK!
  // ==========================================
  const productLimit = (landingConfig.products?.config?.limit as number) || 8;
  const products = await getProducts(slug, productLimit);

  // Get testimonials - langsung dari DB
  const testimonialItems = flattenTestimonialItems(landingConfig.testimonials?.config?.items);
  const testimonialsEnabled = landingConfig.testimonials?.enabled === true;
  const hasTestimonials = testimonialsEnabled && testimonialItems.length > 0;

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
        {/* Hero - langsung cek enabled dari DB */}
        {landingConfig.hero?.enabled && (
          <TenantHero tenant={tenant} config={landingConfig.hero} />
        )}

        {/* About - langsung cek enabled dari DB */}
        {landingConfig.about?.enabled && (
          <TenantAbout tenant={tenant} config={landingConfig.about} />
        )}

        {/* Products - langsung cek enabled dari DB */}
        {landingConfig.products?.enabled && products.length > 0 && (
          <TenantProducts
            products={products}
            storeSlug={slug}
            config={landingConfig.products}
          />
        )}

        {/* Testimonials - langsung cek enabled dari DB */}
        {hasTestimonials && (
          <TenantTestimonials
            config={{
              ...landingConfig.testimonials,
              config: {
                items: testimonialItems,
              },
            }}
          />
        )}

        {/* CTA - langsung cek enabled dari DB */}
        {landingConfig.cta?.enabled && (
          <TenantCta storeSlug={slug} config={landingConfig.cta} />
        )}

        {/* Contact - langsung cek enabled dari DB */}
        {landingConfig.contact?.enabled && (
          <TenantContact tenant={tenant} config={landingConfig.contact} />
        )}

        {/* Empty state jika semua section disabled */}
        {!landingConfig.hero?.enabled &&
          !landingConfig.about?.enabled &&
          !landingConfig.products?.enabled &&
          !hasTestimonials &&
          !landingConfig.cta?.enabled &&
          !landingConfig.contact?.enabled && (
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
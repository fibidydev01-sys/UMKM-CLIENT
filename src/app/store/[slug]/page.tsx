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
import { DEFAULT_LANDING_CONFIG } from '@/types/landing';
import type { PublicTenant, Product } from '@/types';

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

  // Merge tenant config with defaults
  const landingConfig = {
    ...DEFAULT_LANDING_CONFIG,
    ...tenant.landingConfig,
  };

  // Generate breadcrumbs for SEO
  const breadcrumbs = generateTenantBreadcrumbs({
    name: tenant.name,
    slug: tenant.slug,
  });

  // ==========================================
  // MODE 1: DEFAULT VIEW (landingConfig.enabled = false)
  // Uses existing StoreHero + FeaturedProducts components
  // ==========================================
  if (!landingConfig.enabled) {
    const [featuredProducts, latestProducts] = await Promise.all([
      getFeaturedProducts(slug),
      getLatestProducts(slug),
    ]);

    // Combine all products for ProductListSchema
    const allProducts = [...featuredProducts, ...latestProducts].filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

    return (
      <>
        {/* ==========================================
            SEO: Structured Data (JSON-LD)
        ========================================== */}
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

        {/* ==========================================
            PAGE CONTENT
        ========================================== */}
        <div className="container px-4 py-8 space-y-12">
          {/* Hero Section - EXISTING COMPONENT */}
          <StoreHero tenant={tenant} />

          {/* Featured Products - EXISTING COMPONENT */}
          {featuredProducts.length > 0 && (
            <FeaturedProducts
              products={featuredProducts}
              storeSlug={slug}
              title="Produk Unggulan"
            />
          )}

          {/* Latest Products - EXISTING COMPONENT */}
          {latestProducts.length > 0 && (
            <FeaturedProducts
              products={latestProducts}
              storeSlug={slug}
              title="Produk Terbaru"
            />
          )}

          {/* Empty State */}
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
  // MODE 2: CUSTOM LANDING PAGE (landingConfig.enabled = true)
  // Uses new Landing components
  // ==========================================
  const productLimit = landingConfig.products?.config?.limit || 8;
  const products = await getProducts(slug, productLimit);

  return (
    <>
      {/* ==========================================
          SEO: Structured Data (JSON-LD)
      ========================================== */}
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

      {/* ==========================================
          PAGE CONTENT
      ========================================== */}
      <div className="container px-4 py-8 space-y-8">
        {/* Hero - NEW COMPONENT */}
        {landingConfig.hero?.enabled && (
          <TenantHero tenant={tenant} config={landingConfig.hero} />
        )}

        {/* About - NEW COMPONENT */}
        {landingConfig.about?.enabled && (
          <TenantAbout tenant={tenant} config={landingConfig.about} />
        )}

        {/* Products - NEW COMPONENT */}
        {landingConfig.products?.enabled && products.length > 0 && (
          <TenantProducts
            products={products}
            storeSlug={slug}
            config={landingConfig.products}
          />
        )}

        {/* Testimonials - NEW COMPONENT */}
        {landingConfig.testimonials?.enabled && (
          <TenantTestimonials config={landingConfig.testimonials} />
        )}

        {/* CTA - NEW COMPONENT */}
        {landingConfig.cta?.enabled && (
          <TenantCta storeSlug={slug} config={landingConfig.cta} />
        )}

        {/* Contact - NEW COMPONENT */}
        {landingConfig.contact?.enabled && (
          <TenantContact tenant={tenant} config={landingConfig.contact} />
        )}

        {/* Empty State - All sections disabled */}
        {!landingConfig.hero?.enabled &&
          !landingConfig.about?.enabled &&
          !landingConfig.products?.enabled &&
          !landingConfig.testimonials?.enabled &&
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
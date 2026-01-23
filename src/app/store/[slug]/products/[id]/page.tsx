import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { tenantsApi, productsApi } from '@/lib/api';
import {
  StoreBreadcrumb,
  ProductGallery,
  ProductInfo,
  ProductActions,
  ShippingInfo,
  RelatedProducts,
  ProductGridSkeleton,
} from '@/components/store';
import {
  ProductSchema,
  BreadcrumbSchema,
  SocialShare,
  generateProductBreadcrumbs,
} from '@/components/seo';
import { createProductMetadata, getTenantUrl } from '@/lib/seo';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';
import type { PublicTenant, Product } from '@/types';

// ==========================================
// PRODUCT DETAIL PAGE
// ==========================================

interface ProductPageProps {
  params: Promise<{ slug: string; id: string }>;
}

// Fetch tenant
async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

// Fetch product (PUBLIC endpoint)
async function getProduct(
  slug: string,
  productId: string
): Promise<Product | null> {
  try {
    return await productsApi.getByStoreAndId(slug, productId);
  } catch {
    return null;
  }
}

// Fetch related products
async function getRelatedProducts(
  slug: string,
  currentId: string,
  category?: string | null
): Promise<Product[]> {
  try {
    const response = await productsApi.getByStore(slug, {
      isActive: true,
      category: category || undefined,
      limit: 4,
    });
    return response.data.filter((p) => p.id !== currentId);
  } catch {
    return [];
  }
}

// ==========================================
// GENERATE METADATA (Enhanced with SEO)
// ==========================================

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const [tenant, product] = await Promise.all([
    getTenant(slug),
    getProduct(slug, id),
  ]);

  if (!tenant || !product) {
    return {
      title: 'Produk Tidak Ditemukan',
      description: 'Produk yang Anda cari tidak ditemukan.',
      robots: { index: false, follow: false },
    };
  }

  // Use enhanced metadata generator from lib/seo.ts
  return createProductMetadata({
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      category: product.category,
    },
    tenant: {
      name: tenant.name,
      slug: tenant.slug,
    },
  });
}

// ==========================================
// PRODUCT PAGE COMPONENT
// ==========================================

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, id } = await params;

  const [tenant, product] = await Promise.all([
    getTenant(slug),
    getProduct(slug, id),
  ]);

  // Not found
  if (!tenant || !product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(slug, id, product.category);

  // Generate breadcrumbs for SEO
  const breadcrumbs = generateProductBreadcrumbs(
    { name: tenant.name, slug: tenant.slug },
    {
      name: product.name,
      id: product.id,
      slug: product.slug,
      category: product.category,
    }
  );

  // Generate product URL for sharing
  const productPath = product.slug
    ? `/p/${product.slug}`
    : `/product/${product.id}`;
  const productUrl = getTenantUrl(tenant.slug, productPath);

  return (
    <>
      {/* ==========================================
          SEO: Structured Data (JSON-LD)
      ========================================== */}
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          images: product.images,
          category: product.category,
          sku: product.sku,
          stock: product.stock,
          trackStock: product.trackStock,
        }}
        tenant={{
          name: tenant.name,
          slug: tenant.slug,
          whatsapp: tenant.whatsapp || '', // ✅ FIX: Provide default empty string
        }}
      />

      {/* ==========================================
          PAGE CONTENT
      ========================================== */}
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <StoreBreadcrumb
            storeSlug={slug}
            storeName={tenant.name}
            items={[
              { label: 'Produk', href: `/store/${slug}/products` },
              { label: product.name },
            ]}
          />
        </div>

        {/* Product Detail */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Info & Actions */}
          <div className="space-y-6">
            <ProductInfo product={product} />

            {/* Shipping Information */}
            <ShippingInfo tenant={tenant} />

            {/* Social Share Buttons */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Bagikan produk ini:
              </span>
              <SocialShare
                url={productUrl}
                title={`${product.name} - ${tenant.name}`}
                description={
                  product.description ||
                  `Beli ${product.name} di ${tenant.name}`
                }
                variant="buttons"
              />
            </div>

            <Separator />
            <ProductActions product={product} tenant={tenant} />
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Deskripsi Produk</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {product.description}
              </p>
            </div>
          </section>
        )}

        {/* Related Products */}
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <RelatedProducts products={relatedProducts} storeSlug={slug} />
        </Suspense>
      </div>
    </>
  );
}
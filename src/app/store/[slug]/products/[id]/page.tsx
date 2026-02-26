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
import { createProductMetadata } from '@/lib/seo';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';
import type { PublicTenant, Product } from '@/types';

// ══════════════════════════════════════════════════════════════
// PRODUCT DETAIL PAGE - v2.3 (MULTI-CURRENCY FIX)
// ✅ FIX: currency dari tenant di-pass ke ProductInfo & RelatedProducts
// ══════════════════════════════════════════════════════════════

interface ProductPageProps {
  params: Promise<{ slug: string; id: string }>;
}

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, id } = await params;

  const [tenant, product] = await Promise.all([
    getTenant(slug),
    getProduct(slug, id),
  ]);

  if (!tenant || !product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(slug, id, product.category);

  const breadcrumbs = generateProductBreadcrumbs(
    { name: tenant.name, slug: tenant.slug },
    {
      name: product.name,
      id: product.id,
      slug: product.slug,
      category: product.category,
    }
  );

  const productUrl = `https://www.fibidy.com/store/${tenant.slug}/products/${product.id}`;

  // ✅ FIX: currency dari tenant
  const currency = tenant.currency || 'IDR';

  return (
    <>
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
          whatsapp: tenant.whatsapp || '',
        }}
      />

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
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="space-y-6">
            {/* ✅ FIX: pass currency ke ProductInfo */}
            <ProductInfo product={product} currency={currency} />

            <ShippingInfo tenant={tenant} />

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

        {/* ✅ FIX: pass currency ke RelatedProducts → ProductGrid → ProductCard */}
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <RelatedProducts
            products={relatedProducts}
            storeSlug={slug}
            currency={currency}
          />
        </Suspense>
      </div>
    </>
  );
}
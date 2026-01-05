import { getServerSideSitemap, ISitemapField } from 'next-sitemap';
import { seoConfig } from '@/config/seo.config';

// ==========================================
// DYNAMIC SITEMAP PAGES
// Generates actual URL entries per sitemap page
// Route: /server-sitemap/[id].xml
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const URLS_PER_SITEMAP = 45000;

interface SitemapTenant {
  slug: string;
  updatedAt: string;
}

interface SitemapProduct {
  id: string;
  slug: string | null;
  tenantSlug: string;
  updatedAt: string;
}

// ==========================================
// URL BUILDER HELPERS
// ==========================================

function getTenantUrl(slug: string, path: string = ''): string {
  if (seoConfig.isProduction) {
    return `https://${slug}.fibidy.com${path}`;
  }
  return `${seoConfig.siteUrl}/store/${slug}${path}`;
}

function getProductUrl(tenantSlug: string, productId: string, productSlug: string | null): string {
  const productPath = productSlug ? `/p/${productSlug}` : `/product/${productId}`;
  return getTenantUrl(tenantSlug, productPath);
}

// ==========================================
// DATA FETCHERS
// ==========================================

async function fetchTenants(page: number, limit: number): Promise<{ tenants: SitemapTenant[]; total: number }> {
  try {
    const res = await fetch(
      `${API_URL}/sitemap/tenants/paginated?page=${page}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return { tenants: [], total: 0 };
    return res.json();
  } catch {
    return { tenants: [], total: 0 };
  }
}

async function fetchProducts(page: number, limit: number): Promise<{ products: SitemapProduct[]; total: number }> {
  try {
    const res = await fetch(
      `${API_URL}/sitemap/products/paginated?page=${page}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return { products: [], total: 0 };
    return res.json();
  } catch {
    return { products: [], total: 0 };
  }
}

async function fetchStats(): Promise<{ tenants: number; products: number } | null> {
  try {
    const res = await fetch(`${API_URL}/sitemap/stats`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stats;
  } catch {
    return null;
  }
}

// ==========================================
// ROUTE HANDLER
// ==========================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sitemapIndex = parseInt(id, 10);

  if (isNaN(sitemapIndex) || sitemapIndex < 0) {
    return new Response('Invalid sitemap ID', { status: 400 });
  }

  const fields: ISitemapField[] = [];
  const now = new Date().toISOString();

  try {
    // Get stats to know total counts
    const stats = await fetchStats();
    if (!stats) {
      return getServerSideSitemap(fields);
    }

    const tenantUrlsTotal = stats.tenants * 2; // Each tenant has 2 URLs
    const offset = sitemapIndex * URLS_PER_SITEMAP;
    let remainingSlots = URLS_PER_SITEMAP;
    let currentOffset = offset;

    // ==========================================
    // TENANT URLS
    // Each tenant = 2 URLs (homepage + products page)
    // ==========================================
    if (currentOffset < tenantUrlsTotal && remainingSlots > 0) {
      const tenantStartIndex = Math.floor(currentOffset / 2);
      const tenantsNeeded = Math.min(
        Math.ceil(remainingSlots / 2),
        stats.tenants - tenantStartIndex
      );

      if (tenantsNeeded > 0) {
        // Fetch in batches of 1000
        const batchSize = 1000;
        let fetched = 0;
        let page = Math.floor(tenantStartIndex / batchSize) + 1;
        let skipInFirstBatch = tenantStartIndex % batchSize;

        while (fetched < tenantsNeeded && remainingSlots > 0) {
          const { tenants } = await fetchTenants(page, batchSize);

          const startIdx = page === Math.floor(tenantStartIndex / batchSize) + 1 ? skipInFirstBatch : 0;
          const tenantsToProcess = tenants.slice(startIdx, startIdx + (tenantsNeeded - fetched));

          for (const tenant of tenantsToProcess) {
            if (remainingSlots <= 0) break;

            // Store homepage
            fields.push({
              loc: getTenantUrl(tenant.slug),
              lastmod: tenant.updatedAt || now,
              changefreq: 'daily',
              priority: 0.9,
            });
            remainingSlots--;

            // Products page
            if (remainingSlots > 0) {
              fields.push({
                loc: getTenantUrl(tenant.slug, '/products'),
                lastmod: tenant.updatedAt || now,
                changefreq: 'daily',
                priority: 0.8,
              });
              remainingSlots--;
            }

            fetched++;
          }

          page++;
          skipInFirstBatch = 0;

          if (tenants.length < batchSize) break; // No more data
        }
      }

      currentOffset = Math.max(0, currentOffset - tenantUrlsTotal);
    } else {
      currentOffset -= tenantUrlsTotal;
    }

    // ==========================================
    // PRODUCT URLS
    // ==========================================
    if (currentOffset >= 0 && remainingSlots > 0 && currentOffset < stats.products) {
      const productStartIndex = currentOffset;
      const productsNeeded = Math.min(remainingSlots, stats.products - productStartIndex);

      if (productsNeeded > 0) {
        const batchSize = 1000;
        let fetched = 0;
        let page = Math.floor(productStartIndex / batchSize) + 1;
        let skipInFirstBatch = productStartIndex % batchSize;

        while (fetched < productsNeeded && remainingSlots > 0) {
          const { products } = await fetchProducts(page, batchSize);

          const startIdx = page === Math.floor(productStartIndex / batchSize) + 1 ? skipInFirstBatch : 0;
          const productsToProcess = products.slice(startIdx, startIdx + (productsNeeded - fetched));

          for (const product of productsToProcess) {
            if (remainingSlots <= 0) break;

            fields.push({
              loc: getProductUrl(product.tenantSlug, product.id, product.slug),
              lastmod: product.updatedAt || now,
              changefreq: 'weekly',
              priority: 0.6,
            });
            remainingSlots--;
            fetched++;
          }

          page++;
          skipInFirstBatch = 0;

          if (products.length < batchSize) break;
        }
      }
    }

    console.log(`[Sitemap ${sitemapIndex}] Generated ${fields.length} URLs`);

    return getServerSideSitemap(fields);
  } catch (error) {
    console.error(`Error generating sitemap ${sitemapIndex}:`, error);
    return getServerSideSitemap(fields);
  }
}
import { Metadata } from 'next';
import { seoConfig } from '@/config/seo.config';

// ==========================================
// URL UTILITIES
// ==========================================

/**
 * Get full URL for main platform
 */
export function getFullUrl(path: string = ''): string {
  return seoConfig.getMainUrl(path);
}

/**
 * Get tenant store URL (subdomain in prod, path in dev)
 */
export function getTenantUrl(slug: string, path: string = ''): string {
  return seoConfig.getTenantUrl(slug, path);
}

/**
 * Check if slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
  return seoConfig.reservedSubdomains.includes(slug.toLowerCase());
}

/**
 * Validate tenant slug format
 * - 3-30 chars
 * - lowercase alphanumeric and dash
 * - no double dash
 * - not reserved
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  const pattern = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
  return pattern.test(slug) && !slug.includes('--') && !isReservedSlug(slug);
}

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ==========================================
// TEXT UTILITIES
// ==========================================

/**
 * Truncate text for meta description (max 155-160 chars)
 */
export function truncateDescription(text: string, maxLength: number = 155): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Sanitize text for meta tags
 */
export function sanitizeMetaText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ==========================================
// METADATA GENERATORS
// ==========================================

interface CreateMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

/**
 * Create metadata for main platform pages
 */
export function createMetadata({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const cleanDescription = truncateDescription(sanitizeMetaText(description));
  const cleanTitle = sanitizeMetaText(title);
  const imageUrl = ogImage
    ? (ogImage.startsWith('http') ? ogImage : getFullUrl(ogImage))
    : getFullUrl(seoConfig.defaultOgImage);
  const canonicalUrl = canonical || seoConfig.siteUrl;

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords: keywords || seoConfig.defaultKeywords,
    authors: [{ name: seoConfig.siteName }],
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: ogType === 'product' ? 'website' : ogType,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      images: [imageUrl],
    },
  };
}

/**
 * Create metadata for tenant store pages
 */
export function createTenantMetadata({
  tenant,
  pageTitle,
  pageDescription,
  path = '',
  ogImage,
}: {
  tenant: {
    name: string;
    slug: string;
    description?: string | null;
    logo?: string | null;
    heroBackgroundImage?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
  pageTitle?: string;
  pageDescription?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  // Build title
  const title = pageTitle
    ? `${pageTitle} | ${tenant.name}`
    : tenant.metaTitle || `${tenant.name} | Fibidy`;

  // Build description
  const description = pageDescription
    || tenant.metaDescription
    || tenant.description
    || `${tenant.name} - Belanja mudah dan pesan langsung via WhatsApp.`;

  // URLs
  const canonicalUrl = getTenantUrl(tenant.slug, path);
  const imageUrl = ogImage || tenant.heroBackgroundImage || tenant.logo;

  // Build metadata base for subdomain (production only)
  const metadataBase = seoConfig.isProduction
    ? new URL(`https://${tenant.slug}.${seoConfig.domain}`)
    : new URL(seoConfig.siteUrl);

  return {
    metadataBase,
    title,
    description: truncateDescription(sanitizeMetaText(description)),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description: truncateDescription(description),
      url: canonicalUrl,
      siteName: tenant.name,
      locale: seoConfig.locale,
      type: 'website',
      images: imageUrl ? [
        {
          url: imageUrl.startsWith('http') ? imageUrl : getFullUrl(imageUrl),
          width: 1200,
          height: 630,
          alt: tenant.name,
        },
      ] : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description: truncateDescription(description),
      images: imageUrl ? [imageUrl.startsWith('http') ? imageUrl : getFullUrl(imageUrl)] : undefined,
    },

    keywords: [
      tenant.name,
      'toko online',
      'belanja online',
      'whatsapp order',
      'fibidy',
    ],
  };
}

/**
 * Create metadata for product pages
 */
export function createProductMetadata({
  product,
  tenant,
}: {
  product: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    price: number;
    images?: string[];
    category?: string | null;
  };
  tenant: {
    name: string;
    slug: string;
  };
}): Metadata {
  const title = `${product.name} - ${tenant.name} | Fibidy`;

  const priceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);

  const description = product.description
    || `Beli ${product.name} di ${tenant.name} ${priceFormatted}. Order langsung via WhatsApp!`;

  const productPath = product.slug
    ? `/p/${product.slug}`
    : `/product/${product.id}`;
  const canonicalUrl = getTenantUrl(tenant.slug, productPath);
  const ogImage = product.images?.[0];

  const metadataBase = seoConfig.isProduction
    ? new URL(`https://${tenant.slug}.${seoConfig.domain}`)
    : new URL(seoConfig.siteUrl);

  return {
    metadataBase,
    title,
    description: truncateDescription(sanitizeMetaText(description)),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description: truncateDescription(description),
      url: canonicalUrl,
      siteName: tenant.name,
      locale: seoConfig.locale,
      type: 'website',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ] : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description: truncateDescription(description),
      images: ogImage ? [ogImage] : undefined,
    },

    keywords: [
      product.name,
      tenant.name,
      product.category || '',
      'beli online',
      'whatsapp order',
    ].filter(Boolean),
  };
}

// ==========================================
// BREADCRUMB HELPERS
// ==========================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate breadcrumbs for tenant store
 */
export function generateTenantBreadcrumbs(tenant: {
  name: string;
  slug: string;
}): BreadcrumbItem[] {
  return [
    { name: 'Home', url: getFullUrl('/') },
    { name: tenant.name, url: getTenantUrl(tenant.slug) },
  ];
}

/**
 * Generate breadcrumbs for product page
 */
export function generateProductBreadcrumbs(
  tenant: { name: string; slug: string },
  product: { name: string; id: string; slug?: string | null; category?: string | null }
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: getFullUrl('/') },
    { name: tenant.name, url: getTenantUrl(tenant.slug) },
  ];

  if (product.category) {
    breadcrumbs.push({
      name: product.category,
      url: getTenantUrl(tenant.slug, `/products?category=${encodeURIComponent(product.category)}`),
    });
  }

  const productPath = product.slug ? `/p/${product.slug}` : `/product/${product.id}`;
  breadcrumbs.push({
    name: product.name,
    url: getTenantUrl(tenant.slug, productPath),
  });

  return breadcrumbs;
}
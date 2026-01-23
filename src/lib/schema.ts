import { seoConfig } from '@/config/seo.config';
import { getFullUrl, getTenantUrl } from '@/lib/seo';

// ==========================================
// SCHEMA.ORG GENERATORS
// ==========================================

/**
 * Organization Schema (Platform level)
 * https://schema.org/Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${seoConfig.siteUrl}/#organization`,
    name: seoConfig.organization.name,
    legalName: seoConfig.organization.legalName,
    url: seoConfig.organization.url,
    logo: {
      '@type': 'ImageObject',
      url: seoConfig.organization.logo,
      width: 512,
      height: 512,
    },
    foundingDate: seoConfig.organization.foundingDate,
    address: {
      '@type': 'PostalAddress',
      addressCountry: seoConfig.organization.address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: seoConfig.organization.contactPoint.contactType,
      availableLanguage: seoConfig.organization.contactPoint.availableLanguage,
    },
    sameAs: seoConfig.organization.sameAs,
  };
}

/**
 * WebSite Schema with SearchAction
 * https://schema.org/WebSite
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${seoConfig.siteUrl}/#website`,
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    publisher: {
      '@id': `${seoConfig.siteUrl}/#organization`,
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
    inLanguage: seoConfig.language,
  };
}

/**
 * LocalBusiness Schema (Tenant level)
 * https://schema.org/LocalBusiness
 */
export function generateLocalBusinessSchema(tenant: {
  name: string;
  slug: string;
  description?: string | null;
  category?: string;
  whatsapp: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  logo?: string | null;
  heroBackgroundImage?: string | null;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  } | null;
}) {
  const tenantUrl = getTenantUrl(tenant.slug);

  // Collect social links
  const sameAs: string[] = [];
  if (tenant.socialLinks?.instagram) sameAs.push(tenant.socialLinks.instagram);
  if (tenant.socialLinks?.facebook) sameAs.push(tenant.socialLinks.facebook);
  if (tenant.socialLinks?.tiktok) sameAs.push(tenant.socialLinks.tiktok);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${tenantUrl}/#business`,
    name: tenant.name,
    url: tenantUrl,
    description: tenant.description || `${tenant.name} - Toko online terpercaya`,
    image: tenant.heroBackgroundImage || tenant.logo || getFullUrl(seoConfig.defaultOgImage),
    logo: tenant.logo || seoConfig.organization.logo,
    telephone: tenant.phone || `+${tenant.whatsapp}`,
    email: tenant.email || undefined,
    address: tenant.address ? {
      '@type': 'PostalAddress',
      streetAddress: tenant.address,
      addressCountry: 'ID',
    } : undefined,
    priceRange: '$$',
    paymentAccepted: 'Cash, Bank Transfer, E-Wallet',
    currenciesAccepted: 'IDR',
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${tenant.whatsapp}`,
      contactType: 'customer service',
      availableLanguage: ['Indonesian'],
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

/**
 * Product Schema
 * https://schema.org/Product
 */
export function generateProductSchema(
  product: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    price: number;
    comparePrice?: number | null;
    images?: string[];
    category?: string | null;
    sku?: string | null;
    stock?: number | null;
    trackStock?: boolean;
  },
  tenant: {
    name: string;
    slug: string;
    whatsapp: string;
  }
) {
  const productPath = product.slug ? `/p/${product.slug}` : `/product/${product.id}`;
  const productUrl = getTenantUrl(tenant.slug, productPath);
  const tenantUrl = getTenantUrl(tenant.slug);
  const inStock = product.trackStock ? (product.stock ?? 0) > 0 : true;

  // Price valid for 1 year
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}/#product`,
    name: product.name,
    description: product.description || `${product.name} dari ${tenant.name}`,
    url: productUrl,
    image: product.images?.[0] || getFullUrl(seoConfig.defaultOgImage),
    sku: product.sku || product.id,
    category: product.category || undefined,
    brand: {
      '@type': 'Brand',
      name: tenant.name,
    },
    manufacturer: {
      '@type': 'Organization',
      name: tenant.name,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'IDR',
      price: product.price,
      priceValidUntil: priceValidUntil,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: tenant.name,
        url: tenantUrl,
      },
    },
  };
}

/**
 * BreadcrumbList Schema
 * https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : getFullUrl(item.url),
    })),
  };
}

/**
 * ItemList Schema (Product List)
 * https://schema.org/ItemList
 */
export function generateProductListSchema(
  products: Array<{
    id: string;
    name: string;
    slug?: string | null;
    price: number;
    images?: string[];
  }>,
  tenant: {
    name: string;
    slug: string;
  },
  listName: string = 'Daftar Produk'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => {
      const productPath = product.slug ? `/p/${product.slug}` : `/product/${product.id}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: getTenantUrl(tenant.slug, productPath),
        name: product.name,
        image: product.images?.[0] || undefined,
      };
    }),
  };
}

/**
 * FAQPage Schema
 * https://schema.org/FAQPage
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * WebPage Schema
 * https://schema.org/WebPage
 */
export function generateWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getFullUrl(page.url)}/#webpage`,
    name: page.name,
    description: page.description,
    url: getFullUrl(page.url),
    isPartOf: {
      '@id': `${seoConfig.siteUrl}/#website`,
    },
    about: {
      '@id': `${seoConfig.siteUrl}/#organization`,
    },
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    inLanguage: seoConfig.language,
  };
}

/**
 * CollectionPage Schema
 * https://schema.org/CollectionPage
 */
export function generateCollectionPageSchema(
  page: {
    name: string;
    description: string;
    url: string;
  },
  numberOfItems: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${getFullUrl(page.url)}/#collectionpage`,
    name: page.name,
    description: page.description,
    url: getFullUrl(page.url),
    numberOfItems: numberOfItems,
    isPartOf: {
      '@id': `${seoConfig.siteUrl}/#website`,
    },
    inLanguage: seoConfig.language,
  };
}
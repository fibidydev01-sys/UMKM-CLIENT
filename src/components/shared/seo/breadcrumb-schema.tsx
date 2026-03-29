import { JsonLd } from './json-ld';
import { generateBreadcrumbSchema } from '@/lib/shared/schema';

// ==========================================
// BREADCRUMB SCHEMA
// Used in: All pages with breadcrumbs
// ==========================================

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const schema = generateBreadcrumbSchema(items);
  return <JsonLd data={schema} />;
}

// ==========================================
// BREADCRUMB GENERATOR UTILITIES
// ==========================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate breadcrumb items for tenant/store pages
 */
export function generateTenantBreadcrumbs(
  tenant: { name: string; slug: string },
  currentPage?: string
): BreadcrumbItem[] {
  const storeUrl = `https://www.fibidy.com/store/${tenant.slug}`;
  const items: BreadcrumbItem[] = [
    { name: tenant.name, url: storeUrl },
  ];
  if (currentPage) {
    items.push({ name: currentPage, url: `${storeUrl}/${currentPage.toLowerCase()}` });
  }
  return items;
}

/**
 * Generate breadcrumb items for product pages
 */
export function generateProductBreadcrumbs(
  tenant: { name: string; slug: string },
  product: { name: string; id: string; slug?: string | null; category?: string | null }
): BreadcrumbItem[] {
  const storeUrl = `https://www.fibidy.com/store/${tenant.slug}`;
  return [
    { name: tenant.name, url: storeUrl },
    { name: 'Products', url: `${storeUrl}/products` },
    { name: product.name, url: `${storeUrl}/products/${product.id}` },
  ];
}
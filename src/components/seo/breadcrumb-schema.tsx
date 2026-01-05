import { JsonLd } from './json-ld';
import { generateBreadcrumbSchema } from '@/lib/schema';

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
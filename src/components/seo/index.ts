// ==========================================
// SEO COMPONENTS - BARREL EXPORTS
// ==========================================

// JSON-LD Wrappers
export { JsonLd, MultiJsonLd } from './json-ld';

// Schema Components
export { OrganizationSchema } from './organization-schema';
export { LocalBusinessSchema } from './local-business-schema';
export { ProductSchema } from './product-schema';
export { BreadcrumbSchema } from './breadcrumb-schema';
export { ProductListSchema } from './product-list-schema';
export { FAQSchema, defaultPlatformFAQs } from './faq-schema';

// Social Share Component
export { SocialShare } from './social-share';

// Re-export breadcrumb generators from lib
export {
  generateTenantBreadcrumbs,
  generateProductBreadcrumbs,
} from '@/lib/seo';
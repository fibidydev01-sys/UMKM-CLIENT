// ==========================================
// TEMPLATE SYSTEM TYPE DEFINITIONS
// 🚀 SYNCED WITH BACKEND VALIDATOR
// ==========================================

import type {
  HeroVariant,
  AboutVariant,
  ProductsVariant,
  TestimonialsVariant,
  ContactVariant,
  CtaVariant,
} from '@/types/landing';

/**
 * Template ID (from backend)
 */
export type TemplateId =
  | 'suspended-minimalist'
  | 'modern-starter'
  | 'bold-starter'
  | 'classic-starter'
  | 'brand-starter'
  | 'catalog-starter'
  | 'fresh-starter'
  | 'elegant-starter'
  | 'dynamic-starter'
  | 'professional-starter'
  | 'custom';

/**
 * Template category
 */
export type TemplateCategory = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional' | 'catalog';

/**
 * A template is a combination of section variants
 * This defines the visual appearance of the entire landing page
 */
export interface LandingTemplate {
  id: TemplateId;
  name: string;
  description: string;
  preview?: string; // Preview image URL (optional)
  category: TemplateCategory;
  variants: {
    hero: HeroVariant;
    about: AboutVariant;
    products: ProductsVariant;
    testimonials?: TestimonialsVariant;
    contact?: ContactVariant;
    cta?: CtaVariant;
  };
}

/**
 * Template context value
 */
export interface TemplateContextValue {
  currentTemplate: LandingTemplate;
  setTemplate: (templateId: string) => void;
  getHeroVariant: () => HeroVariant;
  getAboutVariant: () => AboutVariant;
  getProductsVariant: () => ProductsVariant;
  getTestimonialsVariant: () => TestimonialsVariant;
  getContactVariant: () => ContactVariant;
  getCtaVariant: () => CtaVariant;
}

// Re-export variant types for convenience
export type {
  HeroVariant,
  AboutVariant,
  ProductsVariant,
  TestimonialsVariant,
  ContactVariant,
  CtaVariant,
};

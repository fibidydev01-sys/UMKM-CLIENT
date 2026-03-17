// ==========================================
// TEMPLATE SYSTEM TYPE DEFINITIONS
// 🚀 SYNCED WITH BACKEND VALIDATOR
// ==========================================

import type {
  HeroBlock,
  AboutBlock,
  ProductsBlock,
  TestimonialsBlock,
  ContactBlock,
  CtaBlock,
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
 * A template is a combination of section blocks
 * This defines the visual appearance of the entire landing page
 */
export interface LandingTemplate {
  id: TemplateId;
  name: string;
  description: string;
  preview?: string; // Preview image URL (optional)
  category: TemplateCategory;
  blocks: {
    hero: HeroBlock;
    about: AboutBlock;
    products: ProductsBlock;
    testimonials?: TestimonialsBlock;
    contact?: ContactBlock;
    cta?: CtaBlock;
  };
}

/**
 * Template context value
 */
export interface TemplateContextValue {
  currentTemplate: LandingTemplate;
  setTemplate: (templateId: string) => void;
  getHeroBlock: () => HeroBlock;
  getAboutBlock: () => AboutBlock;
  getProductsBlock: () => ProductsBlock;
  getTestimonialsBlock: () => TestimonialsBlock;
  getContactBlock: () => ContactBlock;
  getCtaBlock: () => CtaBlock;
}

// Re-export block types for convenience
export type {
  HeroBlock,
  AboutBlock,
  ProductsBlock,
  TestimonialsBlock,
  ContactBlock,
  CtaBlock,
};

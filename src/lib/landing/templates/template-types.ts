// ==========================================
// TEMPLATE SYSTEM TYPE DEFINITIONS
// ==========================================

/**
 * Supported variants for each landing section
 */
export type HeroVariant = 'centered' | 'split';
export type AboutVariant = 'grid' | 'cards';
export type ProductsVariant = 'grid' | 'carousel';

/**
 * A template is a combination of section variants
 * This defines the visual appearance of the entire landing page
 */
export interface LandingTemplate {
  id: string;
  name: string;
  description: string;
  preview?: string; // Preview image URL (optional)
  category: 'modern' | 'classic' | 'minimal' | 'creative';
  variants: {
    hero: HeroVariant;
    about: AboutVariant;
    products: ProductsVariant;
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
}

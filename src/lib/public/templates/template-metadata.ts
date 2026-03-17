// ==========================================
// TEMPLATE METADATA & CONFIGURATIONS
// 🚀 SYNCED WITH BACKEND VALIDATOR - 11 TEMPLATES
// ==========================================

import type { LandingTemplate, TemplateId } from './template-types';

/**
 * Available landing page templates
 *
 * Each template defines a unique combination of section blocks
 * to create different visual styles.
 *
 * 🚀 SYNCED WITH BACKEND: All 11 templates from backend validator
 */
/**
 * v3.0 NUMBERING SYSTEM
 * All blocks now use numbered format (hero1, about2, etc.)
 * See MAPPING.md for design name references
 */
export const LANDING_TEMPLATES: Record<TemplateId, LandingTemplate> = {
  'suspended-minimalist': {
    id: 'suspended-minimalist',
    name: 'Suspended Minimalist',
    description: 'Ultra minimal design for suspended tenants - clean and simple',
    category: 'minimal',
    blocks: {
      hero: 'hero1',      // Centered
      about: 'about3',    // Centered
      products: 'products6', // Minimal List
      testimonials: 'testimonials1', // Grid Cards
      contact: 'contact5', // Minimal
      cta: 'cta6',        // Minimal Line
    },
  },
  'modern-starter': {
    id: 'modern-starter',
    name: 'Modern Starter',
    description: 'Clean and contemporary design - perfect for modern brands',
    category: 'modern',
    blocks: {
      hero: 'hero1',      // Centered (was gradient-overlay)
      about: 'about2',    // Side by Side
      products: 'products2', // Grid Hover
      testimonials: 'testimonials2', // Card Slider
      contact: 'contact2', // Split Form
      cta: 'cta2',        // Bold Center
    },
  },
  'bold-starter': {
    id: 'bold-starter',
    name: 'Bold Starter',
    description: 'Eye-catching design with bold visuals - make a statement',
    category: 'creative',
    blocks: {
      hero: 'hero5',      // Animated Gradient
      about: 'about6',    // Magazine
      products: 'products2', // Grid Hover (was featured-hero)
      testimonials: 'testimonials3', // Quote Highlight
      contact: 'contact6', // Social Focused
      cta: 'cta3',        // Gradient Banner
    },
  },
  'classic-starter': {
    id: 'classic-starter',
    name: 'Classic Starter',
    description: 'Traditional layout with timeless appeal',
    category: 'classic',
    blocks: {
      hero: 'hero2',      // Split Screen
      about: 'about4',    // Timeline
      products: 'products4', // Carousel
      testimonials: 'testimonials1', // Grid Cards
      contact: 'contact4', // Map Focus
      cta: 'cta4',        // Split Action
    },
  },
  'brand-starter': {
    id: 'brand-starter',
    name: 'Brand Starter',
    description: 'Emphasize brand identity with storytelling elements',
    category: 'creative',
    blocks: {
      hero: 'hero6',      // Glass Morphism
      about: 'about7',    // Storytelling
      products: 'products3', // Masonry
      testimonials: 'testimonials4', // Single Focus
      contact: 'contact3', // Centered
      cta: 'cta5',        // Floating
    },
  },
  'catalog-starter': {
    id: 'catalog-starter',
    name: 'Catalog Starter',
    description: 'Product-focused design - ideal for catalogs and e-commerce',
    category: 'catalog',
    blocks: {
      hero: 'hero1',      // Centered (default)
      about: 'about1',    // Grid (default)
      products: 'products5', // Catalog
      testimonials: 'testimonials6', // Social Proof
      contact: 'contact1', // Default
      cta: 'cta1',        // Default
    },
  },
  'fresh-starter': {
    id: 'fresh-starter',
    name: 'Fresh Starter',
    description: 'Light and airy design with modern aesthetics',
    category: 'modern',
    blocks: {
      hero: 'hero1',      // Centered
      about: 'about3',    // Centered
      products: 'products2', // Grid Hover
      testimonials: 'testimonials2', // Card Slider
      contact: 'contact2', // Split Form
      cta: 'cta6',        // Minimal Line
    },
  },
  'elegant-starter': {
    id: 'elegant-starter',
    name: 'Elegant Starter',
    description: 'Sophisticated and refined design for premium brands',
    category: 'professional',
    blocks: {
      hero: 'hero4',      // Parallax
      about: 'about6',    // Magazine
      products: 'products3', // Masonry
      testimonials: 'testimonials3', // Quote Highlight
      contact: 'contact3', // Centered
      cta: 'cta2',        // Bold Center
    },
  },
  'dynamic-starter': {
    id: 'dynamic-starter',
    name: 'Dynamic Starter',
    description: 'Energetic design with motion and interactivity',
    category: 'creative',
    blocks: {
      hero: 'hero3',      // Video Background
      about: 'about5',    // Cards
      products: 'products2', // Grid Hover (was featured-hero)
      testimonials: 'testimonials5', // Video
      contact: 'contact6', // Social Focused
      cta: 'cta3',        // Gradient Banner
    },
  },
  'professional-starter': {
    id: 'professional-starter',
    name: 'Professional Starter',
    description: 'Clean and trustworthy design for businesses',
    category: 'professional',
    blocks: {
      hero: 'hero2',      // Split Screen
      about: 'about2',    // Side by Side
      products: 'products2', // Grid Hover
      testimonials: 'testimonials1', // Grid Cards
      contact: 'contact4', // Map Focus
      cta: 'cta4',        // Split Action
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Start from scratch and build your own unique design',
    category: 'modern',
    blocks: {
      hero: 'hero1',      // Default
      about: 'about1',    // Default
      products: 'products1', // Default
      testimonials: 'testimonials1', // Default
      contact: 'contact1', // Default
      cta: 'cta1',        // Default
    },
  },
} as const;

/**
 * Get template by ID
 */
export function getTemplate(id: string): LandingTemplate {
  return LANDING_TEMPLATES[id as TemplateId] || LANDING_TEMPLATES['suspended-minimalist'];
}

/**
 * Get all available templates as an array
 */
export function getAllTemplates(): LandingTemplate[] {
  return Object.values(LANDING_TEMPLATES);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): LandingTemplate[] {
  return getAllTemplates().filter((t) => t.category === category);
}

/**
 * Default template ID (matches backend default)
 */
export const DEFAULT_TEMPLATE_ID: TemplateId = 'suspended-minimalist';

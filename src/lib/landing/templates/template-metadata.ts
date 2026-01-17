// ==========================================
// TEMPLATE METADATA & CONFIGURATIONS
// 🚀 SYNCED WITH BACKEND VALIDATOR - 11 TEMPLATES
// ==========================================

import type { LandingTemplate, TemplateId } from './template-types';

/**
 * Available landing page templates
 *
 * Each template defines a unique combination of section variants
 * to create different visual styles.
 *
 * 🚀 SYNCED WITH BACKEND: All 11 templates from backend validator
 */
export const LANDING_TEMPLATES: Record<TemplateId, LandingTemplate> = {
  'suspended-minimalist': {
    id: 'suspended-minimalist',
    name: 'Suspended Minimalist',
    description: 'Ultra minimal design for suspended tenants - clean and simple',
    category: 'minimal',
    variants: {
      hero: 'centered-minimal',
      about: 'centered',
      products: 'minimal-list',
      testimonials: 'default',
      contact: 'minimal',
      cta: 'minimal-line',
    },
  },
  'modern-starter': {
    id: 'modern-starter',
    name: 'Modern Starter',
    description: 'Clean and contemporary design - perfect for modern brands',
    category: 'modern',
    variants: {
      hero: 'gradient-overlay',
      about: 'side-by-side',
      products: 'grid-hover',
      testimonials: 'card-slider',
      contact: 'split-form',
      cta: 'bold-center',
    },
  },
  'bold-starter': {
    id: 'bold-starter',
    name: 'Bold Starter',
    description: 'Eye-catching design with bold visuals - make a statement',
    category: 'creative',
    variants: {
      hero: 'animated-gradient',
      about: 'magazine',
      products: 'featured-hero',
      testimonials: 'quote-highlight',
      contact: 'social-focused',
      cta: 'gradient-banner',
    },
  },
  'classic-starter': {
    id: 'classic-starter',
    name: 'Classic Starter',
    description: 'Traditional layout with timeless appeal',
    category: 'classic',
    variants: {
      hero: 'split-screen',
      about: 'timeline',
      products: 'carousel',
      testimonials: 'grid-cards',
      contact: 'map-focus',
      cta: 'split-action',
    },
  },
  'brand-starter': {
    id: 'brand-starter',
    name: 'Brand Starter',
    description: 'Emphasize brand identity with storytelling elements',
    category: 'creative',
    variants: {
      hero: 'glass-morphism',
      about: 'storytelling',
      products: 'masonry',
      testimonials: 'single-focus',
      contact: 'centered',
      cta: 'floating',
    },
  },
  'catalog-starter': {
    id: 'catalog-starter',
    name: 'Catalog Starter',
    description: 'Product-focused design - ideal for catalogs and e-commerce',
    category: 'catalog',
    variants: {
      hero: 'default',
      about: 'default',
      products: 'catalog',
      testimonials: 'social-proof',
      contact: 'default',
      cta: 'default',
    },
  },
  'fresh-starter': {
    id: 'fresh-starter',
    name: 'Fresh Starter',
    description: 'Light and airy design with modern aesthetics',
    category: 'modern',
    variants: {
      hero: 'centered-minimal',
      about: 'centered',
      products: 'grid-hover',
      testimonials: 'card-slider',
      contact: 'split-form',
      cta: 'minimal-line',
    },
  },
  'elegant-starter': {
    id: 'elegant-starter',
    name: 'Elegant Starter',
    description: 'Sophisticated and refined design for premium brands',
    category: 'professional',
    variants: {
      hero: 'parallax',
      about: 'magazine',
      products: 'masonry',
      testimonials: 'quote-highlight',
      contact: 'centered',
      cta: 'bold-center',
    },
  },
  'dynamic-starter': {
    id: 'dynamic-starter',
    name: 'Dynamic Starter',
    description: 'Energetic design with motion and interactivity',
    category: 'creative',
    variants: {
      hero: 'video-background',
      about: 'cards',
      products: 'featured-hero',
      testimonials: 'video-testimonials',
      contact: 'social-focused',
      cta: 'gradient-banner',
    },
  },
  'professional-starter': {
    id: 'professional-starter',
    name: 'Professional Starter',
    description: 'Clean and trustworthy design for businesses',
    category: 'professional',
    variants: {
      hero: 'split-screen',
      about: 'side-by-side',
      products: 'grid-hover',
      testimonials: 'grid-cards',
      contact: 'map-focus',
      cta: 'split-action',
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Start from scratch and build your own unique design',
    category: 'modern',
    variants: {
      hero: 'default',
      about: 'default',
      products: 'default',
      testimonials: 'default',
      contact: 'default',
      cta: 'default',
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

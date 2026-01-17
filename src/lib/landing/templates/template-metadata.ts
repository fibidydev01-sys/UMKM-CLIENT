// ==========================================
// TEMPLATE METADATA & CONFIGURATIONS
// ==========================================

import type { LandingTemplate } from './template-types';

/**
 * Available landing page templates
 *
 * Each template defines a unique combination of section variants
 * to create different visual styles.
 */
export const LANDING_TEMPLATES: Record<string, LandingTemplate> = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with centered hero and grid layouts',
    category: 'modern',
    variants: {
      hero: 'centered',
      about: 'grid',
      products: 'grid',
    },
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with split hero and card-based sections',
    category: 'classic',
    variants: {
      hero: 'split',
      about: 'cards',
      products: 'carousel',
    },
  },
} as const;

/**
 * Get template by ID
 */
export function getTemplate(id: string): LandingTemplate {
  return LANDING_TEMPLATES[id] || LANDING_TEMPLATES.modern;
}

/**
 * Get all available templates as an array
 */
export function getAllTemplates(): LandingTemplate[] {
  return Object.values(LANDING_TEMPLATES);
}

/**
 * Default template ID
 */
export const DEFAULT_TEMPLATE_ID = 'modern';

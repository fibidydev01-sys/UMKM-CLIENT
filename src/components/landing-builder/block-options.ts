/**
 * ============================================================================
 * FILE: src/components/landing-builder/block-options.ts
 * PURPOSE: Auto-generated block options for landing builder
 * ============================================================================
 *
 * 🚀 SMART STATIC GENERATION (Next.js Compatible!)
 *
 * This file generates block options automatically based on numeric ranges.
 * NO FILESYSTEM SCANNING (Next.js doesn't support import.meta.glob)
 * Instead, we generate options for blocks 1-200 statically.
 *
 * HOW IT WORKS:
 * - Generates options for hero1-hero200, about1-about200, etc.
 * - Dynamic imports in tenant components will load the actual files
 * - If file doesn't exist, fallback to block 1 (handled in tenant components)
 *
 * TO ADD MORE BLOCKS:
 * - Just add the new .tsx file (e.g., hero201.tsx)
 * - Update BLOCKS_PER_SECTION constant below
 * - That's it! No other changes needed.
 *
 * ============================================================================
 */

export interface BlockOption {
  value: string; // e.g., 'hero1', 'hero201'
  label: string; // e.g., 'Hero 1', 'Hero 201'
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Number of blocks available per section
 * Update this when you add more blocks!
 */
const BLOCKS_PER_SECTION = 200; // hero1-hero200, about1-about200, etc.

// ============================================================================
// SMART GENERATION FUNCTION
// ============================================================================

type SectionType = 'hero' | 'about' | 'products' | 'testimonials' | 'contact' | 'cta';

/**
 * 🚀 Generate block options for a section
 *
 * Creates options for blocks 1 to BLOCKS_PER_SECTION
 * Text only (no icons, no emoji)
 *
 * @param section - Section name (hero, about, products, etc.)
 * @param count - Number of blocks (default: BLOCKS_PER_SECTION)
 * @returns Array of block options sorted numerically
 */
function generateBlocks(section: SectionType, count: number = BLOCKS_PER_SECTION): BlockOption[] {
  const blocks: BlockOption[] = [];

  for (let i = 1; i <= count; i++) {
    blocks.push({
      value: `${section}${i}`,
      label: `${capitalize(section)} ${i}`,
    });
  }

  return blocks;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// GENERATED BLOCK OPTIONS
// ============================================================================

export const HERO_BLOCKS = generateBlocks('hero');
export const ABOUT_BLOCKS = generateBlocks('about');
export const PRODUCTS_BLOCKS = generateBlocks('products');
export const TESTIMONIALS_BLOCKS = generateBlocks('testimonials');
export const CONTACT_BLOCKS = generateBlocks('contact');
export const CTA_BLOCKS = generateBlocks('cta');

export const BLOCK_OPTIONS_MAP = {
  hero: HERO_BLOCKS,
  about: ABOUT_BLOCKS,
  products: PRODUCTS_BLOCKS,
  testimonials: TESTIMONIALS_BLOCKS,
  contact: CONTACT_BLOCKS,
  cta: CTA_BLOCKS,
} as const;

// ============================================================================
// DEBUG: Log generated blocks (dev mode only)
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Generated block options:', {
    hero: HERO_BLOCKS.length,
    about: ABOUT_BLOCKS.length,
    products: PRODUCTS_BLOCKS.length,
    testimonials: TESTIMONIALS_BLOCKS.length,
    contact: CONTACT_BLOCKS.length,
    cta: CTA_BLOCKS.length,
    total: HERO_BLOCKS.length + ABOUT_BLOCKS.length + PRODUCTS_BLOCKS.length +
           TESTIMONIALS_BLOCKS.length + CONTACT_BLOCKS.length + CTA_BLOCKS.length,
  });
}


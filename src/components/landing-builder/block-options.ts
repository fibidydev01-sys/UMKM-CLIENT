/**
 * ============================================================================
 * FILE: src/components/landing-builder/block-options.ts
 * PURPOSE: Auto-generated block options for landing builder
 * ============================================================================
 */

export interface BlockOption {
  value: string;
  label: string;
}

// ============================================================================
// CONFIGURATION - Atur jumlah block per section di sini!
// ============================================================================

const BLOCKS_PER_SECTION: Record<SectionType, number> = {
  hero: 25,
  about: 5,
  products: 5,
  testimonials: 5,
  contact: 5,
  cta: 5,
};

// ============================================================================
// SMART GENERATION FUNCTION
// ============================================================================

type SectionType = 'hero' | 'about' | 'products' | 'testimonials' | 'contact' | 'cta';

function generateBlocks(section: SectionType): BlockOption[] {
  const count = BLOCKS_PER_SECTION[section];
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
// DEBUG
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
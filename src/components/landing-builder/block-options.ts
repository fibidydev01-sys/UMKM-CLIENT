/**
 * ============================================================================
 * FILE: src/components/landing-builder/block-options.ts
 * PURPOSE: Auto-generated block options for landing builder
 *
 * ✅ CANVA STRATEGY:
 * - Semua block bisa dipilih/preview bebas
 * - isPro = hint visual (badge) saja
 * - Gate terjadi saat Publish, bukan saat pilih block
 * ============================================================================
 */

export interface BlockOption {
  value: string;
  label: string;
  isPro: boolean; // hint visual badge — tidak memblokir selection
}

// ============================================================================
// CONFIGURATION
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
// PRO LIMIT — untuk badge hint & publish gate
// ============================================================================

export const FREE_BLOCK_LIMIT = 3; // block 1-3 gratis, 4+ = Pro

/**
 * Cek apakah blockId ini adalah Pro block.
 * Dipakai untuk:
 * 1. Badge hint di block list (visual only)
 * 2. Publish gate — cek apakah config punya Pro block aktif
 *
 * Safe handling: null/undefined/Infinity → false (tidak Pro)
 */
export function isProBlock(
  blockId: string,
  limit: number | null | undefined = FREE_BLOCK_LIMIT,
): boolean {
  if (limit == null || limit === 0 || !isFinite(limit) || isNaN(limit)) {
    return false; // unlimited → tidak ada Pro block
  }
  const match = blockId.match(/(\d+)$/);
  if (!match) return false;
  return parseInt(match[1]) > limit;
}

/**
 * Cek apakah landing config punya Pro block yang aktif.
 * Dipanggil sebelum Publish — kalau true → block + UpgradeModal.
 *
 * Hanya cek section yang ENABLED — section disabled tidak dihitung.
 */
export function hasProBlocks(
  config: Record<string, any> | null | undefined,
  limit: number | null | undefined = FREE_BLOCK_LIMIT,
): boolean {
  if (!config) return false;
  if (limit == null || !isFinite(limit as number)) return false; // unlimited

  const sections = ['hero', 'about', 'products', 'testimonials', 'contact', 'cta'];

  return sections.some((section) => {
    const sectionConfig = config[section];
    if (!sectionConfig) return false;
    if (!sectionConfig.enabled) return false; // disabled section → skip

    const block = sectionConfig.block as string | undefined;
    if (!block) return false;

    return isProBlock(block, limit);
  });
}

// ============================================================================
// GENERATION FUNCTION
// ============================================================================

type SectionType = 'hero' | 'about' | 'products' | 'testimonials' | 'contact' | 'cta';

function generateBlocks(section: SectionType): BlockOption[] {
  const count = BLOCKS_PER_SECTION[section];

  return Array.from({ length: count }, (_, i) => ({
    value: `${section}${i + 1}`,
    label: `${capitalize(section)} ${i + 1}`,
    isPro: i + 1 > FREE_BLOCK_LIMIT,
  }));
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
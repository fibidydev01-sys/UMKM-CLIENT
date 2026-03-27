/**
 * block-options.ts — Hero only
 */

export interface BlockOption {
  value: string;
  label: string;
}

export const FREE_BLOCK_LIMIT = 3;

export function isProBlock(
  blockId: string,
  limit: number | null | undefined = FREE_BLOCK_LIMIT,
): boolean {
  if (limit == null || limit === 0 || !isFinite(limit) || isNaN(limit)) return false;
  const match = blockId.match(/(\d+)$/);
  if (!match) return false;
  return parseInt(match[1]) > limit;
}

export function hasProBlocks(
  config: Record<string, any> | null | undefined,
  limit: number | null | undefined = FREE_BLOCK_LIMIT,
): boolean {
  if (!config) return false;
  if (limit == null || !isFinite(limit as number)) return false;

  const heroConfig = config['hero'];
  if (!heroConfig || !heroConfig.enabled) return false;
  const block = heroConfig.block as string | undefined;
  if (!block) return false;
  return isProBlock(block, limit);
}

const HERO_COUNT = 25;

function generateBlocks(section: string, count: number): BlockOption[] {
  return Array.from({ length: count }, (_, i) => ({
    value: `${section}${i + 1}`,
    label: `Hero ${i + 1}`,
  }));
}

export const HERO_BLOCKS = generateBlocks('hero', HERO_COUNT);

export const BLOCK_OPTIONS_MAP = {
  hero: HERO_BLOCKS,
} as const;
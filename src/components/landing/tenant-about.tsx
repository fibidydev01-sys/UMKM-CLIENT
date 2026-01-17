'use client';

import { extractSectionText, getAboutConfig, extractAboutImage } from '@/lib/landing';
import { LANDING_CONSTANTS, useAboutVariant } from '@/lib/landing';
import { AboutGrid, AboutCards } from './variants';
import type { TenantLandingConfig } from '@/types';

interface TenantAboutProps {
  config?: TenantLandingConfig['about'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
  };
}

/**
 * Tenant About Component
 *
 * Wrapper that selects and renders the appropriate about variant
 * based on the current template context
 *
 * 🚀 NOTE: Currently only 2 about variants are implemented:
 * - default, side-by-side, centered -> AboutGrid
 * - cards, magazine, storytelling, timeline -> AboutCards
 * Other variants will fallback to default (AboutGrid)
 */
export function TenantAbout({ config, fallbacks = {} }: TenantAboutProps) {
  const variant = useAboutVariant();

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.ABOUT,
    subtitle: fallbacks.subtitle,
  });

  const aboutConfig = getAboutConfig(config);
  const content = aboutConfig?.content || fallbacks.content || '';
  const image = extractAboutImage(aboutConfig, fallbacks.image);
  const features = aboutConfig?.features || [];

  const commonProps = {
    title,
    subtitle,
    content,
    image,
    features,
  };

  // Render appropriate variant based on template
  // Card-based variants
  if (variant === 'cards' || variant === 'magazine' || variant === 'storytelling' || variant === 'timeline') {
    return <AboutCards {...commonProps} />;
  }

  // Default: grid variant (covers: default, side-by-side, centered)
  return <AboutGrid {...commonProps} />;
}

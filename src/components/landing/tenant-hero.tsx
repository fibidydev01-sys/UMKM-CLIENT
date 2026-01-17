'use client';

import { extractSectionText, getHeroConfig, extractBackgroundImage } from '@/lib/landing';
import { LANDING_CONSTANTS, useHeroVariant } from '@/lib/landing';
import { HeroCentered, HeroSplit } from './variants';
import type { TenantLandingConfig } from '@/types';

interface TenantHeroProps {
  config?: TenantLandingConfig['hero'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    logo?: string;
    storeName?: string;
  };
}

/**
 * Tenant Hero Component
 *
 * Wrapper that selects and renders the appropriate hero variant
 * based on the current template context
 *
 * 🚀 NOTE: Currently only 2 hero variants are implemented:
 * - centered-minimal, gradient-overlay, default -> HeroCentered
 * - split-screen -> HeroSplit
 * Other variants will fallback to default (HeroCentered)
 */
export function TenantHero({ config, fallbacks = {} }: TenantHeroProps) {
  const variant = useHeroVariant();

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || fallbacks.storeName,
    subtitle: fallbacks.subtitle,
  });

  const heroConfig = getHeroConfig(config);
  const showCta = heroConfig?.showCta ?? true;
  const ctaText = heroConfig?.ctaText || LANDING_CONSTANTS.CTA_TEXT_DEFAULT;
  const ctaLink = heroConfig?.ctaLink || '/products';
  const backgroundImage = extractBackgroundImage(heroConfig, fallbacks.backgroundImage);
  const overlayOpacity = heroConfig?.overlayOpacity ?? LANDING_CONSTANTS.OVERLAY_OPACITY_DEFAULT;

  const commonProps = {
    title,
    subtitle,
    ctaText,
    ctaLink,
    showCta,
    backgroundImage,
    logo: fallbacks.logo,
    storeName: fallbacks.storeName,
  };

  // Render appropriate variant based on template
  // 🚀 Split-screen variant
  if (variant === 'split-screen') {
    return <HeroSplit {...commonProps} />;
  }

  // Default: centered variant (covers: default, centered-minimal, gradient-overlay, etc.)
  return <HeroCentered {...commonProps} overlayOpacity={overlayOpacity} />;
}

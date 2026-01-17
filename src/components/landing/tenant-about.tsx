'use client';

import { extractSectionText, getAboutConfig, extractAboutImage } from '@/lib/landing';
import { LANDING_CONSTANTS, useAboutVariant } from '@/lib/landing';
import {
  AboutGrid,
  AboutCards,
  AboutTimeline,
  AboutMagazine,
  AboutStorytelling,
  AboutSideBySide,
  AboutCentered,
} from './variants';
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
 * 🚀 ALL 7 VARIANTS IMPLEMENTED:
 * - default → AboutGrid
 * - side-by-side → AboutSideBySide
 * - centered → AboutCentered
 * - timeline → AboutTimeline
 * - cards → AboutCards
 * - magazine → AboutMagazine
 * - storytelling → AboutStorytelling
 *
 * 🎯 VARIANT PRIORITY:
 * 1. config.variant (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantAbout({ config, fallbacks = {} }: TenantAboutProps) {
  const templateVariant = useAboutVariant();
  const variant = config?.variant || templateVariant;

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

  // 🚀 Render appropriate variant based on template
  switch (variant) {
    case 'side-by-side':
      return <AboutSideBySide {...commonProps} />;

    case 'centered':
      return <AboutCentered {...commonProps} />;

    case 'timeline':
      return <AboutTimeline {...commonProps} />;

    case 'cards':
      return <AboutCards {...commonProps} />;

    case 'magazine':
      return <AboutMagazine {...commonProps} />;

    case 'storytelling':
      return <AboutStorytelling {...commonProps} />;

    // Default variant
    default:
      return <AboutGrid {...commonProps} />;
  }
}

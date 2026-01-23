'use client';

// ==========================================
// TEMPLATE CONTEXT PROVIDER
// 🚀 SYNCED WITH BACKEND - ALL BLOCKS
// ==========================================
// Manages the current template selection and provides
// block getters for each section

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  getTemplate,
  DEFAULT_TEMPLATE_ID,
  type TemplateContextValue,
  type HeroBlock,
  type AboutBlock,
  type ProductsBlock,
  type TestimonialsBlock,
  type ContactBlock,
  type CtaBlock,
} from '../templates';

const TemplateContext = createContext<TemplateContextValue | null>(null);

interface TemplateProviderProps {
  children: React.ReactNode;
  initialTemplateId?: string;
}

/**
 * Template Provider
 *
 * Wraps the landing page to provide template context
 * Use this in both the public store and dashboard preview
 */
export function TemplateProvider({ children, initialTemplateId }: TemplateProviderProps) {
  const [templateId, setTemplateId] = useState(initialTemplateId || DEFAULT_TEMPLATE_ID);

  const currentTemplate = useMemo(() => getTemplate(templateId), [templateId]);

  // v3.0 NUMBERING SYSTEM - fallback to default numbered blocks
  const value: TemplateContextValue = {
    currentTemplate,
    setTemplate: setTemplateId,
    getHeroBlock: () => currentTemplate.blocks.hero,
    getAboutBlock: () => currentTemplate.blocks.about,
    getProductsBlock: () => currentTemplate.blocks.products,
    getTestimonialsBlock: () => currentTemplate.blocks.testimonials || 'testimonials1',
    getContactBlock: () => currentTemplate.blocks.contact || 'contact1',
    getCtaBlock: () => currentTemplate.blocks.cta || 'cta1',
  };

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
}

/**
 * Hook to access template context
 *
 * @throws Error if used outside of TemplateProvider
 */
export function useTemplate(): TemplateContextValue {
  const context = useContext(TemplateContext);

  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }

  return context;
}

/**
 * Hooks to get the current block for each section
 */
export function useHeroBlock(): HeroBlock {
  const { getHeroBlock } = useTemplate();
  return getHeroBlock();
}

export function useAboutBlock(): AboutBlock {
  const { getAboutBlock } = useTemplate();
  return getAboutBlock();
}

export function useProductsBlock(): ProductsBlock {
  const { getProductsBlock } = useTemplate();
  return getProductsBlock();
}

export function useTestimonialsBlock(): TestimonialsBlock {
  const { getTestimonialsBlock } = useTemplate();
  return getTestimonialsBlock();
}

export function useContactBlock(): ContactBlock {
  const { getContactBlock } = useTemplate();
  return getContactBlock();
}

export function useCtaBlock(): CtaBlock {
  const { getCtaBlock } = useTemplate();
  return getCtaBlock();
}

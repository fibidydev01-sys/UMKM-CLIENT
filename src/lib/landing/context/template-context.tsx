'use client';

// ==========================================
// TEMPLATE CONTEXT PROVIDER
// ==========================================
// Manages the current template selection and provides
// variant getters for each section

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  getTemplate,
  DEFAULT_TEMPLATE_ID,
  type LandingTemplate,
  type TemplateContextValue,
  type HeroVariant,
  type AboutVariant,
  type ProductsVariant,
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

  const value: TemplateContextValue = {
    currentTemplate,
    setTemplate: setTemplateId,
    getHeroVariant: () => currentTemplate.variants.hero,
    getAboutVariant: () => currentTemplate.variants.about,
    getProductsVariant: () => currentTemplate.variants.products,
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
 * Hook to get the current variant for a specific section
 */
export function useHeroVariant(): HeroVariant {
  const { getHeroVariant } = useTemplate();
  return getHeroVariant();
}

export function useAboutVariant(): AboutVariant {
  const { getAboutVariant } = useTemplate();
  return getAboutVariant();
}

export function useProductsVariant(): ProductsVariant {
  const { getProductsVariant } = useTemplate();
  return getProductsVariant();
}

import { Tenant } from '@/types/tenant';
import { OnboardingProgress, OnboardingStepStatus } from './types';
import { ONBOARDING_STEPS } from './steps-config';

// ============================================
// PROGRESS CALCULATION
// ============================================

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'theme.primaryColor')
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Check if a step is completed based on tenant data
 */
function isStepCompleted(
  tenant: Tenant,
  field: string,
  checkType: string = 'string',
  minCount: number = 1,
  productsCount: number = 0
): boolean {
  // Special case for products (not in tenant object)
  if (field === 'products') {
    return productsCount >= minCount;
  }

  const value = getNestedValue(tenant as Record<string, any>, field);

  switch (checkType) {
    case 'array_min':
      return Array.isArray(value) && value.length >= minCount;
    case 'boolean':
      return value === true;
    case 'string':
    default:
      return !!value && value !== '' && value !== null && value !== undefined;
  }
}

/**
 * Get milestone based on score
 */
function getMilestone(score: number): 'bronze' | 'silver' | 'gold' | 'diamond' | null {
  if (score >= 100) return 'diamond';
  if (score >= 75) return 'gold';
  if (score >= 50) return 'silver';
  if (score >= 25) return 'bronze';
  return null;
}

/**
 * Calculate full onboarding progress
 */
export function calculateOnboardingProgress(
  tenant: Tenant,
  productsCount: number = 0
): OnboardingProgress {
  let totalScore = 0;
  const maxScore = ONBOARDING_STEPS.reduce((sum, step) => sum + step.points, 0);
  const steps: OnboardingStepStatus[] = [];

  // Calculate each step
  for (const step of ONBOARDING_STEPS) {
    const completed = isStepCompleted(
      tenant,
      step.field,
      step.checkType,
      step.minCount,
      productsCount
    );

    if (completed) {
      totalScore += step.points;
    }

    steps.push({
      ...step,
      completed,
    });
  }

  // Check critical items
  const hasLogo = !!tenant.logo;
  const hasHeroBackground = !!tenant.heroBackgroundImage;
  const canPublish = hasLogo && hasHeroBackground;

  // Calculate percentage
  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    totalScore,
    maxScore,
    percentage,
    completedSteps: steps.filter(s => s.completed).length,
    totalSteps: steps.length,
    canPublish,
    criticalItems: {
      logo: hasLogo,
      heroBackground: hasHeroBackground,
    },
    steps,
    milestone: getMilestone(percentage),
  };
}

/**
 * Calculate full profile progress (100 points system)
 * Based on TENANT-PROFILE-PROGRESS.md
 */
export function calculateFullProfileProgress(
  tenant: Tenant,
  productsCount: number = 0
): number {
  let score = 0;

  // 1. Business Identity (15 pts)
  if (tenant.logo) score += 4;
  if (tenant.theme?.primaryColor) score += 4;

  // 2. Hero Section (18 pts)
  if (tenant.heroTitle) score += 4;
  if (tenant.heroSubtitle) score += 3;
  if (tenant.heroCtaText) score += 2;
  if (tenant.heroCtaLink) score += 2;
  if (tenant.heroBackgroundImage) score += 7;

  // 3. About Section (15 pts)
  if (tenant.aboutTitle) score += 2;
  if (tenant.aboutSubtitle) score += 2;
  if (tenant.aboutContent && tenant.aboutContent.length > 50) score += 5;
  if (tenant.aboutImage) score += 4;
  if (tenant.aboutFeatures && tenant.aboutFeatures.length > 0) score += 2;

  // 4. Testimonials Section (12 pts)
  if (tenant.testimonialsTitle) score += 2;
  if (tenant.testimonialsSubtitle) score += 2;
  const testimonialsCount = tenant.testimonials?.length || 0;
  if (testimonialsCount >= 1) score += 4;
  if (testimonialsCount >= 3) score += 4;

  // 5. Contact Section (15 pts)
  if (tenant.contactTitle) score += 1;
  if (tenant.contactSubtitle) score += 1;
  if (tenant.whatsapp) score += 5;
  if (tenant.phone) score += 2;
  if (tenant.address && tenant.address.length > 10) score += 4;
  if (tenant.contactMapUrl) score += 2;

  // 6. CTA Section (8 pts)
  if (tenant.ctaTitle) score += 2;
  if (tenant.ctaSubtitle) score += 2;
  if (tenant.ctaButtonText) score += 2;
  if (tenant.ctaButtonLink) score += 2;

  // 7. Products (17 pts)
  if (productsCount >= 1) score += 10;
  if (productsCount >= 5) score += 7;

  return score;
}

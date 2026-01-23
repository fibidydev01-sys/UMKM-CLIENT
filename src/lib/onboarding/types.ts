// ============================================
// ONBOARDING TYPES
// ============================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  field: string;
  points: number;
  isCritical: boolean;
  actionLabel: string;
  actionHref: string;
  category: 'identity' | 'hero' | 'about' | 'testimonials' | 'contact' | 'cta' | 'products';
  checkType?: 'boolean' | 'string' | 'array_min';
  minCount?: number;
}

export interface OnboardingStepStatus extends OnboardingStep {
  completed: boolean;
}

export interface OnboardingProgress {
  totalScore: number;
  maxScore: number;
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  canPublish: boolean;
  criticalItems: {
    logo: boolean;
    heroBackground: boolean;
  };
  steps: OnboardingStepStatus[];
  milestone: 'bronze' | 'silver' | 'gold' | 'diamond' | null;
}

export interface OnboardingState {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  isDismissed: boolean;
  error: string | null;
}

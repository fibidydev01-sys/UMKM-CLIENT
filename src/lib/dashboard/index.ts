// ==========================================
// DASHBOARD
// ==========================================

export {
  calculateOnboardingProgress,
  calculateFullProfileProgress,
} from './calculate-progress';

export {
  generateInvoiceWhatsAppMessage,
  downloadInvoiceImage,
  openWhatsAppWithInvoice,
} from './invoice';

export type {
  OnboardingStep,
  OnboardingStepStatus,
  OnboardingProgress,
  OnboardingState,
} from './onboarding-types';

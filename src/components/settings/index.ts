// ============================================================================
// SETTINGS COMPONENTS — Barrel Export
// ============================================================================

// ── Core Settings UI ───────────────────────────────────────────────────────
export { SettingsLayout } from './settings-layout';
export { SettingsSidebar } from './settings-sidebar';
export { SettingsMobileNavbar } from './settings-mobile-navbar';
export { SettingsNav, SettingsMobileTrigger } from './settings-nav';
export { PreviewModal } from './preview-modal';

// ── Settings Pages (standalone) ────────────────────────────────────────────
export { StoreInfoForm } from './store-info-form';
export { ShippingSettings } from './shipping-settings';
export { SeoSettings } from './seo-settings';
export { LandingContentSettings } from './landing-content-settings';
export type { LandingContentData } from './landing-content-settings';

// ── About Section ──────────────────────────────────────────────────────────
export {
  StepContent as AboutStepContent,
  StepHeading as AboutStepHeading,
  StepHighlights,
} from './about-section';

// ── Contact Section ────────────────────────────────────────────────────────
export {
  StepContactInfo,
  StepDisplaySettings,
  StepLocation,
} from './contact-section';

// ── CTA Section ────────────────────────────────────────────────────────────
export {
  StepButton as CtaStepButton,
  StepContent as CtaStepContent,
} from './cta-section';

// ── Hero Section ───────────────────────────────────────────────────────────
export {
  StepAppearance,
  StepIdentity,
  StepStory,
} from './hero-section';

// ── Pembayaran Section ─────────────────────────────────────────────────────
export {
  StepCurrency,
  StepBank,
  StepEwallet,
  StepCod,
  BankAccountDialog,
  EwalletDialog,
  PaymentPreview,
} from './pembayaran-section';

// ── Pengiriman Section ─────────────────────────────────────────────────────
export {
  StepCarriers,
  StepRates,
} from './pengiriman-section';

// ── SEO Section ────────────────────────────────────────────────────────────
export {
  StepSearch,
  StepSocialLinks,
} from './seo-section';

// ── Testimonials Section ───────────────────────────────────────────────────
export {
  StepHeading as TestimonialsStepHeading,
  StepTestimonials,
} from './testimonials-section';
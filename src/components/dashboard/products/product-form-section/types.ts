// ─── Product Form Wizard — Shared Types ───────────────────────────────────

export type ProductType = 'product' | 'service';

export interface WizardStep {
  id: number;
  title: string;
  desc: string;
}

export const PRODUCT_STEPS: WizardStep[] = [
  { id: 0, title: 'Details', desc: 'Name & description' },
  { id: 1, title: 'Media', desc: 'Photos & portfolio images' },
  { id: 2, title: 'Pricing', desc: 'Sale price & compare-at' },
  { id: 3, title: 'Publish', desc: 'Visibility & listing status' },
] as const;

export const SERVICE_STEPS: WizardStep[] = [
  { id: 0, title: 'Details', desc: 'Name & description' },
  { id: 1, title: 'Media', desc: 'Portfolio & work samples' },
  { id: 2, title: 'Pricing', desc: 'Rate & price display' },
  { id: 3, title: 'Publish', desc: 'Visibility & listing status' },
] as const;
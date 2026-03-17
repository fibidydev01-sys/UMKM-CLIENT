// ─── Product Form Wizard — Shared Types ───────────────────────────────────

export type ProductType = 'product' | 'service';

export interface WizardStep {
  id: number;
  title: string;
  desc: string;
}

// Steps for Product
export const PRODUCT_STEPS: WizardStep[] = [
  { id: 0, title: 'Details', desc: 'Name, description & category' },
  { id: 1, title: 'Media', desc: 'Photos & portfolio images' },
  { id: 2, title: 'Pricing', desc: 'Sale price, compare-at & cost' },
  { id: 3, title: 'Inventory', desc: 'Stock quantity & tracking' },
  { id: 4, title: 'Publish', desc: 'Visibility & listing status' },
] as const;

// Steps for Service (Inventory skipped — step 3 removed)
export const SERVICE_STEPS: WizardStep[] = [
  { id: 0, title: 'Details', desc: 'Name, description & category' },
  { id: 1, title: 'Media', desc: 'Portfolio & work samples' },
  { id: 2, title: 'Pricing', desc: 'Rate & price display' },
  { id: 3, title: 'Publish', desc: 'Visibility & listing status' },
] as const;
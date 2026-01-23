import type { LucideIcon } from 'lucide-react';

// ==========================================
// CATEGORY FEATURES
// ==========================================

export interface CategoryFeatures {
  stock: boolean;
  debt: boolean;
  booking: boolean;
  tracking: boolean;
  membership: boolean;
  cashier: boolean;
}

export interface CategoryLabels {
  product: string;
  price: string;
  customer: string;
}

// ==========================================
// PREDEFINED CATEGORY (with icon & color)
// ==========================================

export interface PredefinedCategory {
  key: string;
  icon: LucideIcon;
  label: string;
  labelShort: string;
  color: string;
  description: string;
  features: CategoryFeatures;
  labels: CategoryLabels;
  isPredefined: true;
  count?: number;
}

// ==========================================
// DYNAMIC CATEGORY (from database)
// ==========================================

export interface DynamicCategory {
  key: string;
  label: string;
  count?: number;
  isPredefined: false;
}

// ==========================================
// UNIFIED CATEGORY (either type)
// ==========================================

export type Category = PredefinedCategory | DynamicCategory;

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface CategoryStatsResponse {
  category: string;
  count: number;
}

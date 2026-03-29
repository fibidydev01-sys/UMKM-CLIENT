import { api } from './client';

// ==========================================
// TYPES
// ==========================================

export interface PlanLimits {
  maxProducts: number;
  componentBlockVariants: number;
}

export interface SubscriptionInfo {
  subscription: {
    id: string;
    tenantId: string;
    plan: 'STARTER' | 'BUSINESS';
    status: 'ACTIVE' | 'PAST_DUE';
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    priceAmount: number;
    currency: string;
  };
  limits: PlanLimits;
  usage: {
    products: number;
  };
  isAtLimit: {
    products: boolean;
  };
  isOverLimit: {
    products: boolean;
  };
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid';
  paymentMethod: string | null;
  periodStart: string;
  periodEnd: string;
  paidAt: string | null;
  createdAt: string;
}

export interface RequestUpgradeResponse {
  payment: PaymentHistory;
  waUrl: string;
  alreadyPending: boolean;
}

// ==========================================
// API
// ==========================================

export const subscriptionApi = {
  /**
   * Get plan info + usage
   * GET /api/subscription/me
   */
  getMyPlan: () => api.get<SubscriptionInfo>('/subscription/me'),

  /**
   * Get payment history
   * GET /api/subscription/payments
   */
  getPaymentHistory: () => api.get<PaymentHistory[]>('/subscription/payments'),

  /**
   * User klik "Contact Sales" → buat PENDING record + return WA URL
   * Kalau sudah ada pending → return yang lama
   * POST /api/subscription/request-upgrade
   */
  requestUpgrade: () =>
    api.post<RequestUpgradeResponse>('/subscription/request-upgrade'),
};
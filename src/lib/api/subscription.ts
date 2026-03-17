import { api } from './client';
import type {
  XenditPaymentMethod,
  XenditPaymentChannel,
} from '@/types/xendit-invoice';

// ==========================================
// TYPES
// ==========================================

export interface PlanLimits {
  maxProducts: number;
  maxCustomers: number;
  componentBlockVariants: number;
}

export interface SubscriptionInfo {
  subscription: {
    id: string;
    tenantId: string;
    plan: 'STARTER' | 'BUSINESS';
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    isTrial: boolean;
    trialEndsAt: string | null;
    priceAmount: number;
    currency: string;
    cancelledAt: string | null;
    cancelReason: string | null;
  };
  limits: PlanLimits;
  usage: {
    products: number;
    customers: number;
  };
  isAtLimit: {
    products: boolean;
    customers: boolean;
  };
  isOverLimit: {
    products: boolean;
    customers: boolean;
  };
}

// ✅ XENDIT: response dari POST /api/payment/subscribe
// Ganti dari Midtrans { token, redirect_url } → Xendit { invoice_url, ... }
export interface CreatePaymentResponse {
  invoice_url: string;        // URL hosted Xendit → frontend redirect ke sini
  payment_id: string;         // ID internal DB
  external_id: string;        // Format: SUB-{slug}-{timestamp}
  xendit_invoice_id: string;  // ID dari Xendit
  amount: number;
  expires_at: string;         // ISO date — invoice expire 24 jam
}

// ✅ XENDIT: payment history item
export interface PaymentHistory {
  id: string;
  // ✅ Renamed dari midtransOrderId → xenditExternalId
  xenditExternalId: string;
  xenditInvoiceId: string | null;
  invoiceUrl: string | null;
  amount: number;
  currency: string;
  // ✅ Status Xendit: pending | paid | settled | expired | failed
  paymentStatus: 'pending' | 'paid' | 'settled' | 'expired' | 'failed';
  // ✅ Renamed dari paymentType → paymentMethod + paymentChannel
  paymentMethod: XenditPaymentMethod | null;
  paymentChannel: XenditPaymentChannel | null;
  periodStart: string;
  periodEnd: string;
  paidAt: string | null;
  createdAt: string;
}

// ==========================================
// SUBSCRIPTION API SERVICE
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
   * Create Xendit Invoice untuk upgrade subscription
   * POST /api/payment/subscribe
   * Response: invoice_url → frontend redirect ke sana
   *
   * ✅ Ganti dari Midtrans createUpgradePayment() yang return token
   */
  createUpgradePayment: () =>
    api.post<CreatePaymentResponse>('/payment/subscribe'),

  /**
   * Cancel subscription (no refund, access until period end)
   * POST /api/subscription/cancel
   */
  cancelSubscription: (reason?: string) =>
    api.post('/subscription/cancel', reason ? { reason } : undefined),

  /**
   * Get status payment terbaru (untuk polling setelah redirect balik dari Xendit)
   * GET /api/payment/status
   *
   * ✅ BARU: menggantikan getClientKey() yang tidak relevan untuk Xendit
   */
  getPaymentStatus: () =>
    api.get<{
      payment_id: string;
      external_id: string;
      xendit_invoice_id: string | null;
      invoice_url: string | null;
      status: PaymentHistory['paymentStatus'];
      amount: number;
      paid_at: string | null;
      period_end: string | null;
    }>('/payment/status'),
};
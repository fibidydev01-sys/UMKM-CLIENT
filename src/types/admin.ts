// ==========================================
// ADMIN TYPES
// File: src/types/admin.ts
// ==========================================

// ==========================================
// ADMIN ENTITY
// ==========================================

export interface Admin {
  id: string;
  email: string;
  name: string | null;
  role: 'SUPER_ADMIN';
  isActive: boolean;
  createdAt: string;
}

// ==========================================
// STATS
// ==========================================

export interface AdminStats {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalRevenue: number;
  revenueThisMonth: number;
  newTenantsThisMonth: number;
  totalRedeemCodes: number;
  usedRedeemCodes: number;
}

// ==========================================
// TENANT (admin view)
// ==========================================

export interface AdminTenant {
  id: string;
  slug: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  subscription?: {
    plan: 'STARTER' | 'BUSINESS';
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';
    currentPeriodEnd: string | null;
    isTrial: boolean;
  };
  _count: { products: number };
}

export interface AdminTenantDetail extends AdminTenant {
  description?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  logo?: string;
  updatedAt: string;
  customDomain?: string | null;
  customDomainVerified?: boolean;
  subscription?: {
    id: string;
    plan: 'STARTER' | 'BUSINESS';
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';
    isTrial: boolean;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    trialEndsAt: string | null;
    priceAmount: number;
    cancelledAt: string | null;
    payments: AdminPaymentHistory[];
  };
}

// ==========================================
// SUBSCRIPTION (admin view)
// ==========================================

export interface AdminSubscription {
  id: string;
  plan: 'STARTER' | 'BUSINESS';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';
  isTrial: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  priceAmount: number;
  cancelledAt: string | null;
  createdAt: string;
  tenant: {
    id: string;
    name: string;
    email: string;
    slug: string;
    status: string;
  };
}

export interface AdminPaymentHistory {
  id: string;
  xenditExternalId: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string | null;
  paidAt: string | null;
  createdAt: string;
}

// ==========================================
// REDEEM CODE
// ==========================================

export interface RedeemCode {
  id: string;
  code: string;
  plan: 'STARTER' | 'BUSINESS';
  durationDay: number;
  isUsed: boolean;
  usedBy: string | null;
  usedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: {
    name: string | null;
    email: string;
  };
}

// ==========================================
// ADMIN LOG
// ==========================================

export interface AdminLog {
  id: string;
  action: string;
  targetId: string | null;
  details: Record<string, any> | null;
  ipAddress: string | null;
  createdAt: string;
  admin: {
    name: string | null;
    email: string;
  };
}

// ==========================================
// PAGINATION
// Pakai nama AdminPaginatedResponse untuk
// menghindari konflik dengan PaginatedResponse
// yang sudah ada di types/api.ts
// ==========================================

export interface AdminPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ==========================================
// API QUERY PARAMS
// ==========================================

export interface TenantQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface SubscriptionQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
}

export interface RedeemCodeQueryParams {
  page?: number;
  limit?: number;
  isUsed?: boolean;
}
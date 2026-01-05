// ==========================================
// TENANT TYPES
// ==========================================

import type { TenantLandingConfig } from './landing';

// ==========================================
// SOCIAL LINKS TYPE
// ==========================================
export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  email: string;
  category: string;
  description?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  logo?: string;
  banner?: string;
  theme?: { primaryColor?: string };
  landingConfig?: TenantLandingConfig;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  socialLinks?: SocialLinks;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt?: string;
}

export interface PublicTenant {
  id: string;
  slug: string;
  name: string;
  category: string;
  description?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  logo?: string;
  banner?: string;
  theme?: { primaryColor?: string };
  landingConfig?: TenantLandingConfig;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  socialLinks?: SocialLinks;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  _count?: { products: number };
}

export interface UpdateTenantInput {
  name?: string;
  description?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  logo?: string;
  banner?: string;
  theme?: { primaryColor?: string };
  landingConfig?: TenantLandingConfig;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  socialLinks?: SocialLinks;
}

// ==========================================
// DASHBOARD STATS (Enhanced)
// ==========================================

export interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    phone?: string;
  } | null;
  customerName?: string;
  customerPhone?: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  stock: number | null;
  sku?: string | null;
}

export interface DashboardStats {
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  customers: {
    total: number;
    thisMonth: number;
    trend: number;
  };
  orders: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
    trend: number;
  };
  revenue: {
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
    trend: number;
  };
  alerts: {
    lowStock: number;
    pendingOrders: number;
  };
  recentOrders: RecentOrder[];
  lowStockItems: LowStockItem[];
}

// Keep backward compatibility alias
export type TenantStats = DashboardStats;
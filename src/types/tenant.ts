// ==========================================
// TENANT TYPES
// ==========================================

import type { TenantLandingConfig, Testimonial } from './landing';

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

// ==========================================
// FEATURE ITEM TYPE (for About section)
// ==========================================
export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

// ==========================================
// PAYMENT SETTINGS TYPES (NEW)
// ==========================================

export type BankName = 'BCA' | 'Mandiri' | 'BNI' | 'BRI' | 'BSI' | 'CIMB' | 'Permata' | 'Danamon' | 'Other';
export type EWalletProvider = 'GoPay' | 'OVO' | 'DANA' | 'ShopeePay' | 'LinkAja' | 'Other';
export type CourierName = 'JNE' | 'J&T Express' | 'SiCepat' | 'AnterAja' | 'Ninja Express' | 'ID Express' | 'SAP Express' | 'Lion Parcel' | 'Pos Indonesia' | 'TIKI' | 'Other';

export interface BankAccount {
  id: string;
  bank: BankName;
  accountNumber: string;
  accountName: string;
  enabled: boolean;
}

export interface EWallet {
  id: string;
  provider: EWalletProvider;
  number: string;
  name?: string;
  enabled: boolean;
}

export interface CodSettings {
  enabled: boolean;
  note?: string;
}

export interface PaymentMethods {
  bankAccounts: BankAccount[];
  eWallets: EWallet[];
  cod: CodSettings;
}

// ==========================================
// SHIPPING SETTINGS TYPES (NEW)
// ==========================================

export interface Courier {
  id: string;
  name: CourierName;
  enabled: boolean;
  note?: string;
}

export interface ShippingMethods {
  couriers: Courier[];
}

// ==========================================
// TENANT INTERFACES
// ==========================================

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
  theme?: { primaryColor?: string };
  landingConfig?: TenantLandingConfig;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  socialLinks?: SocialLinks;
  // Payment Settings
  currency: string;
  taxRate: number;
  paymentMethods?: PaymentMethods;
  // Shipping Settings
  freeShippingThreshold?: number | null;
  defaultShippingCost: number;
  shippingMethods?: ShippingMethods;
  // ==========================================
  // STORE INFORMATION - HERO SECTION
  // ==========================================
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroBackgroundImage?: string;
  // ==========================================
  // STORE INFORMATION - ABOUT SECTION
  // ==========================================
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutContent?: string;
  aboutImage?: string;
  aboutFeatures?: FeatureItem[];
  // ==========================================
  // STORE INFORMATION - TESTIMONIALS SECTION
  // ==========================================
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: Testimonial[];
  // ==========================================
  // STORE INFORMATION - CONTACT SECTION
  // ==========================================
  contactTitle?: string;
  contactSubtitle?: string;
  contactMapUrl?: string;
  contactShowMap?: boolean;
  contactShowForm?: boolean;
  // ==========================================
  // STORE INFORMATION - CTA SECTION
  // ==========================================
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaButtonStyle?: 'primary' | 'secondary' | 'outline';
  // Status
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
  theme?: { primaryColor?: string };
  landingConfig?: TenantLandingConfig;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  socialLinks?: SocialLinks;
  // Payment Settings
  currency: string;
  taxRate: number;
  paymentMethods?: PaymentMethods;
  // Shipping Settings
  freeShippingThreshold?: number | null;
  defaultShippingCost: number;
  shippingMethods?: ShippingMethods;
  // ==========================================
  // STORE INFORMATION - HERO SECTION
  // ==========================================
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroBackgroundImage?: string;
  // ==========================================
  // STORE INFORMATION - ABOUT SECTION
  // ==========================================
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutContent?: string;
  aboutImage?: string;
  aboutFeatures?: FeatureItem[];
  // ==========================================
  // STORE INFORMATION - TESTIMONIALS SECTION
  // ==========================================
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: Testimonial[];
  // ==========================================
  // STORE INFORMATION - CONTACT SECTION
  // ==========================================
  contactTitle?: string;
  contactSubtitle?: string;
  contactMapUrl?: string;
  contactShowMap?: boolean;
  contactShowForm?: boolean;
  // ==========================================
  // STORE INFORMATION - CTA SECTION
  // ==========================================
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaButtonStyle?: 'primary' | 'secondary' | 'outline';
  // Status
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
  // Payment Settings
  currency?: string;
  taxRate?: number;
  paymentMethods?: PaymentMethods;
  // Shipping Settings
  freeShippingThreshold?: number | null;
  defaultShippingCost?: number;
  shippingMethods?: ShippingMethods;
  // ==========================================
  // STORE INFORMATION - HERO SECTION
  // ==========================================
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroBackgroundImage?: string;
  // ==========================================
  // STORE INFORMATION - ABOUT SECTION
  // ==========================================
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutContent?: string;
  aboutImage?: string;
  aboutFeatures?: FeatureItem[];
  // ==========================================
  // STORE INFORMATION - TESTIMONIALS SECTION
  // ==========================================
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: Testimonial[];
  // ==========================================
  // STORE INFORMATION - CONTACT SECTION
  // ==========================================
  contactTitle?: string;
  contactSubtitle?: string;
  contactMapUrl?: string;
  contactShowMap?: boolean;
  contactShowForm?: boolean;
  // ==========================================
  // STORE INFORMATION - CTA SECTION
  // ==========================================
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaButtonStyle?: 'primary' | 'secondary' | 'outline';
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
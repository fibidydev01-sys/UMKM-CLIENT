// ==========================================
// TENANT TYPES
// ✅ UPDATED Feb 2026 — ASEAN Courier Research
// ==========================================

import type { TenantLandingConfig, Testimonial } from './landing';

// ==========================================
// ASEAN CURRENCY — Re-export from dedicated module
// ==========================================
// Import dari '@/types/asean-currency' untuk:
//   - ASEAN_CURRENCIES const
//   - AseanCurrencyCode type
//   - ASEAN_CURRENCY_META
//   - formatAseanPrice()
//   - getAseanCurrencyMeta()
// ==========================================
export type {
  AseanCurrencyCode,
  AseanCurrencyMeta,
} from './asean-currency';
export {
  ASEAN_CURRENCIES,
  ASEAN_CURRENCY_META,
  ZERO_DECIMAL_CURRENCIES,
  ASEAN_TAX_TIPS,
  ASEAN_SIMULATION_PRICES,
  formatAseanPrice,
  isAseanCurrency,
  getAseanCurrencyMeta,
} from './asean-currency';

// ==========================================
// SOCIAL LINKS TYPE
// ==========================================
export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  whatsapp?: string;
  telegram?: string;
  pinterest?: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
  threads?: string;
  vimeo?: string;
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
// PAYMENT SETTINGS TYPES
// ==========================================

export type BankName =
  // ── Indonesia ──────────────────────────────────────────────────────────
  | 'BCA'
  | 'Mandiri'
  | 'BRI'
  | 'BNI'
  | 'BSI'
  | 'BTN'
  | 'CIMB Niaga'
  | 'Permata'
  | 'Danamon'
  | 'Maybank ID'
  | 'Panin'
  | 'Jenius'
  | 'SeaBank'
  | 'Blu by BCA'
  | 'Bank Jago'
  | 'Allo Bank'
  | 'OCBC Indonesia'   // ✅ OCBC NISP rebrand efektif Nov 2023
  // ── Malaysia ───────────────────────────────────────────────────────────
  | 'Maybank'
  | 'CIMB Malaysia'
  | 'Public Bank'
  | 'RHB Bank'
  | 'Hong Leong Bank'
  | 'AmBank'
  | 'UOB Malaysia'
  | 'OCBC Malaysia'
  | 'HSBC Malaysia'
  | 'Affin Bank'
  // ── Singapore ──────────────────────────────────────────────────────────
  | 'DBS'
  | 'OCBC'
  | 'UOB'
  | 'Standard Chartered SG'
  | 'HSBC SG'
  | 'Citibank SG'
  // ── Thailand ───────────────────────────────────────────────────────────
  | 'Bangkok Bank'
  | 'Kasikornbank'
  | 'SCB Thailand'
  | 'Krung Thai Bank'
  | 'Bank of Ayudhya'
  | 'TMBThanachart'
  // ── Philippines ────────────────────────────────────────────────────────
  | 'BDO Unibank'
  | 'BPI'
  | 'Metrobank'
  | 'PNB'
  | 'UnionBank PH'
  | 'Security Bank'
  // ── Vietnam ────────────────────────────────────────────────────────────
  | 'Vietcombank'
  | 'VietinBank'
  | 'BIDV'
  | 'Techcombank'
  | 'MB Bank'
  | 'ACB Vietnam'
  // ── Brunei ─────────────────────────────────────────────────────────────
  | 'Baiduri Bank'     // Market leader Brunei, retail & SME
  | 'Bank Islam Brunei Darussalam' // BIBD — largest Islamic bank BN
  // ── Regional / Global ──────────────────────────────────────────────────
  | 'HSBC'
  | 'Citibank'
  | 'Standard Chartered'
  // ── Fallback ───────────────────────────────────────────────────────────
  | 'Other';

export type EWalletProvider =
  // ── Indonesia ──────────────────────────────────────────────────────────
  | 'GoPay'
  | 'OVO'
  | 'DANA'
  | 'ShopeePay'
  | 'LinkAja'
  | 'QRIS'
  // ── Malaysia ───────────────────────────────────────────────────────────
  | 'Touch n Go'
  | 'GrabPay MY'
  | 'Boost'
  | 'MAE'
  | 'ShopeePay MY'
  // ── Singapore ──────────────────────────────────────────────────────────
  | 'PayNow'
  | 'GrabPay SG'
  | 'DBS PayLah'
  | 'NETS'
  // ── Thailand ───────────────────────────────────────────────────────────
  | 'TrueMoney'
  | 'PromptPay'
  | 'Rabbit LINE Pay'
  | 'ShopeePay TH'
  // ── Philippines ────────────────────────────────────────────────────────
  | 'GCash'
  | 'Maya'
  | 'GrabPay PH'
  | 'ShopeePay PH'
  // ── Vietnam ────────────────────────────────────────────────────────────
  | 'MoMo'
  | 'ZaloPay'
  | 'VNPay'
  | 'ShopeePay VN'
  // ── Brunei ─────────────────────────────────────────────────────────────
  | 'Progresif Pay'    // Brunei e-wallet by Progresif (telco)
  // ── Regional / Global ──────────────────────────────────────────────────
  | 'GrabPay'
  | 'Apple Pay'
  | 'Google Pay'
  | 'PayPal'
  | 'Alipay'
  | 'WeChat Pay'
  // ── Fallback ───────────────────────────────────────────────────────────
  | 'Other';

// ==========================================
// COURIER NAME TYPE
// ==========================================
/**
 * ✅ UPDATED Feb 2026 — Verified active ASEAN couriers
 * 
 * Research sources:
 * - Market share reports Q4 2025 / Q1 2026
 * - Official courier websites & press releases
 * - E-commerce platform integrations
 * 
 * Changes from previous version:
 * ❌ REMOVED:
 *   - AnterAja (Indonesia) → Unreliable service, poor ratings
 *   - Flash Express (Malaysia) → Permanently closed 31 Jan 2026
 *   - Ninja Van (Vietnam) → Suspended operations Sep 2024
 *   - ID Express, SAP Express → Minor players, simplified list
 *   - Nim Express (Thailand) → Consolidated to major players
 * 
 * ✅ ADDED:
 *   - JRS Express (Philippines) → 65+ years, 450+ branches
 *   - Pos Brunei → National postal service monopoly
 *   - Lalamove (Singapore) → On-demand delivery leader
 * 
 * ⚠️ NOTES:
 *   - Kerry Express renamed to KEX Express (Jul 2024), but keeping original name for compatibility
 *   - Flash Express active in Thailand only (profitable market)
 *   - SPX Express = Shopee Express (active: ID, MY, TH, PH, VN)
 */
export type CourierName =
  // ─── Indonesia (9 aktif) ──────────────────────────────────────
  | 'JNE'                // Market leader since 1990, 8000+ points
  | 'J&T Express'        // Revenue +37% 2024, 3M parcels/day
  | 'SiCepat'           // 500+ cities, profitable 2025
  | 'SPX Express'       // Shopee in-house, market leader
  | 'Ninja Express'     // 2M+ merchants, strong COD
  | 'Paxel'            // Same-day specialist, COD
  | 'Lion Parcel'      // Cold chain, Halim hub 2025
  | 'Pos Indonesia'    // BUMN, widest coverage
  | 'TIKI'             // Veteran since 1970
  // ─── Malaysia (6 aktif) ───────────────────────────────────────
  | 'Pos Laju'         // Only rural Sabah/Sarawak coverage
  | 'GDEX'             // B2B strong, East Malaysia
  | 'City-Link Express' // Since 1979, East specialist
  // ─── Thailand (4 aktif) ───────────────────────────────────────
  | 'Thailand Post'    // Market leader by volume
  | 'Flash Express'    // #2 market share, profitable 2025
  | 'Kerry Express'    // ⚠️ Rebranded to KEX, restructuring
  // ─── Singapore (4 aktif) ──────────────────────────────────────
  | 'SingPost'         // National post, SmartPac popular
  | 'Lalamove'         // On-demand same-day, 24/7
  // ─── Philippines (5 aktif) ────────────────────────────────────
  | 'LBC Express'      // 36% market share, 6400+ outlets
  | '2GO Express'      // FedEx retail partner, sea+air
  | 'JRS Express'      // 65+ years, 450+ branches, budget
  // ─── Vietnam (5 aktif) ────────────────────────────────────────
  | 'GHN'              // Giao Hang Nhanh, AI suite 2025
  | 'GHTK'             // E-commerce specialist, COD
  | 'Viettel Post'     // Largest daily delivery count
  // ─── Brunei (1 domestic + 2 international) ────────────────────
  | 'Pos Brunei'       // National postal service monopoly
  // ─── ASEAN Cross-region ───────────────────────────────────────
  | 'Ninja Van'        // Active: MY, SG, PH, TH, ID (not VN!)
  | 'DHL Express'      // All ASEAN countries
  // ─── Fallback ─────────────────────────────────────────────────
  | 'Other';

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
// SHIPPING SETTINGS TYPES
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

export interface SeoFormData {
  metaTitle: string;
  metaDescription: string;
  socialLinks: SocialLinks;
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
  // NOTE: currency is string (DB-level) — use AseanCurrencyCode for UI validation
  currency: string;
  taxRate: number;
  paymentMethods?: PaymentMethods;
  // Shipping Settings
  freeShippingThreshold?: number | null;
  defaultShippingCost: number;
  shippingMethods?: ShippingMethods;
  // HERO SECTION
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroBackgroundImage?: string;
  // ABOUT SECTION
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutContent?: string;
  aboutImage?: string;
  aboutFeatures?: FeatureItem[];
  // TESTIMONIALS SECTION
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: Testimonial[];
  // CONTACT SECTION
  contactTitle?: string;
  contactSubtitle?: string;
  contactMapUrl?: string;
  contactShowMap?: boolean;
  contactShowForm?: boolean;
  // CTA SECTION
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaButtonStyle?: 'primary' | 'secondary' | 'outline';
  // CUSTOM DOMAIN
  customDomain?: string | null;
  customDomainVerified?: boolean;
  customDomainToken?: string | null;
  sslStatus?: string | null;
  sslIssuedAt?: string | null;
  dnsRecords?: import('./domain').DnsRecord[] | null;
  customDomainAddedAt?: string | null;
  customDomainVerifiedAt?: string | null;
  customDomainRemovedAt?: string | null;
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
  // HERO SECTION
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroBackgroundImage?: string;
  // ABOUT SECTION
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutContent?: string;
  aboutImage?: string;
  aboutFeatures?: FeatureItem[];
  // TESTIMONIALS SECTION
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: Testimonial[];
  // CONTACT SECTION
  contactTitle?: string;
  contactSubtitle?: string;
  contactMapUrl?: string;
  contactShowMap?: boolean;
  contactShowForm?: boolean;
  // CTA SECTION
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaButtonStyle?: 'primary' | 'secondary' | 'outline';
  // CUSTOM DOMAIN (public-safe fields only)
  customDomain?: string | null;
  customDomainVerified?: boolean;
  sslStatus?: string | null;
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
  // HERO SECTION
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroBackgroundImage?: string;
  // ABOUT SECTION
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutContent?: string;
  aboutImage?: string;
  aboutFeatures?: FeatureItem[];
  // TESTIMONIALS SECTION
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: Testimonial[];
  // CONTACT SECTION
  contactTitle?: string;
  contactSubtitle?: string;
  contactMapUrl?: string;
  contactShowMap?: boolean;
  contactShowForm?: boolean;
  // CTA SECTION
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaButtonStyle?: 'primary' | 'secondary' | 'outline';
}

// ==========================================
// FORM DATA TYPES
// ==========================================

export interface HeroFormData {
  name: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBackgroundImage: string;
  logo: string;
  primaryColor: string;
  category: string;
}

export interface AboutFormData {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutContent: string;
  aboutImage: string;
  aboutFeatures: FeatureItem[];
}

export interface TestimonialsFormData {
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: Testimonial[];
}

export interface ContactFormData {
  contactTitle: string;
  contactSubtitle: string;
  contactMapUrl: string;
  contactShowMap: boolean;
  contactShowForm: boolean;
  phone: string;
  whatsapp: string;
  address: string;
}

export interface CtaFormData {
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaButtonStyle: 'primary' | 'secondary' | 'outline';
}

export interface PembayaranFormData {
  currency: string;
  taxRate: number;
  paymentMethods: PaymentMethods;
}

export interface PengirimanFormData {
  currency: string;
  freeShippingThreshold: number | null;
  defaultShippingCost: number;
  shippingMethods: ShippingMethods;
}

// ==========================================
// DASHBOARD STATS
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
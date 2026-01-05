// ==========================================
// APP CONSTANTS
// ==========================================

/**
 * API Configuration
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * App Configuration
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'fibidy_token',
  CART: 'fibidy_cart',
  THEME: 'fibidy_theme',
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Image Configuration
 */
export const IMAGE = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  PLACEHOLDER: '/images/placeholder.png',
} as const;

/**
 * Order Status Labels (Indonesian)
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Menunggu',
  PROCESSING: 'Diproses',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

/**
 * Payment Status Labels (Indonesian)
 */
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Belum Bayar',
  PAID: 'Lunas',
  PARTIAL: 'Sebagian',
  FAILED: 'Gagal',
};

/**
 * Payment Methods
 */
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Tunai' },
  { value: 'transfer', label: 'Transfer Bank' },
  { value: 'qris', label: 'QRIS' },
  { value: 'debt', label: 'Hutang' },
] as const;

/**
 * Unit Options
 */
export const UNIT_OPTIONS = [
  { value: 'pcs', label: 'Pcs' },
  { value: 'kg', label: 'Kg' },
  { value: 'gram', label: 'Gram' },
  { value: 'liter', label: 'Liter' },
  { value: 'porsi', label: 'Porsi' },
  { value: 'jam', label: 'Jam' },
  { value: 'hari', label: 'Hari' },
  { value: 'paket', label: 'Paket' },
] as const;

export const BUSINESS_CATEGORIES = [
  { value: 'WARUNG_KELONTONG', label: 'Warung Kelontong' },
  { value: 'TOKO_BANGUNAN', label: 'Toko Bangunan' },
  { value: 'TOKO_ELEKTRONIK', label: 'Toko Elektronik' },
  { value: 'BENGKEL', label: 'Bengkel Motor/Mobil' },
  { value: 'SALON_KECANTIKAN', label: 'Salon Kecantikan' },
  { value: 'LAUNDRY', label: 'Laundry' },
  { value: 'WARUNG_MAKAN', label: 'Warung Makan' },
  { value: 'CATERING', label: 'Catering' },
  { value: 'KEDAI_KOPI', label: 'Kedai Kopi' },
  { value: 'TOKO_KUE', label: 'Toko Kue & Bakery' },
  { value: 'APOTEK', label: 'Apotek & Toko Obat' },
  { value: 'KONTER_HP', label: 'Konter HP & Pulsa' },
  { value: 'RENTAL_KENDARAAN', label: 'Rental Kendaraan' },
  { value: 'STUDIO_FOTO', label: 'Studio Foto' },
  { value: 'PRINTING', label: 'Printing & Fotocopy' },
  { value: 'PET_SHOP', label: 'Pet Shop' },
  { value: 'AC_SERVICE', label: 'Service AC' },
  { value: 'OTHER', label: 'Lainnya' },
] as const;

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number]['value'];
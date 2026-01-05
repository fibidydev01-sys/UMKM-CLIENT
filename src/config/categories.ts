import {
  ShoppingCart,
  Wrench,
  Scissors,
  Shirt,
  UtensilsCrossed,
  Package,
  Coffee,
  Cake,
  Pill,
  Wind,
  Camera,
  Dog,
  Dumbbell,
  Home,
  Printer,
  type LucideIcon,
} from 'lucide-react';

// ==========================================
// CATEGORY TYPES
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

export interface CategoryConfig {
  key: string;
  icon: LucideIcon;
  label: string;
  labelShort: string;
  color: string;
  description: string;
  features: CategoryFeatures;
  labels: CategoryLabels;
}

// ==========================================
// 15 MVP CATEGORIES
// ==========================================

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  // ========== RETAIL ==========
  WARUNG_KELONTONG: {
    key: 'WARUNG_KELONTONG',
    icon: ShoppingCart,
    label: 'Warung Kelontong',
    labelShort: 'Warung',
    color: '#10b981',
    description: 'Toko kelontong, sembako, minimarket',
    features: {
      stock: true,
      debt: true,
      booking: false,
      tracking: false,
      membership: false,
      cashier: true,
    },
    labels: {
      product: 'Produk',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },

  TOKO_BANGUNAN: {
    key: 'TOKO_BANGUNAN',
    icon: Package,
    label: 'Toko Bangunan',
    labelShort: 'Bangunan',
    color: '#f59e0b',
    description: 'Material bangunan, alat tukang',
    features: {
      stock: true,
      debt: true,
      booking: false,
      tracking: false,
      membership: false,
      cashier: true,
    },
    labels: {
      product: 'Material',
      price: 'Harga',
      customer: 'Kontraktor',
    },
  },

  // ========== SERVICE ==========
  BENGKEL_MOTOR: {
    key: 'BENGKEL_MOTOR',
    icon: Wrench,
    label: 'Bengkel Motor',
    labelShort: 'Bengkel',
    color: '#f97316',
    description: 'Service motor, ganti oli, tune up',
    features: {
      stock: true,
      debt: false,
      booking: true,
      tracking: true,
      membership: false,
      cashier: false,
    },
    labels: {
      product: 'Layanan',
      price: 'Tarif',
      customer: 'Pelanggan',
    },
  },

  LAUNDRY: {
    key: 'LAUNDRY',
    icon: Shirt,
    label: 'Laundry',
    labelShort: 'Laundry',
    color: '#3b82f6',
    description: 'Cuci kiloan, cuci satuan, setrika',
    features: {
      stock: false,
      debt: false,
      booking: false,
      tracking: true,
      membership: false,
      cashier: true,
    },
    labels: {
      product: 'Layanan',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },

  SERVICE_AC: {
    key: 'SERVICE_AC',
    icon: Wind,
    label: 'Service AC',
    labelShort: 'AC',
    color: '#06b6d4',
    description: 'Service AC, elektronik, kulkas',
    features: {
      stock: true,
      debt: false,
      booking: true,
      tracking: true,
      membership: false,
      cashier: false,
    },
    labels: {
      product: 'Layanan',
      price: 'Tarif',
      customer: 'Pelanggan',
    },
  },

  // ========== BEAUTY & HEALTH ==========
  SALON_BARBERSHOP: {
    key: 'SALON_BARBERSHOP',
    icon: Scissors,
    label: 'Salon & Barbershop',
    labelShort: 'Salon',
    color: '#ec4899',
    description: 'Potong rambut, creambath, facial',
    features: {
      stock: false,
      debt: false,
      booking: true,
      tracking: false,
      membership: true,
      cashier: true,
    },
    labels: {
      product: 'Layanan',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },

  APOTEK: {
    key: 'APOTEK',
    icon: Pill,
    label: 'Apotek',
    labelShort: 'Apotek',
    color: '#ef4444',
    description: 'Obat, vitamin, alat kesehatan',
    features: {
      stock: true,
      debt: false,
      booking: false,
      tracking: false,
      membership: false,
      cashier: true,
    },
    labels: {
      product: 'Obat',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },

  // ========== F&B ==========
  CATERING: {
    key: 'CATERING',
    icon: UtensilsCrossed,
    label: 'Catering',
    labelShort: 'Catering',
    color: '#f59e0b',
    description: 'Catering harian, prasmanan, nasi box',
    features: {
      stock: false,
      debt: false,
      booking: true,
      tracking: true,
      membership: false,
      cashier: false,
    },
    labels: {
      product: 'Menu',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },

  KEDAI_KOPI: {
    key: 'KEDAI_KOPI',
    icon: Coffee,
    label: 'Kedai Kopi',
    labelShort: 'Kopi',
    color: '#78350f',
    description: 'Coffee shop, cafe, kedai minuman',
    features: {
      stock: true,
      debt: false,
      booking: false,
      tracking: false,
      membership: true,
      cashier: true,
    },
    labels: {
      product: 'Menu',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },

  TOKO_KUE: {
    key: 'TOKO_KUE',
    icon: Cake,
    label: 'Toko Kue',
    labelShort: 'Kue',
    color: '#db2777',
    description: 'Kue, roti, bakery, pastry',
    features: {
      stock: true,
      debt: false,
      booking: true,
      tracking: false,
      membership: false,
      cashier: true,
    },
    labels: {
      product: 'Produk',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },

  // ========== OTHERS ==========
  FOTOGRAFI: {
    key: 'FOTOGRAFI',
    icon: Camera,
    label: 'Fotografi',
    labelShort: 'Foto',
    color: '#8b5cf6',
    description: 'Studio foto, wedding, dokumentasi',
    features: {
      stock: false,
      debt: false,
      booking: true,
      tracking: true,
      membership: false,
      cashier: false,
    },
    labels: {
      product: 'Paket',
      price: 'Harga',
      customer: 'Klien',
    },
  },

  PETSHOP: {
    key: 'PETSHOP',
    icon: Dog,
    label: 'Pet Shop',
    labelShort: 'Pet',
    color: '#f97316',
    description: 'Makanan hewan, grooming, aksesoris',
    features: {
      stock: true,
      debt: false,
      booking: true,
      tracking: false,
      membership: true,
      cashier: true,
    },
    labels: {
      product: 'Produk',
      price: 'Harga',
      customer: 'Pet Owner',
    },
  },

  GYM_FITNESS: {
    key: 'GYM_FITNESS',
    icon: Dumbbell,
    label: 'Gym & Fitness',
    labelShort: 'Gym',
    color: '#059669',
    description: 'Tempat gym, fitness center',
    features: {
      stock: false,
      debt: false,
      booking: true,
      tracking: false,
      membership: true,
      cashier: true,
    },
    labels: {
      product: 'Paket',
      price: 'Harga',
      customer: 'Member',
    },
  },

  KOST_KONTRAKAN: {
    key: 'KOST_KONTRAKAN',
    icon: Home,
    label: 'Kost & Kontrakan',
    labelShort: 'Kost',
    color: '#0891b2',
    description: 'Kost, kontrakan, sewa kamar',
    features: {
      stock: false,
      debt: true,
      booking: true,
      tracking: true,
      membership: false,
      cashier: false,
    },
    labels: {
      product: 'Kamar',
      price: 'Harga',
      customer: 'Penghuni',
    },
  },

  PERCETAKAN: {
    key: 'PERCETAKAN',
    icon: Printer,
    label: 'Percetakan',
    labelShort: 'Print',
    color: '#4f46e5',
    description: 'Print, fotocopy, cetak undangan',
    features: {
      stock: true,
      debt: false,
      booking: true,
      tracking: true,
      membership: false,
      cashier: true,
    },
    labels: {
      product: 'Layanan',
      price: 'Harga',
      customer: 'Pelanggan',
    },
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get category config by key
 */
export function getCategoryConfig(category: string): CategoryConfig | null {
  return CATEGORY_CONFIG[category] || null;
}

/**
 * Get all categories as array
 */
export function getCategoryList(): CategoryConfig[] {
  return Object.values(CATEGORY_CONFIG);
}

/**
 * Get category options for select
 */
export function getCategoryOptions(): { value: string; label: string }[] {
  return Object.values(CATEGORY_CONFIG).map((cat) => ({
    value: cat.key,
    label: cat.label,
  }));
}

/**
 * Default category config for unknown categories
 */
export const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  key: 'OTHER',
  icon: Package,
  label: 'Lainnya',
  labelShort: 'Lainnya',
  color: '#6b7280',
  description: 'Kategori lainnya',
  features: {
    stock: true,
    debt: false,
    booking: false,
    tracking: false,
    membership: false,
    cashier: true,
  },
  labels: {
    product: 'Produk',
    price: 'Harga',
    customer: 'Pelanggan',
  },
};
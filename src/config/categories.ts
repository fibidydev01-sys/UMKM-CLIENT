import { Package, type LucideIcon } from 'lucide-react';

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
  group: string;
  features: CategoryFeatures;
  labels: CategoryLabels;
}

export interface CategoryGroup {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  count: number;
}

// ==========================================
// 7 CATEGORY GROUPS
// ==========================================

export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  FOOD_DRINK: {
    key: 'FOOD_DRINK',
    label: 'Food & Drink',
    icon: Package,
    color: '#f59e0b',
    count: 6,
  },
  HEALTH_BEAUTY: {
    key: 'HEALTH_BEAUTY',
    label: 'Health & Beauty',
    icon: Package,
    color: '#ec4899',
    count: 7,
  },
  RETAIL: {
    key: 'RETAIL',
    label: 'Retail',
    icon: Package,
    color: '#06b6d4',
    count: 6,
  },
  HOME_SERVICES: {
    key: 'HOME_SERVICES',
    label: 'Home Services',
    icon: Package,
    color: '#10b981',
    count: 7,
  },
  AUTOMOTIVE: {
    key: 'AUTOMOTIVE',
    label: 'Automotive',
    icon: Package,
    color: '#3b82f6',
    count: 4,
  },
  LIFESTYLE_ENTERTAINMENT: {
    key: 'LIFESTYLE_ENTERTAINMENT',
    label: 'Lifestyle & Entertainment',
    icon: Package,
    color: '#8b5cf6',
    count: 5,
  },
  PROFESSIONAL_SERVICES: {
    key: 'PROFESSIONAL_SERVICES',
    label: 'Professional Services',
    icon: Package,
    color: '#6b7280',
    count: 6,
  },
};

// ==========================================
// ~50 CATEGORIES — ASEAN-relevant, English
// ==========================================

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {

  // ─────────────────────────────────────────
  // FOOD & DRINK (6)
  // ─────────────────────────────────────────
  RESTAURANT: {
    key: 'RESTAURANT',
    icon: Package,
    label: 'Restaurant',
    labelShort: 'Restaurant',
    color: '#f59e0b',
    description: 'Dine-in restaurant or food hall',
    group: 'FOOD_DRINK',
    features: { stock: true, debt: false, booking: true, tracking: false, membership: false, cashier: true },
    labels: { product: 'Menu Item', price: 'Price', customer: 'Guest' },
  },
  CAFE: {
    key: 'CAFE',
    icon: Package,
    label: 'Cafe & Coffee Shop',
    labelShort: 'Cafe',
    color: '#78350f',
    description: 'Coffee shop, cafe, or tea house',
    group: 'FOOD_DRINK',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: true, cashier: true },
    labels: { product: 'Menu Item', price: 'Price', customer: 'Customer' },
  },
  BAKERY: {
    key: 'BAKERY',
    icon: Package,
    label: 'Bakery',
    labelShort: 'Bakery',
    color: '#f97316',
    description: 'Bread, pastries, and baked goods',
    group: 'FOOD_DRINK',
    features: { stock: true, debt: false, booking: true, tracking: false, membership: false, cashier: true },
    labels: { product: 'Item', price: 'Price', customer: 'Customer' },
  },
  FOOD_DELIVERY: {
    key: 'FOOD_DELIVERY',
    icon: Package,
    label: 'Food Delivery',
    labelShort: 'Delivery',
    color: '#ef4444',
    description: 'Online food ordering and delivery',
    group: 'FOOD_DRINK',
    features: { stock: true, debt: false, booking: false, tracking: true, membership: false, cashier: true },
    labels: { product: 'Menu Item', price: 'Price', customer: 'Customer' },
  },
  CATERING: {
    key: 'CATERING',
    icon: Package,
    label: 'Catering',
    labelShort: 'Catering',
    color: '#d97706',
    description: 'Event catering and meal packages',
    group: 'FOOD_DRINK',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Package', price: 'Price', customer: 'Client' },
  },
  STREET_FOOD: {
    key: 'STREET_FOOD',
    icon: Package,
    label: 'Street Food & Snacks',
    labelShort: 'Street Food',
    color: '#ea580c',
    description: 'Street food stall, food cart, or snack shop',
    group: 'FOOD_DRINK',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Item', price: 'Price', customer: 'Customer' },
  },

  // ─────────────────────────────────────────
  // HEALTH & BEAUTY (7)
  // ─────────────────────────────────────────
  HAIR_SALON: {
    key: 'HAIR_SALON',
    icon: Package,
    label: 'Hair Salon',
    labelShort: 'Hair Salon',
    color: '#db2777',
    description: 'Hair styling, coloring, and treatment',
    group: 'HEALTH_BEAUTY',
    features: { stock: false, debt: false, booking: true, tracking: false, membership: true, cashier: true },
    labels: { product: 'Service', price: 'Price', customer: 'Client' },
  },
  BARBERSHOP: {
    key: 'BARBERSHOP',
    icon: Package,
    label: 'Barbershop',
    labelShort: 'Barbershop',
    color: '#374151',
    description: 'Men\'s haircut and grooming',
    group: 'HEALTH_BEAUTY',
    features: { stock: false, debt: false, booking: true, tracking: false, membership: true, cashier: true },
    labels: { product: 'Service', price: 'Price', customer: 'Client' },
  },
  NAIL_SALON: {
    key: 'NAIL_SALON',
    icon: Package,
    label: 'Nail Salon',
    labelShort: 'Nail Salon',
    color: '#f472b6',
    description: 'Nail art, manicure, and pedicure',
    group: 'HEALTH_BEAUTY',
    features: { stock: true, debt: false, booking: true, tracking: false, membership: true, cashier: true },
    labels: { product: 'Service', price: 'Price', customer: 'Client' },
  },
  SPA_MASSAGE: {
    key: 'SPA_MASSAGE',
    icon: Package,
    label: 'Spa & Massage',
    labelShort: 'Spa',
    color: '#a855f7',
    description: 'Spa treatments, massage, and relaxation',
    group: 'HEALTH_BEAUTY',
    features: { stock: true, debt: false, booking: true, tracking: false, membership: true, cashier: true },
    labels: { product: 'Treatment', price: 'Price', customer: 'Guest' },
  },
  SKINCARE_CLINIC: {
    key: 'SKINCARE_CLINIC',
    icon: Package,
    label: 'Skincare Clinic',
    labelShort: 'Skincare',
    color: '#ec4899',
    description: 'Facial treatments, skincare, and aesthetics',
    group: 'HEALTH_BEAUTY',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: true, cashier: true },
    labels: { product: 'Treatment', price: 'Price', customer: 'Patient' },
  },
  PHARMACY: {
    key: 'PHARMACY',
    icon: Package,
    label: 'Pharmacy',
    labelShort: 'Pharmacy',
    color: '#16a34a',
    description: 'Medicine, vitamins, and health products',
    group: 'HEALTH_BEAUTY',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },
  GYM_FITNESS: {
    key: 'GYM_FITNESS',
    icon: Package,
    label: 'Gym & Fitness',
    labelShort: 'Gym',
    color: '#059669',
    description: 'Gym, fitness center, or yoga studio',
    group: 'HEALTH_BEAUTY',
    features: { stock: false, debt: false, booking: true, tracking: false, membership: true, cashier: true },
    labels: { product: 'Package', price: 'Price', customer: 'Member' },
  },

  // ─────────────────────────────────────────
  // RETAIL (6)
  // ─────────────────────────────────────────
  FASHION_APPAREL: {
    key: 'FASHION_APPAREL',
    icon: Package,
    label: 'Fashion & Apparel',
    labelShort: 'Fashion',
    color: '#ec4899',
    description: 'Clothing, accessories, and fashion items',
    group: 'RETAIL',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },
  FOOTWEAR: {
    key: 'FOOTWEAR',
    icon: Package,
    label: 'Footwear',
    labelShort: 'Footwear',
    color: '#374151',
    description: 'Shoes, sandals, and boots',
    group: 'RETAIL',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },
  ELECTRONICS_GADGETS: {
    key: 'ELECTRONICS_GADGETS',
    icon: Package,
    label: 'Electronics & Gadgets',
    labelShort: 'Electronics',
    color: '#3b82f6',
    description: 'Phones, gadgets, and accessories',
    group: 'RETAIL',
    features: { stock: true, debt: true, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },
  GROCERY_CONVENIENCE: {
    key: 'GROCERY_CONVENIENCE',
    icon: Package,
    label: 'Grocery & Convenience',
    labelShort: 'Grocery',
    color: '#10b981',
    description: 'Grocery store, minimarket, or convenience shop',
    group: 'RETAIL',
    features: { stock: true, debt: true, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },
  BEAUTY_COSMETICS: {
    key: 'BEAUTY_COSMETICS',
    icon: Package,
    label: 'Beauty & Cosmetics',
    labelShort: 'Cosmetics',
    color: '#db2777',
    description: 'Makeup, skincare products, and cosmetics',
    group: 'RETAIL',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },
  HOME_LIVING: {
    key: 'HOME_LIVING',
    icon: Package,
    label: 'Home & Living',
    labelShort: 'Home',
    color: '#92400e',
    description: 'Furniture, home decor, and household items',
    group: 'RETAIL',
    features: { stock: true, debt: true, booking: true, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },

  // ─────────────────────────────────────────
  // HOME SERVICES (7)
  // ─────────────────────────────────────────
  CLEANING_SERVICE: {
    key: 'CLEANING_SERVICE',
    icon: Package,
    label: 'Cleaning Service',
    labelShort: 'Cleaning',
    color: '#3b82f6',
    description: 'Home and office cleaning',
    group: 'HOME_SERVICES',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: true, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Client' },
  },
  PLUMBING: {
    key: 'PLUMBING',
    icon: Package,
    label: 'Plumbing',
    labelShort: 'Plumbing',
    color: '#0ea5e9',
    description: 'Pipe repair, installation, and water systems',
    group: 'HOME_SERVICES',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Client' },
  },
  ELECTRICAL: {
    key: 'ELECTRICAL',
    icon: Package,
    label: 'Electrical',
    labelShort: 'Electrical',
    color: '#fbbf24',
    description: 'Electrical installation and repair',
    group: 'HOME_SERVICES',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Client' },
  },
  AC_APPLIANCE_REPAIR: {
    key: 'AC_APPLIANCE_REPAIR',
    icon: Package,
    label: 'AC & Appliance Repair',
    labelShort: 'AC Repair',
    color: '#06b6d4',
    description: 'AC servicing and home appliance repair',
    group: 'HOME_SERVICES',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Client' },
  },
  LANDSCAPING: {
    key: 'LANDSCAPING',
    icon: Package,
    label: 'Landscaping & Gardening',
    labelShort: 'Landscaping',
    color: '#10b981',
    description: 'Garden design, lawn care, and plants',
    group: 'HOME_SERVICES',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Client' },
  },
  MOVING_SERVICE: {
    key: 'MOVING_SERVICE',
    icon: Package,
    label: 'Moving Service',
    labelShort: 'Moving',
    color: '#f59e0b',
    description: 'Furniture moving and relocation',
    group: 'HOME_SERVICES',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Client' },
  },
  INTERIOR_DESIGN: {
    key: 'INTERIOR_DESIGN',
    icon: Package,
    label: 'Interior Design',
    labelShort: 'Interior',
    color: '#8b5cf6',
    description: 'Interior design and renovation consulting',
    group: 'HOME_SERVICES',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Project', price: 'Rate', customer: 'Client' },
  },

  // ─────────────────────────────────────────
  // AUTOMOTIVE (4)
  // ─────────────────────────────────────────
  CAR_REPAIR: {
    key: 'CAR_REPAIR',
    icon: Package,
    label: 'Car Repair',
    labelShort: 'Car Repair',
    color: '#ef4444',
    description: 'Car service, repair, and maintenance',
    group: 'AUTOMOTIVE',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Customer' },
  },
  MOTORCYCLE_REPAIR: {
    key: 'MOTORCYCLE_REPAIR',
    icon: Package,
    label: 'Motorcycle Repair',
    labelShort: 'Moto Repair',
    color: '#f97316',
    description: 'Motorcycle service and repair',
    group: 'AUTOMOTIVE',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Customer' },
  },
  CAR_WASH: {
    key: 'CAR_WASH',
    icon: Package,
    label: 'Car Wash & Detailing',
    labelShort: 'Car Wash',
    color: '#0ea5e9',
    description: 'Car wash, detailing, and coating',
    group: 'AUTOMOTIVE',
    features: { stock: false, debt: false, booking: true, tracking: false, membership: true, cashier: true },
    labels: { product: 'Service', price: 'Rate', customer: 'Customer' },
  },
  AUTO_PARTS: {
    key: 'AUTO_PARTS',
    icon: Package,
    label: 'Auto Parts & Accessories',
    labelShort: 'Auto Parts',
    color: '#6b7280',
    description: 'Car and motorcycle parts, accessories',
    group: 'AUTOMOTIVE',
    features: { stock: true, debt: true, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Customer' },
  },

  // ─────────────────────────────────────────
  // LIFESTYLE & ENTERTAINMENT (5)
  // ─────────────────────────────────────────
  TRAVEL_AGENCY: {
    key: 'TRAVEL_AGENCY',
    icon: Package,
    label: 'Travel Agency',
    labelShort: 'Travel',
    color: '#8b5cf6',
    description: 'Tour packages and travel booking',
    group: 'LIFESTYLE_ENTERTAINMENT',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Package', price: 'Price', customer: 'Traveler' },
  },
  HOTEL_LODGING: {
    key: 'HOTEL_LODGING',
    icon: Package,
    label: 'Hotel & Lodging',
    labelShort: 'Hotel',
    color: '#0891b2',
    description: 'Hotel, guesthouse, and accommodation',
    group: 'LIFESTYLE_ENTERTAINMENT',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Room', price: 'Rate', customer: 'Guest' },
  },
  PHOTOGRAPHY: {
    key: 'PHOTOGRAPHY',
    icon: Package,
    label: 'Photography & Videography',
    labelShort: 'Photography',
    color: '#374151',
    description: 'Photo and video for events, products, portraits',
    group: 'LIFESTYLE_ENTERTAINMENT',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Package', price: 'Price', customer: 'Client' },
  },
  EVENT_VENUE: {
    key: 'EVENT_VENUE',
    icon: Package,
    label: 'Event Venue',
    labelShort: 'Venue',
    color: '#7c3aed',
    description: 'Venue rental for weddings and events',
    group: 'LIFESTYLE_ENTERTAINMENT',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Package', price: 'Price', customer: 'Client' },
  },
  TUTORING_EDUCATION: {
    key: 'TUTORING_EDUCATION',
    icon: Package,
    label: 'Tutoring & Education',
    labelShort: 'Education',
    color: '#f59e0b',
    description: 'Private tutoring, courses, and classes',
    group: 'LIFESTYLE_ENTERTAINMENT',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: true, cashier: true },
    labels: { product: 'Class', price: 'Fee', customer: 'Student' },
  },

  // ─────────────────────────────────────────
  // PROFESSIONAL SERVICES (6)
  // ─────────────────────────────────────────
  LAUNDRY: {
    key: 'LAUNDRY',
    icon: Package,
    label: 'Laundry',
    labelShort: 'Laundry',
    color: '#3b82f6',
    description: 'Laundry, dry cleaning, and ironing',
    group: 'PROFESSIONAL_SERVICES',
    features: { stock: false, debt: false, booking: false, tracking: true, membership: false, cashier: true },
    labels: { product: 'Service', price: 'Rate', customer: 'Customer' },
  },
  TAILOR: {
    key: 'TAILOR',
    icon: Package,
    label: 'Tailor & Alterations',
    labelShort: 'Tailor',
    color: '#8b5cf6',
    description: 'Custom clothing and garment alterations',
    group: 'PROFESSIONAL_SERVICES',
    features: { stock: false, debt: false, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Service', price: 'Rate', customer: 'Customer' },
  },
  PET_SHOP: {
    key: 'PET_SHOP',
    icon: Package,
    label: 'Pet Shop',
    labelShort: 'Pet Shop',
    color: '#f97316',
    description: 'Pet food, supplies, and accessories',
    group: 'PROFESSIONAL_SERVICES',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Product', price: 'Price', customer: 'Pet Owner' },
  },
  PET_GROOMING: {
    key: 'PET_GROOMING',
    icon: Package,
    label: 'Pet Grooming',
    labelShort: 'Pet Grooming',
    color: '#ea580c',
    description: 'Pet bathing, grooming, and care',
    group: 'PROFESSIONAL_SERVICES',
    features: { stock: true, debt: false, booking: true, tracking: true, membership: false, cashier: true },
    labels: { product: 'Service', price: 'Rate', customer: 'Pet Owner' },
  },
  PRINT_SHOP: {
    key: 'PRINT_SHOP',
    icon: Package,
    label: 'Print Shop',
    labelShort: 'Print Shop',
    color: '#4f46e5',
    description: 'Printing, copying, and design services',
    group: 'PROFESSIONAL_SERVICES',
    features: { stock: true, debt: false, booking: false, tracking: false, membership: false, cashier: true },
    labels: { product: 'Service', price: 'Rate', customer: 'Customer' },
  },
  RENTAL_PROPERTY: {
    key: 'RENTAL_PROPERTY',
    icon: Package,
    label: 'Rental Property',
    labelShort: 'Rental',
    color: '#0891b2',
    description: 'Room, house, or property rental',
    group: 'PROFESSIONAL_SERVICES',
    features: { stock: false, debt: true, booking: true, tracking: true, membership: false, cashier: false },
    labels: { product: 'Unit', price: 'Rate', customer: 'Tenant' },
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getCategoryConfig(category: string): CategoryConfig | null {
  return CATEGORY_CONFIG[category] || null;
}

export function getCategoryList(): CategoryConfig[] {
  return Object.values(CATEGORY_CONFIG);
}

export function getCategoriesByGroup(groupKey: string): CategoryConfig[] {
  return Object.values(CATEGORY_CONFIG).filter((cat) => cat.group === groupKey);
}

export function getCategoryGroupList(): CategoryGroup[] {
  return Object.values(CATEGORY_GROUPS);
}

export function getCategoryOptions(): { value: string; label: string }[] {
  return Object.values(CATEGORY_CONFIG).map((cat) => ({
    value: cat.key,
    label: cat.label,
  }));
}

export const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  key: 'OTHER',
  icon: Package,
  label: 'Other',
  labelShort: 'Other',
  color: '#6b7280',
  description: 'Other business type',
  group: 'PROFESSIONAL_SERVICES',
  features: {
    stock: true,
    debt: false,
    booking: false,
    tracking: false,
    membership: false,
    cashier: true,
  },
  labels: {
    product: 'Product',
    price: 'Price',
    customer: 'Customer',
  },
};
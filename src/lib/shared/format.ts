// ==========================================
// FORMAT UTILITIES
// ✅ ASEAN MULTI-CURRENCY SUPPORT
// ✅ ISO code style: "IDR 150.000" / "MYR 45.00"
// ==========================================

import { ZERO_DECIMAL_CURRENCIES } from '@/types';

// ==========================================
// PRICE FORMATTING
// ==========================================

/**
 * Format price with ISO currency code display.
 * ✅ Zero-decimal currencies (IDR, VND): no cents, thousand sep = titik
 * ✅ 2-decimal currencies (MYR, SGD, THB, PHP, BND, USD): standard
 *
 * @example
 * formatPrice(150000, 'IDR') → "IDR 150.000"
 * formatPrice(45.5,  'MYR') → "MYR 45.50"
 * formatPrice(10,    'SGD') → "SGD 10.00"
 * formatPrice(350,   'THB') → "THB 350.00"
 * formatPrice(550,   'PHP') → "PHP 550.00"
 * formatPrice(150000,'VND') → "VND 150.000"
 */
export function formatPrice(price: number, currency: string = 'IDR'): string {
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);

  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(price);

    // Zero-decimal: "IDR 150,000" → "IDR 150.000" (konvensi ASEAN)
    if (isZeroDecimal) {
      return formatted.replace(/,/g, '.');
    }

    // 2-decimal: "MYR 1,500.00" → tetap as-is (en-US standard)
    return formatted;
  } catch {
    // Fallback kalau currency code tidak dikenal Intl
    const num = isZeroDecimal
      ? Math.round(price).toLocaleString('en-US').replace(/,/g, '.')
      : price.toFixed(2);
    return `${currency} ${num}`;
  }
}

/**
 * Format price to short/compact format.
 * ✅ Multi-currency aware — fallback ke ISO code + suffix
 *
 * @example
 * formatPriceShort(1500000, 'IDR') → "IDR 1.5jt"
 * formatPriceShort(2000000000, 'IDR') → "IDR 2.0M"
 * formatPriceShort(1500, 'MYR') → "MYR 1.5K"
 * formatPriceShort(50, 'SGD') → "SGD 50.00"
 */
export function formatPriceShort(price: number, currency: string = 'IDR'): string {
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);

  if (isZeroDecimal) {
    // IDR / VND — pakai suffix juta/M
    if (price >= 1_000_000_000) return `${currency} ${(price / 1_000_000_000).toFixed(1)}M`;
    if (price >= 1_000_000) return `${currency} ${(price / 1_000_000).toFixed(1)}jt`;
    if (price >= 1_000) return `${currency} ${(price / 1_000).toFixed(0)}rb`;
    return `${currency} ${Math.round(price)}`;
  }

  // 2-decimal currencies — pakai K/M
  if (price >= 1_000_000) return `${currency} ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${currency} ${(price / 1_000).toFixed(1)}K`;
  return formatPrice(price, currency);
}

/**
 * Format price with custom locale.
 * Tetap support locale override untuk kasus edge tertentu.
 */
export function formatPriceLocale(
  price: number,
  locale: string = 'en-US',
  currency: string = 'IDR'
): string {
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(price);
  } catch {
    return formatPrice(price, currency);
  }
}

// ==========================================
// NUMBER FORMATTING
// ==========================================

/**
 * Format number with thousand separator (titik — konvensi Indonesia/ASEAN)
 * @example formatNumber(1500000) → "1.500.000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format percentage
 * @example formatPercentage(15.5, 1) → "15.5%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// ==========================================
// DATE & TIME FORMATTING
// ==========================================

/**
 * Format date ke Indonesian format
 * @example formatDate('2024-01-15') → "15 Januari 2024"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

/**
 * Format date ke short format
 * @example formatDateShort('2024-01-15') → "15 Jan 2024"
 */
export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

/**
 * Format datetime dengan waktu
 * @example formatDateTime('2024-01-15T10:30') → "15 Jan 2024, 10.30"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

/**
 * Format relative time
 * @example formatRelativeTime(Date.now() - 300000) → "5 menit lalu"
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDateShort(date);
}

// ==========================================
// PHONE NUMBER FORMATTING
// ==========================================

/**
 * Format phone number for display
 * @example formatPhone('6281234567890') → "+62 812-3456-7890"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    const number = cleaned.slice(2);
    return `+62 ${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
  }
  return phone;
}

/**
 * Normalize phone number ke 62xxx format
 * @example normalizePhone('081234567890') → "6281234567890"
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1);
  if (!cleaned.startsWith('62')) cleaned = '62' + cleaned;
  return cleaned;
}

// ==========================================
// WHATSAPP UTILITIES
// ==========================================

/**
 * Generate WhatsApp link dengan message
 * @example generateWhatsAppLink('081234567890', 'Hello') → "https://wa.me/6281234567890?text=Hello"
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate order WhatsApp message
 * ✅ ISO code style: "IDR 150.000" / "MYR 45.00"
 *
 * @example
 * generateOrderWhatsAppMessage('Toko Budi', [...], 'IDR')
 * → "Halo Toko Budi,\n\nSaya ingin memesan:\n• Produk A (2x) - IDR 30.000\n..."
 */
export function generateOrderWhatsAppMessage(
  storeName: string,
  products: Array<{ name: string; qty: number; price: number }>,
  currency: string = 'IDR'
): string {
  const itemsList = products
    .map((p) => `• ${p.name} (${p.qty}x) - ${formatPrice(p.price * p.qty, currency)}`)
    .join('\n');

  const total = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  return `Halo ${storeName},

Saya ingin memesan:
${itemsList}

Total: ${formatPrice(total, currency)}

Mohon konfirmasi ketersediaan.
Terima kasih!`;
}

// ==========================================
// TEXT UTILITIES
// ==========================================

/**
 * Slugify text (URL-safe)
 * @example slugify('Hello World 123') → "hello-world-123"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get initials from name (max 2 chars)
 * @example getInitials('John Doe') → "JD"
 */
export function getInitials(name?: string | null): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text with ellipsis
 * @example truncate('Hello World', 8) → "Hello Wo..."
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// ==========================================
// STATUS COLOR UTILITIES
// ==========================================

/**
 * Get order status color class (Tailwind)
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
}

/**
 * Get payment status color class (Tailwind)
 */
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    PARTIAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
}
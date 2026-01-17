// ==========================================
// FORMAT UTILITIES - MERGED & UPDATED
// Support multi-currency & locale
// ==========================================

// ==========================================
// PRICE FORMATTING
// ==========================================

/**
 * Format price with currency (DEFAULT: IDR)
 * @param price - Price number
 * @param currency - Currency code (default: IDR)
 * @returns Formatted price string
 * @example formatPrice(15000) => "Rp 15.000"
 * @example formatPrice(100, 'USD') => "$100"
 */
export function formatPrice(price: number, currency: string = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price with custom locale
 * @param price - Price number
 * @param locale - Locale string (default: id-ID)
 * @param currency - Currency code (default: IDR)
 * @returns Formatted price string
 * @example formatPriceLocale(15000, 'en-US', 'USD') => "$15,000"
 */
export function formatPriceLocale(
  price: number,
  locale: string = 'id-ID',
  currency: string = 'IDR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price to short format (Rp 1.5jt, Rp 2M)
 * @param price - Price number
 * @returns Short formatted price string
 * @example formatPriceShort(1500000) => "Rp 1.5jt"
 * @example formatPriceShort(2000000000) => "Rp 2.0M"
 */
export function formatPriceShort(price: number): string {
  if (price >= 1000000000) {
    return `Rp ${(price / 1000000000).toFixed(1)}M`;
  }
  if (price >= 1000000) {
    return `Rp ${(price / 1000000).toFixed(1)}jt`;
  }
  if (price >= 1000) {
    return `Rp ${(price / 1000).toFixed(0)}rb`;
  }
  return `Rp ${price}`;
}

// ==========================================
// NUMBER FORMATTING
// ==========================================

/**
 * Format number with thousand separator
 * @param num - Number to format
 * @returns Formatted number string
 * @example formatNumber(1500000) => "1.500.000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format percentage
 * @param value - Percentage value
 * @param decimals - Decimal places (default: 0)
 * @returns Formatted percentage string
 * @example formatPercentage(15.5, 1) => "15.5%"
 * @example formatPercentage(20) => "20%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// ==========================================
// DATE & TIME FORMATTING
// ==========================================

/**
 * Format date to Indonesian format
 * @param date - Date string or Date object
 * @returns Formatted date string
 * @example formatDate('2024-01-15') => "15 Januari 2024"
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
 * Format date to short format
 * @param date - Date string or Date object
 * @returns Short formatted date string
 * @example formatDateShort('2024-01-15') => "15 Jan 2024"
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
 * Format datetime with time
 * @param date - Date string or Date object
 * @returns Formatted datetime string
 * @example formatDateTime('2024-01-15T10:30') => "15 Jan 2024, 10:30"
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
 * Format relative time (e.g., "5 menit lalu")
 * @param date - Date string or Date object
 * @returns Relative time string
 * @example formatRelativeTime(Date.now() - 300000) => "5 menit lalu"
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
 * @param phone - Phone number string
 * @returns Formatted phone string
 * @example formatPhone('6281234567890') => "+62 812-3456-7890"
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
 * Normalize phone number to 62xxx format
 * @param phone - Phone number string
 * @returns Normalized phone string (62xxx)
 * @example normalizePhone('081234567890') => "6281234567890"
 * @example normalizePhone('6281234567890') => "6281234567890"
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

// ==========================================
// WHATSAPP UTILITIES
// ==========================================

/**
 * Generate WhatsApp link with message
 * @param phone - Phone number (will be auto-normalized)
 * @param message - Message to send
 * @returns WhatsApp URL
 * @example generateWhatsAppLink('081234567890', 'Hello') => "https://wa.me/6281234567890?text=Hello"
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate order WhatsApp message
 * @param storeName - Store name
 * @param products - Array of products with name, qty, price
 * @returns Formatted WhatsApp message
 */
export function generateOrderWhatsAppMessage(
  storeName: string,
  products: Array<{ name: string; qty: number; price: number }>
): string {
  const itemsList = products
    .map((p) => `• ${p.name} (${p.qty}x) - ${formatPrice(p.price * p.qty)}`)
    .join('\n');

  const total = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  return `Halo ${storeName},

Saya ingin memesan:
${itemsList}

Total: ${formatPrice(total)}

Mohon konfirmasi ketersediaan.
Terima kasih!`;
}

// ==========================================
// TEXT UTILITIES
// ==========================================

/**
 * Slugify text (URL-safe)
 * @param text - Text to slugify
 * @returns Slugified string
 * @example slugify('Hello World 123') => "hello-world-123"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get initials from name
 * @param name - Full name
 * @returns Initials (max 2 chars)
 * @example getInitials('John Doe') => "JD"
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
 * @param text - Text to truncate
 * @param length - Max length
 * @returns Truncated string
 * @example truncate('Hello World', 8) => "Hello Wo..."
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
 * @param status - Order status
 * @returns Tailwind color classes
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
 * @param status - Payment status
 * @returns Tailwind color classes
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
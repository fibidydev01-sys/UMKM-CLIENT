// ==========================================
// SHIPPING COST FORMATTER
// ✅ Delegate ke formatPrice (single source of truth)
// ✅ Zero-decimal dari ASEAN_CURRENCY_META via ZERO_DECIMAL_CURRENCIES
// ==========================================

import { formatPrice } from '@/lib/format';

/**
 * Format shipping cost value using the tenant's currency.
 * Returns '—' for null / zero values.
 *
 * ✅ ISO code style output: "IDR 15.000" / "SGD 5.00"
 *
 * @example
 * formatShippingCost(15000, 'IDR') → 'IDR 15.000'
 * formatShippingCost(5,     'SGD') → 'SGD 5.00'
 * formatShippingCost(null,  'IDR') → '—'
 * formatShippingCost(0,     'MYR') → '—'
 */
export function formatShippingCost(
  value: number | null | undefined,
  currency: string
): string {
  if (!value || value === 0) return '—';
  return formatPrice(value, currency);
}
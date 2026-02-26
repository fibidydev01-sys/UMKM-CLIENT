// ==========================================
// ASEAN CURRENCY — SINGLE SOURCE OF TRUTH
// ==========================================
// Dipakai di: step-currency.tsx, payment-preview.tsx,
//             product display, WA message formatter, dll.
//
// Strategy: Option B
//   - DB tetap: currency String @default("IDR")
//   - Frontend dikontrol ketat via const ini
//
// ASEAN Members (11 per Okt 2025):
//   Tier 1 e-commerce: ID, MY, SG, TH, PH, VN
//   Tier 2: BN (BND pegged 1:1 ke SGD)
//   USD: Timor-Leste (resmi), Cambodia (dual-currency praktis)
//   Skip: MMK (Myanmar volatile), LAK (Laos infra terbatas)
// ==========================================

export const ASEAN_CURRENCIES = [
  'IDR', // 🇮🇩 Indonesia
  'MYR', // 🇲🇾 Malaysia
  'SGD', // 🇸🇬 Singapore
  'THB', // 🇹🇭 Thailand
  'PHP', // 🇵🇭 Philippines
  'VND', // 🇻🇳 Vietnam
  'BND', // 🇧🇳 Brunei (pegged 1:1 to SGD)
  'USD', // 🇺🇸 USD — Timor-Leste (official) + Cambodia (practical)
] as const;

export type AseanCurrencyCode = typeof ASEAN_CURRENCIES[number];

// ── Zero-decimal currencies (tidak pakai sen/desimal) ──────────────────────
// IDR: Rp 150.000 (bukan Rp 150.000,00)
// VND: ₫ 150.000 (bukan ₫ 150.000,00)
export const ZERO_DECIMAL_CURRENCIES: ReadonlySet<AseanCurrencyCode> = new Set([
  'IDR',
  'VND',
]);

// ── Currency metadata ──────────────────────────────────────────────────────
export interface AseanCurrencyMeta {
  code: AseanCurrencyCode;
  name: string;
  flag: string;
  /** Decimal places for display */
  decimals: 0 | 2;
}

export const ASEAN_CURRENCY_META: Record<AseanCurrencyCode, AseanCurrencyMeta> = {
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', decimals: 0 },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', decimals: 2 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', decimals: 2 },
  THB: { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', decimals: 2 },
  PHP: { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭', decimals: 2 },
  VND: { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳', decimals: 0 },
  BND: { code: 'BND', name: 'Brunei Dollar', flag: '🇧🇳', decimals: 2 },
  USD: { code: 'USD', name: 'US Dollar', flag: '🇺🇸', decimals: 2 },
};

// ── Tax tips per currency (updated 2025/2026) ─────────────────────────────
export const ASEAN_TAX_TIPS: Record<AseanCurrencyCode, string> = {
  IDR: 'PPN Indonesia 12% per 1 Jan 2025 (UU HPP). Untuk barang/jasa umum, tarif efektif ~11% karena DPP dikalikan 11/12. Rate 12% penuh hanya untuk barang mewah (PMK-131/2024). Gunakan 11 untuk transaksi ritel biasa.',
  MYR: 'Malaysia SST: 10% untuk goods, 6% untuk services. SST hanya wajib jika omzet > RM 500k/tahun.',
  SGD: 'Singapore GST 9% per 1 Jan 2024. Wajib jika omzet > SGD 1 juta/tahun.',
  THB: 'Thailand VAT 7%. Wajib jika omzet > THB 1.8 juta/tahun.',
  PHP: 'Philippines VAT 12% untuk sebagian besar barang & jasa.',
  VND: 'Vietnam VAT 10% (standard). Tarif 8% berlaku untuk beberapa kategori.',
  BND: 'Brunei tidak memiliki GST/VAT. Isi 0 kecuali ada kewajiban pajak khusus.',
  USD: 'Untuk Timor-Leste: tidak ada VAT nasional saat ini. Untuk Cambodia: VAT 10%. Sesuaikan dengan lokasi operasional.',
};

// ── Simulation prices per currency (untuk tax preview di UI) ──────────────
export const ASEAN_SIMULATION_PRICES: Record<AseanCurrencyCode, number[]> = {
  IDR: [100_000, 250_000, 500_000],
  MYR: [50, 150, 500],
  SGD: [20, 50, 200],
  THB: [350, 1_000, 3_500],
  PHP: [500, 1_500, 5_000],
  VND: [100_000, 300_000, 1_000_000],
  BND: [20, 50, 200],
  USD: [10, 25, 100],
};

// ==========================================
// PRICE FORMATTER — ISO Code Style
// ==========================================
// Format: "IDR 150.000" / "MYR 45.00" / "SGD 10.00"
// Dipakai di: product card, WA message, order summary, dll.
//
// Menggunakan locale 'en-US' sebagai base tapi override
// grouping separator untuk IDR/VND agar pakai titik (.)
// sesuai konvensi lokal ASEAN yang lebih umum di e-commerce.
// ==========================================

export function formatAseanPrice(amount: number, currency: string): string {
  const meta = ASEAN_CURRENCY_META[currency as AseanCurrencyCode];
  const decimals = meta?.decimals ?? 2;

  try {
    // Gunakan Intl.NumberFormat dengan currencyDisplay: 'code'
    // Output: "IDR 150,000" → kita replace separator sesuai konvensi
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    // en-US pakai koma sebagai thousand separator dan titik sebagai decimal
    // IDR & VND (zero-decimal): "IDR 150,000" → "IDR 150.000"
    // MYR (2-decimal): "MYR 45.00" → tetap "MYR 45.00"
    if (decimals === 0) {
      // Zero-decimal: ganti koma thousand separator → titik
      return formatted.replace(/,/g, '.');
    }

    // 2-decimal: sudah correct format (koma = thousand, titik = decimal)
    // "MYR 1,500.00" → biarkan as-is (en-US convention, umum di ASEAN SG/MY/PH)
    return formatted;
  } catch {
    // Fallback kalau currency code tidak dikenal Intl
    const num = decimals === 0
      ? Math.round(amount).toLocaleString('en-US').replace(/,/g, '.')
      : amount.toFixed(decimals);
    return `${currency} ${num}`;
  }
}

// ── Helper: check apakah currency code valid ASEAN ────────────────────────
export function isAseanCurrency(code: string): code is AseanCurrencyCode {
  return ASEAN_CURRENCIES.includes(code as AseanCurrencyCode);
}

// ── Helper: get meta dengan fallback ──────────────────────────────────────
export function getAseanCurrencyMeta(code: string): AseanCurrencyMeta {
  return ASEAN_CURRENCY_META[code as AseanCurrencyCode] ?? {
    code: code as AseanCurrencyCode,
    name: code,
    flag: '🌏',
    decimals: 2,
  };
}
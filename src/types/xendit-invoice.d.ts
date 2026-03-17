/**
 * Xendit Invoice type declarations
 * Pengganti: src/types/midtrans-snap.d.ts
 *
 * Xendit Invoice = hosted page (checkout.xendit.co)
 * Tidak ada window.snap, tidak ada CDN script.
 * Webhook callback type ada di xendit-node SDK (server-side only).
 */

// ── Xendit Invoice Status ─────────────────────────────────────────────────────
// Status yang dikirim Xendit via webhook (uppercase)
export type XenditInvoiceStatus =
  | 'PENDING'
  | 'PAID'
  | 'SETTLED'
  | 'EXPIRED';

// ── Internal Payment Status (yang disimpan di DB) ─────────────────────────────
// Lowercase, hasil mapping dari XenditInvoiceStatus
export type InternalPaymentStatus =
  | 'pending'
  | 'paid'
  | 'settled'
  | 'expired'
  | 'failed';

// ── Xendit Payment Method ─────────────────────────────────────────────────────
// paymentMethod = metode utama
export type XenditPaymentMethod =
  | 'BANK_TRANSFER'
  | 'EWALLET'
  | 'RETAIL_OUTLET'
  | 'QR_CODE'
  | 'CREDIT_CARD'
  | string;

// ── Xendit Payment Channel ────────────────────────────────────────────────────
// paymentChannel = channel spesifik
export type XenditPaymentChannel =
  | 'BCA'
  | 'BNI'
  | 'BRI'
  | 'MANDIRI'
  | 'PERMATA'
  | 'BSI'
  | 'OVO'
  | 'DANA'
  | 'GOPAY'
  | 'SHOPEEPAY'
  | 'LINKAJA'
  | 'ALFAMART'
  | 'INDOMARET'
  | 'QRIS'
  | string;

// ── Perbandingan Midtrans vs Xendit ───────────────────────────────────────────
//
// Midtrans (lama)           | Xendit (baru)
// --------------------------|------------------------------------
// window.snap.pay(token)    | window.location.href = invoice_url
// snap_token                | TIDAK ADA
// snap_redirect_url         | invoice_url (checkout.xendit.co/...)
// order_id                  | xenditExternalId
// transaction_id            | xenditInvoiceId
// transaction_status        | paymentStatus (paid/settled/expired)
// payment_type              | paymentMethod (BANK_TRANSFER/EWALLET)
// bank / va_numbers[0].bank | paymentChannel (BCA/OVO/GOPAY)
// settlement_time           | paidAt
// signature_key (SHA-512)   | x-callback-token header (server only)
// ?payment=finish/unfinish  | ?payment=success/failure
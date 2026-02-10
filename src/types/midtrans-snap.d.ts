/**
 * Midtrans Snap.js type declarations
 * Snap.js di-load via CDN, bukan npm package
 */

interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

interface SnapOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

interface Snap {
  pay: (snapToken: string, options?: SnapOptions) => void;
  hide: () => void;
  show: () => void;
}

interface Window {
  snap?: Snap;
}

// ==========================================
// INVOICE UTILITIES - FINAL
// ==========================================

import { formatPrice, formatDate, generateWhatsAppLink } from './format';
import type { Order } from '@/types';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'fibidy_unsigned';
const INVOICE_FOLDER = 'fibidy/invoices';

/**
 * Generate invoice image dengan margin/padding
 */
export async function generateInvoiceImage(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default;

  // Create container with padding for margin effect
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    z-index: -1;
    background: #ffffff;
    padding: 40px;
  `;

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    background-color: #ffffff !important;
    color: #111827 !important;
    font-family: Arial, sans-serif !important;
  `;

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach((style) => {
          if (style.tagName === 'LINK') {
            style.remove();
          }
        });
      },
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to generate invoice image'));
        },
        'image/png',
        0.95
      );
    });
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Upload invoice image ke Cloudinary
 */
export async function uploadInvoiceToCloudinary(
  blob: Blob,
  orderNumber: string
): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const formData = new FormData();
  const filename = `invoice-${orderNumber}-${Date.now()}`;

  formData.append('file', blob, `${filename}.png`);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', INVOICE_FOLDER);
  formData.append('public_id', filename);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to upload invoice to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Generate WhatsApp message untuk invoice
 */
export function generateInvoiceWhatsAppMessage(
  order: Order,
  storeName: string,
  invoiceUrl?: string
): string {
  const itemsList = order.items
    .map((item) => `• ${item.name} (${item.qty}x) - ${formatPrice(item.subtotal)}`)
    .join('\n');

  let message = `Halo ${order.customerName || 'Pelanggan'},

Terima kasih atas pesanan Anda di *${storeName}*!

*Invoice: ${order.orderNumber}*
Tanggal: ${formatDate(order.createdAt)}

*Detail Pesanan:*
${itemsList}

${order.discount > 0 ? `Diskon: -${formatPrice(order.discount)}\n` : ''}${order.tax > 0 ? `Pajak: ${formatPrice(order.tax)}\n` : ''}*Total: ${formatPrice(order.total)}*

Status Pembayaran: ${getPaymentStatusText(order.paymentStatus)}`;

  if (invoiceUrl) {
    message += `\n\nLihat Invoice:\n${invoiceUrl}`;
  }

  message += `\n\n---\nPowered by fibidy.com`;

  return message;
}

function getPaymentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Menunggu Pembayaran',
    PAID: 'Lunas',
    PARTIAL: 'Sebagian Dibayar',
    FAILED: 'Gagal',
  };
  return statusMap[status] || status;
}

/**
 * Download invoice image locally
 */
export function downloadInvoiceImage(blob: Blob, orderNumber: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${orderNumber}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open WhatsApp with invoice message
 */
export function openWhatsAppWithInvoice(
  phone: string,
  order: Order,
  storeName: string,
  invoiceUrl?: string
): void {
  const message = generateInvoiceWhatsAppMessage(order, storeName, invoiceUrl);
  const whatsappUrl = generateWhatsAppLink(phone, message);
  window.open(whatsappUrl, '_blank');
}
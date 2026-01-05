'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Share2, Printer } from 'lucide-react';
import { toast } from '@/providers';
import { InvoiceTemplate } from './invoice-template';
import {
  generateInvoiceImage,
  uploadInvoiceToCloudinary,
  downloadInvoiceImage,
  openWhatsAppWithInvoice,
} from '@/lib/invoice';
import { normalizePhone } from '@/lib/format';
import type { Order, Tenant } from '@/types';

export interface InvoiceModalProps {
  order: Order;
  tenant: Pick<Tenant, 'name' | 'logo' | 'phone' | 'whatsapp' | 'address'>;
  isOpen: boolean;
  onClose: () => void;
}

type ActionState = 'idle' | 'generating' | 'uploading';

export function InvoiceModal({ order, tenant, isOpen, onClose }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [actionState, setActionState] = useState<ActionState>('idle');
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setActionState('idle');
    setInvoiceUrl(null);
    onClose();
  }, [onClose]);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!invoiceRef.current) {
      toast.error('Invoice template tidak ditemukan');
      return null;
    }

    setActionState('generating');
    try {
      const blob = await generateInvoiceImage(invoiceRef.current);
      return blob;
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Gagal membuat invoice');
      setActionState('idle');
      return null;
    }
  }, []);

  // Download
  const handleDownload = useCallback(async () => {
    const blob = await generateImage();
    if (!blob) return;

    try {
      downloadInvoiceImage(blob, order.orderNumber);
      setActionState('idle');
      toast.success('Invoice berhasil diunduh');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Gagal mengunduh invoice');
      setActionState('idle');
    }
  }, [generateImage, order.orderNumber]);

  // Print invoice - Hidden iframe, PDF preview centered
  const handlePrint = useCallback(() => {
    if (!invoiceRef.current) {
      toast.error('Invoice template tidak ditemukan');
      return;
    }

    const invoiceHTML = invoiceRef.current.outerHTML;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      toast.error('Gagal membuat print preview');
      document.body.removeChild(iframe);
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${order.orderNumber}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      background: white;
      font-family: Arial, sans-serif;
    }
    body {
      padding: 0;
    }
    .invoice-wrapper {
      width: 500px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    ${invoiceHTML}
  </div>
</body>
</html>`);
    iframeDoc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {
          // Already removed
        }
      }, 1000);
    }, 300);
  }, [order.orderNumber]);

  // WhatsApp + Image
  const handleShareWhatsApp = useCallback(async () => {
    const customerPhone = order.customer?.phone || order.customerPhone;
    if (!customerPhone) {
      toast.error('Nomor telepon pelanggan tidak tersedia');
      return;
    }

    const blob = await generateImage();
    if (!blob) return;

    setActionState('uploading');
    try {
      const uploadedUrl = await uploadInvoiceToCloudinary(blob, order.orderNumber);
      setInvoiceUrl(uploadedUrl);

      const normalizedPhone = normalizePhone(customerPhone);
      openWhatsAppWithInvoice(normalizedPhone, order, tenant.name, uploadedUrl);

      setActionState('idle');
      toast.success('Invoice berhasil dibagikan');
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Gagal membagikan invoice');
      setActionState('idle');
    }
  }, [generateImage, order, tenant.name]);

  // WhatsApp Text Only
  const handleShareTextOnly = useCallback(() => {
    const customerPhone = order.customer?.phone || order.customerPhone;
    if (!customerPhone) {
      toast.error('Nomor telepon pelanggan tidak tersedia');
      return;
    }

    const normalizedPhone = normalizePhone(customerPhone);
    openWhatsAppWithInvoice(normalizedPhone, order, tenant.name);
    toast.success('WhatsApp dibuka');
  }, [order, tenant.name]);

  const isLoading = actionState === 'generating' || actionState === 'uploading';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b bg-white">
          <DialogTitle className="text-base font-semibold">
            Invoice {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-100 p-4 max-h-[55vh]">
          <div className="flex justify-center">
            <div className="shadow-lg bg-white transform scale-[0.85] origin-top">
              <InvoiceTemplate ref={invoiceRef} order={order} tenant={tenant} />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t bg-white space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
              className="flex-1"
            >
              {actionState === 'generating' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading}
              className="flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleShareWhatsApp}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {actionState === 'uploading' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              WhatsApp + Gambar
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleShareTextOnly}
              disabled={isLoading}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              WhatsApp Teks
            </Button>
          </div>

          {invoiceUrl && (
            <div className="p-2 bg-green-50 rounded text-xs">
              <span className="text-green-700">✓ Uploaded: </span>
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline break-all"
              >
                {invoiceUrl.slice(0, 50)}...
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Printer,
  XCircle,
  StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatusSelect, PaymentStatusSelect } from './order-status-select';
import { OrderItemsTable } from './order-items-table';
import { OrderCancelDialog } from './order-cancel-dialog';
import { InvoiceModal } from './invoice-modal';
import { formatPhone, formatDateTime, formatPrice, generateWhatsAppLink } from '@/lib/format';
import { useCancelOrder } from '@/hooks';
import { useCurrentTenant } from '@/stores';
import type { Order } from '@/types';

// ==========================================
// ORDER DETAIL COMPONENT (WITH INVOICE)
// ==========================================

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter();
  const tenant = useCurrentTenant();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const { cancelOrder, isLoading: isCancelling } = useCancelOrder();

  const handleWhatsApp = () => {
    const phone = order.customer?.phone || order.customerPhone;
    if (!phone) return;

    const message = `Halo ${order.customer?.name || order.customerName},

Terima kasih atas pesanan Anda #${order.orderNumber}

Total: ${formatPrice(order.total)}
Status: ${order.status}

Ada yang bisa kami bantu?`;

    const link = generateWhatsAppLink(phone, message);
    window.open(link, '_blank');
  };

  const handleCancel = async () => {
    const success = await cancelOrder(order.id);
    if (success) {
      setShowCancelDialog(false);
      router.refresh();
    }
  };

  const canCancel = order.status !== 'CANCELLED' && order.status !== 'COMPLETED';

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="text-2xl font-bold">
                #{order.orderNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4" />
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderItemsTable
              items={order.items || []}
              subtotal={order.subtotal}
              discount={order.discount}
              shippingCost={0}
              total={order.total}
            />
          </CardContent>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-4 w-4" />
                Catatan Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {order.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pelanggan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-lg">
                {order.customer?.name || order.customerName || 'Guest'}
              </p>
            </div>

            {(order.customer?.phone || order.customerPhone) && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{formatPhone(order.customer?.phone || order.customerPhone || '')}</span>
              </div>
            )}

            {order.customer?.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{order.customer.address}</span>
              </div>
            )}

            {(order.customer?.phone || order.customerPhone) && (
              <Button onClick={handleWhatsApp} className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Hubungi via WhatsApp
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Status Management */}
        <Card>
          <CardHeader>
            <CardTitle>Kelola Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Status Pesanan
              </label>
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium mb-2 block">
                Status Pembayaran
              </label>
              <PaymentStatusSelect
                orderId={order.id}
                currentStatus={order.paymentStatus}
                orderStatus={order.status}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6 space-y-2">
            {/* ✅ INVOICE BUTTON - NOW ENABLED */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowInvoiceModal(true)}
            >
              <Printer className="h-4 w-4 mr-2" />
              Cetak Invoice
            </Button>

            {canCancel && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowCancelDialog(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Batalkan Pesanan
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cancel Dialog */}
      <OrderCancelDialog
        order={order}
        isOpen={showCancelDialog}
        isLoading={isCancelling}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
      />

      {/* ✅ INVOICE MODAL */}
      {tenant && (
        <InvoiceModal
          order={order}
          tenant={{
            name: tenant.name,
            logo: tenant.logo,
            phone: tenant.phone,
            whatsapp: tenant.whatsapp,
            address: tenant.address,
          }}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
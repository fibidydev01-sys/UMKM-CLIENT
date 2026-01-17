'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Printer,
  XCircle,
  StickyNote,
  X,
  Package,
} from 'lucide-react';
import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge, PaymentStatusBadge } from './order-status-badge';
import { OrderStatusSelect, PaymentStatusSelect } from './order-status-select';
import { OrderItemsTable } from './order-items-table';
import { InvoiceModal } from './invoice-modal';
import { ordersApi } from '@/lib/api';
import { useCurrentTenant } from '@/stores';
import {
  formatPhone,
  formatDateTime,
  formatPrice,
  generateWhatsAppLink,
} from '@/lib/format';
import type { Order, OrderListItem } from '@/types';

// ==========================================
// ORDER PREVIEW DRAWER
// Mobile-first drawer for order details
// ==========================================

interface OrderPreviewDrawerProps {
  orderListItem: OrderListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: (order: OrderListItem) => void;
}

export function OrderPreviewDrawer({
  orderListItem,
  open,
  onOpenChange,
  onCancel,
}: OrderPreviewDrawerProps) {
  const tenant = useCurrentTenant();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Fetch full order details
  const fetchOrder = useCallback(async () => {
    if (!orderListItem?.id) return;

    setIsLoading(true);
    try {
      const fullOrder = await ordersApi.getById(orderListItem.id);
      setOrder(fullOrder);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [orderListItem?.id]);

  useEffect(() => {
    if (open && orderListItem) {
      fetchOrder();
    }
  }, [open, orderListItem, fetchOrder]);

  // Handle scroll to detect sticky header
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsHeaderSticky(scrollTop > 20);
  };

  const handleWhatsApp = () => {
    if (!order) return;
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

  const handlePrintInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleCancel = () => {
    if (orderListItem && onCancel) {
      onOpenChange(false);
      onCancel(orderListItem);
    }
  };

  if (!orderListItem) return null;

  const canCancel = order && order.status !== 'CANCELLED' && order.status !== 'COMPLETED';

  return (
    <>
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-[100] outline-none">
            {/* Handle Bar */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mt-4 mb-4" />

            {/* Sticky Header */}
            <div
              className={`sticky top-0 z-10 transition-all duration-200 ${
                isHeaderSticky
                  ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b shadow-sm'
                  : 'bg-transparent'
              }`}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold truncate">
                      #{orderListItem.orderNumber}
                    </h2>
                    <p className="text-xs text-muted-foreground truncate">
                      {orderListItem.customer?.name || orderListItem.customerName || 'Guest'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8" onScroll={handleScroll}>
              {isLoading ? (
                // Loading Skeleton
                <div className="max-w-2xl mx-auto space-y-6 py-4">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              ) : order ? (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Order Header */}
                  <div className="text-center py-4">
                    <h2 className="text-2xl font-bold">#{order.orderNumber}</h2>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      {formatDateTime(order.createdAt)}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <OrderStatusBadge status={order.status} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Informasi Pelanggan
                    </h3>

                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <p className="font-medium text-lg">
                        {order.customer?.name || order.customerName || 'Guest'}
                      </p>

                      {(order.customer?.phone || order.customerPhone) && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${order.customer?.phone || order.customerPhone}`}
                            className="hover:underline"
                          >
                            {formatPhone(order.customer?.phone || order.customerPhone || '')}
                          </a>
                        </div>
                      )}

                      {order.customer?.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{order.customer.address}</span>
                        </div>
                      )}

                      {(order.customer?.phone || order.customerPhone) && (
                        <Button
                          onClick={handleWhatsApp}
                          size="sm"
                          className="w-full mt-2"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Hubungi via WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Daftar Produk
                    </h3>
                    <div className="rounded-lg border overflow-hidden">
                      <OrderItemsTable
                        items={order.items || []}
                        subtotal={order.subtotal}
                        discount={order.discount}
                        shippingCost={0}
                        total={order.total}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        Catatan
                      </h3>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="whitespace-pre-wrap text-sm">{order.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Management */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Kelola Status
                    </h3>
                    <div className="space-y-3 p-3 rounded-lg bg-muted/50">
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
                    </div>
                  </div>
                </div>
              ) : (
                // Error State
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Gagal memuat detail pesanan</p>
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed Bottom */}
            {order && (
              <div className="border-t bg-background p-4">
                <div className="max-w-2xl mx-auto grid grid-cols-2 gap-2">
                  {/* Print Invoice */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintInvoice}
                    disabled={!tenant}
                  >
                    <Printer className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Cetak Invoice</span>
                  </Button>

                  {/* Cancel Order */}
                  {canCancel && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Batalkan</span>
                    </Button>
                  )}

                  {/* View Full Page Link */}
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={canCancel ? 'col-span-2' : 'col-span-1'}
                  >
                    <Link href={`/dashboard/orders/${order.id}`}>
                      Lihat Detail Lengkap
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Invoice Modal */}
      {tenant && order && (
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
    </>
  );
}

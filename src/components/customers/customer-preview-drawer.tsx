'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Edit,
  Trash2,
  StickyNote,
  ShoppingCart,
  X,
  ExternalLink,
} from 'lucide-react';
import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders';
import { ordersApi } from '@/lib/api';
import {
  formatPhone,
  formatPrice,
  formatDate,
  formatDateShort,
  getInitials,
  generateWhatsAppLink,
} from '@/lib/format';
import type { Customer, OrderListItem } from '@/types';

// ==========================================
// CUSTOMER PREVIEW DRAWER
// Mobile-first drawer for customer details
// ==========================================

interface CustomerPreviewDrawerProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onWhatsApp?: (customer: Customer) => void;
}

export function CustomerPreviewDrawer({
  customer,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onWhatsApp,
}: CustomerPreviewDrawerProps) {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Fetch customer orders
  const fetchOrders = useCallback(async () => {
    if (!customer?.id) return;

    setIsLoadingOrders(true);
    try {
      const response = await ordersApi.getAll({
        customerId: customer.id,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch customer orders:', error);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [customer?.id]);

  useEffect(() => {
    if (open && customer) {
      fetchOrders();
    }
  }, [open, customer, fetchOrders]);

  // Handle scroll to detect sticky header
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsHeaderSticky(scrollTop > 20);
  };

  const handleWhatsApp = () => {
    if (!customer) return;
    if (onWhatsApp) {
      onWhatsApp(customer);
    } else {
      const link = generateWhatsAppLink(customer.phone, `Halo ${customer.name},`);
      window.open(link, '_blank');
    }
  };

  if (!customer) return null;

  return (
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
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold truncate">{customer.name}</h2>
                  {customer.email && (
                    <p className="text-xs text-muted-foreground truncate">
                      {customer.email}
                    </p>
                  )}
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
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Avatar & Name - Large Display */}
              <div className="flex flex-col items-center text-center py-4">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pelanggan sejak {formatDate(customer.createdAt)}
                </p>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Informasi Kontak
                </h3>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Telepon</p>
                    <a
                      href={`tel:${customer.phone}`}
                      className="font-medium hover:underline"
                    >
                      {formatPhone(customer.phone)}
                    </a>
                  </div>
                </div>

                {/* Email */}
                {customer.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${customer.email}`}
                        className="font-medium hover:underline truncate block"
                      >
                        {customer.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Address */}
                {customer.address && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background flex-shrink-0">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Alamat</p>
                      <p className="font-medium text-sm">{customer.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Spent */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Belanja</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {formatPrice(customer.totalSpent || 0)}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-primary/30" />
                </div>
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Catatan
                  </h3>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="whitespace-pre-wrap text-sm">{customer.notes}</p>
                  </div>
                </div>
              )}

              {/* Order History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Riwayat Pesanan
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/orders/new?customer=${customer.id}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buat Pesanan
                    </Link>
                  </Button>
                </div>

                {isLoadingOrders ? (
                  // Loading skeleton
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  // Order list
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/dashboard/orders/${order.id}`}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              #{order.orderNumber}
                            </span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right mr-2">
                            <p className="font-semibold text-sm">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <OrderStatusBadge status={order.status} />
                            <PaymentStatusBadge status={order.paymentStatus} />
                          </div>
                        </div>
                      </Link>
                    ))}

                    {orders.length >= 5 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders?customerId=${customer.id}`}>
                            Lihat Semua Pesanan
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Empty state
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Belum ada pesanan</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Timeline
                </h3>
                <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Terdaftar</p>
                    <p className="font-medium text-sm">{formatDate(customer.createdAt)}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Terakhir Diupdate</p>
                    <p className="font-medium text-sm">{formatDate(customer.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed Bottom */}
          <div className="border-t bg-background p-4">
            <div className="max-w-2xl mx-auto grid grid-cols-3 gap-2">
              {/* WhatsApp */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsApp}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">WhatsApp</span>
              </Button>

              {/* Edit */}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(customer)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Edit</span>
                </Button>
              )}

              {/* Delete */}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(customer)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Hapus</span>
                </Button>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

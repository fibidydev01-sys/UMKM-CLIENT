'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Edit,
  ShoppingCart,
  StickyNote,
  Trash2,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerDeleteDialog } from './customer-delete-dialog';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders';
import { useDeleteCustomer } from '@/hooks';
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
// CUSTOMER DETAIL COMPONENT
// Refactored: Merged best of component + page inline
// + Added actual order history
// ==========================================

interface CustomerDetailProps {
  customer: Customer;
  /** Show back button and page-level header */
  showHeader?: boolean;
}

export function CustomerDetail({ customer, showHeader = true }: CustomerDetailProps) {
  const router = useRouter();

  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteCustomer, isLoading: isDeleting } = useDeleteCustomer();

  // Orders state
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Fetch customer orders
  const fetchOrders = useCallback(async () => {
    if (!customer.id) return;

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
  }, [customer.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handlers
  const handleWhatsApp = () => {
    const link = generateWhatsAppLink(customer.phone, `Halo ${customer.name},`);
    window.open(link, '_blank');
  };

  const handleDelete = async () => {
    const success = await deleteCustomer(customer.id);
    if (success) {
      setShowDeleteDialog(false);
      router.push('/dashboard/customers');
    }
  };

  return (
    <>
      {/* Header with Actions */}
      {showHeader && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/customers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
              <p className="text-muted-foreground">Detail informasi pelanggan</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/customers/${customer.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar */}
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{customer.name}</h2>
                    <p className="text-muted-foreground">
                      Pelanggan sejak {formatDate(customer.createdAt)}
                    </p>
                  </div>

                  <Separator />

                  {/* Contact Info */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${customer.phone}`}
                        className="hover:underline"
                      >
                        {formatPhone(customer.phone)}
                      </a>
                    </div>

                    {/* Email */}
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="hover:underline"
                        >
                          {customer.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {customer.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{customer.address}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleWhatsApp}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/customers/${customer.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <StickyNote className="h-4 w-4" />
                  Catatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {customer.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* ==========================================
              ORDER HISTORY - NEW FEATURE!
              Shows actual 5 latest orders
          ========================================== */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-4 w-4" />
                Riwayat Pesanan
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/orders/new?customer=${customer.id}`}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buat Pesanan
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                // Loading skeleton
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : orders.length > 0 ? (
                // Order list
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="space-y-1">
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
                      <div className="flex items-center gap-2">
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

                  {/* View All Button - tanpa count */}
                  {orders.length >= 5 && (
                    <div className="pt-2 text-center">
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
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada pesanan</p>
                  <p className="text-sm">Pesanan akan muncul di sini</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* ❌ REMOVED: Statistik Card
              Data totalOrders dan totalSpent adalah hardcoded di DB,
              bukan computed dari relasi orders.
              Untuk MVP, user bisa lihat langsung dari riwayat pesanan.
          */}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Terdaftar</p>
                <p className="font-medium">{formatDate(customer.createdAt)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Terakhir Diupdate</p>
                <p className="font-medium">{formatDate(customer.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleWhatsApp}
              >
                <Phone className="h-4 w-4 mr-2" />
                Hubungi via WhatsApp
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/orders/new?customer=${customer.id}`}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buat Pesanan Baru
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <CustomerDeleteDialog
        customer={showDeleteDialog ? customer : null}
        isOpen={showDeleteDialog}
        isLoading={isDeleting}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
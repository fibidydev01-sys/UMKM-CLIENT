'use client';

import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Edit,
  ShoppingCart,
  StickyNote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPhone, formatPrice, formatDate, getInitials } from '@/lib/format';
import { generateWhatsAppLink } from '@/lib/format';
import type { Customer } from '@/types';

// ==========================================
// CUSTOMER DETAIL COMPONENT
// ==========================================

interface CustomerDetailProps {
  customer: Customer;
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const handleWhatsApp = () => {
    const link = generateWhatsAppLink(customer.phone, `Halo ${customer.name},`);
    window.open(link, '_blank');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Info */}
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

                <div className="flex flex-wrap gap-4">
                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formatPhone(customer.phone)}</span>
                  </div>

                  {/* Email */}
                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                {customer.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{customer.address}</span>
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

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4" />
              Riwayat Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Riwayat pesanan akan ditampilkan di sini
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statistik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Pesanan</span>
              <Badge variant="secondary" className="text-lg font-semibold">
                {customer.totalOrders || 0}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Belanja</span>
              <span className="text-lg font-semibold text-primary">
                {formatPrice(customer.totalSpent || 0)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rata-rata</span>
              <span className="font-medium">
                {customer.totalOrders && customer.totalOrders > 0
                  ? formatPrice((customer.totalSpent || 0) / customer.totalOrders)
                  : '-'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/dashboard/orders/new?customer=${customer.id}`}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buat Pesanan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
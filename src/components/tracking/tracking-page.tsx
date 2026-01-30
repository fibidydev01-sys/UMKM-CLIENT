'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MessageCircle, Package, MapPin, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { OrderTimeline } from './order-timeline';
import { formatPrice, generateWhatsAppLink } from '@/lib/format';
import { getThumbnailUrl } from '@/lib/cloudinary';

interface TrackingPageProps {
  order: any; // TODO: Add proper type
}

export function TrackingPage({ order }: TrackingPageProps) {
  const handleWhatsApp = () => {
    if (!order.tenant?.whatsapp) return;

    const message = `Halo ${order.tenant.name},

Saya ingin menanyakan pesanan saya:
Nomor Pesanan: *${order.orderNumber}*
Status: ${order.status}

Terima kasih!`;

    const link = generateWhatsAppLink(order.tenant.whatsapp, message);
    window.open(link, '_blank');
  };

  // Get status badge variant and custom class
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { variant: 'secondary' as const, className: '' };
      case 'PROCESSING':
        return { variant: 'default' as const, className: '' };
      case 'COMPLETED':
        return { variant: 'default' as const, className: 'bg-green-600 hover:bg-green-700' };
      case 'CANCELLED':
        return { variant: 'destructive' as const, className: '' };
      default:
        return { variant: 'secondary' as const, className: '' };
    }
  };

  // Get payment status badge variant and custom class
  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { variant: 'secondary' as const, className: '' };
      case 'PAID':
        return { variant: 'default' as const, className: 'bg-green-600 hover:bg-green-700' };
      case 'FAILED':
        return { variant: 'destructive' as const, className: '' };
      case 'PARTIAL':
        return { variant: 'default' as const, className: 'bg-yellow-600 hover:bg-yellow-700' };
      default:
        return { variant: 'secondary' as const, className: '' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {order.tenant?.logo && (
                <Image
                  src={getThumbnailUrl(order.tenant.logo)}
                  alt={order.tenant.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <h1 className="text-lg font-semibold">{order.tenant?.name || 'Toko'}</h1>
                <Link
                  href={`/store/${order.tenant?.slug}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Lihat Toko
                </Link>
              </div>
            </div>
            {order.tenant?.whatsapp && (
              <Button onClick={handleWhatsApp} size="sm" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Hubungi
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href={`/store/${order.tenant?.slug}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Toko
        </Link>

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">Pesanan #{order.orderNumber}</CardTitle>
                  <CardDescription className="mt-1">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </CardDescription>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    variant={getStatusStyle(order.status).variant}
                    className={getStatusStyle(order.status).className}
                  >
                    {order.status}
                  </Badge>
                  <Badge
                    variant={getPaymentStatusStyle(order.paymentStatus).variant}
                    className={getPaymentStatusStyle(order.paymentStatus).className}
                  >
                    {order.paymentStatus === 'PAID' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Status Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline order={order} />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Item Image */}
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={getThumbnailUrl(item.product.images[0])}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} x {item.qty}
                      </p>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pajak</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Informasi Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">
                    {order.customer?.name || order.customerName || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nomor HP</p>
                  <p className="font-medium">
                    {order.customer?.phone || order.customerPhone || '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Informasi Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Alamat</p>
                  <p className="font-medium">
                    {order.metadata?.shippingAddress || order.customer?.address || '-'}
                  </p>
                </div>
                {order.metadata?.courier && (
                  <div>
                    <p className="text-sm text-muted-foreground">Kurir</p>
                    <p className="font-medium">{order.metadata.courier}</p>
                  </div>
                )}
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Store */}
          {order.tenant?.whatsapp && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ada pertanyaan tentang pesanan Anda?
                  </p>
                  <Button onClick={handleWhatsApp} size="lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Hubungi {order.tenant.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

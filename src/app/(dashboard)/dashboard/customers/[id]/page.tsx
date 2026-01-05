'use client';

// src/app/(dashboard)/dashboard/customers/[id]/page.tsx
// Route: /dashboard/customers/[id]
// Purpose: View customer detail

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomer } from '@/hooks';

// ==========================================
// CUSTOMER DETAIL PAGE (Client Component)
// ==========================================

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // ✅ Client-side fetch = localStorage accessible = token sent!
  const { customer, isLoading, error } = useCustomer(id);

  // Loading state
  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  // Error / Not Found state
  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-2">Pelanggan Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-4">{error || 'Data tidak ditemukan'}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Pelanggan
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Header with Actions */}
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
            <Link href={`/dashboard/customers/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Customer Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pelanggan</CardTitle>
              <CardDescription>Data dasar pelanggan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                  </div>

                  <Separator />

                  <div className="grid gap-3 sm:grid-cols-2">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${customer.email}`} className="hover:underline">
                          {customer.email}
                        </a>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${customer.phone}`} className="hover:underline">
                          {customer.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {customer.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{customer.address}</span>
                    </div>
                  )}

                  {customer.notes && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{customer.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders History Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Riwayat Pesanan</CardTitle>
                <CardDescription>Pesanan terakhir dari pelanggan ini</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/orders/new?customer=${id}`}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Buat Pesanan
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {customer.totalOrders > 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>{customer.totalOrders} pesanan tercatat</p>
                  <p className="text-sm">Lihat detail di halaman pesanan</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada pesanan</p>
                  <p className="text-sm">Pesanan akan muncul di sini</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Pesanan</p>
                <p className="text-2xl font-bold">{customer.totalOrders}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Belanja</p>
                <p className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
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
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {customer.phone && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a
                    href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/orders/new?customer=${id}`}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Buat Pesanan Baru
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// ==========================================
// SKELETON COMPONENT
// ==========================================

function CustomerDetailSkeleton() {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { API_URL } from '@/config/constants';

export default function TrackOrderPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedOrderId = orderId.trim();

    // Validate input
    if (!trimmedOrderId) {
      toast.error('Masukkan nomor pesanan');
      return;
    }

    // Validate format (CUID format: starts with 'c', alphanumeric, 25 chars)
    if (trimmedOrderId.length < 20 || !trimmedOrderId.match(/^[a-z0-9]+$/i)) {
      toast.error('Format nomor pesanan tidak valid');
      return;
    }

    setIsSearching(true);

    // Check if order exists before redirecting
    try {
      // Fetch directly from backend API
      const response = await fetch(`${API_URL}/store/track/${trimmedOrderId}`);

      if (response.ok) {
        // Order found, redirect to tracking page with slug
        router.push(`/store/${slug}/track/${trimmedOrderId}`);
      } else {
        // Order not found
        toast.error('Pesanan tidak ditemukan. Pastikan nomor pesanan sudah benar.');
        setIsSearching(false);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Toko
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-4">
            {/* Icon */}
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <div>
              <CardTitle className="text-3xl">Lacak Pesanan</CardTitle>
              <CardDescription className="mt-2">
                Masukkan nomor pesanan Anda untuk melihat status pengiriman
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="order-id" className="text-sm font-medium">
                  Nomor Pesanan
                </label>
                <div className="relative">
                  <Input
                    id="order-id"
                    type="text"
                    placeholder="cmkv4uh4c001atzlod9chuhfp"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pr-12 font-mono text-sm"
                    disabled={isSearching}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Contoh: cmkv4uh4c001atzlod9chuhfp atau ORD-20240127-001
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Search className="mr-2 h-5 w-5 animate-pulse" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Lacak Pesanan
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Info */}
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Cara Mendapatkan Nomor Pesanan:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">1.</span>
                  <span>Cek email konfirmasi pesanan Anda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">2.</span>
                  <span>Lihat pesan WhatsApp dari toko</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">3.</span>
                  <span>Klik link tracking yang dikirimkan setelah checkout</span>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Tidak menemukan pesanan Anda?{' '}
                <Link href={`/store/${slug}`} className="text-primary hover:underline font-medium">
                  Hubungi Toko
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

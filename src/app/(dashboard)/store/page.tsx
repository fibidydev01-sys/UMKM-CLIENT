'use client';

// src/app/(store)/store/page.tsx
// Route: /store
// Purpose: Redirect to user's own store or show store directory

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks';

// ==========================================
// STORE INDEX PAGE
// Redirects logged-in users to their store
// Shows landing for guests
// ==========================================

export default function StoreIndexPage() {
  const router = useRouter();
  const { tenant, isLoading } = useAuth();

  useEffect(() => {
    // If user is logged in and has a store, redirect to their store
    if (!isLoading && tenant?.slug) {
      router.push(`/store/${tenant.slug}`);
    }
  }, [isLoading, tenant, router]);

  // Show loading while checking auth or if has tenant (will redirect)
  if (isLoading || tenant?.slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {tenant?.slug ? 'Mengalihkan ke toko Anda...' : 'Memuat...'}
          </p>
        </div>
      </div>
    );
  }

  // Guest view - show store info/CTA
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background to-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Store className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Selamat Datang di Fibidy Store</CardTitle>
          <CardDescription>
            Platform toko online untuk UMKM Indonesia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Untuk melihat toko, masukkan alamat toko di URL:
          </p>
          <div className="bg-muted rounded-lg p-3 text-center font-mono text-sm">
            fibidy.com/store/<span className="text-primary">nama-toko</span>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link href="/register">
                Buat Toko Gratis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">
                Masuk ke Dashboard
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-4">
            Sudah punya toko? Login untuk melihat toko Anda
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
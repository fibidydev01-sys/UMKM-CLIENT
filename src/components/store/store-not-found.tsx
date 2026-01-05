import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ==========================================
// STORE NOT FOUND COMPONENT
// 404 page for invalid store slug
// ==========================================

interface StoreNotFoundProps {
  slug?: string;
}

export function StoreNotFound({ slug }: StoreNotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-muted p-6">
            <Store className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Toko Tidak Ditemukan</h1>

        <p className="text-muted-foreground mb-6">
          {slug ? (
            <>
              Toko dengan alamat <span className="font-medium">&quot;{slug}&quot;</span> tidak
              ditemukan atau sudah tidak aktif.
            </>
          ) : (
            'Toko yang Anda cari tidak ditemukan atau sudah tidak aktif.'
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild>
            <Link href="/register">Buat Toko Gratis</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
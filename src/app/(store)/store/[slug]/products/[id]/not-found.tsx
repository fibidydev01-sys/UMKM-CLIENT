import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ==========================================
// PRODUCT NOT FOUND PAGE
// ==========================================

export default function ProductNotFound() {
  return (
    <div className="container px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-muted p-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h1>

        <p className="text-muted-foreground mb-6">
          Produk yang Anda cari tidak ditemukan atau sudah tidak tersedia.
        </p>

        <Button asChild>
          <Link href="..">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Toko
          </Link>
        </Button>
      </div>
    </div>
  );
}
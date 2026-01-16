import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <Store className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Kategori Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Kategori yang kamu cari tidak tersedia. Coba lihat kategori lainnya di halaman Discover.
        </p>
        <Button asChild>
          <Link href="/discover">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Discover
          </Link>
        </Button>
      </div>
    </div>
  );
}
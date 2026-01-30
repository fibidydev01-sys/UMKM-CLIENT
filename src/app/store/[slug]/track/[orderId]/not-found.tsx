import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Pesanan Tidak Ditemukan</h1>
              <p className="text-muted-foreground">
                Maaf, kami tidak dapat menemukan pesanan dengan ID tersebut. Pastikan link yang
                Anda gunakan sudah benar.
              </p>
            </div>

            {/* Action */}
            <Link href="/" className="w-full">
              <Button className="w-full" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

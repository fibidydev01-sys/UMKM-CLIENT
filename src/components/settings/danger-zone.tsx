'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteAccount, useAuth } from '@/hooks';

// ==========================================
// DANGER ZONE
// ==========================================

export function DangerZone() {
  const router = useRouter();
  const { tenant } = useAuth();
  const { deleteAccount, isLoading } = useDeleteAccount();

  const [confirmText, setConfirmText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const confirmationText = tenant?.slug || 'hapus-akun';
  const isConfirmed = confirmText === confirmationText;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    try {
      await deleteAccount();
      router.push('/');
    } catch {
      // Error handled in hook
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Zona Berbahaya
        </CardTitle>
        <CardDescription>
          Tindakan di sini bersifat permanen dan tidak dapat dibatalkan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Akun
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Hapus Akun Permanen
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  Tindakan ini akan menghapus akun Anda secara permanen beserta
                  semua data toko, produk, pelanggan, dan pesanan. Tindakan ini
                  tidak dapat dibatalkan.
                </p>
                <p>
                  Untuk konfirmasi, ketik{' '}
                  <strong className="text-foreground">{confirmationText}</strong>{' '}
                  di bawah:
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={confirmationText}
                  className="mt-2"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setConfirmText('')}
                disabled={isLoading}
              >
                Batal
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!isConfirmed || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  'Hapus Akun Saya'
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
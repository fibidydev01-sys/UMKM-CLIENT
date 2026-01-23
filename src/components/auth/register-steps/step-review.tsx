'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCategoryConfig } from '@/config/categories';
import { Store, Mail, Lock, Phone, Edit2, Loader2 } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface StepReviewProps {
  data: {
    category?: string;
    name?: string;
    slug?: string;
    description?: string;
    email?: string;
    password?: string;
    whatsapp?: string;
  };
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

// ==========================================
// COMPONENT
// ==========================================

export function StepReview({
  data,
  onBack,
  onEdit,
  onSubmit,
  isLoading,
}: StepReviewProps) {
  const categoryConfig = data.category
    ? getCategoryConfig(data.category)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Review & Konfirmasi</h2>
        <p className="text-muted-foreground">
          Pastikan semua informasi sudah benar
        </p>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {/* Category */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Kategori Usaha
                </p>
              </div>
              {categoryConfig && (
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${categoryConfig.color}20`,
                      color: categoryConfig.color,
                    }}
                  >
                    <categoryConfig.icon className="w-4 h-4" />
                  </div>
                  <p className="font-medium">{categoryConfig.label}</p>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Store Info */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Informasi Toko
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Toko</p>
                  <p className="font-medium">{data.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alamat Toko</p>
                  <p className="font-medium text-primary">
                    {data.slug || '-'}.fibidy.com
                  </p>
                </div>
                {data.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Deskripsi</p>
                    <p className="text-sm">{data.description}</p>
                  </div>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(3)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Informasi Akun
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{data.email || '-'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">••••••••</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">+{data.whatsapp || '-'}</p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(4)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Terms Notice */}
      <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
        Dengan mendaftar, Anda menyetujui{' '}
        <a href="/terms" className="text-primary hover:underline">
          Syarat & Ketentuan
        </a>{' '}
        serta{' '}
        <a href="/privacy" className="text-primary hover:underline">
          Kebijakan Privasi
        </a>{' '}
        kami.
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1"
        >
          Kembali
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Membuat Toko...
            </>
          ) : (
            'Buat Toko Sekarang'
          )}
        </Button>
      </div>
    </div>
  );
}

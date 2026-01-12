'use client';

import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// TYPES
// ============================================================================

interface StoreFormData {
  name: string;
  description: string;
  phone: string;
  address: string;
}

interface StoreInfoFormProps {
  formData: StoreFormData | null;
  tenantEmail?: string;
  tenantSlug?: string;
  isLoading: boolean;
  isSaving: boolean;
  onFormChange: (key: keyof StoreFormData, value: string) => void;
  onSave: () => Promise<void>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function StoreInfoForm({
  formData,
  tenantEmail,
  tenantSlug,
  isLoading,
  isSaving,
  onFormChange,
  onSave,
}: StoreInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Toko</CardTitle>
        <CardDescription>
          Informasi dasar tentang toko Anda yang akan ditampilkan kepada pelanggan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading || !formData ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input
                  id="store-name"
                  placeholder="Nama toko Anda"
                  value={formData.name}
                  onChange={(e) => onFormChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">Email Toko</Label>
                <Input
                  id="store-email"
                  type="email"
                  placeholder="email@toko.com"
                  value={tenantEmail || ''}
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-phone">Nomor Telepon</Label>
                <Input
                  id="store-phone"
                  placeholder="+62 xxx xxxx xxxx"
                  value={formData.phone}
                  onChange={(e) => onFormChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-slug">URL Toko</Label>
                <Input
                  id="store-slug"
                  value={`fibidy.com/store/${tenantSlug || ''}`}
                  disabled
                />
                <p className="text-xs text-muted-foreground">URL toko tidak dapat diubah</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-description">Deskripsi Toko</Label>
              <Textarea
                id="store-description"
                placeholder="Ceritakan tentang toko Anda..."
                rows={4}
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-address">Alamat</Label>
              <Textarea
                id="store-address"
                placeholder="Alamat lengkap toko"
                rows={3}
                value={formData.address}
                onChange={(e) => onFormChange('address', e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Simpan Informasi Toko
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
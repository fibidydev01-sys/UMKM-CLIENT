'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import type { HeroFormData } from '@/types';

interface StepIdentitasProps {
  formData: HeroFormData;
  updateFormData: <K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) => void;
  onRemoveLogo: () => void;
  isRemovingLogo: boolean;
}

export function StepIdentitas({ formData, updateFormData, onRemoveLogo, isRemovingLogo }: StepIdentitasProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col items-center gap-6">

          {/* ── Logo ── */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-[120px]">
              <ImageUpload
                value={formData.logo}
                onChange={(url) => updateFormData('logo', url ?? '')}
                onRemove={onRemoveLogo}
                disabled={isRemovingLogo}
                folder="fibidy/logos"
                aspectRatio={1}
                placeholder="Upload logo"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">200x200px, PNG/JPG</p>
          </div>

          {/* ── Divider ── */}
          <div className="w-full border-t" />

          {/* ── Nama Toko ── */}
          <div className="w-full space-y-1.5">
            <Label htmlFor="store-name" className="block text-center text-xs text-muted-foreground">
              Nama Toko
            </Label>
            <Input
              id="store-name"
              placeholder="Burger China"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="text-center font-medium"
            />
          </div>

          {/* ── Kategori ── */}
          <div className="w-full flex flex-col items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Kategori</span>
            <span className="inline-flex items-center text-xs bg-muted px-3 py-1 rounded-full font-medium">
              {formData.category || 'Belum dipilih'}
            </span>
            <p className="text-xs text-muted-foreground text-center">
              Kategori tidak dapat diubah setelah pendaftaran
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
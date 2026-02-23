'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { SeoFormData } from '@/types';

interface StepMetaProps {
  formData: SeoFormData;
  updateFormData: <K extends keyof SeoFormData>(key: K, value: SeoFormData[K]) => void;
  tenantName?: string;
  tenantSlug?: string;
  tenantDescription?: string;
}

export function StepMeta({ formData, updateFormData, tenantName, tenantSlug, tenantDescription }: StepMetaProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="meta-title" className="block text-center text-xs text-muted-foreground">
              Meta Title
              <span className="ml-1">({formData.metaTitle.length}/60)</span>
            </Label>
            <Input
              id="meta-title"
              placeholder={tenantName || 'Judul toko Anda'}
              maxLength={60}
              value={formData.metaTitle}
              onChange={(e) => updateFormData('metaTitle', e.target.value)}
              className="text-center font-medium"
            />
            <p className="text-xs text-muted-foreground text-center">
              Judul di hasil pencarian Google. Maks. 60 karakter.
            </p>
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="meta-description" className="block text-center text-xs text-muted-foreground">
              Meta Description
              <span className="ml-1">({formData.metaDescription.length}/160)</span>
            </Label>
            <Textarea
              id="meta-description"
              placeholder="Deskripsi singkat toko Anda..."
              maxLength={160}
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => updateFormData('metaDescription', e.target.value)}
              className="text-center resize-none"
            />
            <p className="text-xs text-muted-foreground text-center">
              Deskripsi di hasil pencarian Google. Maks. 160 karakter.
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Google Preview */}
          <div className="rounded-lg bg-muted/30 p-3 space-y-0.5">
            <p className="text-xs text-muted-foreground mb-1.5">Preview di Google:</p>
            <p className="text-blue-600 text-sm font-medium truncate">
              {formData.metaTitle || tenantName || 'Nama Toko'}
            </p>
            <p className="text-green-700 text-xs">{tenantSlug}.fibidy.com</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {formData.metaDescription || tenantDescription || 'Deskripsi toko akan muncul di sini...'}
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
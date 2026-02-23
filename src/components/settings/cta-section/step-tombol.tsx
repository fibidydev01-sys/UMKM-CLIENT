'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CtaFormData } from '@/types';

interface StepTombolProps {
  formData: CtaFormData;
  updateFormData: <K extends keyof CtaFormData>(key: K, value: CtaFormData[K]) => void;
}

export function StepTombol({ formData, updateFormData }: StepTombolProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="ctaButtonText" className="block text-center text-xs text-muted-foreground">
              Teks Tombol
            </Label>
            <Input
              id="ctaButtonText"
              placeholder="Mulai Sekarang"
              value={formData.ctaButtonText}
              onChange={(e) => updateFormData('ctaButtonText', e.target.value)}
              className="text-center font-medium"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="ctaButtonLink" className="block text-center text-xs text-muted-foreground">
              Link Tombol
            </Label>
            <Input
              id="ctaButtonLink"
              placeholder="/products"
              value={formData.ctaButtonLink}
              onChange={(e) => updateFormData('ctaButtonLink', e.target.value)}
              className="text-center"
            />
            <p className="text-xs text-muted-foreground text-center">
              Internal: /products · External: https://...
            </p>
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label className="block text-center text-xs text-muted-foreground">Gaya Tombol</Label>
            <Select
              value={formData.ctaButtonStyle}
              onValueChange={(value: 'primary' | 'secondary' | 'outline') =>
                updateFormData('ctaButtonStyle', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih gaya tombol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary (Warna Tema)</SelectItem>
                <SelectItem value="secondary">Secondary (Abu-abu)</SelectItem>
                <SelectItem value="outline">Outline (Hanya Border)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full border-t" />

          <div className="flex flex-col items-center gap-2">
            <Label className="text-xs text-muted-foreground">Preview Tombol</Label>
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg w-full justify-center">
              <Button
                variant={
                  formData.ctaButtonStyle === 'primary'
                    ? 'default'
                    : (formData.ctaButtonStyle as 'secondary' | 'outline')
                }
                disabled
              >
                {formData.ctaButtonText || 'Mulai Sekarang'}
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
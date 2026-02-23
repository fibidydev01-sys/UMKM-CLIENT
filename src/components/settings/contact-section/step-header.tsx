'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { ContactFormData } from '@/types';

interface StepHeaderProps {
  formData: ContactFormData;
  updateFormData: <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => void;
}

export function StepHeader({ formData, updateFormData }: StepHeaderProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="contactTitle" className="block text-center text-xs text-muted-foreground">
              Judul Section
            </Label>
            <Input
              id="contactTitle"
              placeholder="Hubungi Kami"
              value={formData.contactTitle}
              onChange={(e) => updateFormData('contactTitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="contactSubtitle" className="block text-center text-xs text-muted-foreground">
              Subtitle Section
            </Label>
            <Input
              id="contactSubtitle"
              placeholder="Kami siap membantu Anda"
              value={formData.contactSubtitle}
              onChange={(e) => updateFormData('contactSubtitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="store-phone" className="block text-center text-xs text-muted-foreground">
              Nomor Telepon
            </Label>
            <Input
              id="store-phone"
              placeholder="+62 812-3456-7890"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="text-center"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="store-whatsapp" className="block text-center text-xs text-muted-foreground">
              WhatsApp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="store-whatsapp"
              placeholder="6281234567890"
              value={formData.whatsapp}
              onChange={(e) => updateFormData('whatsapp', e.target.value)}
              className="text-center"
            />
            <p className="text-xs text-muted-foreground text-center">Tanpa +, contoh: 6281234567890</p>
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="store-address" className="block text-center text-xs text-muted-foreground">
              Alamat Lengkap
            </Label>
            <Textarea
              id="store-address"
              placeholder="Jl. Contoh No. 123, Kota..."
              rows={3}
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              className="text-center resize-none"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
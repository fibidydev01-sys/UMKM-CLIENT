'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { ContactFormData } from '@/types';

interface StepSettingsProps {
  formData: ContactFormData;
  updateFormData: <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => void;
  tenantEmail: string;
  tenantSlug: string;
}

export function StepSettings({ formData, updateFormData, tenantEmail, tenantSlug }: StepSettingsProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label className="block text-center text-xs text-muted-foreground">Email</Label>
            <Input value={tenantEmail} disabled className="text-center" />
            <p className="text-xs text-muted-foreground text-center">Email tidak dapat diubah</p>
          </div>

          <div className="space-y-1.5">
            <Label className="block text-center text-xs text-muted-foreground">Domain Toko</Label>
            <Input value={`${tenantSlug}.fibidy.com`} disabled className="text-center" />
          </div>

          <div className="w-full border-t" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="contactShowForm" className="text-xs">Tampilkan Form Kontak</Label>
              <p className="text-xs text-muted-foreground">Form kontak di halaman kontak</p>
            </div>
            <Switch
              id="contactShowForm"
              checked={formData.contactShowForm}
              onCheckedChange={(checked) => updateFormData('contactShowForm', checked)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
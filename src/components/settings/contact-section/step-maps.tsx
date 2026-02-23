'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { ContactFormData } from '@/types';

interface StepMapsProps {
  formData: ContactFormData;
  updateFormData: <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => void;
}

export function StepMaps({ formData, updateFormData }: StepMapsProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="contactMapUrl" className="block text-center text-xs text-muted-foreground">
              URL Google Maps Embed
            </Label>
            <Input
              id="contactMapUrl"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={formData.contactMapUrl}
              onChange={(e) => updateFormData('contactMapUrl', e.target.value)}
              className="text-center"
            />
            <p className="text-xs text-muted-foreground text-center">
              Share → Embed a map → salin URL-nya
            </p>
          </div>

          <div className="w-full border-t" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="contactShowMap" className="text-xs">Tampilkan Peta</Label>
              <p className="text-xs text-muted-foreground">Google Maps di halaman kontak</p>
            </div>
            <Switch
              id="contactShowMap"
              checked={formData.contactShowMap}
              onCheckedChange={(checked) => updateFormData('contactShowMap', checked)}
            />
          </div>

          {formData.contactMapUrl && formData.contactShowMap && (
            <>
              <div className="w-full border-t" />
              <div className="space-y-1.5">
                <Label className="block text-center text-xs text-muted-foreground">Preview Peta</Label>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={formData.contactMapUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
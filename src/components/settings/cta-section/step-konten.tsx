'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { CtaFormData } from '@/types';

interface StepKontenProps {
  formData: CtaFormData;
  updateFormData: <K extends keyof CtaFormData>(key: K, value: CtaFormData[K]) => void;
}

export function StepKonten({ formData, updateFormData }: StepKontenProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="ctaTitle" className="block text-center text-xs text-muted-foreground">
              Judul CTA
            </Label>
            <Input
              id="ctaTitle"
              placeholder="Siap Memulai?"
              value={formData.ctaTitle}
              onChange={(e) => updateFormData('ctaTitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="ctaSubtitle" className="block text-center text-xs text-muted-foreground">
              Subtitle CTA
            </Label>
            <Input
              id="ctaSubtitle"
              placeholder="Bergabunglah dengan pelanggan puas kami"
              value={formData.ctaSubtitle}
              onChange={(e) => updateFormData('ctaSubtitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
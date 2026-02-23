'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { TestimonialsFormData } from '@/types';

interface StepHeaderProps {
  formData: TestimonialsFormData;
  updateFormData: <K extends keyof TestimonialsFormData>(key: K, value: TestimonialsFormData[K]) => void;
}

export function StepHeader({ formData, updateFormData }: StepHeaderProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="testimonialsTitle" className="block text-center text-xs text-muted-foreground">
              Judul Section
            </Label>
            <Input
              id="testimonialsTitle"
              placeholder="Kata Mereka"
              value={formData.testimonialsTitle}
              onChange={(e) => updateFormData('testimonialsTitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="testimonialsSubtitle" className="block text-center text-xs text-muted-foreground">
              Subtitle Section
            </Label>
            <Input
              id="testimonialsSubtitle"
              placeholder="Apa kata pelanggan tentang kami"
              value={formData.testimonialsSubtitle}
              onChange={(e) => updateFormData('testimonialsSubtitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
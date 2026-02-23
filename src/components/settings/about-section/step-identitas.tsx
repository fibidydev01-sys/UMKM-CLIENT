'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { AboutFormData } from '@/types';

interface StepIdentitasProps {
  formData: AboutFormData;
  updateFormData: <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => void;
}

export function StepIdentitas({ formData, updateFormData }: StepIdentitasProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="aboutTitle" className="block text-center text-xs text-muted-foreground">
              Judul Section
            </Label>
            <Input
              id="aboutTitle"
              placeholder="Tentang Kami"
              value={formData.aboutTitle}
              onChange={(e) => updateFormData('aboutTitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="aboutSubtitle" className="block text-center text-xs text-muted-foreground">
              Subtitle Section
            </Label>
            <Input
              id="aboutSubtitle"
              placeholder="Cerita di balik toko kami"
              value={formData.aboutSubtitle}
              onChange={(e) => updateFormData('aboutSubtitle', e.target.value)}
              className="text-center font-medium"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
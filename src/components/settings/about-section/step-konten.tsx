'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import type { AboutFormData } from '@/types';

interface StepKontenProps {
  formData: AboutFormData;
  updateFormData: <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => void;
  onRemoveAboutImage: () => void;
  isRemovingAboutImage: boolean;
}

export function StepKonten({ formData, updateFormData, onRemoveAboutImage, isRemovingAboutImage }: StepKontenProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="aboutContent" className="block text-center text-xs text-muted-foreground">
              Deskripsi Lengkap
            </Label>
            <Textarea
              id="aboutContent"
              placeholder="Ceritakan tentang toko kamu..."
              rows={5}
              value={formData.aboutContent}
              onChange={(e) => updateFormData('aboutContent', e.target.value)}
              className="text-center resize-none"
            />
            <p className="text-xs text-muted-foreground text-center">Rekomendasi: 150–300 kata</p>
          </div>

          <div className="w-full border-t" />

          <div className="flex flex-col items-center gap-2">
            <Label className="block text-center text-xs text-muted-foreground">About Image</Label>
            <div className="w-full max-w-[200px]">
              <ImageUpload
                value={formData.aboutImage}
                onChange={(url) => updateFormData('aboutImage', url ?? '')}
                onRemove={onRemoveAboutImage}
                disabled={isRemovingAboutImage}
                folder="fibidy/about-images"
                aspectRatio={1.5}
                placeholder="Upload about image"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">800x533px, JPG/PNG</p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
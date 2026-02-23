'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import type { AboutFormData } from '@/types';
import type { FeatureItem } from '@/types';

interface StepFiturProps {
  formData: AboutFormData;
  updateFormData: <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => void;
}

export function StepFitur({ formData, updateFormData }: StepFiturProps) {
  const handleAddFeature = () => {
    const newFeature: FeatureItem = { title: '', description: '' };
    updateFormData('aboutFeatures', [...formData.aboutFeatures, newFeature]);
  };

  const handleRemoveFeature = (index: number) => {
    updateFormData('aboutFeatures', formData.aboutFeatures.filter((_, i) => i !== index));
  };

  const handleUpdateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const updated = [...formData.aboutFeatures];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData('aboutFeatures', updated);
  };

  return (
    <div className="flex flex-col items-center gap-4">

      <Button type="button" size="sm" variant="outline" onClick={handleAddFeature}>
        + Tambah Fitur
      </Button>

      {formData.aboutFeatures.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] w-full max-w-sm border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">
            Belum ada fitur. Klik &quot;Tambah Fitur&quot; untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {formData.aboutFeatures.map((feature, index) => (
            <Card key={index}>
              <CardContent className="pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Fitur #{index + 1}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-6 px-2 text-xs"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    Hapus
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <Label className="text-xs text-muted-foreground">Icon (Opsional)</Label>
                  <div className="w-[80px]">
                    <ImageUpload
                      value={feature.icon}
                      onChange={(url) => handleUpdateFeature(index, 'icon', url ?? '')}
                      onRemove={() => handleUpdateFeature(index, 'icon', '')}
                      folder="fibidy/feature-icons"
                      aspectRatio={1}
                      placeholder="Icon"
                    />
                  </div>
                </div>

                <div className="w-full border-t" />

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Judul Fitur</Label>
                  <Input
                    placeholder="Kualitas Terjamin"
                    value={feature.title}
                    onChange={(e) => handleUpdateFeature(index, 'title', e.target.value)}
                    className="text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Deskripsi</Label>
                  <Input
                    placeholder="Produk berkualitas tinggi"
                    value={feature.description}
                    onChange={(e) => handleUpdateFeature(index, 'description', e.target.value)}
                    className="text-center"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
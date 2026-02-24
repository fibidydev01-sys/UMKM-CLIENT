'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AboutFormData, FeatureItem } from '@/types';

interface StepFiturProps {
  formData: AboutFormData;
  updateFormData: <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepFitur({ formData, updateFormData, isDesktop = false }: StepFiturProps) {

  const handleAdd = () => {
    updateFormData('aboutFeatures', [...formData.aboutFeatures, { title: '', description: '' }]);
  };

  const handleRemove = (i: number) => {
    updateFormData('aboutFeatures', formData.aboutFeatures.filter((_, idx) => idx !== i));
  };

  const handleUpdate = (i: number, field: keyof FeatureItem, val: string) => {
    const updated = [...formData.aboutFeatures];
    updated[i] = { ...updated[i], [field]: val };
    updateFormData('aboutFeatures', updated);
  };

  // ── DESKTOP ────────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Fitur Unggulan
            </p>
            <p className="text-xs text-muted-foreground">
              {formData.aboutFeatures.length === 0
                ? 'Belum ada fitur — tambahkan keunggulan toko kamu'
                : `${formData.aboutFeatures.length} fitur ditambahkan`
              }
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAdd}
            className="gap-1.5 h-8 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Fitur
          </Button>
        </div>

        {/* Empty state */}
        {formData.aboutFeatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[220px] border-2 border-dashed rounded-lg gap-3">
            <p className="text-sm text-muted-foreground">Belum ada fitur unggulan</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAdd}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Fitur Pertama
            </Button>
          </div>
        ) : (
          /* Feature grid — max 3 cols */
          <div className={cn(
            'grid gap-4',
            formData.aboutFeatures.length === 1 ? 'grid-cols-1 max-w-sm' :
              formData.aboutFeatures.length === 2 ? 'grid-cols-2 max-w-2xl' :
                'grid-cols-3'
          )}>
            {formData.aboutFeatures.map((feature, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4 relative group">

                {/* Fitur badge + remove */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                    Fitur #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    aria-label="Hapus fitur"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Icon */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-[72px]">
                    <ImageUpload
                      value={feature.icon}
                      onChange={(url) => handleUpdate(i, 'icon', url ?? '')}
                      onRemove={() => handleUpdate(i, 'icon', '')}
                      folder="fibidy/feature-icons"
                      aspectRatio={1}
                      placeholder="Icon"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Opsional</p>
                </div>

                <div className="border-t" />

                {/* Judul */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                    Judul
                  </Label>
                  <Input
                    placeholder="Kualitas Terjamin"
                    value={feature.title}
                    onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                    className="h-9 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                    Deskripsi
                  </Label>
                  <Input
                    placeholder="Produk berkualitas tinggi"
                    value={feature.description}
                    onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                    className="h-9 text-sm placeholder:font-normal placeholder:text-muted-foreground/50"
                  />
                </div>

              </div>
            ))}
          </div>
        )}

        {formData.aboutFeatures.length > 0 && (
          <p className="text-[11px] text-muted-foreground">
            Rekomendasi: <span className="font-medium text-foreground">3 fitur</span> untuk tampilan yang seimbang
          </p>
        )}
      </div>
    );
  }

  // ── MOBILE: portrait stack ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4">

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleAdd}
        className="gap-1.5 h-8 text-xs font-medium"
      >
        <Plus className="h-3.5 w-3.5" />
        Tambah Fitur
      </Button>

      {formData.aboutFeatures.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full max-w-sm border-2 border-dashed rounded-lg gap-2 px-6 text-center">
          <p className="text-sm text-muted-foreground">Belum ada fitur unggulan</p>
          <p className="text-[11px] text-muted-foreground">
            Klik &quot;Tambah Fitur&quot; di atas untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {formData.aboutFeatures.map((feature, i) => (
            <Card key={i} className="border shadow-none">
              <CardContent className="pt-4 pb-4 flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                    Fitur #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Hapus fitur"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Icon */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-[72px]">
                    <ImageUpload
                      value={feature.icon}
                      onChange={(url) => handleUpdate(i, 'icon', url ?? '')}
                      onRemove={() => handleUpdate(i, 'icon', '')}
                      folder="fibidy/feature-icons"
                      aspectRatio={1}
                      placeholder="Icon"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Icon (Opsional)</p>
                </div>

                <div className="w-full border-t" />

                {/* Judul */}
                <div className="space-y-1.5">
                  <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                    Judul Fitur
                  </Label>
                  <Input
                    placeholder="Kualitas Terjamin"
                    value={feature.title}
                    onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                    className="text-center h-9 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-1.5">
                  <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                    Deskripsi
                  </Label>
                  <Input
                    placeholder="Produk berkualitas tinggi"
                    value={feature.description}
                    onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                    className="text-center h-9 text-sm placeholder:font-normal placeholder:text-muted-foreground/50"
                  />
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {formData.aboutFeatures.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center">
          Rekomendasi: <span className="font-medium text-foreground">3 fitur</span> untuk tampilan seimbang
        </p>
      )}
    </div>
  );
}
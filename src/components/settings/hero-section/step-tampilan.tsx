'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import { cn } from '@/lib/utils';
import type { HeroFormData } from '@/types';

const THEME_COLORS = [
  { value: '#0ea5e9', class: 'bg-sky-500' },
  { value: '#10b981', class: 'bg-emerald-500' },
  { value: '#f43f5e', class: 'bg-rose-500' },
  { value: '#f59e0b', class: 'bg-amber-500' },
  { value: '#8b5cf6', class: 'bg-violet-500' },
  { value: '#f97316', class: 'bg-orange-500' },
] as const;

interface StepTampilanProps {
  formData: HeroFormData;
  updateFormData: <K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) => void;
  onRemoveHeroBg: () => void;
  isRemovingHeroBg: boolean;
  onCtaTextChange: (value: string) => void;
}

export function StepTampilan({ formData, updateFormData, onRemoveHeroBg, isRemovingHeroBg, onCtaTextChange }: StepTampilanProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col items-center gap-6">

          {/* ── Warna Tema ── */}
          <div className="w-full space-y-3">
            <Label className="block text-center text-xs text-muted-foreground">Warna Tema</Label>
            <div className="grid grid-cols-6 gap-2">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => updateFormData('primaryColor', color.value)}
                  className={cn(
                    'flex items-center justify-center p-1.5 rounded-lg border-2 transition-all',
                    formData.primaryColor === color.value
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:border-muted-foreground/20'
                  )}
                >
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center', color.class)}>
                    {formData.primaryColor === color.value && (
                      <span className="text-white text-xs font-bold">&#10003;</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="w-full border-t" />

          {/* ── Hero Background ── */}
          <div className="flex flex-col items-center gap-2">
            <Label className="block text-center text-xs text-muted-foreground">Hero Background</Label>
            <div className="w-full max-w-[160px]">
              <ImageUpload
                value={formData.heroBackgroundImage}
                onChange={(url) => updateFormData('heroBackgroundImage', url ?? '')}
                onRemove={onRemoveHeroBg}
                disabled={isRemovingHeroBg}
                folder="fibidy/hero-backgrounds"
                aspectRatio={3 / 4}
                placeholder="Upload background"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">Portrait 3:4 · 1080x1440px, JPG/PNG</p>
          </div>

          {/* ── Divider ── */}
          <div className="w-full border-t" />

          {/* ── Teks CTA ── */}
          <div className="w-full space-y-1.5">
            <Label htmlFor="heroCtaText" className="block text-center text-xs text-muted-foreground">
              Teks Tombol CTA
            </Label>
            <Input
              id="heroCtaText"
              placeholder="Pesan Sekarang"
              value={formData.heroCtaText}
              onChange={(e) => onCtaTextChange(e.target.value)}
              className="text-center font-medium"
            />
            <p className="text-xs text-muted-foreground text-center">
              Max 2 kata / 15 karakter &middot; Link:{' '}
              <code className="font-mono text-primary">/products</code>
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
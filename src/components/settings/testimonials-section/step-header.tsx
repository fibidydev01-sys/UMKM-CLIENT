'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { TestimonialsFormData } from '@/types';

interface StepHeaderProps {
  formData: TestimonialsFormData;
  updateFormData: <K extends keyof TestimonialsFormData>(key: K, value: TestimonialsFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepHeader({ formData, updateFormData, isDesktop = false }: StepHeaderProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Judul */}
        <div className="space-y-1.5">
          <Label htmlFor="testimonialsTitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Judul Section
          </Label>
          <Input
            id="testimonialsTitle-d"
            placeholder="Kata Mereka"
            value={formData.testimonialsTitle}
            onChange={(e) => updateFormData('testimonialsTitle', e.target.value)}
            className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Heading utama di bagian testimonials
          </p>
        </div>

        {/* Subtitle */}
        <div className="space-y-1.5">
          <Label htmlFor="testimonialsSubtitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Subtitle
          </Label>
          <Input
            id="testimonialsSubtitle-d"
            placeholder="Apa kata pelanggan tentang kami"
            value={formData.testimonialsSubtitle}
            onChange={(e) => updateFormData('testimonialsSubtitle', e.target.value)}
            className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Kalimat pendukung di bawah judul
          </p>
        </div>

        {/* Tip */}
        <div className="col-span-2 border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tips:</span>{' '}
            Judul singkat yang emosional lebih efektif — contoh: &quot;Mereka Sudah Merasakannya&quot; atau &quot;Ribuan Pelanggan Puas&quot;.
          </p>
        </div>

      </div>
    );
  }

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col gap-5">

          <div className="space-y-1.5">
            <Label htmlFor="testimonialsTitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Judul Section
            </Label>
            <Input
              id="testimonialsTitle-m"
              placeholder="Kata Mereka"
              value={formData.testimonialsTitle}
              onChange={(e) => updateFormData('testimonialsTitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="testimonialsSubtitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Subtitle
            </Label>
            <Input
              id="testimonialsSubtitle-m"
              placeholder="Apa kata pelanggan tentang kami"
              value={formData.testimonialsSubtitle}
              onChange={(e) => updateFormData('testimonialsSubtitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
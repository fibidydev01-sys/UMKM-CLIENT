'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { AboutFormData } from '@/types';

interface StepIdentitasProps {
  formData: AboutFormData;
  updateFormData: <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepIdentitas({ formData, updateFormData, isDesktop = false }: StepIdentitasProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Judul Section */}
        <div className="space-y-1.5">
          <Label htmlFor="aboutTitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Judul Section
          </Label>
          <Input
            id="aboutTitle-d"
            placeholder="Tentang Kami"
            value={formData.aboutTitle}
            onChange={(e) => updateFormData('aboutTitle', e.target.value)}
            className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Heading utama yang tampil di bagian About
          </p>
        </div>

        {/* Subtitle */}
        <div className="space-y-1.5">
          <Label htmlFor="aboutSubtitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Subtitle
          </Label>
          <Input
            id="aboutSubtitle-d"
            placeholder="Cerita di balik toko kami"
            value={formData.aboutSubtitle}
            onChange={(e) => updateFormData('aboutSubtitle', e.target.value)}
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
            Judul yang baik singkat dan menggugah rasa ingin tahu — contoh: &quot;Cerita Di Balik Setiap Suapan&quot;.
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

          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="aboutTitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Judul Section
            </Label>
            <Input
              id="aboutTitle-m"
              placeholder="Tentang Kami"
              value={formData.aboutTitle}
              onChange={(e) => updateFormData('aboutTitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          {/* Subtitle */}
          <div className="space-y-1.5">
            <Label htmlFor="aboutSubtitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Subtitle
            </Label>
            <Input
              id="aboutSubtitle-m"
              placeholder="Cerita di balik toko kami"
              value={formData.aboutSubtitle}
              onChange={(e) => updateFormData('aboutSubtitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
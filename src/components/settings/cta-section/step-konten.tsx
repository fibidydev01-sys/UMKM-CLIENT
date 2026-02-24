'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { CtaFormData } from '@/types';

interface StepKontenProps {
  formData: CtaFormData;
  updateFormData: <K extends keyof CtaFormData>(key: K, value: CtaFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepKonten({ formData, updateFormData, isDesktop = false }: StepKontenProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Judul CTA */}
        <div className="space-y-1.5">
          <Label htmlFor="ctaTitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Judul CTA
          </Label>
          <Input
            id="ctaTitle-d"
            placeholder="Siap Memulai?"
            value={formData.ctaTitle}
            onChange={(e) => updateFormData('ctaTitle', e.target.value)}
            className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Pertanyaan atau pernyataan singkat yang mendorong aksi
          </p>
        </div>

        {/* Subtitle CTA */}
        <div className="space-y-1.5">
          <Label htmlFor="ctaSubtitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Subtitle CTA
          </Label>
          <Input
            id="ctaSubtitle-d"
            placeholder="Bergabunglah dengan pelanggan puas kami"
            value={formData.ctaSubtitle}
            onChange={(e) => updateFormData('ctaSubtitle', e.target.value)}
            className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Kalimat pendukung yang memperkuat alasan untuk bertindak
          </p>
        </div>

        {/* Tip */}
        <div className="col-span-2 border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tips:</span>{' '}
            CTA terbaik singkat dan langsung — contoh: &quot;Siap Pesan?&quot; dengan subtitle &quot;Ribuan pelanggan sudah puas. Giliran kamu!&quot;
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
            <Label htmlFor="ctaTitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Judul CTA
            </Label>
            <Input
              id="ctaTitle-m"
              placeholder="Siap Memulai?"
              value={formData.ctaTitle}
              onChange={(e) => updateFormData('ctaTitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="ctaSubtitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Subtitle CTA
            </Label>
            <Input
              id="ctaSubtitle-m"
              placeholder="Bergabunglah dengan pelanggan puas kami"
              value={formData.ctaSubtitle}
              onChange={(e) => updateFormData('ctaSubtitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
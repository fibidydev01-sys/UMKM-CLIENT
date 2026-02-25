'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { CtaFormData } from '@/types';

interface StepContentProps {
  formData: CtaFormData;
  updateFormData: <K extends keyof CtaFormData>(key: K, value: CtaFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepContent({ formData, updateFormData, isDesktop = false }: StepContentProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Headline */}
        <div className="space-y-1.5">
          <Label htmlFor="ctaTitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Headline
          </Label>
          <Input
            id="ctaTitle-d"
            placeholder="Ready to get started?"
            value={formData.ctaTitle}
            onChange={(e) => updateFormData('ctaTitle', e.target.value)}
            className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Short, punchy question or statement that drives action
          </p>
        </div>

        {/* Supporting Text */}
        <div className="space-y-1.5">
          <Label htmlFor="ctaSubtitle-d" className="text-[11px] font-medium tracking-widests uppercase text-muted-foreground">
            Supporting Text
          </Label>
          <Input
            id="ctaSubtitle-d"
            placeholder="Join thousands of happy customers"
            value={formData.ctaSubtitle}
            onChange={(e) => updateFormData('ctaSubtitle', e.target.value)}
            className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Supporting line that reinforces the reason to act
          </p>
        </div>

        {/* Tip */}
        <div className="col-span-2 border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tip:</span>{' '}
            Best CTAs are short &amp; direct — e.g. &quot;Ready to Order?&quot; with &quot;Thousands of happy customers. Your turn!&quot;
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

          {/* Headline */}
          <div className="space-y-1.5">
            <Label htmlFor="ctaTitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Headline
            </Label>
            <Input
              id="ctaTitle-m"
              placeholder="Ready to get started?"
              value={formData.ctaTitle}
              onChange={(e) => updateFormData('ctaTitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          {/* Supporting Text */}
          <div className="space-y-1.5">
            <Label htmlFor="ctaSubtitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Supporting Text
            </Label>
            <Input
              id="ctaSubtitle-m"
              placeholder="Join thousands of happy customers"
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
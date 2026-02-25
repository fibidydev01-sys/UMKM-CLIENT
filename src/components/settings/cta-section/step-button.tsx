'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CtaFormData } from '@/types';

interface StepButtonProps {
  formData: CtaFormData;
  updateFormData: <K extends keyof CtaFormData>(key: K, value: CtaFormData[K]) => void;
  primaryColor?: string;
  isDesktop?: boolean;
}

// ─── Button Style Picker ───────────────────────────────────────────────────
const BUTTON_STYLES: { value: CtaFormData['ctaButtonStyle']; label: string; desc: string }[] = [
  { value: 'primary', label: 'Primary', desc: 'Brand color' },
  { value: 'secondary', label: 'Secondary', desc: 'Neutral gray' },
  { value: 'outline', label: 'Outline', desc: 'Border only' },
];

function StylePicker({
  value,
  onChange,
  primaryColor,
  buttonText,
}: {
  value: CtaFormData['ctaButtonStyle'];
  onChange: (v: CtaFormData['ctaButtonStyle']) => void;
  primaryColor?: string;
  buttonText: string;
}) {
  return (
    <div className="flex items-stretch gap-2">
      {BUTTON_STYLES.map((style) => {
        const active = value === style.value;
        return (
          <button
            key={style.value}
            type="button"
            onClick={() => onChange(style.value)}
            className={cn(
              'flex-1 flex flex-col items-center gap-2.5 rounded-lg border px-3 py-3 transition-all text-left focus-visible:outline-none',
              active
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30'
            )}
          >
            {/* Mini button preview */}
            <div className="flex items-center justify-center w-full">
              {style.value === 'primary' && (
                <span
                  className="inline-flex items-center justify-center px-3 py-1 rounded text-[11px] font-semibold text-white transition-none"
                  style={{ backgroundColor: primaryColor || 'hsl(var(--primary))' }}
                >
                  {buttonText || 'Button'}
                </span>
              )}
              {style.value === 'secondary' && (
                <span className="inline-flex items-center justify-center px-3 py-1 rounded text-[11px] font-semibold bg-secondary text-secondary-foreground">
                  {buttonText || 'Button'}
                </span>
              )}
              {style.value === 'outline' && (
                <span className="inline-flex items-center justify-center px-3 py-1 rounded text-[11px] font-semibold border border-border bg-transparent text-foreground">
                  {buttonText || 'Button'}
                </span>
              )}
            </div>
            {/* Label */}
            <div className="text-center">
              <p className={cn('text-[11px] font-medium tracking-wide', active ? 'text-primary' : 'text-foreground')}>
                {style.label}
              </p>
              <p className="text-[10px] text-muted-foreground">{style.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function StepButton({ formData, updateFormData, primaryColor, isDesktop = false }: StepButtonProps) {

  const previewVariant =
    formData.ctaButtonStyle === 'outline' ? 'outline' :
      formData.ctaButtonStyle === 'secondary' ? 'secondary' :
        'default';

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[1fr_280px] gap-10 items-start">

        {/* Left — fields */}
        <div className="space-y-6">

          {/* Button Label */}
          <div className="space-y-1.5">
            <Label htmlFor="ctaButtonText-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Button Label
            </Label>
            <Input
              id="ctaButtonText-d"
              placeholder="Get Started"
              value={formData.ctaButtonText}
              onChange={(e) => updateFormData('ctaButtonText', e.target.value)}
              className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-xs text-muted-foreground">Short, verb-first — keep it action-oriented</p>
          </div>

          {/* Button URL */}
          <div className="space-y-1.5">
            <Label htmlFor="ctaButtonLink-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Button URL
            </Label>
            <Input
              id="ctaButtonLink-d"
              placeholder="/products"
              value={formData.ctaButtonLink}
              onChange={(e) => updateFormData('ctaButtonLink', e.target.value)}
              className="h-11 text-sm font-medium font-mono placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>Internal: <code className="font-mono text-primary">/products</code></span>
              <span className="text-border">·</span>
              <span>External: <code className="font-mono text-primary">https://...</code></span>
            </div>
          </div>

          {/* Button Style */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Button Style
            </p>
            <StylePicker
              value={formData.ctaButtonStyle}
              onChange={(v) => updateFormData('ctaButtonStyle', v)}
              primaryColor={primaryColor}
              buttonText={formData.ctaButtonText}
            />
          </div>
        </div>

        {/* Right — live preview card */}
        <div className="sticky top-0 space-y-2">
          <p className="text-[11px] font-medium tracking-widests uppercase text-muted-foreground">
            Preview
          </p>
          <div className="border rounded-lg bg-muted/20 px-6 py-8 flex flex-col items-center gap-4 text-center">
            <div className="space-y-1.5">
              <p className="text-base font-bold tracking-tight leading-tight">
                {formData.ctaTitle || 'CTA Headline'}
              </p>
              {formData.ctaSubtitle && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {formData.ctaSubtitle}
                </p>
              )}
            </div>

            {formData.ctaButtonStyle === 'primary' ? (
              <button
                type="button"
                className="inline-flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor || 'hsl(var(--primary))' }}
                tabIndex={-1}
              >
                {formData.ctaButtonText || 'Get Started'}
              </button>
            ) : (
              <Button
                variant={previewVariant}
                size="sm"
                tabIndex={-1}
                className="pointer-events-none"
              >
                {formData.ctaButtonText || 'Get Started'}
              </Button>
            )}

            {formData.ctaButtonLink && (
              <p className="text-[10px] text-muted-foreground font-mono">
                → {formData.ctaButtonLink}
              </p>
            )}
          </div>
        </div>

      </div>
    );
  }

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col gap-5">

          {/* Button Label */}
          <div className="space-y-1.5">
            <Label htmlFor="ctaButtonText-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Button Label
            </Label>
            <Input
              id="ctaButtonText-m"
              placeholder="Get Started"
              value={formData.ctaButtonText}
              onChange={(e) => updateFormData('ctaButtonText', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          {/* Button URL */}
          <div className="space-y-1.5">
            <Label htmlFor="ctaButtonLink-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Button URL
            </Label>
            <Input
              id="ctaButtonLink-m"
              placeholder="/products"
              value={formData.ctaButtonLink}
              onChange={(e) => updateFormData('ctaButtonLink', e.target.value)}
              className="text-center h-10 text-sm font-medium font-mono placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-[11px] text-muted-foreground text-center">
              Internal: <code className="font-mono text-primary">/products</code>{' '}·{' '}
              External: <code className="font-mono text-primary">https://...</code>
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Button Style */}
          <div className="space-y-2">
            <p className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Button Style
            </p>
            <StylePicker
              value={formData.ctaButtonStyle}
              onChange={(v) => updateFormData('ctaButtonStyle', v)}
              primaryColor={primaryColor}
              buttonText={formData.ctaButtonText}
            />
          </div>

          <div className="w-full border-t" />

          {/* Preview */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Preview
            </p>
            <div className="flex items-center justify-center px-4 py-3 bg-muted/30 rounded-lg w-full">
              {formData.ctaButtonStyle === 'primary' ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-white pointer-events-none"
                  style={{ backgroundColor: primaryColor || 'hsl(var(--primary))' }}
                  tabIndex={-1}
                >
                  {formData.ctaButtonText || 'Get Started'}
                </button>
              ) : (
                <Button
                  variant={previewVariant}
                  size="sm"
                  tabIndex={-1}
                  className="pointer-events-none"
                >
                  {formData.ctaButtonText || 'Get Started'}
                </Button>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
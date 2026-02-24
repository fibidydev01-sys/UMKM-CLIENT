'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import { cn } from '@/lib/utils';
import type { HeroFormData } from '@/types';

const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

interface StepTampilanProps {
  formData: HeroFormData;
  updateFormData: <K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) => void;
  onRemoveHeroBg: () => void;
  isRemovingHeroBg: boolean;
  onCtaTextChange: (value: string) => void;
  isDesktop?: boolean;
}

// ─── Shared Color Picker ───────────────────────────────────────────────────
function ColorPicker({
  value,
  onChange,
  dotSize = 'md',
}: {
  value: string;
  onChange: (v: string) => void;
  dotSize?: 'sm' | 'md';
}) {
  const selected = THEME_COLORS.find((c) => c.value === value);
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        {THEME_COLORS.map((color) => {
          const active = value === color.value;
          return (
            <button
              key={color.value}
              type="button"
              title={color.name}
              onClick={() => onChange(color.value)}
              className={cn(
                'rounded-full transition-all duration-150 focus-visible:outline-none',
                dotSize === 'md' ? 'p-1' : 'p-0.5',
                active && 'ring-2 ring-offset-2 ring-offset-background'
              )}
              style={active ? { ['--tw-ring-color' as string]: color.value } : undefined}
            >
              <div
                className={cn(
                  'rounded-full flex items-center justify-center transition-transform',
                  color.class,
                  dotSize === 'md' ? 'w-9 h-9' : 'w-7 h-7',
                  active && 'scale-105'
                )}
              >
                {active && (
                  <svg className="w-3.5 h-3.5 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Terpilih:{' '}
        <span className="font-medium text-foreground">{selected?.name ?? '—'}</span>
      </p>
    </div>
  );
}

export function StepTampilan({
  formData,
  updateFormData,
  onRemoveHeroBg,
  isRemovingHeroBg,
  onCtaTextChange,
  isDesktop = false,
}: StepTampilanProps) {

  // ── DESKTOP: 3-column ─────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-3 gap-8 items-start">

        {/* Col 1 — Warna Tema */}
        <div className="space-y-3">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Warna Tema
            </p>
            <p className="text-xs text-muted-foreground">
              Warna utama tombol &amp; aksen toko
            </p>
          </div>

          <ColorPicker
            value={formData.primaryColor}
            onChange={(v) => updateFormData('primaryColor', v)}
            dotSize="md"
          />

          {/* Live color swatch */}
          <div
            className="h-9 w-full rounded-md transition-colors duration-300 border border-black/5"
            style={{ backgroundColor: formData.primaryColor }}
          />
        </div>

        {/* Col 2 — Hero Background */}
        <div className="space-y-3">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Hero Background
            </p>
            <p className="text-xs text-muted-foreground">
              Gambar latar hero banner toko
            </p>
          </div>

          <div className="w-[160px]">
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

          <p className="text-[11px] text-muted-foreground">
            Portrait 3:4 · 1080×1440px · JPG/PNG
          </p>
        </div>

        {/* Col 3 — Teks CTA */}
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label htmlFor="cta-desktop" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Teks Tombol CTA
            </Label>
            <p className="text-xs text-muted-foreground">
              Teks tombol call-to-action di hero
            </p>
          </div>

          <Input
            id="cta-desktop"
            placeholder="Pesan Sekarang"
            value={formData.heroCtaText}
            onChange={(e) => onCtaTextChange(e.target.value)}
            className="h-11 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            maxLength={15}
          />

          {/* Char counter */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Maks. 2 kata / 15 karakter</span>
            <span className={cn(
              'font-mono tabular-nums',
              formData.heroCtaText.length >= 14 && 'text-amber-500 font-semibold'
            )}>
              {formData.heroCtaText.length}/15
            </span>
          </div>

          {/* Link info */}
          <div className="border-l-2 border-muted-foreground/20 pl-3 py-0.5">
            <p className="text-xs text-muted-foreground">
              Link:{' '}
              <code className="font-mono text-primary text-[11px]">/products</code>
            </p>
          </div>

          {/* Live CTA preview */}
          {formData.heroCtaText && (
            <div>
              <p className="text-[11px] text-muted-foreground mb-2 tracking-wide">Preview:</p>
              <button
                type="button"
                className="inline-flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: formData.primaryColor }}
              >
                {formData.heroCtaText}
              </button>
            </div>
          )}
        </div>

      </div>
    );
  }

  // ── MOBILE: portrait card ────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col items-center gap-5">

          {/* Warna Tema */}
          <div className="w-full space-y-2.5">
            <p className="text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Warna Tema
            </p>
            <div className="flex justify-center">
              <ColorPicker
                value={formData.primaryColor}
                onChange={(v) => updateFormData('primaryColor', v)}
                dotSize="sm"
              />
            </div>
          </div>

          <div className="w-full border-t" />

          {/* Hero Background */}
          <div className="w-full flex flex-col items-center gap-2.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Hero Background
            </p>
            <div className="w-[140px]">
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
            <p className="text-[11px] text-muted-foreground text-center">
              Portrait 3:4 · 1080×1440px · JPG/PNG
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Teks CTA */}
          <div className="w-full space-y-2">
            <Label htmlFor="cta-mobile" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Teks Tombol CTA
            </Label>
            <Input
              id="cta-mobile"
              placeholder="Pesan Sekarang"
              value={formData.heroCtaText}
              onChange={(e) => onCtaTextChange(e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
              maxLength={15}
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
              <span>Maks. 2 kata / 15 karakter</span>
              <span className={cn(
                'font-mono tabular-nums',
                formData.heroCtaText.length >= 14 && 'text-amber-500 font-semibold'
              )}>
                {formData.heroCtaText.length}/15
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Link:{' '}
              <code className="font-mono text-primary text-[10px]">/products</code>
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
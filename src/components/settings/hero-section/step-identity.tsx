'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/upload';
import type { HeroFormData } from '@/types';

interface StepIdentityProps {
  formData: HeroFormData;
  updateFormData: <K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) => void;
  onRemoveLogo: () => void;
  isRemovingLogo: boolean;
  isDesktop?: boolean;
}

export function StepIdentity({
  formData,
  updateFormData,
  onRemoveLogo,
  isRemovingLogo,
  isDesktop = false,
}: StepIdentityProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[160px_1fr] gap-10 items-start">

        {/* Left — Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-full">
            <ImageUpload
              value={formData.logo}
              onChange={(url) => updateFormData('logo', url ?? '')}
              onRemove={onRemoveLogo}
              disabled={isRemovingLogo}
              folder="fibidy/logos"
              aspectRatio={1}
              placeholder="Upload logo"
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-center leading-snug">
            PNG/JPG · 200×200px
          </p>
        </div>

        {/* Right — Fields */}
        <div className="space-y-6">

          {/* Store Name */}
          <div className="space-y-1.5 max-w-md">
            <Label htmlFor="name-desktop" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Store Name
            </Label>
            <Input
              id="name-desktop"
              placeholder="e.g. Burger House"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-xs text-muted-foreground">
              Shown on your store homepage and listings
            </p>
          </div>

          {/* Divider */}
          <div className="border-t max-w-md" />

          {/* Category */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Category
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full font-medium tracking-wide">
                {formData.category || 'Not set'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Set during registration · cannot be changed
            </p>
          </div>

          {/* Tip box */}
          <div className="max-w-md border-l-2 border-muted-foreground/20 pl-4 py-0.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Logo tip:</span>{' '}
              Use a transparent PNG for best results across all backgrounds.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col items-center gap-5">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-[108px]">
              <ImageUpload
                value={formData.logo}
                onChange={(url) => updateFormData('logo', url ?? '')}
                onRemove={onRemoveLogo}
                disabled={isRemovingLogo}
                folder="fibidy/logos"
                aspectRatio={1}
                placeholder="Upload logo"
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              PNG/JPG · 200×200px
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Store Name */}
          <div className="w-full space-y-1.5">
            <Label htmlFor="name-mobile" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Store Name
            </Label>
            <Input
              id="name-mobile"
              placeholder="e.g. Burger House"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          {/* Category */}
          <div className="w-full flex flex-col items-center gap-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Category
            </p>
            <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full font-medium tracking-wide">
              {formData.category || 'Not set'}
            </Badge>
            <p className="text-[11px] text-muted-foreground text-center">
              Set during registration · cannot be changed
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
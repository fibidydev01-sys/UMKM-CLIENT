'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SeoFormData } from '@/types';

interface StepMetaProps {
  formData: SeoFormData;
  updateFormData: <K extends keyof SeoFormData>(key: K, value: SeoFormData[K]) => void;
  tenantName?: string;
  tenantSlug?: string;
  tenantDescription?: string;
  isDesktop?: boolean;
}

// ─── Char counter bar ─────────────────────────────────────────────────────
function CharBar({ count, max }: { count: number; max: number }) {
  const pct = (count / max) * 100;
  const warn = pct > 90;
  const over = count > max;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-border rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-200',
            over ? 'bg-destructive' : warn ? 'bg-amber-500' : 'bg-primary'
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={cn(
        'text-[11px] tabular-nums font-mono shrink-0',
        over ? 'text-destructive font-semibold' :
          warn ? 'text-amber-500 font-semibold' :
            'text-muted-foreground'
      )}>
        {count}/{max}
      </span>
    </div>
  );
}

// ─── Google preview ───────────────────────────────────────────────────────
function GooglePreview({
  title,
  slug,
  description,
}: {
  title: string;
  slug?: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white dark:bg-muted/10 p-4 space-y-0.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-4 h-4 rounded-full bg-muted/60" />
        <span className="text-[11px] text-muted-foreground">{slug ?? 'toko'}.fibidy.com</span>
      </div>
      <p className="text-blue-600 dark:text-blue-400 text-base font-medium leading-snug hover:underline cursor-pointer line-clamp-1">
        {title || 'Nama Toko'}
      </p>
      <p className="text-[13px] text-emerald-700 dark:text-emerald-500">{slug ?? 'toko'}.fibidy.com</p>
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {description || 'Deskripsi toko akan muncul di sini...'}
      </p>
    </div>
  );
}

export function StepMeta({
  formData,
  updateFormData,
  tenantName,
  tenantSlug,
  tenantDescription,
  isDesktop = false,
}: StepMetaProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[1fr_320px] gap-10 items-start">

        {/* Left — fields */}
        <div className="space-y-6">

          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Meta Title
            </Label>
            <Input
              id="metaTitle-d"
              placeholder={tenantName || 'Judul toko Anda'}
              maxLength={70}
              value={formData.metaTitle}
              onChange={(e) => updateFormData('metaTitle', e.target.value)}
              className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <CharBar count={formData.metaTitle.length} max={60} />
            <p className="text-xs text-muted-foreground">
              Judul di hasil pencarian Google —{' '}
              <span className="font-medium text-foreground">ideal 50–60 karakter</span>
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="metaDesc-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Meta Description
            </Label>
            <Textarea
              id="metaDesc-d"
              placeholder="Deskripsi singkat toko Anda..."
              maxLength={180}
              rows={5}
              value={formData.metaDescription}
              onChange={(e) => updateFormData('metaDescription', e.target.value)}
              className="resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <CharBar count={formData.metaDescription.length} max={160} />
            <p className="text-xs text-muted-foreground">
              Deskripsi di hasil pencarian Google —{' '}
              <span className="font-medium text-foreground">ideal 120–160 karakter</span>
            </p>
          </div>

          <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Tips SEO:</span>{' '}
              Sertakan nama toko dan kata kunci utama di Meta Title. Meta Description yang menarik meningkatkan click-through rate dari Google.
            </p>
          </div>
        </div>

        {/* Right — live Google preview */}
        <div className="space-y-2 sticky top-0">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Preview di Google
          </p>
          <GooglePreview
            title={formData.metaTitle || tenantName || ''}
            slug={tenantSlug}
            description={formData.metaDescription || tenantDescription || ''}
          />
          <p className="text-[11px] text-muted-foreground text-center pt-1">
            Preview berubah sesuai input
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

          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Meta Title
            </Label>
            <Input
              id="metaTitle-m"
              placeholder={tenantName || 'Judul toko Anda'}
              maxLength={70}
              value={formData.metaTitle}
              onChange={(e) => updateFormData('metaTitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <CharBar count={formData.metaTitle.length} max={60} />
            <p className="text-[11px] text-muted-foreground text-center">
              Ideal 50–60 karakter
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="metaDesc-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Meta Description
            </Label>
            <Textarea
              id="metaDesc-m"
              placeholder="Deskripsi singkat toko Anda..."
              maxLength={180}
              rows={4}
              value={formData.metaDescription}
              onChange={(e) => updateFormData('metaDescription', e.target.value)}
              className="text-center resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <CharBar count={formData.metaDescription.length} max={160} />
            <p className="text-[11px] text-muted-foreground text-center">
              Ideal 120–160 karakter
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Mini Google preview */}
          <div className="space-y-1.5">
            <p className="text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Preview di Google
            </p>
            <GooglePreview
              title={formData.metaTitle || tenantName || ''}
              slug={tenantSlug}
              description={formData.metaDescription || tenantDescription || ''}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
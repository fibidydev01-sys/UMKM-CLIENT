'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import { Plus, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TestimonialsFormData, Testimonial } from '@/types';

interface StepTestimoniProps {
  formData: TestimonialsFormData;
  updateFormData: <K extends keyof TestimonialsFormData>(key: K, value: TestimonialsFormData[K]) => void;
  isDesktop?: boolean;
}

// ─── Star Rating ───────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none"
          aria-label={`${star} bintang`}
        >
          <Star
            className={cn(
              'h-4 w-4 transition-colors',
              (value ?? 0) >= star
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground/40'
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Shared testimonial card fields ───────────────────────────────────────
function TestimoniCard({
  testimonial,
  index,
  onUpdate,
  onRemove,
  layout = 'portrait',
}: {
  testimonial: Testimonial;
  index: number;
  onUpdate: (field: keyof Testimonial, val: string | number) => void;
  onRemove: () => void;
  layout?: 'portrait' | 'landscape';
}) {
  if (layout === 'landscape') {
    return (
      <div className="border rounded-lg p-5 space-y-4 relative group">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Testimoni #{index + 1}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            aria-label="Hapus testimoni"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Identity row: avatar + nama + role */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-[72px]">
              <ImageUpload
                value={testimonial.avatar}
                onChange={(url) => onUpdate('avatar', url ?? '')}
                onRemove={() => onUpdate('avatar', '')}
                folder="fibidy/testimonial-avatars"
                aspectRatio={1}
                placeholder="Avatar"
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-1">Opsional</p>
          </div>

          <div className="flex-1 space-y-3">
            {/* Nama */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                Nama Pelanggan
              </Label>
              <Input
                placeholder="Nama pelanggan..."
                value={testimonial.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className="h-9 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                Role <span className="normal-case font-normal">(Opsional)</span>
              </Label>
              <Input
                placeholder="Food Blogger"
                value={testimonial.role ?? ''}
                onChange={(e) => onUpdate('role', e.target.value)}
                className="h-9 text-sm placeholder:font-normal placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                Rating <span className="normal-case font-normal">(Opsional)</span>
              </Label>
              <StarRating
                value={testimonial.rating}
                onChange={(v) => onUpdate('rating', v)}
              />
            </div>
          </div>
        </div>

        <div className="border-t" />

        {/* Isi testimoni */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Isi Testimoni
          </Label>
          <Textarea
            placeholder="Tulis testimoni pelanggan..."
            rows={3}
            value={testimonial.content}
            onChange={(e) => onUpdate('content', e.target.value)}
            className="resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
          />
        </div>
      </div>
    );
  }

  // portrait (mobile)
  return (
    <Card className="border shadow-none">
      <CardContent className="pt-4 pb-4 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Testimoni #{index + 1}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Hapus testimoni"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-[72px]">
            <ImageUpload
              value={testimonial.avatar}
              onChange={(url) => onUpdate('avatar', url ?? '')}
              onRemove={() => onUpdate('avatar', '')}
              folder="fibidy/testimonial-avatars"
              aspectRatio={1}
              placeholder="Avatar"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Avatar (Opsional)</p>
        </div>

        <div className="w-full border-t" />

        {/* Nama */}
        <div className="space-y-1.5">
          <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Nama Pelanggan
          </Label>
          <Input
            placeholder="Nama pelanggan..."
            value={testimonial.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="text-center h-9 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Role <span className="normal-case font-normal">(Opsional)</span>
          </Label>
          <Input
            placeholder="Food Blogger"
            value={testimonial.role ?? ''}
            onChange={(e) => onUpdate('role', e.target.value)}
            className="text-center h-9 text-sm placeholder:font-normal placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Rating */}
        <div className="space-y-1.5 flex flex-col items-center">
          <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Rating <span className="normal-case font-normal">(Opsional)</span>
          </Label>
          <StarRating
            value={testimonial.rating}
            onChange={(v) => onUpdate('rating', v)}
          />
        </div>

        <div className="w-full border-t" />

        {/* Isi */}
        <div className="space-y-1.5">
          <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Isi Testimoni
          </Label>
          <Textarea
            placeholder="Tulis testimoni pelanggan..."
            rows={3}
            value={testimonial.content}
            onChange={(e) => onUpdate('content', e.target.value)}
            className="text-center resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
          />
        </div>

      </CardContent>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function StepTestimoni({ formData, updateFormData, isDesktop = false }: StepTestimoniProps) {

  const handleAdd = () => {
    updateFormData('testimonials', [
      ...formData.testimonials,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: '',
        role: '',
        content: '',
      },
    ]);
  };

  const handleRemove = (i: number) => {
    updateFormData('testimonials', formData.testimonials.filter((_, idx) => idx !== i));
  };

  const handleUpdate = (i: number, field: keyof Testimonial, val: string | number) => {
    const updated = [...formData.testimonials];
    updated[i] = { ...updated[i], [field]: val };
    updateFormData('testimonials', updated);
  };

  // ── DESKTOP ────────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="space-y-5">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Daftar Testimoni
            </p>
            <p className="text-xs text-muted-foreground">
              {formData.testimonials.length === 0
                ? 'Belum ada testimoni — tambahkan ulasan pelanggan kamu'
                : `${formData.testimonials.length} testimoni ditambahkan`
              }
            </p>
          </div>
          <Button
            type="button" size="sm" variant="outline"
            onClick={handleAdd}
            className="gap-1.5 h-8 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Testimoni
          </Button>
        </div>

        {/* Empty state */}
        {formData.testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[220px] border-2 border-dashed rounded-lg gap-3">
            <p className="text-sm text-muted-foreground">Belum ada testimoni</p>
            <Button
              type="button" size="sm" variant="outline"
              onClick={handleAdd}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Testimoni Pertama
            </Button>
          </div>
        ) : (
          /* Grid — max 2 col di desktop karena setiap card cukup banyak field */
          <div className={cn(
            'grid gap-4',
            formData.testimonials.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-2'
          )}>
            {formData.testimonials.map((t, i) => (
              <TestimoniCard
                key={t.id || i}
                testimonial={t}
                index={i}
                onUpdate={(field, val) => handleUpdate(i, field, val)}
                onRemove={() => handleRemove(i)}
                layout="landscape"
              />
            ))}
          </div>
        )}

        {formData.testimonials.length > 0 && (
          <p className="text-[11px] text-muted-foreground">
            Rekomendasi: <span className="font-medium text-foreground">3–6 testimoni</span> untuk tampilan yang kredibel
          </p>
        )}
      </div>
    );
  }

  // ── MOBILE ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4">

      <Button
        type="button" size="sm" variant="outline"
        onClick={handleAdd}
        className="gap-1.5 h-8 text-xs font-medium"
      >
        <Plus className="h-3.5 w-3.5" />
        Tambah Testimoni
      </Button>

      {formData.testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full max-w-sm border-2 border-dashed rounded-lg gap-2 px-6 text-center">
          <p className="text-sm text-muted-foreground">Belum ada testimoni</p>
          <p className="text-[11px] text-muted-foreground">
            Klik &quot;Tambah Testimoni&quot; untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {formData.testimonials.map((t, i) => (
            <TestimoniCard
              key={t.id || i}
              testimonial={t}
              index={i}
              onUpdate={(field, val) => handleUpdate(i, field, val)}
              onRemove={() => handleRemove(i)}
              layout="portrait"
            />
          ))}
        </div>
      )}

      {formData.testimonials.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center">
          Rekomendasi: <span className="font-medium text-foreground">3–6 testimoni</span> untuk tampilan kredibel
        </p>
      )}
    </div>
  );
}
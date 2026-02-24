'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { ContactFormData } from '@/types';

interface StepHeaderProps {
  formData: ContactFormData;
  updateFormData: <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepHeader({ formData, updateFormData, isDesktop = false }: StepHeaderProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8">

        {/* Col 1 — Header teks */}
        <div className="space-y-5">

          <div className="space-y-1.5">
            <Label htmlFor="contactTitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Judul Section
            </Label>
            <Input
              id="contactTitle-d"
              placeholder="Hubungi Kami"
              value={formData.contactTitle}
              onChange={(e) => updateFormData('contactTitle', e.target.value)}
              className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-xs text-muted-foreground">Heading utama di bagian kontak</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactSubtitle-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Subtitle
            </Label>
            <Input
              id="contactSubtitle-d"
              placeholder="Kami siap membantu Anda"
              value={formData.contactSubtitle}
              onChange={(e) => updateFormData('contactSubtitle', e.target.value)}
              className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-xs text-muted-foreground">Kalimat pendukung di bawah judul</p>
          </div>

          {/* Alamat */}
          <div className="space-y-1.5">
            <Label htmlFor="contactAddress-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Alamat Lengkap
            </Label>
            <Textarea
              id="contactAddress-d"
              placeholder="Jl. Contoh No. 123, Kota..."
              rows={4}
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              className="resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Col 2 — Info kontak */}
        <div className="space-y-5">

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <Label htmlFor="contactWa-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              WhatsApp <span className="text-destructive normal-case font-normal">*wajib</span>
            </Label>
            <Input
              id="contactWa-d"
              placeholder="6281234567890"
              value={formData.whatsapp}
              onChange={(e) => updateFormData('whatsapp', e.target.value)}
              className="h-11 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-xs text-muted-foreground">
              Tanpa tanda <code className="font-mono text-primary text-[11px]">+</code> — contoh:{' '}
              <code className="font-mono text-[11px]">6281234567890</code>
            </p>
          </div>

          {/* Telepon */}
          <div className="space-y-1.5">
            <Label htmlFor="contactPhone-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Nomor Telepon <span className="normal-case font-normal text-muted-foreground">(Opsional)</span>
            </Label>
            <Input
              id="contactPhone-d"
              placeholder="+62 812-3456-7890"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="h-11 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Tip */}
          <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5 mt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Tips:</span>{' '}
              Pastikan nomor WhatsApp aktif — pelanggan akan langsung terhubung ke chat WA saat mengklik tombol kontak.
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
        <CardContent className="pt-6 pb-6 flex flex-col gap-5">

          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="contactTitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Judul Section
            </Label>
            <Input
              id="contactTitle-m"
              placeholder="Hubungi Kami"
              value={formData.contactTitle}
              onChange={(e) => updateFormData('contactTitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          {/* Subtitle */}
          <div className="space-y-1.5">
            <Label htmlFor="contactSubtitle-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Subtitle
            </Label>
            <Input
              id="contactSubtitle-m"
              placeholder="Kami siap membantu Anda"
              value={formData.contactSubtitle}
              onChange={(e) => updateFormData('contactSubtitle', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="w-full border-t" />

          {/* Telepon */}
          <div className="space-y-1.5">
            <Label htmlFor="contactPhone-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Nomor Telepon
            </Label>
            <Input
              id="contactPhone-m"
              placeholder="+62 812-3456-7890"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <Label htmlFor="contactWa-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              WhatsApp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactWa-m"
              placeholder="6281234567890"
              value={formData.whatsapp}
              onChange={(e) => updateFormData('whatsapp', e.target.value)}
              className="text-center h-10 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-[11px] text-muted-foreground text-center">
              Tanpa <code className="font-mono text-primary">+</code> — contoh: 6281234567890
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Alamat */}
          <div className="space-y-1.5">
            <Label htmlFor="contactAddress-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Alamat Lengkap
            </Label>
            <Textarea
              id="contactAddress-m"
              placeholder="Jl. Contoh No. 123, Kota..."
              rows={3}
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              className="text-center resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
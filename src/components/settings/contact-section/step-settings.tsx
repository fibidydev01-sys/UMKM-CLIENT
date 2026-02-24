'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Lock } from 'lucide-react';
import type { ContactFormData } from '@/types';

interface StepSettingsProps {
  formData: ContactFormData;
  updateFormData: <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => void;
  tenantEmail: string;
  tenantSlug: string;
  isDesktop?: boolean;
}

export function StepSettings({
  formData,
  updateFormData,
  tenantEmail,
  tenantSlug,
  isDesktop = false,
}: StepSettingsProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Col 1 — Readonly info akun */}
        <div className="space-y-5">
          <div className="space-y-0.5 mb-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Informasi Akun
            </p>
            <p className="text-xs text-muted-foreground">
              Data ini tidak dapat diubah dari sini
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="tenantEmail-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              Email
              <Lock className="h-3 w-3 text-muted-foreground/50" />
            </Label>
            <Input
              id="tenantEmail-d"
              value={tenantEmail}
              disabled
              className="h-11 text-sm bg-muted/30 text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Domain */}
          <div className="space-y-1.5">
            <Label htmlFor="tenantDomain-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              Domain Toko
              <Lock className="h-3 w-3 text-muted-foreground/50" />
            </Label>
            <Input
              id="tenantDomain-d"
              value={`${tenantSlug}.fibidy.com`}
              disabled
              className="h-11 text-sm font-mono bg-muted/30 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Untuk mengubah email atau domain custom, kunjungi halaman{' '}
              <span className="font-medium text-foreground">Pengaturan Akun</span>.
            </p>
          </div>
        </div>

        {/* Col 2 — Pengaturan form kontak */}
        <div className="space-y-5">
          <div className="space-y-0.5 mb-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Pengaturan Form
            </p>
            <p className="text-xs text-muted-foreground">
              Atur visibilitas form kontak
            </p>
          </div>

          {/* Toggle form */}
          <div className="flex items-center justify-between border rounded-lg px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Tampilkan Form Kontak</p>
              <p className="text-xs text-muted-foreground">
                Pengunjung bisa mengirim pesan lewat form
              </p>
            </div>
            <Switch
              id="contactShowForm-d"
              checked={formData.contactShowForm}
              onCheckedChange={(checked) => updateFormData('contactShowForm', checked)}
            />
          </div>

          {/* Status info */}
          <div className={`rounded-lg px-4 py-3 text-xs border ${formData.contactShowForm
            ? 'bg-primary/5 border-primary/20 text-primary'
            : 'bg-muted/50 border-border text-muted-foreground'
            }`}>
            {formData.contactShowForm
              ? '✓ Form kontak aktif — pelanggan dapat menghubungi kamu'
              : '○ Form kontak nonaktif — halaman kontak hanya menampilkan info'
            }
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

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Email
            </Label>
            <Input
              value={tenantEmail}
              disabled
              className="text-center h-10 text-sm bg-muted/30 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground text-center">Email tidak dapat diubah</p>
          </div>

          {/* Domain */}
          <div className="space-y-1.5">
            <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Domain Toko
            </Label>
            <Input
              value={`${tenantSlug}.fibidy.com`}
              disabled
              className="text-center h-10 text-sm font-mono bg-muted/30 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="w-full border-t" />

          {/* Toggle form */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Tampilkan Form Kontak</p>
              <p className="text-xs text-muted-foreground">Form kontak di halaman kontak</p>
            </div>
            <Switch
              id="contactShowForm-m"
              checked={formData.contactShowForm}
              onCheckedChange={(checked) => updateFormData('contactShowForm', checked)}
            />
          </div>

          {/* Status badge */}
          <div className={`rounded-lg px-3 py-2.5 text-[11px] text-center border ${formData.contactShowForm
            ? 'bg-primary/5 border-primary/20 text-primary'
            : 'bg-muted/50 border-border text-muted-foreground'
            }`}>
            {formData.contactShowForm
              ? '✓ Form kontak aktif'
              : '○ Form kontak nonaktif'
            }
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
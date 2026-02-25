'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Lock } from 'lucide-react';
import type { ContactFormData } from '@/types';

interface StepDisplaySettingsProps {
  formData: ContactFormData;
  updateFormData: <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => void;
  tenantEmail: string;
  tenantSlug: string;
  isDesktop?: boolean;
}

export function StepDisplaySettings({
  formData,
  updateFormData,
  tenantEmail,
  tenantSlug,
  isDesktop = false,
}: StepDisplaySettingsProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Col 1 — Readonly account info */}
        <div className="space-y-5">
          <div className="space-y-0.5 mb-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Account Info
            </p>
            <p className="text-xs text-muted-foreground">
              These details cannot be changed here
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

          {/* Store Domain */}
          <div className="space-y-1.5">
            <Label htmlFor="tenantDomain-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              Store Domain
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
              To update your email or custom domain, visit{' '}
              <span className="font-medium text-foreground">Account Settings</span>.
            </p>
          </div>
        </div>

        {/* Col 2 — Form settings */}
        <div className="space-y-5">
          <div className="space-y-0.5 mb-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Form Settings
            </p>
            <p className="text-xs text-muted-foreground">
              Control contact form visibility
            </p>
          </div>

          {/* Show Contact Form toggle */}
          <div className="flex items-center justify-between border rounded-lg px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Show Contact Form</p>
              <p className="text-xs text-muted-foreground">
                Visitors can send messages through the contact form
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
              ? '✓ Contact form active — customers can reach you'
              : '○ Contact form hidden — page shows contact info only'
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
            <p className="text-[11px] text-muted-foreground text-center">Email cannot be changed</p>
          </div>

          {/* Store Domain */}
          <div className="space-y-1.5">
            <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Store Domain
            </Label>
            <Input
              value={`${tenantSlug}.fibidy.com`}
              disabled
              className="text-center h-10 text-sm font-mono bg-muted/30 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="w-full border-t" />

          {/* Show Contact Form toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Show Contact Form</p>
              <p className="text-xs text-muted-foreground">Contact form on your contact page</p>
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
              ? '✓ Contact form active'
              : '○ Contact form hidden'
            }
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
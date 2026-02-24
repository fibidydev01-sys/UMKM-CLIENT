'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import type { ContactFormData } from '@/types';

interface StepMapsProps {
  formData: ContactFormData;
  updateFormData: <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepMaps({ formData, updateFormData, isDesktop = false }: StepMapsProps) {

  const hasValidUrl = formData.contactMapUrl.startsWith('https://');

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[1fr_auto] gap-8 items-start">

        {/* Left — URL + toggle */}
        <div className="space-y-6 max-w-lg">

          <div className="space-y-1.5">
            <Label htmlFor="mapUrl-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              URL Google Maps Embed
            </Label>
            <Input
              id="mapUrl-d"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={formData.contactMapUrl}
              onChange={(e) => updateFormData('contactMapUrl', e.target.value)}
              className="h-11 text-sm font-medium placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <div className="border-l-2 border-muted-foreground/20 pl-3 py-0.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Buka Google Maps → cari lokasi → klik{' '}
                <span className="font-medium text-foreground">Share</span> →{' '}
                <span className="font-medium text-foreground">Embed a map</span> → salin URL dari{' '}
                <code className="font-mono text-primary text-[11px]">src=&#34;...&#34;</code>
              </p>
            </div>
          </div>

          {/* Toggle tampilkan peta */}
          <div className="flex items-center justify-between border rounded-lg px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Tampilkan Peta</p>
              <p className="text-xs text-muted-foreground">
                Google Maps embed di halaman kontak
              </p>
            </div>
            <Switch
              id="contactShowMap-d"
              checked={formData.contactShowMap}
              onCheckedChange={(checked) => updateFormData('contactShowMap', checked)}
            />
          </div>

        </div>

        {/* Right — Preview */}
        <div className="flex flex-col items-center gap-2 pt-6">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground self-start">
            Preview Peta
          </p>
          {hasValidUrl && formData.contactShowMap ? (
            <div className="border rounded-lg overflow-hidden w-[280px] shadow-sm">
              <iframe
                src={formData.contactMapUrl}
                width="280"
                height="220"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="w-[280px] h-[220px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-8 w-8 opacity-30" />
              <p className="text-xs text-center px-4">
                {!hasValidUrl
                  ? 'Masukkan URL untuk melihat preview'
                  : 'Aktifkan "Tampilkan Peta" untuk preview'
                }
              </p>
            </div>
          )}
        </div>

      </div>
    );
  }

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col gap-5">

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="mapUrl-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              URL Google Maps Embed
            </Label>
            <Input
              id="mapUrl-m"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={formData.contactMapUrl}
              onChange={(e) => updateFormData('contactMapUrl', e.target.value)}
              className="h-10 text-sm font-medium placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-[11px] text-muted-foreground text-center">
              Share → Embed a map → salin URL dari <code className="font-mono text-primary">src=&#34;...&#34;</code>
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Tampilkan Peta</p>
              <p className="text-xs text-muted-foreground">Google Maps di halaman kontak</p>
            </div>
            <Switch
              id="contactShowMap-m"
              checked={formData.contactShowMap}
              onCheckedChange={(checked) => updateFormData('contactShowMap', checked)}
            />
          </div>

          {/* Inline preview */}
          {hasValidUrl && formData.contactShowMap && (
            <>
              <div className="w-full border-t" />
              <div className="space-y-1.5">
                <p className="text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                  Preview Peta
                </p>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={formData.contactMapUrl}
                    width="100%"
                    height="180"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
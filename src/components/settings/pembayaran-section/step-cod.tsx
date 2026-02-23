'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { PembayaranFormData } from '@/types';

interface StepCodProps {
  formData: PembayaranFormData;
  onToggleCod: () => void;
  onCodNoteChange: (note: string) => void;
}

export function StepCod({ formData, onToggleCod, onCodNoteChange }: StepCodProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Aktifkan COD</Label>
              <p className="text-xs text-muted-foreground">Pelanggan dapat membayar saat barang diterima</p>
            </div>
            <Switch
              checked={formData.paymentMethods.cod.enabled}
              onCheckedChange={onToggleCod}
            />
          </div>

          {formData.paymentMethods.cod.enabled && (
            <>
              <div className="w-full border-t" />
              <div className="space-y-1.5">
                <Label htmlFor="cod-note" className="block text-center text-xs text-muted-foreground">
                  Catatan COD (Opsional)
                </Label>
                <Input
                  id="cod-note"
                  placeholder="Contoh: Hanya untuk area Jabodetabek"
                  value={formData.paymentMethods.cod.note || ''}
                  onChange={(e) => onCodNoteChange(e.target.value)}
                  className="text-center"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Ditampilkan di halaman checkout
                </p>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
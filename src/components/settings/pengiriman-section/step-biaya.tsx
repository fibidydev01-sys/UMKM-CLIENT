'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { PengirimanFormData } from '@/types';

interface StepBiayaProps {
  formData: PengirimanFormData;
  onFreeShippingChange: (value: string) => void;
  onDefaultCostChange: (value: string) => void;
}

export function StepBiaya({ formData, onFreeShippingChange, onDefaultCostChange }: StepBiayaProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label htmlFor="free-shipping" className="block text-center text-xs text-muted-foreground">
              Batas Gratis Ongkir (Rp)
            </Label>
            <Input
              id="free-shipping"
              type="number"
              min="0"
              placeholder="100000"
              value={formData.freeShippingThreshold || ''}
              onChange={(e) => onFreeShippingChange(e.target.value)}
              className="text-center font-medium"
            />
            <p className="text-xs text-muted-foreground text-center">
              Pesanan di atas nilai ini gratis ongkir. Kosongkan jika tidak ada.
            </p>
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="default-shipping" className="block text-center text-xs text-muted-foreground">
              Ongkos Kirim Default (Rp)
            </Label>
            <Input
              id="default-shipping"
              type="number"
              min="0"
              placeholder="15000"
              value={formData.defaultShippingCost || ''}
              onChange={(e) => onDefaultCostChange(e.target.value)}
              className="text-center font-medium"
            />
            <p className="text-xs text-muted-foreground text-center">
              Ongkos kirim untuk pesanan di bawah batas gratis ongkir.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
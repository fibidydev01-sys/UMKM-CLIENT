'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PembayaranFormData } from '@/types';

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'IDR - Rupiah Indonesia' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
];

interface StepCurrencyProps {
  formData: PembayaranFormData;
  onCurrencyChange: (value: string) => void;
  onTaxRateChange: (value: string) => void;
}

export function StepCurrency({ formData, onCurrencyChange, onTaxRateChange }: StepCurrencyProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-6">

          <div className="space-y-1.5">
            <Label className="block text-center text-xs text-muted-foreground">Mata Uang</Label>
            <Select value={formData.currency} onValueChange={onCurrencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full border-t" />

          <div className="space-y-1.5">
            <Label htmlFor="tax-rate" className="block text-center text-xs text-muted-foreground">
              Tarif Pajak (%)
            </Label>
            <Input
              id="tax-rate"
              type="number"
              min="0"
              max="100"
              placeholder="11"
              value={formData.taxRate || ''}
              onChange={(e) => onTaxRateChange(e.target.value)}
              className="text-center font-medium"
            />
            <p className="text-xs text-muted-foreground text-center">
              Isi 0 jika tidak ada pajak. Pajak akan ditampilkan di checkout.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
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
  { value: 'IDR', label: 'IDR', desc: 'Rupiah Indonesia' },
  { value: 'USD', label: 'USD', desc: 'US Dollar' },
  { value: 'SGD', label: 'SGD', desc: 'Singapore Dollar' },
  { value: 'MYR', label: 'MYR', desc: 'Malaysian Ringgit' },
];

interface StepCurrencyProps {
  formData: PembayaranFormData;
  onCurrencyChange: (value: string) => void;
  onTaxRateChange: (value: string) => void;
  isDesktop?: boolean;
}

export function StepCurrency({ formData, onCurrencyChange, onTaxRateChange, isDesktop = false }: StepCurrencyProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Mata Uang */}
        <div className="space-y-2">
          <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Mata Uang
          </Label>

          {/* Currency card picker */}
          <div className="grid grid-cols-2 gap-2">
            {CURRENCY_OPTIONS.map((opt) => {
              const active = formData.currency === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onCurrencyChange(opt.value)}
                  className={`flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-all focus-visible:outline-none ${active
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30'
                    }`}
                >
                  <span className={`text-base font-bold tracking-tight ${active ? 'text-primary' : 'text-foreground'}`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{opt.desc}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Mata uang yang digunakan di seluruh toko
          </p>
        </div>

        {/* Tarif Pajak */}
        <div className="space-y-2">
          <Label htmlFor="tax-rate-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Tarif Pajak (%)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="tax-rate-d"
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="11"
              value={formData.taxRate || ''}
              onChange={(e) => onTaxRateChange(e.target.value)}
              className="h-11 text-base font-semibold tracking-tight w-32 placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <span className="text-sm text-muted-foreground font-medium">%</span>
          </div>

          {/* Tax preview */}
          <div className="rounded-lg bg-muted/30 px-4 py-3 space-y-1.5 mt-2">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Simulasi</p>
            {[100_000, 250_000, 500_000].map((price) => {
              const tax = (price * (formData.taxRate || 0)) / 100;
              return (
                <div key={price} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Rp {price.toLocaleString('id')} →
                  </span>
                  <span className="font-medium">
                    + Rp {tax.toLocaleString('id')} pajak
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            Isi <span className="font-medium text-foreground">0</span> jika tidak ada pajak — pajak ditampilkan di checkout
          </p>
        </div>

        {/* Editorial tip */}
        <div className="col-span-2 border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tips:</span>{' '}
            PPN Indonesia 11% berlaku untuk produk digital. Pilih IDR untuk toko lokal Indonesia.
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

          {/* Mata Uang */}
          <div className="space-y-2">
            <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Mata Uang
            </Label>
            <Select value={formData.currency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="h-10 text-sm font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label} — {opt.desc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full border-t" />

          {/* Tarif Pajak */}
          <div className="space-y-2">
            <Label htmlFor="tax-rate-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Tarif Pajak (%)
            </Label>
            <Input
              id="tax-rate-m"
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="11"
              value={formData.taxRate || ''}
              onChange={(e) => onTaxRateChange(e.target.value)}
              className="text-center h-10 text-sm font-semibold placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-[11px] text-muted-foreground text-center">
              Isi 0 jika tidak ada pajak
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
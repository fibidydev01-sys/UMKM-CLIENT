'use client';

import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Building2,
  Wallet,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BankAccount, EWallet, PaymentMethods } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface PaymentSettingsData {
  currency: string;
  taxRate: number;
  paymentMethods: PaymentMethods;
}

interface PaymentSettingsProps {
  settings: PaymentSettingsData | null;
  isLoading: boolean;
  isSaving: boolean;
  onSettingsChange: (settings: PaymentSettingsData) => void;
  onSave: () => Promise<void>;
  onAddBank: () => void;
  onEditBank: (bank: BankAccount) => void;
  onDeleteBank: (id: string) => void;
  onToggleBank: (id: string) => void;
  onAddEwallet: () => void;
  onEditEwallet: (ewallet: EWallet) => void;
  onDeleteEwallet: (id: string) => void;
  onToggleEwallet: (id: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'IDR - Rupiah Indonesia' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function PaymentSettings({
  settings,
  isLoading,
  isSaving,
  onSettingsChange,
  onSave,
  onAddBank,
  onEditBank,
  onDeleteBank,
  onToggleBank,
  onAddEwallet,
  onEditEwallet,
  onDeleteEwallet,
  onToggleEwallet,
}: PaymentSettingsProps) {
  const handleCurrencyChange = (value: string) => {
    if (settings) {
      onSettingsChange({ ...settings, currency: value });
    }
  };

  const handleTaxRateChange = (value: string) => {
    if (settings) {
      onSettingsChange({ ...settings, taxRate: parseFloat(value) || 0 });
    }
  };

  const handleToggleCod = () => {
    if (settings) {
      onSettingsChange({
        ...settings,
        paymentMethods: {
          ...settings.paymentMethods,
          cod: {
            ...settings.paymentMethods.cod,
            enabled: !settings.paymentMethods.cod.enabled,
          },
        },
      });
    }
  };

  const handleCodNoteChange = (note: string) => {
    if (settings) {
      onSettingsChange({
        ...settings,
        paymentMethods: {
          ...settings.paymentMethods,
          cod: {
            ...settings.paymentMethods.cod,
            note,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Currency & Tax Card */}
      <Card>
        <CardHeader>
          <CardTitle>Mata Uang & Pajak</CardTitle>
          <CardDescription>
            Konfigurasi mata uang dan tarif pajak untuk toko Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading || !settings ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mata Uang</Label>
                <Select value={settings.currency} onValueChange={handleCurrencyChange}>
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

              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tarif Pajak (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="11"
                  value={settings.taxRate || ''}
                  onChange={(e) => handleTaxRateChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Isi 0 jika tidak ada pajak. Pajak akan ditampilkan di checkout.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Accounts Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Rekening Bank
              </CardTitle>
              <CardDescription>
                Daftar rekening bank untuk transfer pembayaran.
              </CardDescription>
            </div>
            <Button size="sm" onClick={onAddBank}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || !settings ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : settings.paymentMethods.bankAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada rekening bank</p>
              <p className="text-sm">Tambahkan rekening untuk menerima pembayaran transfer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settings.paymentMethods.bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border',
                    bank.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={bank.enabled}
                      onCheckedChange={() => onToggleBank(bank.id)}
                    />
                    <div>
                      <p className="font-medium">{bank.bank}</p>
                      <p className="text-sm text-muted-foreground">
                        {bank.accountNumber} • {bank.accountName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditBank(bank)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteBank(bank.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* E-Wallets Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                E-Wallet
              </CardTitle>
              <CardDescription>
                Daftar e-wallet untuk menerima pembayaran.
              </CardDescription>
            </div>
            <Button size="sm" onClick={onAddEwallet}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || !settings ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : settings.paymentMethods.eWallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada e-wallet</p>
              <p className="text-sm">Tambahkan e-wallet untuk menerima pembayaran digital</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settings.paymentMethods.eWallets.map((ewallet) => (
                <div
                  key={ewallet.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border',
                    ewallet.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={ewallet.enabled}
                      onCheckedChange={() => onToggleEwallet(ewallet.id)}
                    />
                    <div>
                      <p className="font-medium">{ewallet.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        {ewallet.number}
                        {ewallet.name && ` • ${ewallet.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditEwallet(ewallet)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteEwallet(ewallet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* COD Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            COD (Bayar di Tempat)
          </CardTitle>
          <CardDescription>
            Aktifkan pembayaran tunai saat barang diterima.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading || !settings ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Aktifkan COD</p>
                  <p className="text-sm text-muted-foreground">
                    Pelanggan dapat membayar saat barang diterima
                  </p>
                </div>
                <Switch
                  checked={settings.paymentMethods.cod.enabled}
                  onCheckedChange={handleToggleCod}
                />
              </div>
              {settings.paymentMethods.cod.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="cod-note">Catatan COD (Opsional)</Label>
                  <Input
                    id="cod-note"
                    placeholder="Contoh: Hanya untuk area Jabodetabek"
                    value={settings.paymentMethods.cod.note || ''}
                    onChange={(e) => handleCodNoteChange(e.target.value)}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving || isLoading}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan Pembayaran
        </Button>
      </div>
    </div>
  );
}
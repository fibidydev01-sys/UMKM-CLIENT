// ══════════════════════════════════════════════════════════════
// PEMBAYARAN SETTINGS - Wizard Form
// Route: /settings/pembayaran
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  Building2,
  Wallet,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { BankAccountDialog, EwalletDialog, PreviewModal } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { BankAccount, EWallet, PaymentMethods } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  bankAccounts: [],
  eWallets: [],
  cod: { enabled: false, note: '' },
};

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'IDR - Rupiah Indonesia' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

// ─── Wizard Steps ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'currency-tax',
    title: 'Mata Uang & Pajak',
    desc: 'Konfigurasi mata uang dan tarif pajak',
    icon: Coins,
  },
  {
    id: 'bank-accounts',
    title: 'Rekening Bank',
    desc: 'Daftar rekening untuk transfer',
    icon: Building2,
  },
  {
    id: 'e-wallets',
    title: 'E-Wallet',
    desc: 'Daftar e-wallet untuk pembayaran digital',
    icon: Wallet,
  },
  {
    id: 'cod',
    title: 'COD',
    desc: 'Pembayaran tunai di tempat',
    icon: Banknote,
  },
] as const;

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={cn(
              'w-2 h-2 rounded-full transition-colors duration-200',
              i <= currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                'w-8 h-px transition-colors duration-200',
                i < currentStep ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PembayaranPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Dialog states
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [ewalletDialogOpen, setEwalletDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingEwallet, setEditingEwallet] = useState<EWallet | null>(null);

  const [formData, setFormData] = useState<{
    currency: string;
    taxRate: number;
    paymentMethods: PaymentMethods;
  } | null>(null);

  // Initialize form data from tenant
  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        currency: tenant.currency || 'IDR',
        taxRate: tenant.taxRate || 0,
        paymentMethods: tenant.paymentMethods || DEFAULT_PAYMENT_METHODS,
      });
    }
  }, [tenant, formData]);

  // ─── Update Helpers ─────────────────────────────────────────────────────────
  const handleCurrencyChange = (value: string) => {
    if (formData) setFormData({ ...formData, currency: value });
  };

  const handleTaxRateChange = (value: string) => {
    if (formData) setFormData({ ...formData, taxRate: parseFloat(value) || 0 });
  };

  const handleToggleCod = () => {
    if (formData) {
      setFormData({
        ...formData,
        paymentMethods: {
          ...formData.paymentMethods,
          cod: {
            ...formData.paymentMethods.cod,
            enabled: !formData.paymentMethods.cod.enabled,
          },
        },
      });
    }
  };

  const handleCodNoteChange = (note: string) => {
    if (formData) {
      setFormData({
        ...formData,
        paymentMethods: {
          ...formData.paymentMethods,
          cod: { ...formData.paymentMethods.cod, note },
        },
      });
    }
  };

  // ─── Bank Handlers ──────────────────────────────────────────────────────────
  const handleSaveBank = (bank: BankAccount) => {
    if (!formData) return;
    const existing = formData.paymentMethods.bankAccounts.find((b) => b.id === bank.id);
    let updatedBanks: BankAccount[];

    if (existing) {
      updatedBanks = formData.paymentMethods.bankAccounts.map((b) =>
        b.id === bank.id ? bank : b
      );
    } else {
      updatedBanks = [...formData.paymentMethods.bankAccounts, { ...bank, id: generateId() }];
    }

    setFormData({
      ...formData,
      paymentMethods: { ...formData.paymentMethods, bankAccounts: updatedBanks },
    });
    setBankDialogOpen(false);
    setEditingBank(null);
  };

  const handleDeleteBank = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        bankAccounts: formData.paymentMethods.bankAccounts.filter((b) => b.id !== id),
      },
    });
  };

  const handleToggleBank = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        bankAccounts: formData.paymentMethods.bankAccounts.map((b) =>
          b.id === id ? { ...b, enabled: !b.enabled } : b
        ),
      },
    });
  };

  // ─── E-Wallet Handlers ──────────────────────────────────────────────────────
  const handleSaveEwallet = (ewallet: EWallet) => {
    if (!formData) return;
    const existing = formData.paymentMethods.eWallets.find((e) => e.id === ewallet.id);
    let updatedEwallets: EWallet[];

    if (existing) {
      updatedEwallets = formData.paymentMethods.eWallets.map((e) =>
        e.id === ewallet.id ? ewallet : e
      );
    } else {
      updatedEwallets = [...formData.paymentMethods.eWallets, { ...ewallet, id: generateId() }];
    }

    setFormData({
      ...formData,
      paymentMethods: { ...formData.paymentMethods, eWallets: updatedEwallets },
    });
    setEwalletDialogOpen(false);
    setEditingEwallet(null);
  };

  const handleDeleteEwallet = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        eWallets: formData.paymentMethods.eWallets.filter((e) => e.id !== id),
      },
    });
  };

  const handleToggleEwallet = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        eWallets: formData.paymentMethods.eWallets.map((e) =>
          e.id === id ? { ...e, enabled: !e.enabled } : e
        ),
      },
    });
  };

  // ─── Soft Warning ───────────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    const missing: string[] = [];
    if (currentStep === 1) {
      if (formData.paymentMethods.bankAccounts.length === 0) {
        missing.push('Minimal 1 rekening bank');
      }
    } else if (currentStep === 2) {
      if (formData.paymentMethods.eWallets.length === 0) {
        missing.push('Minimal 1 e-wallet');
      }
    }
    if (missing.length > 0) {
      toast.info(`${missing.join(', ')} untuk hasil lebih baik`);
    }
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = () => {
    checkEmptyFields();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // ─── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        currency: formData.currency,
        taxRate: formData.taxRate,
        paymentMethods: formData.paymentMethods,
      });
      await refresh();
      toast.success('Pengaturan pembayaran berhasil disimpan');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to save payment settings:', error);
      toast.error('Gagal menyimpan pengaturan pembayaran');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  const isLoading = tenant === null || formData === null;

  return (
    <div>
      {/* Dialogs */}
      <BankAccountDialog
        open={bankDialogOpen}
        onOpenChange={setBankDialogOpen}
        bank={editingBank}
        onSave={handleSaveBank}
      />
      <EwalletDialog
        open={ewalletDialogOpen}
        onOpenChange={setEwalletDialogOpen}
        ewallet={editingEwallet}
        onSave={handleSaveEwallet}
      />

      <div>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-2 w-24 mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-10 w-full max-w-sm mx-auto" />
            <Skeleton className="h-10 w-full max-w-sm mx-auto" />
            <Skeleton className="h-10 w-full max-w-sm mx-auto" />
          </div>
        ) : (
          <div className="flex flex-col pb-20 lg:pb-0">
            {/* ── Header ──────────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-center lg:justify-between mb-5">
                <div className="hidden lg:flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className={currentStep > 0 ? '' : 'invisible'}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Button>
                </div>

                <StepIndicator currentStep={currentStep} />

                <div className="hidden lg:flex">
                  <Button variant="ghost" size="sm" onClick={handleNext}>
                    {currentStep === STEPS.length - 1 ? 'Preview' : 'Selanjutnya'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-sm font-semibold">{STEPS[currentStep].title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {STEPS[currentStep].desc}
                </p>
              </div>
            </div>

            {/* ── Body ────────────────────────────────────────────── */}
            <div className="min-h-[280px]">
              {/* Step 1: Mata Uang & Pajak */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Mata Uang</Label>
                    <Select value={formData.currency} onValueChange={handleCurrencyChange}>
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
                      value={formData.taxRate || ''}
                      onChange={(e) => handleTaxRateChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Isi 0 jika tidak ada pajak. Pajak akan ditampilkan di checkout.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Rekening Bank */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingBank(null);
                        setBankDialogOpen(true);
                      }}
                    >
                      + Tambah Bank
                    </Button>
                  </div>

                  {formData.paymentMethods.bankAccounts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>Belum ada rekening bank</p>
                      <p className="text-sm">Tambahkan rekening untuk menerima pembayaran transfer</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.paymentMethods.bankAccounts.map((bank) => (
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
                              onCheckedChange={() => handleToggleBank(bank.id)}
                            />
                            <div>
                              <p className="font-medium">{bank.bank}</p>
                              <p className="text-sm text-muted-foreground">
                                {bank.accountNumber} - {bank.accountName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingBank(bank);
                                setBankDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteBank(bank.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: E-Wallet */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingEwallet(null);
                        setEwalletDialogOpen(true);
                      }}
                    >
                      + Tambah E-Wallet
                    </Button>
                  </div>

                  {formData.paymentMethods.eWallets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Wallet className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>Belum ada e-wallet</p>
                      <p className="text-sm">Tambahkan e-wallet untuk menerima pembayaran digital</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.paymentMethods.eWallets.map((ewallet) => (
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
                              onCheckedChange={() => handleToggleEwallet(ewallet.id)}
                            />
                            <div>
                              <p className="font-medium">{ewallet.provider}</p>
                              <p className="text-sm text-muted-foreground">
                                {ewallet.number}
                                {ewallet.name && ` - ${ewallet.name}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingEwallet(ewallet);
                                setEwalletDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteEwallet(ewallet.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: COD */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Aktifkan COD</p>
                      <p className="text-sm text-muted-foreground">
                        Pelanggan dapat membayar saat barang diterima
                      </p>
                    </div>
                    <Switch
                      checked={formData.paymentMethods.cod.enabled}
                      onCheckedChange={handleToggleCod}
                    />
                  </div>

                  {formData.paymentMethods.cod.enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="cod-note">Catatan COD (Opsional)</Label>
                      <Input
                        id="cod-note"
                        placeholder="Contoh: Hanya untuk area Jabodetabek"
                        value={formData.paymentMethods.cod.note || ''}
                        onChange={(e) => handleCodNoteChange(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Catatan ini akan ditampilkan di halaman checkout
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Nav ───────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 bg-background border-t p-3 flex items-center justify-between z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          className={currentStep > 0 ? '' : 'invisible'}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sebelumnya
        </Button>
        <Button variant="ghost" size="sm" onClick={handleNext}>
          {currentStep === STEPS.length - 1 ? 'Preview' : 'Selanjutnya'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* ── Preview Modal ──────────────────────────────────────────── */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        isSaving={isSaving}
        title="Preview Pengaturan Pembayaran"
      >
        {formData && (
          <div className="space-y-6 mt-4">
            {/* Currency & Tax */}
            <div>
              <h4 className="text-sm font-medium mb-3">Mata Uang & Pajak</h4>
              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Mata Uang:</span>{' '}
                  {CURRENCY_OPTIONS.find((c) => c.value === formData.currency)?.label ||
                    formData.currency}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Tarif Pajak:</span>{' '}
                  {formData.taxRate > 0 ? `${formData.taxRate}%` : 'Tidak ada'}
                </p>
              </div>
            </div>

            {/* Bank Accounts */}
            <div>
              <h4 className="text-sm font-medium mb-3">Rekening Bank</h4>
              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                {formData.paymentMethods.bankAccounts.length > 0 ? (
                  formData.paymentMethods.bankAccounts.map((bank) => (
                    <p key={bank.id} className="text-sm">
                      <span
                        className={cn(
                          'inline-block w-2 h-2 rounded-full mr-2',
                          bank.enabled ? 'bg-green-500' : 'bg-muted-foreground'
                        )}
                      />
                      {bank.bank} - {bank.accountNumber} ({bank.accountName})
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada rekening bank</p>
                )}
              </div>
            </div>

            {/* E-Wallets */}
            <div>
              <h4 className="text-sm font-medium mb-3">E-Wallet</h4>
              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                {formData.paymentMethods.eWallets.length > 0 ? (
                  formData.paymentMethods.eWallets.map((ewallet) => (
                    <p key={ewallet.id} className="text-sm">
                      <span
                        className={cn(
                          'inline-block w-2 h-2 rounded-full mr-2',
                          ewallet.enabled ? 'bg-green-500' : 'bg-muted-foreground'
                        )}
                      />
                      {ewallet.provider} - {ewallet.number}
                      {ewallet.name && ` (${ewallet.name})`}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada e-wallet</p>
                )}
              </div>
            </div>

            {/* COD */}
            <div>
              <h4 className="text-sm font-medium mb-3">COD (Bayar di Tempat)</h4>
              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Status:</span>{' '}
                  {formData.paymentMethods.cod.enabled ? 'Aktif' : 'Nonaktif'}
                </p>
                {formData.paymentMethods.cod.enabled && formData.paymentMethods.cod.note && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Catatan:</span>{' '}
                    {formData.paymentMethods.cod.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </PreviewModal>
    </div>
  );
}

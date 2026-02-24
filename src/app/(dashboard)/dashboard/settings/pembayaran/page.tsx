'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BankAccountDialog, EwalletDialog, PreviewModal } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { BankAccount, EWallet, PaymentMethods, PembayaranFormData } from '@/types';
import { StepCurrency, StepBank, StepEwallet, StepCod } from '@/components/settings/pembayaran-section';

// ─── Constants ─────────────────────────────────────────────────────────────
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

// ─── Steps ─────────────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Mata Uang & Pajak', desc: 'Konfigurasi mata uang dan tarif pajak' },
  { title: 'Rekening Bank', desc: 'Daftar rekening untuk transfer pembayaran' },
  { title: 'E-Wallet', desc: 'Daftar e-wallet untuk pembayaran digital' },
  { title: 'COD', desc: 'Pengaturan pembayaran tunai di tempat' },
] as const;

// ─── Step Indicator ────────────────────────────────────────────────────────
function StepIndicator({
  currentStep,
  onStepClick,
  size = 'sm',
}: {
  currentStep: number;
  onStepClick?: (i: number) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => i < currentStep && onStepClick?.(i)}
              className={cn(
                'flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none',
                size === 'lg' ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[11px]',
                i < currentStep
                  ? 'bg-primary text-primary-foreground cursor-pointer hover:opacity-75'
                  : i === currentStep
                    ? 'bg-primary text-primary-foreground ring-[3px] ring-primary/25 cursor-default'
                    : 'bg-muted text-muted-foreground/60 cursor-default'
              )}
            >
              {i < currentStep ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </button>
            {size === 'lg' && (
              <span className={cn(
                'text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors',
                i === currentStep ? 'text-foreground' : 'text-muted-foreground/60'
              )}>
                {step.title}
              </span>
            )}
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              'h-px mx-2 transition-colors duration-500',
              size === 'lg' ? 'w-10 mb-[22px]' : 'w-6',
              i < currentStep ? 'bg-primary' : 'bg-border'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function PembayaranPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<PembayaranFormData | null>(null);

  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [ewalletDialogOpen, setEwalletDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingEwallet, setEditingEwallet] = useState<EWallet | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        currency: tenant.currency || 'IDR',
        taxRate: tenant.taxRate || 0,
        paymentMethods: tenant.paymentMethods || DEFAULT_PAYMENT_METHODS,
      });
    }
  }, [tenant, formData]);

  // ─── Update helpers ───────────────────────────────────────────────────
  const handleCurrencyChange = (v: string) =>
    formData && setFormData({ ...formData, currency: v });

  const handleTaxRateChange = (v: string) =>
    formData && setFormData({ ...formData, taxRate: parseFloat(v) || 0 });

  const handleToggleCod = () =>
    formData && setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        cod: { ...formData.paymentMethods.cod, enabled: !formData.paymentMethods.cod.enabled },
      },
    });

  const handleCodNoteChange = (note: string) =>
    formData && setFormData({
      ...formData,
      paymentMethods: { ...formData.paymentMethods, cod: { ...formData.paymentMethods.cod, note } },
    });

  // ─── Bank helpers ─────────────────────────────────────────────────────
  const handleSaveBank = (bank: BankAccount) => {
    if (!formData) return;
    const exists = formData.paymentMethods.bankAccounts.find((b) => b.id === bank.id);
    const updated = exists
      ? formData.paymentMethods.bankAccounts.map((b) => b.id === bank.id ? bank : b)
      : [...formData.paymentMethods.bankAccounts, { ...bank, id: generateId() }];
    setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, bankAccounts: updated } });
    setBankDialogOpen(false);
    setEditingBank(null);
  };

  const handleDeleteBank = (id: string) =>
    formData && setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        bankAccounts: formData.paymentMethods.bankAccounts.filter((b) => b.id !== id),
      },
    });

  const handleToggleBank = (id: string) =>
    formData && setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        bankAccounts: formData.paymentMethods.bankAccounts.map((b) =>
          b.id === id ? { ...b, enabled: !b.enabled } : b),
      },
    });

  // ─── E-Wallet helpers ─────────────────────────────────────────────────
  const handleSaveEwallet = (ewallet: EWallet) => {
    if (!formData) return;
    const exists = formData.paymentMethods.eWallets.find((e) => e.id === ewallet.id);
    const updated = exists
      ? formData.paymentMethods.eWallets.map((e) => e.id === ewallet.id ? ewallet : e)
      : [...formData.paymentMethods.eWallets, { ...ewallet, id: generateId() }];
    setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, eWallets: updated } });
    setEwalletDialogOpen(false);
    setEditingEwallet(null);
  };

  const handleDeleteEwallet = (id: string) =>
    formData && setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        eWallets: formData.paymentMethods.eWallets.filter((e) => e.id !== id),
      },
    });

  const handleToggleEwallet = (id: string) =>
    formData && setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        eWallets: formData.paymentMethods.eWallets.map((e) =>
          e.id === id ? { ...e, enabled: !e.enabled } : e),
      },
    });

  // ─── Navigation ───────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    if (currentStep === 1 && formData.paymentMethods.bankAccounts.length === 0)
      toast.info('Tambahkan minimal 1 rekening bank untuk hasil lebih baik');
    if (currentStep === 2 && formData.paymentMethods.eWallets.length === 0)
      toast.info('Tambahkan minimal 1 e-wallet untuk hasil lebih baik');
  };

  const handleNext = () => {
    checkEmptyFields();
    if (currentStep < STEPS.length - 1) setCurrentStep((p) => p + 1);
    else setShowPreview(true);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  // ─── Save ─────────────────────────────────────────────────────────────
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
    } catch {
      toast.error('Gagal menyimpan pengaturan pembayaran');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null || formData === null;
  const isLastStep = currentStep === STEPS.length - 1;

  const bankProps = {
    formData: formData!,
    onAdd: () => { setEditingBank(null); setBankDialogOpen(true); },
    onEdit: (bank: BankAccount) => { setEditingBank(bank); setBankDialogOpen(true); },
    onDelete: handleDeleteBank,
    onToggle: handleToggleBank,
  };

  const ewalletProps = {
    formData: formData!,
    onAdd: () => { setEditingEwallet(null); setEwalletDialogOpen(true); },
    onEdit: (ew: EWallet) => { setEditingEwallet(ew); setEwalletDialogOpen(true); },
    onDelete: handleDeleteEwallet,
    onToggle: handleToggleEwallet,
  };

  return (
    <div className="h-full flex flex-col">

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

      {/* ══════════════════════════ LOADING ══════════════════════════ */}
      {isLoading ? (
        <div className="flex-1 space-y-6 py-6">
          <div className="hidden lg:flex items-center justify-between pb-6 border-b">
            <div className="space-y-2"><Skeleton className="h-7 w-44" /><Skeleton className="h-4 w-56" /></div>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  {i < 3 && <Skeleton className="w-10 h-px" />}
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="hidden lg:block h-[300px] w-full rounded-lg" />
          <div className="lg:hidden space-y-4">
            <div className="flex justify-center gap-2">{[0, 1, 2, 3].map(i => <Skeleton key={i} className="w-6 h-6 rounded-full" />)}</div>
            <Skeleton className="h-[260px] w-full max-w-sm mx-auto rounded-lg" />
          </div>
        </div>

      ) : (
        <>
          {/* ════════════════════════ DESKTOP ════════════════════════ */}
          <div className="hidden lg:flex lg:flex-col lg:h-full">

            {/* Header */}
            <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
              <div className="space-y-1">
                <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                  Langkah {currentStep + 1} / {STEPS.length}
                </p>
                <h2 className="text-2xl font-bold tracking-tight leading-none">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-sm text-muted-foreground pt-0.5">
                  {STEPS[currentStep].desc}
                </p>
              </div>
              <div className="shrink-0 pt-0.5">
                <StepIndicator
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="lg"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-[280px]">
              {currentStep === 0 && (
                <StepCurrency
                  formData={formData!}
                  onCurrencyChange={handleCurrencyChange}
                  onTaxRateChange={handleTaxRateChange}
                  isDesktop
                />
              )}
              {currentStep === 1 && <StepBank    {...bankProps} isDesktop />}
              {currentStep === 2 && <StepEwallet {...ewalletProps} isDesktop />}
              {currentStep === 3 && (
                <StepCod
                  formData={formData!}
                  onToggleCod={handleToggleCod}
                  onCodNoteChange={handleCodNoteChange}
                  isDesktop
                />
              )}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-6 border-t mt-8">
              <Button
                variant="outline" onClick={handlePrev}
                className={cn('gap-1.5 min-w-[130px] h-9 text-sm', currentStep === 0 && 'invisible')}
              >
                <ChevronLeft className="h-3.5 w-3.5" />Sebelumnya
              </Button>

              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className={cn(
                    'rounded-full transition-all duration-300',
                    i === currentStep ? 'w-5 h-1.5 bg-primary' : i < currentStep ? 'w-1.5 h-1.5 bg-primary/40' : 'w-1.5 h-1.5 bg-border'
                  )} />
                ))}
              </div>

              <Button onClick={handleNext} className="gap-1.5 min-w-[130px] h-9 text-sm">
                {isLastStep
                  ? <><Eye className="h-3.5 w-3.5" />Preview &amp; Simpan</>
                  : <>Selanjutnya<ChevronRight className="h-3.5 w-3.5" /></>
                }
              </Button>
            </div>
          </div>

          {/* ════════════════════════ MOBILE ════════════════════════ */}
          <div className="lg:hidden flex flex-col pb-24">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <StepIndicator
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="sm"
                />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                  Langkah {currentStep + 1} / {STEPS.length}
                </p>
                <h3 className="text-base font-bold tracking-tight">{STEPS[currentStep].title}</h3>
                <p className="text-xs text-muted-foreground">{STEPS[currentStep].desc}</p>
              </div>
            </div>
            <div className="min-h-[260px]">
              {currentStep === 0 && (
                <StepCurrency
                  formData={formData!}
                  onCurrencyChange={handleCurrencyChange}
                  onTaxRateChange={handleTaxRateChange}
                />
              )}
              {currentStep === 1 && <StepBank    {...bankProps} />}
              {currentStep === 2 && <StepEwallet {...ewalletProps} />}
              {currentStep === 3 && (
                <StepCod
                  formData={formData!}
                  onToggleCod={handleToggleCod}
                  onCodNoteChange={handleCodNoteChange}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
        <div className="bg-background/90 backdrop-blur-sm border-t px-4 py-3 flex items-center gap-2.5">
          <Button
            variant="outline" size="sm" onClick={handlePrev}
            className={cn('gap-1 flex-1 h-9 text-xs font-medium', currentStep === 0 && 'invisible')}
          >
            <ChevronLeft className="h-3.5 w-3.5" />Sebelumnya
          </Button>
          <Button size="sm" onClick={handleNext} className="gap-1 flex-1 h-9 text-xs font-medium">
            {isLastStep
              ? <><Eye className="h-3.5 w-3.5" />Preview</>
              : <>Selanjutnya<ChevronRight className="h-3.5 w-3.5" /></>
            }
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        isSaving={isSaving}
        title="Preview Pengaturan Pembayaran"
      >
        {formData && (
          <div className="space-y-5 mt-4">

            {/* Mata Uang & Pajak */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                Mata Uang &amp; Pajak
              </p>
              <div className="rounded-lg border p-4 bg-muted/20 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Mata Uang</p>
                  <p className="text-sm font-semibold">
                    {CURRENCY_OPTIONS.find((c) => c.value === formData.currency)?.label || formData.currency}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Tarif Pajak</p>
                  <p className="text-sm font-semibold">
                    {formData.taxRate > 0 ? `${formData.taxRate}%` : 'Tidak ada'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                Rekening Bank ({formData.paymentMethods.bankAccounts.length})
              </p>
              <div className="rounded-lg border p-4 bg-muted/20 space-y-2">
                {formData.paymentMethods.bankAccounts.length === 0
                  ? <p className="text-sm text-muted-foreground">Belum ada rekening bank</p>
                  : formData.paymentMethods.bankAccounts.map((bank) => (
                    <div key={bank.id} className="flex items-center gap-2.5">
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', bank.enabled ? 'bg-primary' : 'bg-muted-foreground/30')} />
                      <p className="text-sm font-medium">{bank.bank}</p>
                      <p className="text-xs text-muted-foreground">{bank.accountNumber} · {bank.accountName}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* E-Wallet */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                E-Wallet ({formData.paymentMethods.eWallets.length})
              </p>
              <div className="rounded-lg border p-4 bg-muted/20 space-y-2">
                {formData.paymentMethods.eWallets.length === 0
                  ? <p className="text-sm text-muted-foreground">Belum ada e-wallet</p>
                  : formData.paymentMethods.eWallets.map((ew) => (
                    <div key={ew.id} className="flex items-center gap-2.5">
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', ew.enabled ? 'bg-primary' : 'bg-muted-foreground/30')} />
                      <p className="text-sm font-medium">{ew.provider}</p>
                      <p className="text-xs text-muted-foreground">{ew.number}{ew.name && ` · ${ew.name}`}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* COD */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">COD</p>
              <div className="rounded-lg border p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('w-1.5 h-1.5 rounded-full', formData.paymentMethods.cod.enabled ? 'bg-primary' : 'bg-muted-foreground/30')} />
                  <p className="text-sm font-medium">
                    {formData.paymentMethods.cod.enabled ? 'Aktif' : 'Nonaktif'}
                  </p>
                </div>
                {formData.paymentMethods.cod.enabled && formData.paymentMethods.cod.note && (
                  <p className="text-xs text-muted-foreground pl-4">{formData.paymentMethods.cod.note}</p>
                )}
              </div>
            </div>

          </div>
        )}
      </PreviewModal>
    </div>
  );
}
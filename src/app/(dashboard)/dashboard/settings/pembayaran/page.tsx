'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { BankAccount, EWallet, PaymentMethods, PembayaranFormData } from '@/types';
import {
  StepCurrency,
  StepBank,
  StepEwallet,
  StepCod,
  BankAccountDialog,
  EwalletDialog,
  PaymentPreview,
} from '@/components/settings/pembayaran-section';

// ─── Constants ─────────────────────────────────────────────────────────────
const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  bankAccounts: [],
  eWallets: [],
  cod: { enabled: false, note: '' },
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// ─── Steps ─────────────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Currency & Tax', desc: 'Store currency and tax rate' },
  { title: 'Bank Accounts', desc: 'Accounts for bank transfer payments' },
  { title: 'E-Wallets', desc: 'Digital wallet payment options' },
  { title: 'Cash on Delivery', desc: 'Pay on delivery settings' },
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
      toast.info('Add at least 1 bank account for best results');
    if (currentStep === 2 && formData.paymentMethods.eWallets.length === 0)
      toast.info('Add at least 1 e-wallet for best results');
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
      toast.success('Payment settings saved successfully');
      setShowPreview(false);
    } catch {
      toast.error('Failed to save payment settings');
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

      {/* ── Dialogs ───────────────────────────────────────────────── */}
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
            <div className="space-y-2">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  {i < 3 && <Skeleton className="w-10 h-px" />}
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="hidden lg:block h-[300px] w-full rounded-lg" />
          <div className="lg:hidden space-y-4">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="w-6 h-6 rounded-full" />)}
            </div>
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
                  Step {currentStep + 1} of {STEPS.length}
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
                variant="outline"
                onClick={handlePrev}
                className={cn('gap-1.5 min-w-[130px] h-9 text-sm', currentStep === 0 && 'invisible')}
              >
                <ChevronLeft className="h-3.5 w-3.5" />Previous
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
                  ? <><Eye className="h-3.5 w-3.5" />Preview &amp; Save</>
                  : <>Next<ChevronRight className="h-3.5 w-3.5" /></>
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
                  Step {currentStep + 1} of {STEPS.length}
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

      {/* ── Mobile bottom nav ─────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
        <div className="bg-background/90 backdrop-blur-sm border-t px-4 py-3 flex items-center gap-2.5">
          <Button
            variant="outline" size="sm" onClick={handlePrev}
            className={cn('gap-1 flex-1 h-9 text-xs font-medium', currentStep === 0 && 'invisible')}
          >
            <ChevronLeft className="h-3.5 w-3.5" />Previous
          </Button>
          <Button size="sm" onClick={handleNext} className="gap-1 flex-1 h-9 text-xs font-medium">
            {isLastStep
              ? <><Eye className="h-3.5 w-3.5" />Preview</>
              : <>Next<ChevronRight className="h-3.5 w-3.5" /></>
            }
          </Button>
        </div>
      </div>

      {/* ── Payment Preview ───────────────────────────────────────── */}
      {formData && (
        <PaymentPreview
          open={showPreview}
          onClose={() => setShowPreview(false)}
          onSave={handleSave}
          isSaving={isSaving}
          formData={formData}
        />
      )}

    </div>
  );
}
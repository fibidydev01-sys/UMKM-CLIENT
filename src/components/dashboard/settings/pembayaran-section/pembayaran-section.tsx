'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AutoSaveStatus, StepIndicator, StepDots } from '@/components/dashboard/settings/shared';
import { toast } from 'sonner';
import { useTenant, useAutoSave } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/shared/utils';
import type { BankAccount, EWallet, PaymentMethods, PembayaranFormData } from '@/types';
import { StepBank, StepEwallet, StepCod, BankAccountDialog, EwalletDialog, PaymentPreview } from '.';

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  bankAccounts: [],
  eWallets: [],
  cod: { enabled: false, note: '' },
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const STEPS = [
  { title: 'Bank Accounts', desc: 'Accounts for bank transfer payments' },
  { title: 'E-Wallets', desc: 'Digital wallet payment options' },
  { title: 'Cash on Delivery', desc: 'Pay on delivery settings' },
] as const;

export function PembayaranSection() {
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
        paymentMethods: tenant.paymentMethods || DEFAULT_PAYMENT_METHODS,
      });
    }
  }, [tenant, formData]);

  const { status: autoSaveStatus } = useAutoSave(formData);

  const handleToggleCod = () =>
    formData && setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, cod: { ...formData.paymentMethods.cod, enabled: !formData.paymentMethods.cod.enabled } } });

  const handleCodNoteChange = (note: string) =>
    formData && setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, cod: { ...formData.paymentMethods.cod, note } } });

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
    formData && setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, bankAccounts: formData.paymentMethods.bankAccounts.filter((b) => b.id !== id) } });

  const handleToggleBank = (id: string) =>
    formData && setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, bankAccounts: formData.paymentMethods.bankAccounts.map((b) => b.id === id ? { ...b, enabled: !b.enabled } : b) } });

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
    formData && setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, eWallets: formData.paymentMethods.eWallets.filter((e) => e.id !== id) } });

  const handleToggleEwallet = (id: string) =>
    formData && setFormData({ ...formData, paymentMethods: { ...formData.paymentMethods, eWallets: formData.paymentMethods.eWallets.map((e) => e.id === id ? { ...e, enabled: !e.enabled } : e) } });

  const checkEmptyFields = () => {
    if (!formData) return;
    if (currentStep === 0 && formData.paymentMethods.bankAccounts.length === 0)
      toast.info('Add at least 1 bank account for best results');
    if (currentStep === 1 && formData.paymentMethods.eWallets.length === 0)
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

  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({ paymentMethods: formData.paymentMethods });
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

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">

        {/* ── DESKTOP SKELETON ─────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:flex-col lg:h-full">

          {/* Header row */}
          <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-40 rounded-md" />
            </div>
            <div className="shrink-0 pt-0.5 flex items-start">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-[11px] w-20 rounded-full" />
                  </div>
                  {i < 2 && <Skeleton className="w-14 h-px mx-2 mt-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 min-h-[280px] pb-20">
            <div className="space-y-5 max-w-xl">
              <div className="flex items-center justify-between">
                <Skeleton className="h-[11px] w-28 rounded-full" />
                <Skeleton className="h-8 w-36 rounded-md" />
              </div>
              <Skeleton className="h-[176px] w-full rounded-lg" />
              <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
                <Skeleton className="h-[11px] w-64 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE SKELETON ──────────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col pb-24">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    {i < 2 && <Skeleton className="w-8 h-px mx-2" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-14 rounded-full" />
              </div>
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
          </div>
          <div className="min-h-[260px] flex flex-col items-center gap-4">
            <Skeleton className="h-8 w-36 rounded-md" />
            <Skeleton className="h-[176px] w-full max-w-sm rounded-lg" />
          </div>
        </div>

        {/* ── FIXED BOTTOM DESKTOP */}
        <div
          className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-between px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
          style={{ left: 'var(--sidebar-width)' }}
        >
          <div className="min-w-[130px] h-9 invisible" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
          </div>
          <Skeleton className="min-w-[130px] h-9 rounded-md" />
        </div>

        {/* ── FIXED BOTTOM MOBILE */}
        <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="h-9 w-9 invisible" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-5 h-1.5 rounded-full" />
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">

      <BankAccountDialog open={bankDialogOpen} onOpenChange={setBankDialogOpen} bank={editingBank} onSave={handleSaveBank} />
      <EwalletDialog open={ewalletDialogOpen} onOpenChange={setEwalletDialogOpen} ewallet={editingEwallet} onSave={handleSaveEwallet} />

      {/* DESKTOP */}
      <div className="hidden lg:flex lg:flex-col lg:h-full">
        <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
          <div className="space-y-1">
            <AutoSaveStatus status={autoSaveStatus} />
            <h2 className="text-2xl font-bold tracking-tight leading-none">
              {STEPS[currentStep].title}
            </h2>
          </div>
          <div className="shrink-0 pt-0.5">
            <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} size="lg" />
          </div>
        </div>

        <div className="flex-1 min-h-[280px] pb-20">
          {currentStep === 0 && <StepBank {...bankProps} isDesktop />}
          {currentStep === 1 && <StepEwallet {...ewalletProps} isDesktop />}
          {currentStep === 2 && <StepCod formData={formData!} onToggleCod={handleToggleCod} onCodNoteChange={handleCodNoteChange} isDesktop />}
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden flex flex-col pb-24">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} size="sm" />
          </div>
          <div className="text-center space-y-0.5">
            <div className="flex justify-center">
              <AutoSaveStatus status={autoSaveStatus} />
            </div>
            <h3 className="text-base font-bold tracking-tight">{STEPS[currentStep].title}</h3>
          </div>
        </div>
        <div className="min-h-[260px]">
          {currentStep === 0 && <StepBank {...bankProps} />}
          {currentStep === 1 && <StepEwallet {...ewalletProps} />}
          {currentStep === 2 && <StepCod formData={formData!} onToggleCod={handleToggleCod} onCodNoteChange={handleCodNoteChange} />}
        </div>
      </div>

      {/* Desktop - fixed bottom */}
      <div
        className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-between px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
        style={{ left: 'var(--sidebar-width)' }}
      >
        <Button variant="outline" onClick={handlePrev} className={cn('gap-1.5 min-w-[130px] h-9 text-sm', currentStep === 0 && 'invisible')}>
          <ChevronLeft className="h-3.5 w-3.5" />Previous
        </Button>
        <StepDots steps={STEPS} currentStep={currentStep} />
        <Button onClick={handleNext} className="gap-1.5 min-w-[130px] h-9 text-sm">
          {isLastStep ? <><Eye className="h-3.5 w-3.5" />Preview &amp; Save</> : <>Next<ChevronRight className="h-3.5 w-3.5" /></>}
        </Button>
      </div>

      {/* Mobile - fixed bottom */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <Button variant="outline" size="icon" onClick={handlePrev} className={cn('h-9 w-9 shrink-0', currentStep === 0 && 'invisible')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <StepDots steps={STEPS} currentStep={currentStep} />
          {isLastStep ? (
            <Button size="sm" onClick={handleNext} className="h-9 px-4 text-xs font-medium shrink-0">Preview</Button>
          ) : (
            <Button size="icon" onClick={handleNext} className="h-9 w-9 shrink-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {formData && (
        <PaymentPreview open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} formData={formData} />
      )}
    </div>
  );
}
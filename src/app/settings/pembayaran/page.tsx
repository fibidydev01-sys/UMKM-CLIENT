/**
 * ============================================================================
 * FILE: app/settings/pembayaran/page.tsx
 * ============================================================================
 * Route: /settings/pembayaran
 * Description: Payment methods and currency settings
 * ============================================================================
 */
'use client';

import { useState, useEffect } from 'react';
import { PaymentSettings, BankAccountDialog, EwalletDialog } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { BankAccount, EWallet, PaymentMethods } from '@/types';

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  bankAccounts: [],
  eWallets: [],
  cod: { enabled: false, note: '' },
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function PembayaranPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);

  // Dialog states
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [ewalletDialogOpen, setEwalletDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingEwallet, setEditingEwallet] = useState<EWallet | null>(null);

  const [paymentSettings, setPaymentSettings] = useState<{
    currency: string;
    taxRate: number;
    paymentMethods: PaymentMethods;
  } | null>(null);

  // Initialize form data from tenant
  useEffect(() => {
    if (tenant && paymentSettings === null) {
      setPaymentSettings({
        currency: tenant.currency || 'IDR',
        taxRate: tenant.taxRate || 0,
        paymentMethods: tenant.paymentMethods || DEFAULT_PAYMENT_METHODS,
      });
    }
  }, [tenant, paymentSettings]);

  const handleSave = async () => {
    if (!tenant || !paymentSettings) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        currency: paymentSettings.currency,
        taxRate: paymentSettings.taxRate,
        paymentMethods: paymentSettings.paymentMethods,
      });
      await refresh();
      toast.success('Pengaturan pembayaran berhasil disimpan');
    } catch (error) {
      console.error('Failed to save payment settings:', error);
      toast.error('Gagal menyimpan pengaturan pembayaran');
    } finally {
      setIsSaving(false);
    }
  };

  // Payment Methods Handlers
  const handleSaveBank = (bank: BankAccount) => {
    if (!paymentSettings) return;
    const existing = paymentSettings.paymentMethods.bankAccounts.find((b) => b.id === bank.id);
    let updatedBanks: BankAccount[];

    if (existing) {
      updatedBanks = paymentSettings.paymentMethods.bankAccounts.map((b) =>
        b.id === bank.id ? bank : b
      );
    } else {
      updatedBanks = [
        ...paymentSettings.paymentMethods.bankAccounts,
        { ...bank, id: generateId() },
      ];
    }

    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: { ...paymentSettings.paymentMethods, bankAccounts: updatedBanks },
    });
    setBankDialogOpen(false);
    setEditingBank(null);
  };

  const handleDeleteBank = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        bankAccounts: paymentSettings.paymentMethods.bankAccounts.filter((b) => b.id !== id),
      },
    });
  };

  const handleToggleBank = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        bankAccounts: paymentSettings.paymentMethods.bankAccounts.map((b) =>
          b.id === id ? { ...b, enabled: !b.enabled } : b
        ),
      },
    });
  };

  const handleSaveEwallet = (ewallet: EWallet) => {
    if (!paymentSettings) return;
    const existing = paymentSettings.paymentMethods.eWallets.find((e) => e.id === ewallet.id);
    let updatedEwallets: EWallet[];

    if (existing) {
      updatedEwallets = paymentSettings.paymentMethods.eWallets.map((e) =>
        e.id === ewallet.id ? ewallet : e
      );
    } else {
      updatedEwallets = [
        ...paymentSettings.paymentMethods.eWallets,
        { ...ewallet, id: generateId() },
      ];
    }

    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: { ...paymentSettings.paymentMethods, eWallets: updatedEwallets },
    });
    setEwalletDialogOpen(false);
    setEditingEwallet(null);
  };

  const handleDeleteEwallet = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        eWallets: paymentSettings.paymentMethods.eWallets.filter((e) => e.id !== id),
      },
    });
  };

  const handleToggleEwallet = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        eWallets: paymentSettings.paymentMethods.eWallets.map((e) =>
          e.id === id ? { ...e, enabled: !e.enabled } : e
        ),
      },
    });
  };

  const tenantLoading = tenant === null;

  return (
    <>
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

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Metode Pembayaran</h1>
        <p className="text-muted-foreground mt-2">
          Kelola metode pembayaran, mata uang, dan pajak untuk toko Anda.
        </p>
      </div>

      {/* Content */}
      <PaymentSettings
        settings={paymentSettings}
        isLoading={tenantLoading}
        isSaving={isSaving}
        onSettingsChange={setPaymentSettings}
        onSave={handleSave}
        onAddBank={() => {
          setEditingBank(null);
          setBankDialogOpen(true);
        }}
        onEditBank={(bank) => {
          setEditingBank(bank);
          setBankDialogOpen(true);
        }}
        onDeleteBank={handleDeleteBank}
        onToggleBank={handleToggleBank}
        onAddEwallet={() => {
          setEditingEwallet(null);
          setEwalletDialogOpen(true);
        }}
        onEditEwallet={(ewallet) => {
          setEditingEwallet(ewallet);
          setEwalletDialogOpen(true);
        }}
        onDeleteEwallet={handleDeleteEwallet}
        onToggleEwallet={handleToggleEwallet}
      />
    </>
  );
}

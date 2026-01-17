/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/settings/page.tsx
 * ============================================================================
 * Route: /dashboard/settings
 * Description: Settings page orchestrator - manages state and delegates to components
 * Refactored: January 2026
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/dashboard';
import {
  SettingsNav,
  StoreInfoForm,
  AppearanceSettings,
  PaymentSettings,
  ShippingSettings,
  SeoSettings,
  BankAccountDialog,
  EwalletDialog,
} from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type {
  BankAccount,
  EWallet,
  PaymentMethods,
  ShippingMethods,
  SocialLinks,
  CourierName,
} from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

const COURIER_OPTIONS: CourierName[] = [
  'JNE',
  'J&T Express',
  'SiCepat',
  'AnterAja',
  'Ninja Express',
  'ID Express',
  'SAP Express',
  'Lion Parcel',
  'Pos Indonesia',
  'TIKI',
  'Other',
];

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  bankAccounts: [],
  eWallets: [],
  cod: { enabled: false, note: '' },
};

const DEFAULT_SHIPPING_METHODS: ShippingMethods = {
  couriers: COURIER_OPTIONS.slice(0, 5).map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name,
    enabled: index < 2,
    note: '',
  })),
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SettingsPage() {
  // ---------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------
  const { tenant, refresh } = useTenant();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('store');
  const [sheetOpen, setSheetOpen] = useState(false);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [isRemovingBanner, setIsRemovingBanner] = useState(false);

  // Dialog states
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [ewalletDialogOpen, setEwalletDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingEwallet, setEditingEwallet] = useState<EWallet | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    phone: string;
    address: string;
    logo: string | undefined;
    banner: string | undefined;
    primaryColor: string;
  } | null>(null);

  const [paymentSettings, setPaymentSettings] = useState<{
    currency: string;
    taxRate: number;
    paymentMethods: PaymentMethods;
  } | null>(null);

  const [shippingSettings, setShippingSettings] = useState<{
    freeShippingThreshold: number | null;
    defaultShippingCost: number;
    shippingMethods: ShippingMethods;
  } | null>(null);

  const [seoSettings, setSeoSettings] = useState<{
    metaTitle: string;
    metaDescription: string;
    socialLinks: SocialLinks;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // Initialize form data from tenant
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (tenant && formData === null) {
      const themeData = tenant.theme as { primaryColor?: string } | null;
      setFormData({
        name: tenant.name || '',
        description: tenant.description || '',
        phone: tenant.phone || '',
        address: tenant.address || '',
        logo: tenant.logo || undefined,
        banner: tenant.banner || undefined,
        primaryColor: themeData?.primaryColor || THEME_COLORS[0].value,
      });
    }
  }, [tenant, formData]);

  useEffect(() => {
    if (tenant && paymentSettings === null) {
      setPaymentSettings({
        currency: tenant.currency || 'IDR',
        taxRate: tenant.taxRate || 0,
        paymentMethods: tenant.paymentMethods || DEFAULT_PAYMENT_METHODS,
      });
    }
  }, [tenant, paymentSettings]);

  useEffect(() => {
    if (tenant && shippingSettings === null) {
      setShippingSettings({
        freeShippingThreshold: tenant.freeShippingThreshold ?? null,
        defaultShippingCost: tenant.defaultShippingCost || 0,
        shippingMethods: tenant.shippingMethods || DEFAULT_SHIPPING_METHODS,
      });
    }
  }, [tenant, shippingSettings]);

  useEffect(() => {
    if (tenant && seoSettings === null) {
      setSeoSettings({
        metaTitle: tenant.metaTitle || '',
        metaDescription: tenant.metaDescription || '',
        socialLinks: tenant.socialLinks || {},
      });
    }
  }, [tenant, seoSettings]);

  const tenantLoading = tenant === null;

  // ---------------------------------------------------------------------------
  // Tab Navigation Handlers
  // ---------------------------------------------------------------------------
  const handleTabChange = useCallback(
    (newTab: string) => {
      setActiveTab(newTab);
      setSheetOpen(false);
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Save Handlers
  // ---------------------------------------------------------------------------
  const handleSaveStore = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        name: formData.name || undefined,
        description: formData.description || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });
      await refresh();
      toast.success('Informasi toko berhasil disimpan');
    } catch (error) {
      console.error('Failed to save store settings:', error);
      toast.error('Gagal menyimpan informasi toko');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    if (!tenant || !formData) return;
    setIsSavingAppearance(true);
    try {
      await tenantsApi.update({
        logo: formData.logo || undefined,
        banner: formData.banner || undefined,
        theme: { primaryColor: formData.primaryColor },
      });
      await refresh();
      toast.success('Tampilan toko berhasil disimpan');
    } catch (error) {
      console.error('Failed to save appearance:', error);
      toast.error('Gagal menyimpan tampilan toko');
    } finally {
      setIsSavingAppearance(false);
    }
  };

  const handleSavePayment = async () => {
    if (!tenant || !paymentSettings) return;
    setIsSavingPayment(true);
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
      setIsSavingPayment(false);
    }
  };

  const handleSaveShipping = async () => {
    if (!tenant || !shippingSettings) return;
    setIsSavingShipping(true);
    try {
      await tenantsApi.update({
        freeShippingThreshold: shippingSettings.freeShippingThreshold,
        defaultShippingCost: shippingSettings.defaultShippingCost,
        shippingMethods: shippingSettings.shippingMethods,
      });
      await refresh();
      toast.success('Pengaturan pengiriman berhasil disimpan');
    } catch (error) {
      console.error('Failed to save shipping settings:', error);
      toast.error('Gagal menyimpan pengaturan pengiriman');
    } finally {
      setIsSavingShipping(false);
    }
  };

  const handleSaveSeo = async () => {
    if (!tenant || !seoSettings) return;
    setIsSavingSeo(true);
    try {
      await tenantsApi.update({
        metaTitle: seoSettings.metaTitle || undefined,
        metaDescription: seoSettings.metaDescription || undefined,
        socialLinks: seoSettings.socialLinks,
      });
      await refresh();
      toast.success('Pengaturan SEO berhasil disimpan');
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      toast.error('Gagal menyimpan pengaturan SEO');
    } finally {
      setIsSavingSeo(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!tenant || !formData) return;
    setIsRemovingLogo(true);
    try {
      setFormData({ ...formData, logo: undefined });
      await tenantsApi.update({ logo: '' });
      await refresh();
      toast.success('Logo berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove logo:', error);
      toast.error('Gagal menghapus logo');
      setFormData({ ...formData, logo: tenant.logo || undefined });
    } finally {
      setIsRemovingLogo(false);
    }
  };

  const handleRemoveBanner = async () => {
    if (!tenant || !formData) return;
    setIsRemovingBanner(true);
    try {
      setFormData({ ...formData, banner: undefined });
      await tenantsApi.update({ banner: '' });
      await refresh();
      toast.success('Banner berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove banner:', error);
      toast.error('Gagal menghapus banner');
      setFormData({ ...formData, banner: tenant.banner || undefined });
    } finally {
      setIsRemovingBanner(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Payment Methods Handlers
  // ---------------------------------------------------------------------------
  const handleSaveBank = (bank: BankAccount) => {
    if (!paymentSettings) return;
    const existing = paymentSettings.paymentMethods.bankAccounts.find((b) => b.id === bank.id);
    let updatedBanks: BankAccount[];

    if (existing) {
      updatedBanks = paymentSettings.paymentMethods.bankAccounts.map((b) =>
        b.id === bank.id ? bank : b
      );
    } else {
      updatedBanks = [...paymentSettings.paymentMethods.bankAccounts, { ...bank, id: generateId() }];
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

  // ---------------------------------------------------------------------------
  // Form Data Helpers
  // ---------------------------------------------------------------------------
  const updateFormData = (
    key: 'name' | 'description' | 'phone' | 'address',
    value: string
  ) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div>
      <PageHeader
        title="Pengaturan"
        description="Kelola pengaturan toko dan preferensi Anda"
      />

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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        {/* Navigation */}
        <SettingsNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          sheetOpen={sheetOpen}
          onSheetOpenChange={setSheetOpen}
        />

        {/* Tab: Store Info */}
        <TabsContent value="store" className="mt-6">
          <StoreInfoForm
            formData={formData ? { name: formData.name, description: formData.description, phone: formData.phone, address: formData.address } : null}
            tenantEmail={tenant?.email}
            tenantSlug={tenant?.slug}
            isLoading={tenantLoading}
            isSaving={isSaving}
            onFormChange={updateFormData}
            onSave={handleSaveStore}
          />
        </TabsContent>

        {/* Tab: Payment */}
        <TabsContent value="payment" className="mt-6">
          <PaymentSettings
            settings={paymentSettings}
            isLoading={tenantLoading}
            isSaving={isSavingPayment}
            onSettingsChange={setPaymentSettings}
            onSave={handleSavePayment}
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
        </TabsContent>

        {/* Tab: Shipping */}
        <TabsContent value="shipping" className="mt-6">
          <ShippingSettings
            settings={shippingSettings}
            isLoading={tenantLoading}
            isSaving={isSavingShipping}
            onSettingsChange={setShippingSettings}
            onSave={handleSaveShipping}
          />
        </TabsContent>

        {/* Tab: Appearance */}
        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings
            formData={formData ? { logo: formData.logo, banner: formData.banner, primaryColor: formData.primaryColor } : null}
            isLoading={tenantLoading}
            isSaving={isSavingAppearance}
            isRemovingLogo={isRemovingLogo}
            isRemovingBanner={isRemovingBanner}
            onLogoChange={(url) => formData && setFormData({ ...formData, logo: url })}
            onBannerChange={(url) => formData && setFormData({ ...formData, banner: url })}
            onColorChange={(color) => formData && setFormData({ ...formData, primaryColor: color })}
            onRemoveLogo={handleRemoveLogo}
            onRemoveBanner={handleRemoveBanner}
            onSave={handleSaveAppearance}
          />
        </TabsContent>

        {/* Tab: SEO */}
        <TabsContent value="seo" className="mt-6">
          <SeoSettings
            settings={seoSettings}
            tenantName={tenant?.name}
            tenantSlug={tenant?.slug}
            tenantDescription={tenant?.description}
            isLoading={tenantLoading}
            isSaving={isSavingSeo}
            onSettingsChange={setSeoSettings}
            onSave={handleSaveSeo}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
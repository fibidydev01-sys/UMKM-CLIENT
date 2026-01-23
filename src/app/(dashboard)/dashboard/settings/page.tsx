/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/settings/page.tsx
 * ============================================================================
 * Route: /dashboard/settings
 * Description: Settings page with navigation to subsections
 * Updated: January 2026
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ChevronRight, Megaphone, Info, MessageSquareQuote, Phone, Zap, Paintbrush } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard';
import {
  SettingsNav,
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

// Store Info Sections Navigation
const STORE_SECTIONS = [
  {
    id: 'hero-section',
    title: 'Hero Section',
    description: 'Banner utama dan branding toko',
    icon: Megaphone,
    href: '/dashboard/settings/hero-section',
  },
  {
    id: 'about',
    title: 'About',
    description: 'Tentang toko dan fitur unggulan',
    icon: Info,
    href: '/dashboard/settings/about',
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Testimoni pelanggan',
    icon: MessageSquareQuote,
    href: '/dashboard/settings/testimonials',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Informasi kontak dan lokasi',
    icon: Phone,
    href: '/dashboard/settings/contact',
  },
  {
    id: 'cta',
    title: 'Call to Action',
    description: 'Ajakan untuk mengambil tindakan',
    icon: Zap,
    href: '/dashboard/settings/cta',
  },
  {
    id: 'landing-builder',
    title: 'Landing Builder',
    description: 'Desain dan customize landing page',
    icon: Paintbrush,
    href: '/landing-builder',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SettingsPage() {
  const router = useRouter();

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
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [isSavingSeo, setIsSavingSeo] = useState(false);

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

        {/* Tab: Store Info - Navigation Cards */}
        <TabsContent value="store" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>
                Kelola informasi toko dan konten landing page. Semua data disimpan ke database yang sama.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {STORE_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Card
                      key={section.id}
                      className="group cursor-pointer hover:border-primary hover:shadow-md transition-all"
                      onClick={() => router.push(section.href)}
                    >
                      <CardContent className="flex items-start gap-4 p-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                            {section.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {section.description}
                          </p>
                        </div>
                        <ChevronRight className="flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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

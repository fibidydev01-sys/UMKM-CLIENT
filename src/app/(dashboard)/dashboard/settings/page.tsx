/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/settings/page.tsx
 * ============================================================================
 * Route: /dashboard/settings
 * Description: Complete store settings with Payment, Shipping, SEO tabs
 * ============================================================================
 */
'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Store,
  CreditCard,
  Truck,
  Palette,
  Save,
  Layout,
  Loader2,
  Check,
  Moon,
  Sun,
  Menu,
  Plus,
  Trash2,
  Building2,
  Wallet,
  Banknote,
  Globe,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/dashboard';
import { LandingBuilder } from '@/components/landing';
import { ImageUpload } from '@/components/upload';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { DEFAULT_LANDING_CONFIG } from '@/types/landing';
import type {
  TenantLandingConfig,
  BankAccount,
  EWallet,
  PaymentMethods,
  ShippingMethods,
  SocialLinks,
  BankName,
  EWalletProvider,
  CourierName,
  Testimonial,
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

const SETTINGS_MENU = [
  { key: 'store', label: 'Toko', icon: Store },
  { key: 'landing', label: 'Landing', icon: Layout },
  { key: 'payment', label: 'Pembayaran', icon: CreditCard },
  { key: 'shipping', label: 'Pengiriman', icon: Truck },
  { key: 'appearance', label: 'Tampilan', icon: Palette },
  { key: 'seo', label: 'SEO', icon: Search },
] as const;

const BANK_OPTIONS: BankName[] = ['BCA', 'Mandiri', 'BNI', 'BRI', 'BSI', 'CIMB', 'Permata', 'Danamon', 'Other'];
const EWALLET_OPTIONS: EWalletProvider[] = ['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja', 'Other'];
const COURIER_OPTIONS: CourierName[] = ['JNE', 'J&T Express', 'SiCepat', 'AnterAja', 'Ninja Express', 'ID Express', 'SAP Express', 'Lion Parcel', 'Pos Indonesia', 'TIKI', 'Other'];
const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'IDR - Rupiah Indonesia' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
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

// ============================================================================
// HELPER: Generate unique ID
// ============================================================================
const generateId = () => Math.random().toString(36).substring(2, 9);

// ============================================================================
// HELPER: Extract and normalize testimonial items (FIXED!)
// ============================================================================
const extractTestimonialItems = (items: unknown): Testimonial[] => {
  if (!items) return [];

  let normalizedItems = items;

  // Handle nested array bug [[item]] -> [item]
  let depth = 0;
  while (
    Array.isArray(normalizedItems) &&
    normalizedItems.length > 0 &&
    Array.isArray(normalizedItems[0])
  ) {
    normalizedItems = normalizedItems[0];
    depth++;
    if (depth > 10) {
      console.error('[extractTestimonialItems] Too many nested arrays!');
      return [];
    }
  }

  if (!Array.isArray(normalizedItems)) return [];

  return (normalizedItems as Testimonial[]).filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      item.name.trim() &&
      typeof item.content === 'string' &&
      item.content.trim()
  );
};

// ============================================================================
// HELPER: Deep merge landing config (FIXED!)
// ============================================================================
function deepMergeLandingConfig(
  defaults: TenantLandingConfig,
  tenant?: Partial<TenantLandingConfig> | null
): TenantLandingConfig {
  if (!tenant) {
    return defaults;
  }

  // Get testimonial items from tenant with proper extraction
  const tenantTestimonialItems = extractTestimonialItems(tenant.testimonials?.config?.items);
  const defaultTestimonialItems = extractTestimonialItems(defaults.testimonials?.config?.items);

  // Use tenant items if available, otherwise default
  const finalTestimonialItems = tenantTestimonialItems.length > 0
    ? tenantTestimonialItems
    : defaultTestimonialItems;

  const result: TenantLandingConfig = {
    enabled: tenant.enabled ?? defaults.enabled,
    hero: {
      enabled: tenant.hero?.enabled ?? defaults.hero?.enabled ?? false,
      title: tenant.hero?.title ?? defaults.hero?.title,
      subtitle: tenant.hero?.subtitle ?? defaults.hero?.subtitle,
      config: {
        ...(defaults.hero?.config || {}),
        ...(tenant.hero?.config || {}),
      },
    },
    about: {
      enabled: tenant.about?.enabled ?? defaults.about?.enabled ?? false,
      title: tenant.about?.title ?? defaults.about?.title,
      subtitle: tenant.about?.subtitle ?? defaults.about?.subtitle,
      config: {
        ...(defaults.about?.config || {}),
        ...(tenant.about?.config || {}),
      },
    },
    products: {
      enabled: tenant.products?.enabled ?? defaults.products?.enabled ?? false,
      title: tenant.products?.title ?? defaults.products?.title,
      subtitle: tenant.products?.subtitle ?? defaults.products?.subtitle,
      config: {
        ...(defaults.products?.config || {}),
        ...(tenant.products?.config || {}),
      },
    },
    testimonials: {
      enabled: tenant.testimonials?.enabled ?? defaults.testimonials?.enabled ?? false,
      title: tenant.testimonials?.title ?? defaults.testimonials?.title,
      subtitle: tenant.testimonials?.subtitle ?? defaults.testimonials?.subtitle,
      config: {
        items: finalTestimonialItems,
      },
    },
    contact: {
      enabled: tenant.contact?.enabled ?? defaults.contact?.enabled ?? false,
      title: tenant.contact?.title ?? defaults.contact?.title,
      subtitle: tenant.contact?.subtitle ?? defaults.contact?.subtitle,
      config: {
        ...(defaults.contact?.config || {}),
        ...(tenant.contact?.config || {}),
      },
    },
    cta: {
      enabled: tenant.cta?.enabled ?? defaults.cta?.enabled ?? false,
      title: tenant.cta?.title ?? defaults.cta?.title,
      subtitle: tenant.cta?.subtitle ?? defaults.cta?.subtitle,
      config: {
        ...(defaults.cta?.config || {}),
        ...(tenant.cta?.config || {}),
      },
    },
  };

  return result;
}

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
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
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

  // Form state for basic store info
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    phone: string;
    address: string;
    logo: string | undefined;
    banner: string | undefined;
    primaryColor: string;
  } | null>(null);

  // Landing config state
  const [landingConfig, setLandingConfig] = useState<TenantLandingConfig | null>(null);
  const savedLandingConfigRef = useRef<TenantLandingConfig | null>(null);
  const [landingInitialized, setLandingInitialized] = useState(false);

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState<{
    currency: string;
    taxRate: number;
    paymentMethods: PaymentMethods;
  } | null>(null);

  // Shipping settings state
  const [shippingSettings, setShippingSettings] = useState<{
    freeShippingThreshold: number | null;
    defaultShippingCost: number;
    shippingMethods: ShippingMethods;
  } | null>(null);

  // SEO settings state
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

  // Initialize landing config with DEEP MERGE
  useEffect(() => {
    if (tenant && !landingInitialized) {
      const initialConfig = deepMergeLandingConfig(
        DEFAULT_LANDING_CONFIG,
        tenant.landingConfig
      );
      setLandingConfig(initialConfig);
      savedLandingConfigRef.current = JSON.parse(JSON.stringify(initialConfig));
      setLandingInitialized(true);
    }
  }, [tenant, landingInitialized]);

  // Initialize payment settings
  useEffect(() => {
    if (tenant && paymentSettings === null) {
      setPaymentSettings({
        currency: tenant.currency || 'IDR',
        taxRate: tenant.taxRate || 0,
        paymentMethods: tenant.paymentMethods || DEFAULT_PAYMENT_METHODS,
      });
    }
  }, [tenant, paymentSettings]);

  // Initialize shipping settings
  useEffect(() => {
    if (tenant && shippingSettings === null) {
      setShippingSettings({
        freeShippingThreshold: tenant.freeShippingThreshold ?? null,
        defaultShippingCost: tenant.defaultShippingCost || 0,
        shippingMethods: tenant.shippingMethods || DEFAULT_SHIPPING_METHODS,
      });
    }
  }, [tenant, shippingSettings]);

  // Initialize SEO settings
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
  // Tab Navigation Helpers
  // ---------------------------------------------------------------------------
  const getCurrentTabLabel = () => {
    const item = SETTINGS_MENU.find((m) => m.key === activeTab);
    return item?.label || 'Pengaturan';
  };

  const getCurrentTabIcon = () => {
    const item = SETTINGS_MENU.find((m) => m.key === activeTab);
    return item?.icon || Store;
  };

  const hasUnsavedLandingChanges = useCallback(() => {
    if (!landingConfig || !savedLandingConfigRef.current) return false;
    return JSON.stringify(landingConfig) !== JSON.stringify(savedLandingConfigRef.current);
  }, [landingConfig]);

  const handleTabChange = useCallback((newTab: string) => {
    if (activeTab === 'landing' && newTab !== 'landing' && hasUnsavedLandingChanges()) {
      setPendingTab(newTab);
      setShowUnsavedDialog(true);
      return;
    }
    setActiveTab(newTab);
    setSheetOpen(false);
  }, [activeTab, hasUnsavedLandingChanges]);

  const handleDiscardChanges = useCallback(() => {
    if (savedLandingConfigRef.current) {
      setLandingConfig(JSON.parse(JSON.stringify(savedLandingConfigRef.current)));
    }
    setShowUnsavedDialog(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  }, [pendingTab]);

  const handleCancelTabChange = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingTab(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Save Handlers
  // ---------------------------------------------------------------------------

  // Save Store Info
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

  // Save Appearance
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

  // Save Payment Settings
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

  // Save Shipping Settings
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

  // Save SEO Settings
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

  // Handle remove logo
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

  // Handle remove banner
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

  // Landing save handler - normalize before saving ref
  const handleLandingSaved = useCallback(() => {
    if (landingConfig) {
      // Normalize testimonials before saving to ref
      const normalizedConfig: TenantLandingConfig = {
        ...landingConfig,
        testimonials: {
          enabled: landingConfig.testimonials?.enabled ?? false,
          title: landingConfig.testimonials?.title || 'Testimoni',
          subtitle: landingConfig.testimonials?.subtitle || '',
          config: {
            items: extractTestimonialItems(landingConfig.testimonials?.config?.items),
          },
        },
      };
      savedLandingConfigRef.current = JSON.parse(JSON.stringify(normalizedConfig));
    }
    setLandingInitialized(false);
    refresh();
  }, [landingConfig, refresh]);

  // ---------------------------------------------------------------------------
  // Payment Methods Handlers
  // ---------------------------------------------------------------------------

  // Add/Edit Bank Account
  const handleSaveBank = (bank: BankAccount) => {
    if (!paymentSettings) return;

    const existing = paymentSettings.paymentMethods.bankAccounts.find(b => b.id === bank.id);
    let updatedBanks: BankAccount[];

    if (existing) {
      updatedBanks = paymentSettings.paymentMethods.bankAccounts.map(b =>
        b.id === bank.id ? bank : b
      );
    } else {
      updatedBanks = [...paymentSettings.paymentMethods.bankAccounts, { ...bank, id: generateId() }];
    }

    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        bankAccounts: updatedBanks,
      },
    });
    setBankDialogOpen(false);
    setEditingBank(null);
  };

  // Delete Bank Account
  const handleDeleteBank = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        bankAccounts: paymentSettings.paymentMethods.bankAccounts.filter(b => b.id !== id),
      },
    });
  };

  // Toggle Bank Enabled
  const handleToggleBank = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        bankAccounts: paymentSettings.paymentMethods.bankAccounts.map(b =>
          b.id === id ? { ...b, enabled: !b.enabled } : b
        ),
      },
    });
  };

  // Add/Edit E-Wallet
  const handleSaveEwallet = (ewallet: EWallet) => {
    if (!paymentSettings) return;

    const existing = paymentSettings.paymentMethods.eWallets.find(e => e.id === ewallet.id);
    let updatedEwallets: EWallet[];

    if (existing) {
      updatedEwallets = paymentSettings.paymentMethods.eWallets.map(e =>
        e.id === ewallet.id ? ewallet : e
      );
    } else {
      updatedEwallets = [...paymentSettings.paymentMethods.eWallets, { ...ewallet, id: generateId() }];
    }

    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        eWallets: updatedEwallets,
      },
    });
    setEwalletDialogOpen(false);
    setEditingEwallet(null);
  };

  // Delete E-Wallet
  const handleDeleteEwallet = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        eWallets: paymentSettings.paymentMethods.eWallets.filter(e => e.id !== id),
      },
    });
  };

  // Toggle E-Wallet Enabled
  const handleToggleEwallet = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        eWallets: paymentSettings.paymentMethods.eWallets.map(e =>
          e.id === id ? { ...e, enabled: !e.enabled } : e
        ),
      },
    });
  };

  // Toggle COD
  const handleToggleCod = () => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        cod: {
          ...paymentSettings.paymentMethods.cod,
          enabled: !paymentSettings.paymentMethods.cod.enabled,
        },
      },
    });
  };

  // Update COD Note
  const handleCodNoteChange = (note: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        cod: {
          ...paymentSettings.paymentMethods.cod,
          note,
        },
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Shipping Methods Handlers
  // ---------------------------------------------------------------------------

  // Toggle Courier
  const handleToggleCourier = (id: string) => {
    if (!shippingSettings) return;
    setShippingSettings({
      ...shippingSettings,
      shippingMethods: {
        ...shippingSettings.shippingMethods,
        couriers: shippingSettings.shippingMethods.couriers.map(c =>
          c.id === id ? { ...c, enabled: !c.enabled } : c
        ),
      },
    });
  };

  // Update Courier Note
  const handleCourierNoteChange = (id: string, note: string) => {
    if (!shippingSettings) return;
    setShippingSettings({
      ...shippingSettings,
      shippingMethods: {
        ...shippingSettings.shippingMethods,
        couriers: shippingSettings.shippingMethods.couriers.map(c =>
          c.id === id ? { ...c, note } : c
        ),
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Form Data Helpers
  // ---------------------------------------------------------------------------
  const updateFormData = (key: keyof NonNullable<typeof formData>, value: string | undefined) => {
    if (formData) {
      setFormData({ ...formData, [key]: value ?? '' });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const CurrentIcon = getCurrentTabIcon();

  return (
    <div>
      <PageHeader
        title="Pengaturan"
        description="Kelola pengaturan toko dan preferensi Anda"
      />

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Perubahan Belum Disimpan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda memiliki perubahan pada Landing Page yang belum disimpan.
              Apakah Anda ingin membuang perubahan tersebut?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTabChange}>
              Kembali
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges}>
              Buang Perubahan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bank Account Dialog */}
      <BankAccountDialog
        open={bankDialogOpen}
        onOpenChange={setBankDialogOpen}
        bank={editingBank}
        onSave={handleSaveBank}
      />

      {/* E-Wallet Dialog */}
      <EWalletDialog
        open={ewalletDialogOpen}
        onOpenChange={setEwalletDialogOpen}
        ewallet={editingEwallet}
        onSave={handleSaveEwallet}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        {/* Mobile: Sheet Navigation */}
        <div className="md:hidden mb-4">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <CurrentIcon className="h-4 w-4" />
                  {getCurrentTabLabel()}
                </span>
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Pengaturan</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-1">
                {SETTINGS_MENU.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  const hasIndicator = item.key === 'landing' && hasUnsavedLandingChanges();

                  return (
                    <button
                      key={item.key}
                      onClick={() => handleTabChange(item.key)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {hasIndicator && (
                        <span className="absolute right-3 h-2 w-2 rounded-full bg-yellow-500" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: Tabs */}
        <TabsList className="hidden md:grid w-full grid-cols-6 lg:w-auto">
          {SETTINGS_MENU.map((item) => {
            const Icon = item.icon;
            const hasIndicator = item.key === 'landing' && hasUnsavedLandingChanges();
            return (
              <TabsTrigger key={item.key} value={item.key} className="gap-2 relative">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {hasIndicator && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-500" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* ================================================================
            TAB: STORE INFO
        ================================================================ */}
        <TabsContent value="store" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>
                Informasi dasar tentang toko Anda yang akan ditampilkan kepada pelanggan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tenantLoading || !formData ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Nama Toko</Label>
                      <Input
                        id="store-name"
                        placeholder="Nama toko Anda"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Email Toko</Label>
                      <Input
                        id="store-email"
                        type="email"
                        placeholder="email@toko.com"
                        value={tenant?.email || ''}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Nomor Telepon</Label>
                      <Input
                        id="store-phone"
                        placeholder="+62 xxx xxxx xxxx"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-slug">URL Toko</Label>
                      <Input
                        id="store-slug"
                        value={`fibidy.com/store/${tenant?.slug || ''}`}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">URL toko tidak dapat diubah</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-description">Deskripsi Toko</Label>
                    <Textarea
                      id="store-description"
                      placeholder="Ceritakan tentang toko Anda..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-address">Alamat</Label>
                    <Textarea
                      id="store-address"
                      placeholder="Alamat lengkap toko"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveStore} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Informasi Toko
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================
            TAB: LANDING PAGE
        ================================================================ */}
        <TabsContent value="landing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Landing Page
                {hasUnsavedLandingChanges() && (
                  <span className="text-xs font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
                    Belum disimpan
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Kustomisasi halaman landing toko Anda. Jika dimatikan, akan menggunakan tampilan default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tenantLoading || !landingConfig ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : tenant ? (
                <LandingBuilder
                  config={landingConfig}
                  onConfigChange={setLandingConfig}
                  tenantSlug={tenant.slug}
                  onSave={handleLandingSaved}
                  hasUnsavedChanges={hasUnsavedLandingChanges()}
                />
              ) : (
                <p className="text-muted-foreground">Gagal memuat data tenant</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================
            TAB: PAYMENT SETTINGS
        ================================================================ */}
        <TabsContent value="payment" className="mt-6 space-y-6">
          {/* Currency & Tax Card */}
          <Card>
            <CardHeader>
              <CardTitle>Mata Uang & Pajak</CardTitle>
              <CardDescription>
                Konfigurasi mata uang dan tarif pajak untuk toko Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tenantLoading || !paymentSettings ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Mata Uang</Label>
                    <Select
                      value={paymentSettings.currency}
                      onValueChange={(value) =>
                        setPaymentSettings({ ...paymentSettings, currency: value })
                      }
                    >
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
                      value={paymentSettings.taxRate || ''}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          taxRate: parseFloat(e.target.value) || 0,
                        })
                      }
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
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingBank(null);
                    setBankDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tenantLoading || !paymentSettings ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : paymentSettings.paymentMethods.bankAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada rekening bank</p>
                  <p className="text-sm">Tambahkan rekening untuk menerima pembayaran transfer</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentSettings.paymentMethods.bankAccounts.map((bank) => (
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
                            {bank.accountNumber} • {bank.accountName}
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
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingEwallet(null);
                    setEwalletDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tenantLoading || !paymentSettings ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : paymentSettings.paymentMethods.eWallets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada e-wallet</p>
                  <p className="text-sm">Tambahkan e-wallet untuk menerima pembayaran digital</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentSettings.paymentMethods.eWallets.map((ewallet) => (
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
                            {ewallet.name && ` • ${ewallet.name}`}
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
              {tenantLoading || !paymentSettings ? (
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
                      checked={paymentSettings.paymentMethods.cod.enabled}
                      onCheckedChange={handleToggleCod}
                    />
                  </div>
                  {paymentSettings.paymentMethods.cod.enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="cod-note">Catatan COD (Opsional)</Label>
                      <Input
                        id="cod-note"
                        placeholder="Contoh: Hanya untuk area Jabodetabek"
                        value={paymentSettings.paymentMethods.cod.note || ''}
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
            <Button onClick={handleSavePayment} disabled={isSavingPayment || tenantLoading}>
              {isSavingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan Pembayaran
            </Button>
          </div>
        </TabsContent>

        {/* ================================================================
            TAB: SHIPPING SETTINGS
        ================================================================ */}
        <TabsContent value="shipping" className="mt-6 space-y-6">
          {/* Shipping Cost Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ongkos Kirim</CardTitle>
              <CardDescription>
                Konfigurasi biaya pengiriman dan batas gratis ongkir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tenantLoading || !shippingSettings ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="free-shipping">Batas Gratis Ongkir (Rp)</Label>
                    <Input
                      id="free-shipping"
                      type="number"
                      min="0"
                      placeholder="100000"
                      value={shippingSettings.freeShippingThreshold || ''}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          freeShippingThreshold: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Pesanan di atas nilai ini akan gratis ongkir. Kosongkan jika tidak ada.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-shipping">Ongkos Kirim Default (Rp)</Label>
                    <Input
                      id="default-shipping"
                      type="number"
                      min="0"
                      placeholder="15000"
                      value={shippingSettings.defaultShippingCost || ''}
                      onChange={(e) =>
                        setShippingSettings({
                          ...shippingSettings,
                          defaultShippingCost: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Ongkos kirim untuk pesanan di bawah batas gratis ongkir.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Couriers Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Kurir Pengiriman
              </CardTitle>
              <CardDescription>
                Pilih kurir yang tersedia untuk pengiriman. Kurir yang aktif akan ditampilkan saat checkout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tenantLoading || !shippingSettings ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {shippingSettings.shippingMethods.couriers.map((courier) => (
                    <div
                      key={courier.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        courier.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={courier.enabled}
                            onCheckedChange={() => handleToggleCourier(courier.id)}
                          />
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{courier.name}</span>
                          </div>
                        </div>
                        {courier.enabled && (
                          <Badge variant="secondary" className="text-xs">
                            Aktif
                          </Badge>
                        )}
                      </div>
                      {courier.enabled && (
                        <div className="ml-12">
                          <Input
                            placeholder="Catatan (opsional): REG, YES, OKE tersedia"
                            value={courier.note || ''}
                            onChange={(e) => handleCourierNoteChange(courier.id, e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveShipping} disabled={isSavingShipping || tenantLoading}>
              {isSavingShipping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan Pengiriman
            </Button>
          </div>
        </TabsContent>

        {/* ================================================================
            TAB: APPEARANCE
        ================================================================ */}
        <TabsContent value="appearance" className="mt-6">
          <div className="space-y-6">
            {/* Logo & Banner Card */}
            <Card>
              <CardHeader>
                <CardTitle>Logo & Banner</CardTitle>
                <CardDescription>
                  Gambar yang ditampilkan di toko online Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tenantLoading || !formData ? (
                  <div className="space-y-4">
                    <Skeleton className="h-40 w-40" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Logo Toko</Label>
                      <div className="max-w-[200px]">
                        <ImageUpload
                          value={formData.logo}
                          onChange={(url) => updateFormData('logo', url)}
                          onRemove={handleRemoveLogo}
                          disabled={isRemovingLogo}
                          folder="fibidy/logos"
                          aspectRatio={1}
                          placeholder="Upload logo toko"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Rekomendasi: 200x200px, format PNG atau JPG
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Banner Toko</Label>
                      <ImageUpload
                        value={formData.banner}
                        onChange={(url) => updateFormData('banner', url)}
                        onRemove={handleRemoveBanner}
                        disabled={isRemovingBanner}
                        folder="fibidy/banners"
                        aspectRatio={3}
                        placeholder="Upload banner toko"
                      />
                      <p className="text-xs text-muted-foreground">
                        Rekomendasi: 1200x400px, format PNG atau JPG
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Theme Color Card */}
            <Card>
              <CardHeader>
                <CardTitle>Warna Tema</CardTitle>
                <CardDescription>
                  Pilih warna utama untuk toko online Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tenantLoading || !formData ? (
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-16 w-16 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {THEME_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => updateFormData('primaryColor', color.value)}
                        disabled={isSavingAppearance}
                        className={cn(
                          'relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                          formData.primaryColor === color.value
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent hover:border-muted-foreground/20',
                          isSavingAppearance && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            color.class
                          )}
                        >
                          {formData.primaryColor === color.value && (
                            <Check className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <span className="text-xs font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dark Mode Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Mode Gelap</CardTitle>
                <CardDescription>
                  Ubah tampilan antara mode terang dan gelap.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                    <Moon className="h-4 w-4" />
                    <span>/</span>
                    <Sun className="h-4 w-4" />
                  </span>
                  untuk mengubah mode tampilan.
                </p>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveAppearance} disabled={isSavingAppearance || tenantLoading}>
                {isSavingAppearance && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Simpan Tampilan
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ================================================================
            TAB: SEO & SOCIAL
        ================================================================ */}
        <TabsContent value="seo" className="mt-6 space-y-6">
          {/* SEO Meta Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO (Search Engine Optimization)
              </CardTitle>
              <CardDescription>
                Optimalkan toko Anda agar mudah ditemukan di Google.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tenantLoading || !seoSettings ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">
                      Meta Title
                      <span className="text-xs text-muted-foreground ml-2">
                        ({seoSettings.metaTitle.length}/60)
                      </span>
                    </Label>
                    <Input
                      id="meta-title"
                      placeholder={tenant?.name || 'Judul toko Anda'}
                      maxLength={60}
                      value={seoSettings.metaTitle}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, metaTitle: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Judul yang muncul di hasil pencarian Google. Maksimal 60 karakter.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta-description">
                      Meta Description
                      <span className="text-xs text-muted-foreground ml-2">
                        ({seoSettings.metaDescription.length}/160)
                      </span>
                    </Label>
                    <Textarea
                      id="meta-description"
                      placeholder="Deskripsi singkat toko Anda..."
                      maxLength={160}
                      rows={3}
                      value={seoSettings.metaDescription}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, metaDescription: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Deskripsi yang muncul di hasil pencarian Google. Maksimal 160 karakter.
                    </p>
                  </div>

                  {/* Preview */}
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">Preview di Google:</p>
                    <div className="space-y-1">
                      <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {seoSettings.metaTitle || tenant?.name || 'Nama Toko'}
                      </p>
                      <p className="text-green-700 text-sm">
                        fibidy.com/store/{tenant?.slug}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {seoSettings.metaDescription || tenant?.description || 'Deskripsi toko akan muncul di sini...'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media
              </CardTitle>
              <CardDescription>
                Link ke akun social media toko Anda. Akan ditampilkan di footer toko.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tenantLoading || !seoSettings ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="social-instagram">Instagram</Label>
                      <Input
                        id="social-instagram"
                        placeholder="https://instagram.com/username"
                        value={seoSettings.socialLinks.instagram || ''}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            socialLinks: { ...seoSettings.socialLinks, instagram: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="social-facebook">Facebook</Label>
                      <Input
                        id="social-facebook"
                        placeholder="https://facebook.com/page"
                        value={seoSettings.socialLinks.facebook || ''}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            socialLinks: { ...seoSettings.socialLinks, facebook: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="social-tiktok">TikTok</Label>
                      <Input
                        id="social-tiktok"
                        placeholder="https://tiktok.com/@username"
                        value={seoSettings.socialLinks.tiktok || ''}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            socialLinks: { ...seoSettings.socialLinks, tiktok: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="social-youtube">YouTube</Label>
                      <Input
                        id="social-youtube"
                        placeholder="https://youtube.com/@channel"
                        value={seoSettings.socialLinks.youtube || ''}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            socialLinks: { ...seoSettings.socialLinks, youtube: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="social-twitter">Twitter / X</Label>
                      <Input
                        id="social-twitter"
                        placeholder="https://twitter.com/username"
                        value={seoSettings.socialLinks.twitter || ''}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            socialLinks: { ...seoSettings.socialLinks, twitter: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSeo} disabled={isSavingSeo || tenantLoading}>
              {isSavingSeo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan SEO
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// BANK ACCOUNT DIALOG
// ============================================================================

interface BankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bank: BankAccount | null;
  onSave: (bank: BankAccount) => void;
}

function BankAccountDialog({ open, onOpenChange, bank, onSave }: BankAccountDialogProps) {
  const initialFormData = useMemo(() => ({
    id: bank?.id || '',
    bank: bank?.bank || 'BCA' as BankName,
    accountNumber: bank?.accountNumber || '',
    accountName: bank?.accountName || '',
    enabled: bank?.enabled ?? true,
  }), [bank]);

  const [formData, setFormData] = useState<BankAccount>(initialFormData);

  useEffect(() => {
    if (open) {
      setFormData({
        id: bank?.id || '',
        bank: bank?.bank || 'BCA',
        accountNumber: bank?.accountNumber || '',
        accountName: bank?.accountName || '',
        enabled: bank?.enabled ?? true,
      });
    }
  }, [bank, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountNumber || !formData.accountName) {
      toast.error('Mohon lengkapi semua field');
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bank ? 'Edit Rekening Bank' : 'Tambah Rekening Bank'}</DialogTitle>
          <DialogDescription>
            Masukkan detail rekening bank untuk menerima pembayaran transfer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Bank</Label>
            <Select
              value={formData.bank}
              onValueChange={(value) => setFormData({ ...formData, bank: value as BankName })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BANK_OPTIONS.map((bankName) => (
                  <SelectItem key={bankName} value={bankName}>
                    {bankName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-number">Nomor Rekening</Label>
            <Input
              id="account-number"
              placeholder="1234567890"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-name">Nama Pemilik Rekening</Label>
            <Input
              id="account-name"
              placeholder="Nama sesuai rekening"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// E-WALLET DIALOG
// ============================================================================

interface EWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ewallet: EWallet | null;
  onSave: (ewallet: EWallet) => void;
}

function EWalletDialog({ open, onOpenChange, ewallet, onSave }: EWalletDialogProps) {
  const initialFormData = useMemo(() => ({
    id: ewallet?.id || '',
    provider: ewallet?.provider || 'GoPay' as EWalletProvider,
    number: ewallet?.number || '',
    name: ewallet?.name || '',
    enabled: ewallet?.enabled ?? true,
  }), [ewallet]);

  const [formData, setFormData] = useState<EWallet>(initialFormData);

  useEffect(() => {
    if (open) {
      setFormData({
        id: ewallet?.id || '',
        provider: ewallet?.provider || 'GoPay',
        number: ewallet?.number || '',
        name: ewallet?.name || '',
        enabled: ewallet?.enabled ?? true,
      });
    }
  }, [ewallet, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number) {
      toast.error('Mohon lengkapi nomor e-wallet');
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ewallet ? 'Edit E-Wallet' : 'Tambah E-Wallet'}</DialogTitle>
          <DialogDescription>
            Masukkan detail e-wallet untuk menerima pembayaran digital.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={formData.provider}
              onValueChange={(value) => setFormData({ ...formData, provider: value as EWalletProvider })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EWALLET_OPTIONS.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ewallet-number">Nomor / ID</Label>
            <Input
              id="ewallet-number"
              placeholder="08123456789"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ewallet-name">Nama Akun (Opsional)</Label>
            <Input
              id="ewallet-name"
              placeholder="Nama pemilik akun"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
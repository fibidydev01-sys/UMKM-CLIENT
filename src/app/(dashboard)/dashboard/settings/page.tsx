/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/settings/page.tsx
 * ============================================================================
 * Route: /dashboard/settings
 * Description: Store settings with state persistence across tabs
 * ============================================================================
 */
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Store,
  Bell,
  CreditCard,
  Truck,
  Shield,
  Palette,
  Globe,
  Save,
  Layout,
  Loader2,
  Check,
  Moon,
  Sun,
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
import { PageHeader } from '@/components/dashboard';
import { LandingBuilder } from '@/components/landing';
import { ImageUpload } from '@/components/upload';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { DEFAULT_LANDING_CONFIG } from '@/types/landing';
import type { TenantLandingConfig } from '@/types';

// ============================================================================
// THEME COLORS - Connect ke backend theme.primaryColor
// ============================================================================
const THEME_COLORS = [
  { name: 'Default', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

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

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [isRemovingBanner, setIsRemovingBanner] = useState(false);

  // Form state for editable fields
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    phone: string;
    address: string;
    logo: string | undefined;
    banner: string | undefined;
    primaryColor: string;
  } | null>(null);

  // ✅ LANDING CONFIG STATE - Lifted to parent
  const [landingConfig, setLandingConfig] = useState<TenantLandingConfig | null>(null);
  const savedLandingConfigRef = useRef<TenantLandingConfig | null>(null);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [stockNotifications, setStockNotifications] = useState(true);

  // Payment Settings
  const [currency, setCurrency] = useState('IDR');
  const [taxRate, setTaxRate] = useState('11');

  // Shipping Settings
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('100000');
  const [defaultShippingCost, setDefaultShippingCost] = useState('15000');

  // ---------------------------------------------------------------------------
  // Initialize form data from tenant (only once)
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

  // ✅ Initialize landing config from tenant (only once)
  useEffect(() => {
    if (tenant && landingConfig === null) {
      const initialConfig = {
        ...DEFAULT_LANDING_CONFIG,
        ...tenant.landingConfig,
      };
      setLandingConfig(initialConfig);
      savedLandingConfigRef.current = initialConfig;
    }
  }, [tenant, landingConfig]);

  // Loading state
  const tenantLoading = tenant === null;

  // ---------------------------------------------------------------------------
  // Check for unsaved landing changes
  // ---------------------------------------------------------------------------
  const hasUnsavedLandingChanges = useCallback(() => {
    if (!landingConfig || !savedLandingConfigRef.current) return false;
    return JSON.stringify(landingConfig) !== JSON.stringify(savedLandingConfigRef.current);
  }, [landingConfig]);

  // ---------------------------------------------------------------------------
  // Tab Change Handler with Unsaved Changes Check
  // ---------------------------------------------------------------------------
  const handleTabChange = useCallback((newTab: string) => {
    // If leaving landing tab with unsaved changes, show warning
    if (activeTab === 'landing' && newTab !== 'landing' && hasUnsavedLandingChanges()) {
      setPendingTab(newTab);
      setShowUnsavedDialog(true);
      return;
    }
    setActiveTab(newTab);
  }, [activeTab, hasUnsavedLandingChanges]);

  const handleDiscardChanges = useCallback(() => {
    // Reset to saved config
    if (savedLandingConfigRef.current) {
      setLandingConfig({ ...savedLandingConfigRef.current });
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
  // Handlers
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

  // ✅ Handle remove logo - langsung save ke backend
  const handleRemoveLogo = async () => {
    if (!tenant || !formData) return;

    setIsRemovingLogo(true);
    try {
      // Update local state
      setFormData({ ...formData, logo: undefined });
      // Save to backend immediately
      await tenantsApi.update({ logo: '' });
      await refresh();
      toast.success('Logo berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove logo:', error);
      toast.error('Gagal menghapus logo');
      // Revert local state on error
      setFormData({ ...formData, logo: tenant.logo || undefined });
    } finally {
      setIsRemovingLogo(false);
    }
  };

  // ✅ Handle remove banner - langsung save ke backend
  const handleRemoveBanner = async () => {
    if (!tenant || !formData) return;

    setIsRemovingBanner(true);
    try {
      // Update local state
      setFormData({ ...formData, banner: undefined });
      // Save to backend immediately
      await tenantsApi.update({ banner: '' });
      await refresh();
      toast.success('Banner berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove banner:', error);
      toast.error('Gagal menghapus banner');
      // Revert local state on error
      setFormData({ ...formData, banner: tenant.banner || undefined });
    } finally {
      setIsRemovingBanner(false);
    }
  };

  // ✅ Landing config save handler - updates the ref
  const handleLandingSaved = useCallback(() => {
    if (landingConfig) {
      savedLandingConfigRef.current = { ...landingConfig };
    }
    refresh();
  }, [landingConfig, refresh]);

  const updateFormData = (key: keyof NonNullable<typeof formData>, value: string | undefined) => {
    if (formData) {
      setFormData({ ...formData, [key]: value ?? '' });
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

      {/* ✅ Unsaved Changes Dialog */}
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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Toko</span>
          </TabsTrigger>
          <TabsTrigger value="landing" className="gap-2 relative">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Landing</span>
            {/* ✅ Yellow dot for unsaved changes */}
            {hasUnsavedLandingChanges() && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pembayaran</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Pengiriman</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Tampilan</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
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
                      <Label htmlFor="store-website">Website (Opsional)</Label>
                      <Input
                        id="store-website"
                        placeholder="https://www.toko-anda.com"
                      />
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

        {/* Landing Page Settings */}
        <TabsContent value="landing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Landing Page
                {/* ✅ Unsaved indicator in card header */}
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

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
              <CardDescription>
                Atur notifikasi yang ingin Anda terima.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi melalui email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Pesanan Baru</Label>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan notifikasi saat ada pesanan baru
                  </p>
                </div>
                <Switch
                  checked={orderNotifications}
                  onCheckedChange={setOrderNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Peringatan Stok Rendah</Label>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan notifikasi saat stok produk menipis
                  </p>
                </div>
                <Switch
                  checked={stockNotifications}
                  onCheckedChange={setStockNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pembayaran</CardTitle>
              <CardDescription>
                Konfigurasi mata uang dan pajak.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mata Uang</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR - Rupiah Indonesia</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tarif Pajak (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    placeholder="11"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Metode Pembayaran Aktif</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">
                          BCA, Mandiri, BNI, BRI
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">E-Wallet</p>
                        <p className="text-sm text-muted-foreground">
                          GoPay, OVO, DANA, ShopeePay
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">COD</p>
                        <p className="text-sm text-muted-foreground">
                          Bayar di tempat
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pengiriman</CardTitle>
              <CardDescription>
                Konfigurasi opsi pengiriman dan ongkos kirim.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="free-shipping">
                    Batas Gratis Ongkir (Rp)
                  </Label>
                  <Input
                    id="free-shipping"
                    type="number"
                    placeholder="100000"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pesanan di atas nilai ini akan gratis ongkir
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-shipping">
                    Ongkos Kirim Default (Rp)
                  </Label>
                  <Input
                    id="default-shipping"
                    type="number"
                    placeholder="15000"
                    value={defaultShippingCost}
                    onChange={(e) => setDefaultShippingCost(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ongkos kirim untuk pesanan di bawah batas gratis ongkir
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Kurir Aktif</h4>
                <div className="space-y-4">
                  {['JNE', 'J&T Express', 'SiCepat', 'AnterAja', 'Ninja Express'].map(
                    (courier) => (
                      <div
                        key={courier}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded">
                            <Truck className="h-4 w-4" />
                          </div>
                          <p className="font-medium">{courier}</p>
                        </div>
                        <Switch defaultChecked={['JNE', 'J&T Express'].includes(courier)} />
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
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
                  Pilih warna utama untuk toko online Anda. Warna akan diterapkan pada tombol, link, dan elemen aksen.
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
                  Preferensi akan disimpan secara otomatis di browser Anda.
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
      </Tabs>
    </div>
  );
}
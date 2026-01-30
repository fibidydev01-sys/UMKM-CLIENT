// ══════════════════════════════════════════════════════════════
// TOKO CLIENT - Instant Tabs (Hero Section, About, Testimonials, Contact, CTA)
// Pattern: Same as Dashboard & Auto-Reply (Sticky tabs + State switching)
// ALL TAB CONTENT INLINE - NO SEPARATE TABS FOLDER
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { Home, FileText, MessageSquare, MapPin, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/upload';
import { Hero1, About1, Testimonials1, Contact1, Cta1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { FeatureItem, Testimonial } from '@/types';
import { Drawer } from 'vaul';
import { Eye } from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ══════════════════════════════════════════════════════════════

type TabType = 'hero-section' | 'about' | 'testimonials' | 'contact' | 'cta';

const TABS = [
  {
    id: 'hero-section' as const,
    label: 'Hero Section',
    icon: Home,
    description: 'Banner utama dan branding toko',
  },
  {
    id: 'about' as const,
    label: 'About',
    icon: FileText,
    description: 'Tentang toko dan fitur unggulan',
  },
  {
    id: 'testimonials' as const,
    label: 'Testimonials',
    icon: MessageSquare,
    description: 'Testimoni pelanggan',
  },
  {
    id: 'contact' as const,
    label: 'Contact',
    icon: MapPin,
    description: 'Informasi kontak dan lokasi',
  },
  {
    id: 'cta' as const,
    label: 'Call to Action',
    icon: Megaphone,
    description: 'Ajakan untuk mengambil tindakan',
  },
];

const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

// ══════════════════════════════════════════════════════════════
// MAIN CLIENT COMPONENT
// ══════════════════════════════════════════════════════════════

export function TokoClient() {
  const [activeTab, setActiveTab] = useState<TabType>('hero-section'); // Default: Hero Section
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* PAGE HEADER - Static section (like dashboard profile)   */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Informasi Toko</h1>
        <p className="text-muted-foreground mt-2">
          Kelola informasi toko dan konten landing page. Semua data disimpan ke database yang sama.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB DESCRIPTION                                          */}
      {/* ════════════════════════════════════════════════════════ */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{currentTab.label}</strong> - {currentTab.description}
        </AlertDescription>
      </Alert>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB CONTENT - Instant switching (no routing)            */}
      {/* ════════════════════════════════════════════════════════ */}
      <div>
        {activeTab === 'hero-section' && <HeroSectionTabContent />}
        {activeTab === 'about' && <AboutTabContent />}
        {activeTab === 'testimonials' && <TestimonialsTabContent />}
        {activeTab === 'contact' && <ContactTabContent />}
        {activeTab === 'cta' && <CtaTabContent />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HERO SECTION TAB CONTENT
// ══════════════════════════════════════════════════════════════

function HeroSectionTabContent() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [isRemovingHeroBackground, setIsRemovingHeroBackground] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaText: string;
    heroCtaLink: string;
    heroBackgroundImage: string;
    logo: string;
    primaryColor: string;
    category: string;
  } | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      const themeData = tenant.theme as { primaryColor?: string } | null;
      setFormData({
        name: tenant.name || '',
        description: tenant.description || '',
        heroTitle: tenant.heroTitle || '',
        heroSubtitle: tenant.heroSubtitle || '',
        heroCtaText: tenant.heroCtaText || '',
        heroCtaLink: tenant.heroCtaLink || '',
        heroBackgroundImage: tenant.heroBackgroundImage || '',
        logo: tenant.logo || '',
        primaryColor: themeData?.primaryColor || THEME_COLORS[0].value,
        category: tenant.category || '',
      });
    }
  }, [tenant, formData]);

  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        name: formData.name || undefined,
        description: formData.description || undefined,
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        heroCtaText: formData.heroCtaText,
        heroCtaLink: formData.heroCtaLink,
        heroBackgroundImage: formData.heroBackgroundImage,
        logo: formData.logo || undefined,
        theme: { primaryColor: formData.primaryColor },
      });

      await refresh();
      toast.success('Hero Section berhasil disimpan');
    } catch (error) {
      console.error('Failed to save hero section:', error);
      toast.error('Gagal menyimpan hero section');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!tenant || !formData) return;
    setIsRemovingLogo(true);
    try {
      setFormData({ ...formData, logo: '' });
      await tenantsApi.update({ logo: '' });
      await refresh();
      toast.success('Logo berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove logo:', error);
      toast.error('Gagal menghapus logo');
      setFormData({ ...formData, logo: tenant.logo || '' });
    } finally {
      setIsRemovingLogo(false);
    }
  };

  const handleRemoveHeroBackground = async () => {
    if (!tenant || !formData) return;
    setIsRemovingHeroBackground(true);
    try {
      setFormData({ ...formData, heroBackgroundImage: '' });
      await tenantsApi.update({ heroBackgroundImage: '' });
      await refresh();
      toast.success('Hero background berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove hero background:', error);
      toast.error('Gagal menghapus hero background');
      setFormData({ ...formData, heroBackgroundImage: tenant.heroBackgroundImage || '' });
    } finally {
      setIsRemovingHeroBackground(false);
    }
  };

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const isLoading = tenant === null || formData === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Hero Section</CardTitle>
        <CardDescription>
          Hero section adalah bagian pertama yang dilihat pengunjung. Pastikan kontennya menarik
          dan informatif.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Nama Toko *</Label>
                  <Input
                    id="store-name"
                    placeholder="Burger China"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nama resmi toko Anda (digunakan di hero banner & branding)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-description">Deskripsi Singkat</Label>
                  <Input
                    id="store-description"
                    placeholder="Burger premium dengan cita rasa Asia fusion"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tagline atau deskripsi singkat (1 kalimat)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Judul Marketing (Hero Title)</Label>
                  <Input
                    id="heroTitle"
                    placeholder="Burger Premium dengan Cita Rasa Asia Fusion"
                    value={formData.heroTitle}
                    onChange={(e) => updateFormData('heroTitle', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Headline marketing yang eye-catching
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtitle (Value Proposition)</Label>
                  <Input
                    id="heroSubtitle"
                    placeholder="Rasakan sensasi burger berkualitas dengan bumbu rahasia khas Asia"
                    value={formData.heroSubtitle}
                    onChange={(e) => updateFormData('heroSubtitle', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Value proposition atau penjelasan singkat
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroCtaText">Teks Tombol CTA</Label>
                  <Input
                    id="heroCtaText"
                    placeholder="Pesan Sekarang"
                    value={formData.heroCtaText}
                    onChange={(e) => updateFormData('heroCtaText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroCtaLink">Link Tombol CTA</Label>
                  <Input
                    id="heroCtaLink"
                    placeholder="/products"
                    value={formData.heroCtaLink}
                    onChange={(e) => updateFormData('heroCtaLink', e.target.value)}
                  />
                </div>
              </div>

              {/* Hero Background Image */}
              <div className="space-y-2 pt-4 border-t">
                <Label>Hero Background Image</Label>
                <ImageUpload
                  value={formData.heroBackgroundImage}
                  onChange={(url) => updateFormData('heroBackgroundImage', url)}
                  onRemove={handleRemoveHeroBackground}
                  disabled={isRemovingHeroBackground}
                  folder="fibidy/hero-backgrounds"
                  aspectRatio={2.4}
                  placeholder="Upload hero background"
                />
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 1920x800px, format JPG atau PNG
                </p>
              </div>

              {/* Branding Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-base font-semibold">Kategori & Branding</h3>

                {/* Category - Readonly */}
                <div className="space-y-2">
                  <Label htmlFor="store-category">Kategori Toko</Label>
                  <Input
                    id="store-category"
                    value={formData.category || 'Belum dipilih'}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Kategori hanya dapat dipilih saat pendaftaran dan tidak dapat diubah
                  </p>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2 pt-2 border-t">
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

                {/* Primary Color */}
                <div className="space-y-3 pt-2 border-t">
                  <Label>Warna Tema</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {THEME_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => updateFormData('primaryColor', color.value)}
                        disabled={isSaving}
                        className={cn(
                          'relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                          formData.primaryColor === color.value
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent hover:border-muted-foreground/20',
                          isSaving && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            color.class
                          )}
                        >
                          {formData.primaryColor === color.value && (
                            <span className="text-white font-bold">&#10003;</span>
                          )}
                        </div>
                        <span className="text-xs font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pilih warna utama untuk toko online Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Button with Drawer */}
            <div className="space-y-2 pt-6 mt-6 border-t">
              <Label className="text-lg font-semibold">Preview</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Lihat pratinjau Hero Section Anda
              </p>
              <Drawer.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <Drawer.Trigger asChild>
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    <Eye className="mr-2 h-4 w-4" />
                    Buka Preview
                  </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-4 bg-background rounded-t-[10px] flex-1 overflow-y-auto">
                      <div className="mx-auto w-full max-w-5xl">
                        <Drawer.Title className="font-semibold text-lg mb-2">
                          Preview Hero Section
                        </Drawer.Title>
                        <Drawer.Description className="text-sm text-muted-foreground mb-4">
                          Pratinjau real-time dari Hero Section Anda
                        </Drawer.Description>
                        {/* Inject Theme CSS for Real-time Preview */}
                        <style
                          dangerouslySetInnerHTML={{
                            __html: generateThemeCSS(formData.primaryColor),
                          }}
                        />
                        <div className="tenant-theme border rounded-lg overflow-hidden bg-muted/20">
                          <Hero1
                            title={formData.heroTitle || formData.name || ''}
                            subtitle={formData.heroSubtitle || formData.description}
                            ctaText={formData.heroCtaText || 'Lihat Produk'}
                            ctaLink={formData.heroCtaLink || '/products'}
                            showCta={true}
                            backgroundImage={formData.heroBackgroundImage}
                            logo={formData.logo}
                            storeName={formData.name}
                          />
                        </div>
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t">
              <Button onClick={handleSave} disabled={isSaving} size="lg">
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════
// ABOUT TAB CONTENT
// ══════════════════════════════════════════════════════════════

function AboutTabContent() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingAboutImage, setIsRemovingAboutImage] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<{
    aboutTitle: string;
    aboutSubtitle: string;
    aboutContent: string;
    aboutImage: string;
    aboutFeatures: FeatureItem[];
  } | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        aboutTitle: tenant.aboutTitle || '',
        aboutSubtitle: tenant.aboutSubtitle || '',
        aboutContent: tenant.aboutContent || '',
        aboutImage: tenant.aboutImage || '',
        aboutFeatures: (tenant.aboutFeatures as FeatureItem[]) || [],
      });
    }
  }, [tenant, formData]);

  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        aboutTitle: formData.aboutTitle,
        aboutSubtitle: formData.aboutSubtitle,
        aboutContent: formData.aboutContent,
        aboutImage: formData.aboutImage,
        aboutFeatures: formData.aboutFeatures,
      });

      await refresh();
      toast.success('About section berhasil disimpan');
    } catch (error) {
      console.error('Failed to save about section:', error);
      toast.error('Gagal menyimpan about section');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAboutImage = async () => {
    if (!tenant || !formData) return;
    setIsRemovingAboutImage(true);
    try {
      setFormData({ ...formData, aboutImage: '' });
      await tenantsApi.update({ aboutImage: '' });
      await refresh();
      toast.success('About image berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove about image:', error);
      toast.error('Gagal menghapus about image');
      setFormData({ ...formData, aboutImage: tenant.aboutImage || '' });
    } finally {
      setIsRemovingAboutImage(false);
    }
  };

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const isLoading = tenant === null || formData === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan About Section</CardTitle>
        <CardDescription>
          Bagian ini membantu pelanggan mengenal lebih jauh tentang toko dan produk Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle">Judul</Label>
                  <Input
                    id="aboutTitle"
                    placeholder="Tentang Kami"
                    value={formData.aboutTitle}
                    onChange={(e) => updateFormData('aboutTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutSubtitle">Subtitle</Label>
                  <Input
                    id="aboutSubtitle"
                    placeholder="Cerita di balik toko kami"
                    value={formData.aboutSubtitle}
                    onChange={(e) => updateFormData('aboutSubtitle', e.target.value)}
                  />
                </div>
              </div>

              {/* About Content */}
              <div className="space-y-2">
                <Label htmlFor="aboutContent">Deskripsi Lengkap</Label>
                <Textarea
                  id="aboutContent"
                  placeholder="Ceritakan tentang toko Anda..."
                  rows={4}
                  value={formData.aboutContent}
                  onChange={(e) => updateFormData('aboutContent', e.target.value)}
                />
              </div>

              {/* About Image */}
              <div className="space-y-2 pt-4 border-t">
                <Label>About Section Image</Label>
                <ImageUpload
                  value={formData.aboutImage}
                  onChange={(url) => updateFormData('aboutImage', url)}
                  onRemove={handleRemoveAboutImage}
                  disabled={isRemovingAboutImage}
                  folder="fibidy/about-images"
                  aspectRatio={1.5}
                  placeholder="Upload about image"
                />
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 800x533px atau 1200x800px, format JPG atau PNG
                </p>
              </div>

              {/* Features Editor */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>Fitur-Fitur Unggulan</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newFeature: FeatureItem = { title: '', description: '' };
                      updateFormData('aboutFeatures', [...formData.aboutFeatures, newFeature]);
                    }}
                  >
                    + Tambah Fitur
                  </Button>
                </div>
                {formData.aboutFeatures.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada fitur. Klik &quot;Tambah Fitur&quot; untuk menambahkan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {formData.aboutFeatures.map((feature, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Fitur #{index + 1}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                const updated = formData.aboutFeatures.filter(
                                  (_, i) => i !== index
                                );
                                updateFormData('aboutFeatures', updated);
                              }}
                            >
                              Hapus
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Feature Icon</Label>
                              <div className="max-w-[150px]">
                                <ImageUpload
                                  value={feature.icon}
                                  onChange={(url) => {
                                    const updated = [...formData.aboutFeatures];
                                    updated[index] = { ...updated[index], icon: url };
                                    updateFormData('aboutFeatures', updated);
                                  }}
                                  onRemove={() => {
                                    const updated = [...formData.aboutFeatures];
                                    updated[index] = { ...updated[index], icon: '' };
                                    updateFormData('aboutFeatures', updated);
                                  }}
                                  folder="fibidy/feature-icons"
                                  aspectRatio={1}
                                  placeholder="Upload icon"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Upload icon untuk fitur ini (square, 200x200px)
                              </p>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Judul</Label>
                                <Input
                                  placeholder="Kualitas Terjamin"
                                  value={feature.title}
                                  onChange={(e) => {
                                    const updated = [...formData.aboutFeatures];
                                    updated[index] = { ...updated[index], title: e.target.value };
                                    updateFormData('aboutFeatures', updated);
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Deskripsi</Label>
                                <Input
                                  placeholder="Produk berkualitas tinggi"
                                  value={feature.description}
                                  onChange={(e) => {
                                    const updated = [...formData.aboutFeatures];
                                    updated[index] = {
                                      ...updated[index],
                                      description: e.target.value,
                                    };
                                    updateFormData('aboutFeatures', updated);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Button with Drawer */}
            <div className="space-y-2 pt-6 mt-6 border-t">
              <Label className="text-lg font-semibold">Preview</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Lihat pratinjau About Section Anda
              </p>
              <Drawer.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <Drawer.Trigger asChild>
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    <Eye className="mr-2 h-4 w-4" />
                    Buka Preview
                  </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-4 bg-background rounded-t-[10px] flex-1 overflow-y-auto">
                      <div className="mx-auto w-full max-w-5xl">
                        <Drawer.Title className="font-semibold text-lg mb-2">
                          Preview About Section
                        </Drawer.Title>
                        <Drawer.Description className="text-sm text-muted-foreground mb-4">
                          Pratinjau real-time dari About Section Anda
                        </Drawer.Description>
                        {/* Inject Theme CSS */}
                        <style
                          dangerouslySetInnerHTML={{
                            __html: generateThemeCSS(tenant?.theme?.primaryColor),
                          }}
                        />
                        <div className="tenant-theme border rounded-lg overflow-hidden bg-muted/20">
                          <About1
                            title={formData.aboutTitle || 'Tentang Kami'}
                            subtitle={formData.aboutSubtitle}
                            content={formData.aboutContent}
                            image={formData.aboutImage}
                            features={formData.aboutFeatures}
                          />
                        </div>
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t">
              <Button onClick={handleSave} disabled={isSaving} size="lg">
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════
// TESTIMONIALS TAB CONTENT
// ══════════════════════════════════════════════════════════════

function TestimonialsTabContent() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<{
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    testimonials: Testimonial[];
  } | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        testimonialsTitle: tenant.testimonialsTitle || '',
        testimonialsSubtitle: tenant.testimonialsSubtitle || '',
        testimonials: (tenant.testimonials as Testimonial[]) || [],
      });
    }
  }, [tenant, formData]);

  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        testimonialsTitle: formData.testimonialsTitle,
        testimonialsSubtitle: formData.testimonialsSubtitle,
        testimonials: formData.testimonials,
      });

      await refresh();
      toast.success('Testimonials berhasil disimpan');
    } catch (error) {
      console.error('Failed to save testimonials:', error);
      toast.error('Gagal menyimpan testimonials');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const isLoading = tenant === null || formData === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Testimonials</CardTitle>
        <CardDescription>
          Tampilkan testimoni positif dari pelanggan untuk membangun kredibilitas toko Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* Section Header */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="testimonialsTitle">Judul</Label>
                  <Input
                    id="testimonialsTitle"
                    placeholder="Kata Mereka"
                    value={formData.testimonialsTitle}
                    onChange={(e) => updateFormData('testimonialsTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonialsSubtitle">Subtitle</Label>
                  <Input
                    id="testimonialsSubtitle"
                    placeholder="Apa kata pelanggan tentang kami"
                    value={formData.testimonialsSubtitle}
                    onChange={(e) => updateFormData('testimonialsSubtitle', e.target.value)}
                  />
                </div>
              </div>

              {/* Testimonials Editor */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>Daftar Testimonial</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newTestimonial: Testimonial = {
                        id: Math.random().toString(36).substring(2, 9),
                        name: '',
                        role: '',
                        content: '',
                      };
                      updateFormData('testimonials', [...formData.testimonials, newTestimonial]);
                    }}
                  >
                    + Tambah Testimonial
                  </Button>
                </div>
                {formData.testimonials.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada testimonial. Klik &quot;Tambah Testimonial&quot; untuk menambahkan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {formData.testimonials.map((testimonial, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Testimonial #{index + 1}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                const updated = formData.testimonials.filter(
                                  (_, i) => i !== index
                                );
                                updateFormData('testimonials', updated);
                              }}
                            >
                              Hapus
                            </Button>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Nama</Label>
                              <Input
                                placeholder="John Doe"
                                value={testimonial.name}
                                onChange={(e) => {
                                  const updated = [...formData.testimonials];
                                  updated[index] = { ...updated[index], name: e.target.value };
                                  updateFormData('testimonials', updated);
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Role/Pekerjaan</Label>
                              <Input
                                placeholder="Food Blogger"
                                value={testimonial.role}
                                onChange={(e) => {
                                  const updated = [...formData.testimonials];
                                  updated[index] = { ...updated[index], role: e.target.value };
                                  updateFormData('testimonials', updated);
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Avatar (Opsional)</Label>
                            <div className="max-w-[150px]">
                              <ImageUpload
                                value={testimonial.avatar}
                                onChange={(url) => {
                                  const updated = [...formData.testimonials];
                                  updated[index] = { ...updated[index], avatar: url };
                                  updateFormData('testimonials', updated);
                                }}
                                onRemove={() => {
                                  const updated = [...formData.testimonials];
                                  updated[index] = { ...updated[index], avatar: '' };
                                  updateFormData('testimonials', updated);
                                }}
                                folder="fibidy/testimonial-avatars"
                                aspectRatio={1}
                                placeholder="Upload avatar"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Upload foto pelanggan (square, 200x200px)
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Testimoni</Label>
                            <Textarea
                              placeholder="Produknya sangat berkualitas dan pelayanannya memuaskan!"
                              rows={3}
                              value={testimonial.content}
                              onChange={(e) => {
                                const updated = [...formData.testimonials];
                                updated[index] = { ...updated[index], content: e.target.value };
                                updateFormData('testimonials', updated);
                              }}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Button with Drawer */}
            <div className="space-y-2 pt-6 mt-6 border-t">
              <Label className="text-lg font-semibold">Preview</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Lihat pratinjau Testimonials Section Anda
              </p>
              <Drawer.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <Drawer.Trigger asChild>
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    <Eye className="mr-2 h-4 w-4" />
                    Buka Preview
                  </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-4 bg-background rounded-t-[10px] flex-1 overflow-y-auto">
                      <div className="mx-auto w-full max-w-5xl">
                        <Drawer.Title className="font-semibold text-lg mb-2">
                          Preview Testimonials Section
                        </Drawer.Title>
                        <Drawer.Description className="text-sm text-muted-foreground mb-4">
                          Pratinjau real-time dari Testimonials Section Anda
                        </Drawer.Description>
                        {/* Inject Theme CSS */}
                        <style
                          dangerouslySetInnerHTML={{
                            __html: generateThemeCSS(tenant?.theme?.primaryColor),
                          }}
                        />
                        {formData.testimonials.length === 0 ? (
                          <div className="border rounded-lg p-8 bg-muted/20 text-center">
                            <p className="text-muted-foreground">
                              Tambahkan minimal 1 testimonial untuk melihat preview
                            </p>
                          </div>
                        ) : (
                          <div className="tenant-theme border rounded-lg overflow-hidden bg-muted/20">
                            <Testimonials1
                              title={formData.testimonialsTitle || 'Testimoni'}
                              subtitle={formData.testimonialsSubtitle}
                              items={formData.testimonials}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t">
              <Button onClick={handleSave} disabled={isSaving} size="lg">
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════
// CONTACT TAB CONTENT
// ══════════════════════════════════════════════════════════════

function ContactTabContent() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<{
    contactTitle: string;
    contactSubtitle: string;
    contactMapUrl: string;
    contactShowMap: boolean;
    contactShowForm: boolean;
    phone: string;
    whatsapp: string;
    address: string;
  } | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        contactTitle: tenant.contactTitle || '',
        contactSubtitle: tenant.contactSubtitle || '',
        contactMapUrl: tenant.contactMapUrl || '',
        contactShowMap: tenant.contactShowMap ?? false,
        contactShowForm: tenant.contactShowForm ?? true,
        phone: tenant.phone || '',
        whatsapp: tenant.whatsapp || '',
        address: tenant.address || '',
      });
    }
  }, [tenant, formData]);

  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        contactTitle: formData.contactTitle,
        contactSubtitle: formData.contactSubtitle,
        contactMapUrl: formData.contactMapUrl,
        contactShowMap: formData.contactShowMap,
        contactShowForm: formData.contactShowForm,
        phone: formData.phone || undefined,
        whatsapp: formData.whatsapp || undefined,
        address: formData.address || undefined,
      });

      await refresh();
      toast.success('Contact section berhasil disimpan');
    } catch (error) {
      console.error('Failed to save contact section:', error);
      toast.error('Gagal menyimpan contact section');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const isLoading = tenant === null || formData === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Contact Section</CardTitle>
        <CardDescription>
          Tampilkan informasi kontak dan lokasi toko agar pelanggan mudah menghubungi Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* Section Header */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactTitle">Judul</Label>
                  <Input
                    id="contactTitle"
                    placeholder="Hubungi Kami"
                    value={formData.contactTitle}
                    onChange={(e) => updateFormData('contactTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactSubtitle">Subtitle</Label>
                  <Input
                    id="contactSubtitle"
                    placeholder="Kami siap membantu Anda"
                    value={formData.contactSubtitle}
                    onChange={(e) => updateFormData('contactSubtitle', e.target.value)}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium">Informasi Kontak</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Nomor Telepon</Label>
                    <Input
                      id="store-phone"
                      placeholder="+62 812-3456-7890"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Nomor telepon toko (ditampilkan di halaman kontak)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-whatsapp">WhatsApp *</Label>
                    <Input
                      id="store-whatsapp"
                      placeholder="6281234567890"
                      value={formData.whatsapp}
                      onChange={(e) => updateFormData('whatsapp', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Nomor WhatsApp (tanpa +, contoh: 6281234567890)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Email</Label>
                    <Input id="store-email" value={tenant?.email || ''} disabled />
                    <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-domain">Domain Toko</Label>
                    <Input
                      id="store-domain"
                      value={`${tenant?.slug || ''}.fibidy.com`}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      URL toko Anda (otomatis dari slug)
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-address">Alamat Lengkap</Label>
                  <Textarea
                    id="store-address"
                    placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota, Provinsi 12345"
                    rows={2}
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alamat lengkap toko (ditampilkan di halaman kontak)
                  </p>
                </div>
              </div>

              {/* Google Maps */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="contactMapUrl">URL Google Maps Embed</Label>
                <Input
                  id="contactMapUrl"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={formData.contactMapUrl}
                  onChange={(e) => updateFormData('contactMapUrl', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL embed dari Google Maps untuk menampilkan lokasi toko
                </p>
              </div>

              {/* Display Options */}
              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="contactShowMap">Tampilkan Peta</Label>
                    <p className="text-xs text-muted-foreground">
                      Menampilkan Google Maps di halaman kontak
                    </p>
                  </div>
                  <Switch
                    id="contactShowMap"
                    checked={formData.contactShowMap}
                    onCheckedChange={(checked) => updateFormData('contactShowMap', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="contactShowForm">Tampilkan Form</Label>
                    <p className="text-xs text-muted-foreground">
                      Menampilkan form kontak di halaman kontak
                    </p>
                  </div>
                  <Switch
                    id="contactShowForm"
                    checked={formData.contactShowForm}
                    onCheckedChange={(checked) => updateFormData('contactShowForm', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Preview Button with Drawer */}
            <div className="space-y-2 pt-6 mt-6 border-t">
              <Label className="text-lg font-semibold">Preview</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Lihat pratinjau Contact Section Anda
              </p>
              <Drawer.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <Drawer.Trigger asChild>
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    <Eye className="mr-2 h-4 w-4" />
                    Buka Preview
                  </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-4 bg-background rounded-t-[10px] flex-1 overflow-y-auto">
                      <div className="mx-auto w-full max-w-5xl">
                        <Drawer.Title className="font-semibold text-lg mb-2">
                          Preview Contact Section
                        </Drawer.Title>
                        <Drawer.Description className="text-sm text-muted-foreground mb-4">
                          Pratinjau real-time dari Contact Section Anda
                        </Drawer.Description>
                        {/* Inject Theme CSS */}
                        <style
                          dangerouslySetInnerHTML={{
                            __html: generateThemeCSS(tenant?.theme?.primaryColor),
                          }}
                        />
                        <div className="tenant-theme border rounded-lg overflow-hidden bg-muted/20">
                          <Contact1
                            title={formData.contactTitle || 'Hubungi Kami'}
                            subtitle={formData.contactSubtitle}
                            whatsapp={formData.whatsapp}
                            phone={formData.phone}
                            address={formData.address}
                            storeName={tenant?.name || ''}
                          />
                        </div>
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t">
              <Button onClick={handleSave} disabled={isSaving} size="lg">
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════
// CTA TAB CONTENT
// ══════════════════════════════════════════════════════════════

function CtaTabContent() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<{
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButtonText: string;
    ctaButtonLink: string;
    ctaButtonStyle: 'primary' | 'secondary' | 'outline';
  } | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        ctaTitle: tenant.ctaTitle || '',
        ctaSubtitle: tenant.ctaSubtitle || '',
        ctaButtonText: tenant.ctaButtonText || '',
        ctaButtonLink: tenant.ctaButtonLink || '',
        ctaButtonStyle: tenant.ctaButtonStyle || 'primary',
      });
    }
  }, [tenant, formData]);

  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        ctaTitle: formData.ctaTitle,
        ctaSubtitle: formData.ctaSubtitle,
        ctaButtonText: formData.ctaButtonText,
        ctaButtonLink: formData.ctaButtonLink,
        ctaButtonStyle: formData.ctaButtonStyle,
      });

      await refresh();
      toast.success('CTA section berhasil disimpan');
    } catch (error) {
      console.error('Failed to save CTA section:', error);
      toast.error('Gagal menyimpan CTA section');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const isLoading = tenant === null || formData === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan CTA Section</CardTitle>
        <CardDescription>
          Call to Action adalah ajakan untuk pengunjung melakukan aksi tertentu (pesan, daftar,
          dll).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* CTA Content */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ctaTitle">Judul CTA</Label>
                  <Input
                    id="ctaTitle"
                    placeholder="Siap Memulai?"
                    value={formData.ctaTitle}
                    onChange={(e) => updateFormData('ctaTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaSubtitle">Subtitle CTA</Label>
                  <Input
                    id="ctaSubtitle"
                    placeholder="Bergabunglah dengan kami"
                    value={formData.ctaSubtitle}
                    onChange={(e) => updateFormData('ctaSubtitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaButtonText">Teks Tombol</Label>
                  <Input
                    id="ctaButtonText"
                    placeholder="Mulai Sekarang"
                    value={formData.ctaButtonText}
                    onChange={(e) => updateFormData('ctaButtonText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaButtonLink">Link Tombol</Label>
                  <Input
                    id="ctaButtonLink"
                    placeholder="/products"
                    value={formData.ctaButtonLink}
                    onChange={(e) => updateFormData('ctaButtonLink', e.target.value)}
                  />
                </div>
              </div>

              {/* Button Style */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="ctaButtonStyle">Gaya Tombol</Label>
                <Select
                  value={formData.ctaButtonStyle}
                  onValueChange={(value: 'primary' | 'secondary' | 'outline') =>
                    updateFormData('ctaButtonStyle', value)
                  }
                >
                  <SelectTrigger id="ctaButtonStyle">
                    <SelectValue placeholder="Pilih gaya tombol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (Biru)</SelectItem>
                    <SelectItem value="secondary">Secondary (Abu-abu)</SelectItem>
                    <SelectItem value="outline">Outline (Hanya Border)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Pilih gaya visual untuk tombol CTA
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2 pt-4 border-t">
                <Label>Preview Tombol</Label>
                <div className="flex items-center gap-3 p-6 bg-muted/50 rounded-lg">
                  <Button
                    variant={
                      formData.ctaButtonStyle === 'primary'
                        ? 'default'
                        : (formData.ctaButtonStyle as 'secondary' | 'outline')
                    }
                    disabled
                  >
                    {formData.ctaButtonText || 'Mulai Sekarang'}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Ini adalah preview tombol CTA Anda
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Button with Drawer */}
            <div className="space-y-2 pt-6 mt-6 border-t">
              <Label className="text-lg font-semibold">Preview</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Lihat pratinjau CTA Section Anda
              </p>
              <Drawer.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <Drawer.Trigger asChild>
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    <Eye className="mr-2 h-4 w-4" />
                    Buka Preview
                  </Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-4 bg-background rounded-t-[10px] flex-1 overflow-y-auto">
                      <div className="mx-auto w-full max-w-5xl">
                        <Drawer.Title className="font-semibold text-lg mb-2">
                          Preview CTA Section
                        </Drawer.Title>
                        <Drawer.Description className="text-sm text-muted-foreground mb-4">
                          Pratinjau real-time dari CTA Section Anda
                        </Drawer.Description>
                        {/* Inject Theme CSS */}
                        <style
                          dangerouslySetInnerHTML={{
                            __html: generateThemeCSS(tenant?.theme?.primaryColor),
                          }}
                        />
                        <div className="tenant-theme border rounded-lg overflow-hidden bg-muted/20">
                          <Cta1
                            title={formData.ctaTitle || 'Siap Memulai?'}
                            subtitle={formData.ctaSubtitle}
                            buttonText={formData.ctaButtonText || 'Mulai Sekarang'}
                            buttonLink={formData.ctaButtonLink || '/products'}
                            buttonVariant={
                              formData.ctaButtonStyle === 'outline'
                                ? 'outline'
                                : formData.ctaButtonStyle === 'secondary'
                                  ? 'secondary'
                                  : 'default'
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t">
              <Button onClick={handleSave} disabled={isSaving} size="lg">
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { ImageUpload } from '@/components/upload';
import { Hero1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types';

const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

export default function HeroSectionPage() {
  const router = useRouter();
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [isRemovingHeroBackground, setIsRemovingHeroBackground] = useState(false);

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
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/settings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <PageHeader
        title="Hero Section - Banner Utama"
        description="Kelola banner utama dan branding toko Anda"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pengaturan Hero Section</CardTitle>
          <CardDescription>
            Hero section adalah bagian pertama yang dilihat pengunjung. Pastikan kontennya menarik dan informatif.
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
                              <Check className="h-5 w-5 text-white" />
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

              {/* Live Preview */}
              <div className="space-y-2 pt-6 mt-6 border-t">
                <Label className="text-lg font-semibold">Live Preview</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Pratinjau real-time dari Hero Section Anda
                </p>
                {/* Inject Theme CSS for Real-time Preview */}
                <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(formData.primaryColor) }} />
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

              {/* Save Button */}
              <div className="flex justify-end pt-6 mt-6 border-t">
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

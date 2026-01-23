'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { ImageUpload } from '@/components/upload';
import { About1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { FeatureItem, Tenant } from '@/types';

export default function AboutPage() {
  const router = useRouter();
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingAboutImage, setIsRemovingAboutImage] = useState(false);

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
        title="About - Tentang Toko"
        description="Ceritakan tentang toko Anda kepada pelanggan"
      />

      <Card className="mt-6">
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
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah Fitur
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
                                onClick={() => {
                                  const updated = formData.aboutFeatures.filter((_, i) => i !== index);
                                  updateFormData('aboutFeatures', updated);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                            <div className="grid gap-3">
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
                                      updated[index] = { ...updated[index], description: e.target.value };
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

              {/* Live Preview */}
              <div className="space-y-2 pt-6 mt-6 border-t">
                <Label className="text-lg font-semibold">Live Preview</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Pratinjau real-time dari About Section Anda
                </p>
                {/* Inject Theme CSS */}
                <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
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

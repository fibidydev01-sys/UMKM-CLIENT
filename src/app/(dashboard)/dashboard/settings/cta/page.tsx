'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { Cta1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { Tenant } from '@/types';

export default function CTAPage() {
  const router = useRouter();
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);

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
        title="CTA - Call to Action"
        description="Dorong pengunjung untuk mengambil tindakan"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pengaturan CTA Section</CardTitle>
          <CardDescription>
            Call to Action adalah ajakan untuk pengunjung melakukan aksi tertentu (pesan, daftar, dll).
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
                      variant={formData.ctaButtonStyle === 'primary' ? 'default' : formData.ctaButtonStyle as 'secondary' | 'outline'}
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

              {/* Live Preview */}
              <div className="space-y-2 pt-6 mt-6 border-t">
                <Label className="text-lg font-semibold">Live Preview</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Pratinjau real-time dari CTA Section Anda
                </p>
                {/* Inject Theme CSS */}
                <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
                <div className="tenant-theme border rounded-lg overflow-hidden bg-muted/20">
                  <Cta1
                    title={formData.ctaTitle || 'Siap Memulai?'}
                    subtitle={formData.ctaSubtitle}
                    buttonText={formData.ctaButtonText || 'Mulai Sekarang'}
                    buttonLink={formData.ctaButtonLink || '/products'}
                    buttonVariant={formData.ctaButtonStyle === 'outline' ? 'outline' : formData.ctaButtonStyle === 'secondary' ? 'secondary' : 'default'}
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { Contact1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { Tenant } from '@/types';

export default function ContactPage() {
  const router = useRouter();
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);

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
        title="Contact - Informasi Kontak"
        description="Kelola informasi kontak dan peta lokasi toko"
      />

      <Card className="mt-6">
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
                      <Input
                        id="store-email"
                        value={tenant?.email || ''}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email tidak dapat diubah
                      </p>
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

              {/* Live Preview */}
              <div className="space-y-2 pt-6 mt-6 border-t">
                <Label className="text-lg font-semibold">Live Preview</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Pratinjau real-time dari Contact Section Anda
                </p>
                {/* Inject Theme CSS */}
                <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
                <div className="tenant-theme border rounded-lg overflow-hidden bg-muted/20">
                  <Contact1
                    title={formData.contactTitle || 'Hubungi Kami'}
                    subtitle={formData.contactSubtitle}
                    whatsapp={formData.whatsapp}
                    phone={formData.phone}
                    email={tenant?.email}
                    address={formData.address}
                    storeName={tenant?.name || ''}
                    mapUrl={formData.contactMapUrl}
                    showMap={formData.contactShowMap}
                    showForm={formData.contactShowForm}
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

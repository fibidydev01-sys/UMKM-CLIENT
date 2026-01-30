'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { ImageUpload } from '@/components/upload';
import { Testimonials1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { Testimonial } from '@/types';

export default function TestimonialsPage() {
  const router = useRouter();
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);

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
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
          &larr; Kembali
        </Button>
      </div>

      <PageHeader
        title="Testimonials - Testimoni Pelanggan"
        description="Kelola testimoni pelanggan untuk meningkatkan kepercayaan"
      />

      <Card className="mt-6">
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

              {/* Live Preview */}
              <div className="space-y-2 pt-6 mt-6 border-t">
                <Label className="text-lg font-semibold">Live Preview</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Pratinjau real-time dari Testimonials Section Anda
                </p>
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
    </div>
  );
}

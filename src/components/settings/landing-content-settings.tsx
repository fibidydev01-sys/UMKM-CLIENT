/* eslint-disable @next/next/no-img-element */
/**
 * ============================================================================
 * FILE: components/settings/landing-content-settings.tsx
 * PURPOSE: Accordion form for managing store information fields
 * ============================================================================
 * This component allows users to edit permanent store data that will be
 * displayed on their landing page. The data is stored in tenant fields,
 * separate from the landing page block selection (landingConfig).
 * ============================================================================
 */
'use client';

import {
  Target,
  BookOpen,
  Star,
  Phone,
  Rocket,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Upload,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { FeatureItem, Testimonial } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface LandingContentData {
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroBackgroundImage: string;
  // About
  aboutTitle: string;
  aboutSubtitle: string;
  aboutContent: string;
  aboutImage: string;
  aboutFeatures: FeatureItem[];
  // Testimonials
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: Testimonial[];
  // Contact
  contactTitle: string;
  contactSubtitle: string;
  contactMapUrl: string;
  contactShowMap: boolean;
  contactShowForm: boolean;
  // CTA
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaButtonStyle: 'primary' | 'secondary' | 'outline';
}

interface LandingContentSettingsProps {
  data: LandingContentData | null;
  isLoading: boolean;
  isSaving: boolean;
  onDataChange: (data: LandingContentData) => void;
  onSave?: () => void;
  hideHero?: boolean; // Option to hide Hero section (avoid duplication with basic store info)
  showSaveButton?: boolean; // Option to hide save button (when using unified save)
  renderAsAccordionItems?: boolean; // NEW: Render only AccordionItems, no Card wrapper
}

// ============================================================================
// SIMPLE IMAGE UPLOAD COMPONENT
// ============================================================================
interface SimpleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'landscape' | 'square';
}

function SimpleImageUpload({ value, onChange, aspectRatio = 'landscape' }: SimpleImageUploadProps) {
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-video';

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className={`w-full ${aspectClass} object-cover rounded-lg border`}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className={`w-full ${aspectClass} border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50`}>
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Upload gambar</p>
          </div>
        </div>
      )}
      <Input
        type="text"
        placeholder="Atau masukkan URL gambar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ============================================================================
// HELPER: Generate unique ID
// ============================================================================
const generateId = () => `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// ============================================================================
// COMPONENT
// ============================================================================

export function LandingContentSettings({
  data,
  isLoading,
  isSaving,
  onDataChange,
  onSave,
  hideHero = false,
  showSaveButton = true,
  renderAsAccordionItems = false,
}: LandingContentSettingsProps) {
  // -------------------------------------------------------------------------
  // Loading State
  // -------------------------------------------------------------------------
  if (isLoading || !data) {
    // When rendering as accordion items, parent handles loading
    if (renderAsAccordionItems) return null;

    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const updateField = <K extends keyof LandingContentData>(
    field: K,
    value: LandingContentData[K]
  ) => {
    onDataChange({ ...data, [field]: value });
  };

  // Feature handlers
  const addFeature = () => {
    const newFeature: FeatureItem = {
      icon: 'Star',
      title: '',
      description: '',
    };
    updateField('aboutFeatures', [...data.aboutFeatures, newFeature]);
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const updated = [...data.aboutFeatures];
    updated[index] = { ...updated[index], [field]: value };
    updateField('aboutFeatures', updated);
  };

  const removeFeature = (index: number) => {
    updateField('aboutFeatures', data.aboutFeatures.filter((_, i) => i !== index));
  };

  // Testimonial handlers
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: generateId(),
      name: '',
      role: '',
      content: '',
      rating: 5,
      avatar: '',
    };
    updateField('testimonials', [...data.testimonials, newTestimonial]);
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    const updated = [...data.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    updateField('testimonials', updated);
  };

  const removeTestimonial = (index: number) => {
    updateField('testimonials', data.testimonials.filter((_, i) => i !== index));
  };

  // -------------------------------------------------------------------------
  // Render - All AccordionItems
  // -------------------------------------------------------------------------
  const accordionItems = (
    <>
      {/* =============================================================== */}
      {/* HERO SECTION */}
      {/* =============================================================== */}
      {!hideHero && (
            <AccordionItem value="hero">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Hero - Banner Utama</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Judul Hero</Label>
                    <Input
                      id="heroTitle"
                      placeholder="Selamat Datang di Toko Kami"
                      value={data.heroTitle}
                      onChange={(e) => updateField('heroTitle', e.target.value)}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {data.heroTitle.length}/200 karakter
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Subtitle Hero</Label>
                    <Textarea
                      id="heroSubtitle"
                      placeholder="Temukan produk terbaik dengan harga terjangkau"
                      value={data.heroSubtitle}
                      onChange={(e) => updateField('heroSubtitle', e.target.value)}
                      maxLength={300}
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      {data.heroSubtitle.length}/300 karakter
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heroCtaText">Teks Tombol CTA</Label>
                      <Input
                        id="heroCtaText"
                        placeholder="Lihat Produk"
                        value={data.heroCtaText}
                        onChange={(e) => updateField('heroCtaText', e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heroCtaLink">Link Tombol CTA</Label>
                      <Input
                        id="heroCtaLink"
                        placeholder="/products"
                        value={data.heroCtaLink}
                        onChange={(e) => updateField('heroCtaLink', e.target.value)}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <SimpleImageUpload
                      value={data.heroBackgroundImage}
                      onChange={(url) => updateField('heroBackgroundImage', url)}
                      aspectRatio="landscape"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            )}

            {/* =============================================================== */}
            {/* ABOUT SECTION */}
            {/* =============================================================== */}
            <AccordionItem value="about">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>About - Tentang Toko</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aboutTitle">Judul</Label>
                      <Input
                        id="aboutTitle"
                        placeholder="Tentang Kami"
                        value={data.aboutTitle}
                        onChange={(e) => updateField('aboutTitle', e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aboutSubtitle">Subtitle</Label>
                      <Input
                        id="aboutSubtitle"
                        placeholder="Cerita di balik toko kami"
                        value={data.aboutSubtitle}
                        onChange={(e) => updateField('aboutSubtitle', e.target.value)}
                        maxLength={300}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutContent">Deskripsi Lengkap</Label>
                    <Textarea
                      id="aboutContent"
                      placeholder="Ceritakan tentang toko Anda, visi misi, dan nilai-nilai yang Anda pegang..."
                      value={data.aboutContent}
                      onChange={(e) => updateField('aboutContent', e.target.value)}
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gambar About</Label>
                    <SimpleImageUpload
                      value={data.aboutImage}
                      onChange={(url) => updateField('aboutImage', url)}
                      aspectRatio="square"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Fitur / Keunggulan</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFeature}
                        disabled={data.aboutFeatures.length >= 6}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {data.aboutFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Judul fitur"
                              value={feature.title}
                              onChange={(e) => updateFeature(index, 'title', e.target.value)}
                            />
                            <Input
                              placeholder="Deskripsi singkat"
                              value={feature.description}
                              onChange={(e) => updateFeature(index, 'description', e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      {data.aboutFeatures.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Belum ada fitur. Klik &quot;Tambah&quot; untuk menambahkan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* =============================================================== */}
            {/* TESTIMONIALS SECTION */}
            {/* =============================================================== */}
            <AccordionItem value="testimonials">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Testimonials - Testimoni Pelanggan</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testimonialsTitle">Judul</Label>
                      <Input
                        id="testimonialsTitle"
                        placeholder="Apa Kata Pelanggan"
                        value={data.testimonialsTitle}
                        onChange={(e) => updateField('testimonialsTitle', e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testimonialsSubtitle">Subtitle</Label>
                      <Input
                        id="testimonialsSubtitle"
                        placeholder="Pengalaman nyata dari pelanggan kami"
                        value={data.testimonialsSubtitle}
                        onChange={(e) => updateField('testimonialsSubtitle', e.target.value)}
                        maxLength={300}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Daftar Testimoni</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTestimonial}
                        disabled={data.testimonials.length >= 20}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {data.testimonials.map((testimonial, index) => (
                        <div
                          key={testimonial.id}
                          className="p-4 bg-muted/50 rounded-lg space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-sm font-medium">
                              Testimoni #{index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTestimonial(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="Nama pelanggan"
                              value={testimonial.name}
                              onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                            />
                            <Input
                              placeholder="Jabatan/Keterangan (opsional)"
                              value={testimonial.role || ''}
                              onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                            />
                          </div>
                          <Textarea
                            placeholder="Isi testimoni..."
                            value={testimonial.content}
                            onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                            rows={2}
                          />
                          <div className="flex items-center gap-4">
                            <Label className="text-sm">Rating:</Label>
                            <Select
                              value={String(testimonial.rating || 5)}
                              onValueChange={(v) => updateTestimonial(index, 'rating', parseInt(v))}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[5, 4, 3, 2, 1].map((r) => (
                                  <SelectItem key={r} value={String(r)}>
                                    {r} ⭐
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                      {data.testimonials.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Belum ada testimoni. Klik &quot;Tambah&quot; untuk menambahkan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* =============================================================== */}
            {/* CONTACT SECTION */}
            {/* =============================================================== */}
            <AccordionItem value="contact">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Contact - Informasi Kontak</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactTitle">Judul</Label>
                      <Input
                        id="contactTitle"
                        placeholder="Hubungi Kami"
                        value={data.contactTitle}
                        onChange={(e) => updateField('contactTitle', e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactSubtitle">Subtitle</Label>
                      <Input
                        id="contactSubtitle"
                        placeholder="Kami siap membantu Anda"
                        value={data.contactSubtitle}
                        onChange={(e) => updateField('contactSubtitle', e.target.value)}
                        maxLength={300}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactMapUrl">Google Maps Embed URL</Label>
                    <Input
                      id="contactMapUrl"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      value={data.contactMapUrl}
                      onChange={(e) => updateField('contactMapUrl', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Dapatkan embed URL dari Google Maps dengan cara: Buka lokasi &gt; Share &gt; Embed a map
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="contactShowMap"
                        checked={data.contactShowMap}
                        onCheckedChange={(checked) => updateField('contactShowMap', checked)}
                      />
                      <Label htmlFor="contactShowMap">Tampilkan Map</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="contactShowForm"
                        checked={data.contactShowForm}
                        onCheckedChange={(checked) => updateField('contactShowForm', checked)}
                      />
                      <Label htmlFor="contactShowForm">Tampilkan Form Kontak</Label>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Info kontak (WhatsApp, Email, Phone, Address) diambil dari{' '}
                    <strong>tab Toko</strong> di pengaturan.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* =============================================================== */}
            {/* CTA SECTION */}
            {/* =============================================================== */}
            <AccordionItem value="cta">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <span>CTA - Call to Action</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ctaTitle">Judul CTA</Label>
                      <Input
                        id="ctaTitle"
                        placeholder="Siap Memulai?"
                        value={data.ctaTitle}
                        onChange={(e) => updateField('ctaTitle', e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ctaSubtitle">Subtitle CTA</Label>
                      <Input
                        id="ctaSubtitle"
                        placeholder="Bergabunglah dengan kami hari ini"
                        value={data.ctaSubtitle}
                        onChange={(e) => updateField('ctaSubtitle', e.target.value)}
                        maxLength={300}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ctaButtonText">Teks Tombol</Label>
                      <Input
                        id="ctaButtonText"
                        placeholder="Mulai Sekarang"
                        value={data.ctaButtonText}
                        onChange={(e) => updateField('ctaButtonText', e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ctaButtonLink">Link Tombol</Label>
                      <Input
                        id="ctaButtonLink"
                        placeholder="/products"
                        value={data.ctaButtonLink}
                        onChange={(e) => updateField('ctaButtonLink', e.target.value)}
                        maxLength={500}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ctaButtonStyle">Style Tombol</Label>
                      <Select
                        value={data.ctaButtonStyle}
                        onValueChange={(v) =>
                          updateField('ctaButtonStyle', v as 'primary' | 'secondary' | 'outline')
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
    </>
  );

  // -------------------------------------------------------------------------
  // Render Mode: AccordionItems Only (for unified card)
  // -------------------------------------------------------------------------
  if (renderAsAccordionItems) {
    return accordionItems;
  }

  // -------------------------------------------------------------------------
  // Render Mode: Full Card Wrapper (standalone)
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Konten Landing Page</h3>
            <p className="text-sm text-muted-foreground">
              Kelola informasi yang akan ditampilkan di landing page toko Anda.
              Data ini bersifat permanen dan tidak akan berubah saat Anda mengganti template.
            </p>
          </div>

          <Accordion
            type="multiple"
            defaultValue={hideHero ? ['about'] : ['hero']}
            className="w-full"
          >
            {accordionItems}
          </Accordion>
        </CardContent>
      </Card>

      {/* Save Button */}
      {showSaveButton && onSave && (
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      )}
    </div>
  );
}
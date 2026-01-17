// ============================================================================
// FILE: src/components/landing/landing-builder.tsx
// PURPOSE: Landing page builder with proper Publish flow (NO AUTO-SAVE!)
// ✅ UPDATED: Added validation errors display
// ============================================================================

'use client';

import { useState, useCallback } from 'react';
import {
  Loader2,
  Eye,
  Upload,
  RotateCcw,
  Target,
  BookOpen,
  ShoppingBag,
  Star,
  Phone,
  Rocket,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

import { TestimonialEditor } from './testimonial-editor';
import { VariantSelector } from './variant-selector';
import { normalizeTestimonials } from '@/lib/landing';
import { cn } from '@/lib/utils';
import type { TenantLandingConfig, Testimonial } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface LandingBuilderProps {
  config: TenantLandingConfig;
  onConfigChange: (config: TenantLandingConfig) => void;
  tenantSlug: string;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  validationErrors?: string[];
  onPublish: () => Promise<boolean>;
  onDiscard: () => void;
  onReset: () => Promise<boolean>;
  onClearErrors?: () => void;
}

// ============================================================================
// SECTION DEFINITIONS
// ============================================================================

const SECTIONS = [
  {
    key: 'hero',
    title: 'Hero Section',
    description: 'Banner utama di bagian atas halaman',
    icon: Target
  },
  {
    key: 'about',
    title: 'Tentang Kami',
    description: 'Informasi tentang toko Anda',
    icon: BookOpen
  },
  {
    key: 'products',
    title: 'Produk Unggulan',
    description: 'Tampilkan produk terbaik Anda',
    icon: ShoppingBag
  },
  {
    key: 'testimonials',
    title: 'Testimoni',
    description: 'Ulasan dari pelanggan',
    icon: Star
  },
  {
    key: 'contact',
    title: 'Kontak',
    description: 'Informasi kontak toko',
    icon: Phone
  },
  {
    key: 'cta',
    title: 'Call to Action',
    description: 'Ajakan untuk berbelanja',
    icon: Rocket
  },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LandingBuilder({
  config,
  onConfigChange,
  tenantSlug,
  hasUnsavedChanges,
  isSaving,
  validationErrors = [],
  onPublish,
  onDiscard,
  onReset,
  onClearErrors,
}: LandingBuilderProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['hero']);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // ==========================================================================
  // TOGGLE SECTION - LOCAL ONLY, NO AUTO-SAVE!
  // ==========================================================================
  const handleToggleSection = useCallback((key: SectionKey, enabled: boolean) => {
    const currentSection = config[key] || {};
    onConfigChange({
      ...config,
      [key]: {
        ...currentSection,
        enabled,
      },
    });
  }, [config, onConfigChange]);

  // ==========================================================================
  // UPDATE HANDLERS
  // ==========================================================================
  const handleUpdateSection = useCallback((
    key: SectionKey,
    field: string,
    value: string
  ) => {
    const currentSection = config[key] || {};
    onConfigChange({
      ...config,
      [key]: {
        ...currentSection,
        [field]: value,
      },
    });
  }, [config, onConfigChange]);

  const handleUpdateSectionConfig = useCallback((
    key: SectionKey,
    configUpdates: Record<string, unknown>
  ) => {
    const currentSection = config[key] || {};
    const currentConfig = (currentSection as Record<string, unknown>).config || {};
    onConfigChange({
      ...config,
      [key]: {
        ...currentSection,
        config: { ...currentConfig, ...configUpdates },
      },
    });
  }, [config, onConfigChange]);

  const handleTestimonialsChange = useCallback((items: Testimonial[]) => {
    onConfigChange({
      ...config,
      testimonials: {
        ...config.testimonials,
        config: { items: normalizeTestimonials(items) },
      },
    });
  }, [config, onConfigChange]);

  // ==========================================================================
  // VARIANT CHANGE HANDLER
  // ==========================================================================
  const handleVariantChange = useCallback((
    key: SectionKey,
    variant: string
  ) => {
    const currentSection = config[key] || {};
    onConfigChange({
      ...config,
      [key]: {
        ...currentSection,
        variant,
      },
    });
  }, [config, onConfigChange]);

  // ==========================================================================
  // ACTION HANDLERS
  // ==========================================================================
  const handlePublish = async () => {
    await onPublish();
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true);
    }
  };

  const handleConfirmDiscard = () => {
    onDiscard();
    setShowDiscardDialog(false);
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

  const handleConfirmReset = async () => {
    await onReset();
    setShowResetDialog(false);
  };

  const handlePreview = () => {
    window.open(`/store/${tenantSlug}`, '_blank');
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="space-y-6">
      {/* ✅ NEW: Validation Errors Display */}
      {validationErrors.length > 0 && (
        <Card className="p-4 border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Validasi Gagal ({validationErrors.length} error)
                </p>
                {onClearErrors && (
                  <button
                    onClick={onClearErrors}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <ul className="mt-2 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-xs text-red-700 dark:text-red-300 flex items-start gap-1">
                    <span className="text-red-500">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && validationErrors.length === 0 && (
        <Card className="p-4 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Ada perubahan yang belum dipublish
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                Klik &quot;Publish&quot; untuk menyimpan perubahan ke toko online Anda
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Konfigurasi Section</h3>
          <p className="text-sm text-muted-foreground">
            Aktifkan dan atur setiap bagian landing page
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          {hasUnsavedChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
            >
              Batalkan
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isSaving || !hasUnsavedChanges}
            className={cn(
              hasUnsavedChanges && !isSaving && 'bg-green-600 hover:bg-green-700'
            )}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Sections Accordion */}
      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-3"
      >
        {SECTIONS.map((section) => {
          const IconComponent = section.icon;
          const sectionConfig = config[section.key];
          const isEnabled = sectionConfig?.enabled ?? false;

          return (
            <AccordionItem
              key={section.key}
              value={section.key}
              className={cn(
                'border rounded-lg overflow-hidden transition-colors',
                isEnabled && 'border-primary/50 bg-primary/5'
              )}
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 px-4 py-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{section.title}</p>
                      {isEnabled && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Aktif
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {section.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(enabled) => handleToggleSection(section.key, enabled)}
                  onClick={(e) => e.stopPropagation()}
                />
                <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]>svg]:rotate-180">
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
              </div>

              {/* Section Content */}
              <AccordionContent className="px-4 pb-4">
                <Separator className="mb-4" />
                {section.key === 'testimonials' ? (
                  <TestimonialsSection
                    config={config.testimonials}
                    onTitleChange={(value) => handleUpdateSection('testimonials', 'title', value)}
                    onSubtitleChange={(value) => handleUpdateSection('testimonials', 'subtitle', value)}
                    onItemsChange={handleTestimonialsChange}
                    onVariantChange={(variant) => handleVariantChange('testimonials', variant)}
                  />
                ) : (
                  <GenericSection
                    sectionKey={section.key}
                    config={sectionConfig}
                    onTitleChange={(value) => handleUpdateSection(section.key, 'title', value)}
                    onSubtitleChange={(value) => handleUpdateSection(section.key, 'subtitle', value)}
                    onConfigChange={(updates) => handleUpdateSectionConfig(section.key, updates)}
                    onVariantChange={(variant) => handleVariantChange(section.key, variant)}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Landing Page?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua konfigurasi landing page akan direset ke default.
              Perubahan ini akan langsung dipublish. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset}>
              Ya, Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Perubahan?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua perubahan yang belum dipublish akan hilang. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

interface TestimonialsSectionProps {
  config: TenantLandingConfig['testimonials'];
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onItemsChange: (items: Testimonial[]) => void;
  onVariantChange: (variant: string) => void;
}

function TestimonialsSection({
  config,
  onTitleChange,
  onSubtitleChange,
  onItemsChange,
  onVariantChange,
}: TestimonialsSectionProps) {
  const items = normalizeTestimonials(config?.config?.items);

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      <VariantSelector
        section="testimonials"
        selectedVariant={config?.variant}
        onSelect={onVariantChange}
      />

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="testimonials-title">Judul Section</Label>
          <Input
            id="testimonials-title"
            value={config?.title || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Apa Kata Mereka?"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="testimonials-subtitle">Subtitle</Label>
          <Input
            id="testimonials-subtitle"
            value={config?.subtitle || ''}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Testimoni dari pelanggan kami"
          />
        </div>
      </div>
      <Separator />
      <div>
        <Label className="mb-3 block">Daftar Testimoni ({items.length})</Label>
        <TestimonialEditor
          items={items}
          onChange={onItemsChange}
        />
      </div>
    </div>
  );
}

// ============================================================================
// GENERIC SECTION (Hero, About, Products, Contact, CTA)
// ============================================================================

interface GenericSectionProps {
  sectionKey: Exclude<SectionKey, 'testimonials'>;
  config: TenantLandingConfig[SectionKey];
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onConfigChange: (updates: Record<string, unknown>) => void;
  onVariantChange: (variant: string) => void;
}

function GenericSection({
  sectionKey,
  config,
  onTitleChange,
  onSubtitleChange,
  onConfigChange,
  onVariantChange,
}: GenericSectionProps) {
  const sectionConfig = (config?.config || {}) as Record<string, unknown>;

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      <VariantSelector
        section={sectionKey as any}
        selectedVariant={config?.variant}
        onSelect={onVariantChange}
      />

      <Separator />

      {/* Common Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Judul Section</Label>
          <Input
            value={config?.title || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Masukkan judul..."
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={config?.subtitle || ''}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Masukkan subtitle..."
          />
        </div>
      </div>

      {/* Section-specific Fields */}
      {sectionKey === 'hero' && (
        <HeroFields config={sectionConfig} onChange={onConfigChange} />
      )}
      {sectionKey === 'about' && (
        <AboutFields config={sectionConfig} onChange={onConfigChange} />
      )}
      {sectionKey === 'products' && (
        <ProductsFields config={sectionConfig} onChange={onConfigChange} />
      )}
      {sectionKey === 'contact' && (
        <ContactFields config={sectionConfig} onChange={onConfigChange} />
      )}
      {sectionKey === 'cta' && (
        <CtaFields config={sectionConfig} onChange={onConfigChange} />
      )}
    </div>
  );
}

// ============================================================================
// FIELD COMPONENTS
// ============================================================================

interface FieldProps {
  config: Record<string, unknown>;
  onChange: (updates: Record<string, unknown>) => void;
}

function HeroFields({ config, onChange }: FieldProps) {
  return (
    <>
      <Separator />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Layout</Label>
          <Select
            value={(config.layout as string) || 'centered'}
            onValueChange={(value) => onChange({ layout: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centered">Tengah</SelectItem>
              <SelectItem value="left">Kiri</SelectItem>
              <SelectItem value="right">Kanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Teks Tombol CTA</Label>
          <Input
            value={(config.ctaText as string) || ''}
            onChange={(e) => onChange({ ctaText: e.target.value })}
            placeholder="Lihat Produk"
          />
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div>
          <Label>Tampilkan Tombol CTA</Label>
          <p className="text-xs text-muted-foreground">Tombol ajakan di hero section</p>
        </div>
        <Switch
          checked={(config.showCta as boolean) ?? true}
          onCheckedChange={(checked) => onChange({ showCta: checked })}
        />
      </div>
    </>
  );
}

function AboutFields({ config, onChange }: FieldProps) {
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Deskripsi Lengkap</Label>
          <Textarea
            value={(config.description as string) || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Ceritakan tentang toko Anda..."
            rows={4}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <Label>Tampilkan Gambar</Label>
            <p className="text-xs text-muted-foreground">Gambar di samping deskripsi</p>
          </div>
          <Switch
            checked={(config.showImage as boolean) ?? true}
            onCheckedChange={(checked) => onChange({ showImage: checked })}
          />
        </div>
        {(config.showImage as boolean) !== false && (
          <div className="space-y-2">
            <Label>URL Gambar</Label>
            <Input
              value={(config.image as string) || ''}
              onChange={(e) => onChange({ image: e.target.value })}
              placeholder="https://..."
            />
          </div>
        )}
      </div>
    </>
  );
}

function ProductsFields({ config, onChange }: FieldProps) {
  return (
    <>
      <Separator />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Mode Tampilan</Label>
          <Select
            value={(config.displayMode as string) || 'featured'}
            onValueChange={(value) => onChange({ displayMode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Produk Unggulan</SelectItem>
              <SelectItem value="latest">Produk Terbaru</SelectItem>
              <SelectItem value="all">Semua Produk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Jumlah Produk</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={(config.limit as number) || 8}
            onChange={(e) => onChange({ limit: parseInt(e.target.value) || 8 })}
          />
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div>
          <Label>Tombol Lihat Semua</Label>
          <p className="text-xs text-muted-foreground">Link ke halaman produk</p>
        </div>
        <Switch
          checked={(config.showViewAll as boolean) ?? true}
          onCheckedChange={(checked) => onChange({ showViewAll: checked })}
        />
      </div>
    </>
  );
}

function ContactFields({ config, onChange }: FieldProps) {
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <Label>Tampilkan Map</Label>
            <p className="text-xs text-muted-foreground">Embed Google Maps</p>
          </div>
          <Switch
            checked={(config.showMap as boolean) ?? false}
            onCheckedChange={(checked) => onChange({ showMap: checked })}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <Label>Tampilkan Form Kontak</Label>
            <p className="text-xs text-muted-foreground">Form untuk mengirim pesan</p>
          </div>
          <Switch
            checked={(config.showForm as boolean) ?? true}
            onCheckedChange={(checked) => onChange({ showForm: checked })}
          />
        </div>
      </div>
    </>
  );
}

function CtaFields({ config, onChange }: FieldProps) {
  return (
    <>
      <Separator />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Teks Tombol</Label>
          <Input
            value={(config.buttonText as string) || ''}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Mulai Belanja"
          />
        </div>
        <div className="space-y-2">
          <Label>Link Tombol</Label>
          <Input
            value={(config.buttonLink as string) || ''}
            onChange={(e) => onChange({ buttonLink: e.target.value })}
            placeholder="/products"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Style Tombol</Label>
        <Select
          value={(config.style as string) || 'primary'}
          onValueChange={(value) => onChange({ style: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary (Warna Utama)</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
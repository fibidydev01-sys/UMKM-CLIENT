'use client';

import { useState, useCallback } from 'react';
import {
  Loader2,
  Eye,
  Save,
  RotateCcw,
  Target,
  BookOpen,
  ShoppingBag,
  Star,
  Phone,
  Rocket,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Separator } from '@/components/ui/separator';

import { TestimonialEditor } from './testimonial-editor';
import { tenantsApi } from '@/lib/api';
import type { TenantLandingConfig, Testimonial } from '@/types';

// ==========================================
// TYPES
// ==========================================

interface LandingBuilderProps {
  config: TenantLandingConfig;
  onConfigChange: (config: TenantLandingConfig) => void;
  tenantSlug: string;
  onSave?: () => void;
  hasUnsavedChanges?: boolean;
}

// ==========================================
// SECTION DEFINITIONS
// ==========================================

const SECTIONS = [
  { key: 'hero', title: 'Hero Section', description: 'Banner utama di bagian atas halaman', icon: Target },
  { key: 'about', title: 'Tentang Kami', description: 'Informasi tentang toko Anda', icon: BookOpen },
  { key: 'products', title: 'Produk', description: 'Tampilkan produk unggulan', icon: ShoppingBag },
  { key: 'testimonials', title: 'Testimoni', description: 'Ulasan dari pelanggan', icon: Star },
  { key: 'contact', title: 'Kontak', description: 'Informasi kontak toko', icon: Phone },
  { key: 'cta', title: 'Call to Action', description: 'Ajakan untuk berbelanja', icon: Rocket },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

// ==========================================
// HELPER: Flatten nested array (untuk testimonials)
// ==========================================
function flattenItems(items: unknown): Testimonial[] {
  if (!items) return [];

  let result = items;
  while (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
    result = result[0];
  }

  if (!Array.isArray(result)) return [];

  return result.filter(
    (item): item is Testimonial =>
      item && typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' && item.name.trim() !== '' &&
      typeof item.content === 'string' && item.content.trim() !== ''
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function LandingBuilder({
  config,
  onConfigChange,
  tenantSlug,
  onSave,
  hasUnsavedChanges,
}: LandingBuilderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['hero']);

  // ==========================================
  // SAVE - Langsung save apa adanya, GA ADA DEFAULT!
  // ==========================================
  const saveToDb = useCallback(async (configToSave: TenantLandingConfig) => {
    const testimonialItems = flattenItems(configToSave.testimonials?.config?.items);

    // Check any section enabled = global enabled
    const hasActive =
      configToSave.hero?.enabled ||
      configToSave.about?.enabled ||
      configToSave.products?.enabled ||
      (configToSave.testimonials?.enabled && testimonialItems.length > 0) ||
      configToSave.contact?.enabled ||
      configToSave.cta?.enabled;

    const toSave: TenantLandingConfig = {
      ...configToSave,
      enabled: hasActive || false,
      testimonials: {
        ...configToSave.testimonials,
        config: { items: testimonialItems },
      },
    };

    await tenantsApi.update({ landingConfig: toSave });
    return toSave;
  }, []);

  // ==========================================
  // TOGGLE SECTION - AUTO SAVE!
  // ==========================================
  const handleToggleSection = async (key: SectionKey, enabled: boolean) => {
    const newConfig = {
      ...config,
      [key]: {
        ...config[key],
        enabled,
      },
    };

    onConfigChange(newConfig);

    // AUTO SAVE!
    try {
      await saveToDb(newConfig);
      const sectionTitle = SECTIONS.find(s => s.key === key)?.title;
      toast.success(`${sectionTitle} ${enabled ? 'aktif' : 'nonaktif'}`);
    } catch {
      toast.error('Gagal menyimpan');
    }
  };

  // ==========================================
  // UPDATE HANDLERS
  // ==========================================
  const handleUpdateSection = (key: SectionKey, updates: Record<string, unknown>) => {
    const currentSection = config[key] || {};
    const currentConfig = (currentSection as Record<string, unknown>).config || {};
    const updatesConfig = (updates as Record<string, unknown>).config || {};

    onConfigChange({
      ...config,
      [key]: {
        ...currentSection,
        ...updates,
        config: { ...currentConfig, ...updatesConfig },
      },
    });
  };

  const handleUpdateSectionConfig = (key: SectionKey, configUpdates: Record<string, unknown>) => {
    const currentSection = config[key] || {};
    const currentConfig = (currentSection as Record<string, unknown>).config || {};

    onConfigChange({
      ...config,
      [key]: {
        ...currentSection,
        config: { ...currentConfig, ...configUpdates },
      },
    });
  };

  const handleTestimonialsChange = (items: Testimonial[]) => {
    onConfigChange({
      ...config,
      testimonials: {
        ...config.testimonials,
        config: { items: flattenItems(items) },
      },
    });
  };

  const handleTestimonialsTitleChange = (field: 'title' | 'subtitle', value: string) => {
    onConfigChange({
      ...config,
      testimonials: {
        ...config.testimonials,
        [field]: value,
      },
    });
  };

  // ==========================================
  // MANUAL SAVE
  // ==========================================
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveToDb(config);
      toast.success('Landing page berhasil disimpan');
      onSave?.();
    } catch {
      toast.error('Gagal menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    // Reset = semua section disabled
    const resetConfig: TenantLandingConfig = {
      enabled: false,
      hero: { enabled: false, title: '', subtitle: '', config: {} },
      about: { enabled: false, title: '', subtitle: '', config: {} },
      products: { enabled: false, title: '', subtitle: '', config: {} },
      testimonials: { enabled: false, title: '', subtitle: '', config: { items: [] } },
      contact: { enabled: false, title: '', subtitle: '', config: {} },
      cta: { enabled: false, title: '', subtitle: '', config: {} },
    };
    onConfigChange(resetConfig);
    await saveToDb(resetConfig);
    toast.info('Landing page direset');
  };

  const handlePreview = () => {
    window.open(`/store/${tenantSlug}`, '_blank');
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Landing Page Builder</h3>
          <p className="text-sm text-muted-foreground">Kustomisasi halaman landing toko Anda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={hasUnsavedChanges ? 'animate-pulse' : ''}
          >
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Simpan
          </Button>
        </div>
      </div>

      {/* Sections */}
      <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-4">
        {SECTIONS.map((section) => {
          const IconComponent = section.icon;
          const sectionConfig = config[section.key];
          const isEnabled = sectionConfig?.enabled ?? false;

          return (
            <AccordionItem key={section.key} value={section.key} className="border rounded-lg">
              <div className="flex items-center gap-4 px-4 py-2">
                <div className="flex items-center gap-3 flex-1">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">{section.title}</p>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(enabled) => handleToggleSection(section.key, enabled)}
                  onClick={(e) => e.stopPropagation()}
                />
                <AccordionTrigger className="hover:no-underline py-2" />
              </div>
              <AccordionContent className="px-4 pb-4">
                <Separator className="mb-4" />
                {section.key === 'testimonials' ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="testimonials-title">Judul</Label>
                        <Input
                          id="testimonials-title"
                          value={config.testimonials?.title || ''}
                          onChange={(e) => handleTestimonialsTitleChange('title', e.target.value)}
                          placeholder="Masukkan judul..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testimonials-subtitle">Subtitle</Label>
                        <Input
                          id="testimonials-subtitle"
                          value={config.testimonials?.subtitle || ''}
                          onChange={(e) => handleTestimonialsTitleChange('subtitle', e.target.value)}
                          placeholder="Masukkan subtitle..."
                        />
                      </div>
                    </div>
                    <Separator />
                    <TestimonialEditor
                      items={flattenItems(config.testimonials?.config?.items)}
                      onChange={handleTestimonialsChange}
                    />
                  </div>
                ) : (
                  <SectionEditor
                    sectionKey={section.key}
                    config={config[section.key]}
                    onUpdate={(updates) => handleUpdateSection(section.key, updates)}
                    onUpdateConfig={(configUpdates) => handleUpdateSectionConfig(section.key, configUpdates)}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

// ==========================================
// SECTION EDITOR
// ==========================================

interface SectionEditorProps {
  sectionKey: Exclude<SectionKey, 'testimonials'>;
  config: TenantLandingConfig[SectionKey];
  onUpdate: (updates: Record<string, unknown>) => void;
  onUpdateConfig: (configUpdates: Record<string, unknown>) => void;
}

function SectionEditor({ sectionKey, config, onUpdate, onUpdateConfig }: SectionEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${sectionKey}-title`}>Judul</Label>
          <Input
            id={`${sectionKey}-title`}
            value={config?.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Masukkan judul..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${sectionKey}-subtitle`}>Subtitle</Label>
          <Input
            id={`${sectionKey}-subtitle`}
            value={config?.subtitle || ''}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="Masukkan subtitle..."
          />
        </div>
      </div>

      {sectionKey === 'hero' && <HeroFields config={config?.config as Record<string, unknown>} onUpdate={onUpdateConfig} />}
      {sectionKey === 'about' && <AboutFields config={config?.config as Record<string, unknown>} onUpdate={onUpdateConfig} />}
      {sectionKey === 'products' && <ProductsFields config={config?.config as Record<string, unknown>} onUpdate={onUpdateConfig} />}
      {sectionKey === 'cta' && <CtaFields config={config?.config as Record<string, unknown>} onUpdate={onUpdateConfig} />}
    </div>
  );
}

// ==========================================
// FIELD COMPONENTS
// ==========================================

interface FieldProps {
  config: Record<string, unknown> | undefined;
  onUpdate: (updates: Record<string, unknown>) => void;
}

function HeroFields({ config, onUpdate }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Layout</Label>
        <Select value={(config?.layout as string) || 'centered'} onValueChange={(value) => onUpdate({ layout: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="centered">Tengah</SelectItem>
            <SelectItem value="left">Kiri</SelectItem>
            <SelectItem value="right">Kanan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Teks Tombol CTA</Label>
        <Input value={(config?.ctaText as string) || ''} onChange={(e) => onUpdate({ ctaText: e.target.value })} placeholder="Lihat Produk" />
      </div>
      <div className="flex items-center justify-between">
        <Label>Tampilkan Tombol CTA</Label>
        <Switch checked={(config?.showCta as boolean) ?? true} onCheckedChange={(checked) => onUpdate({ showCta: checked })} />
      </div>
    </div>
  );
}

function AboutFields({ config, onUpdate }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Tampilkan Gambar</Label>
        <Switch checked={(config?.showImage as boolean) ?? true} onCheckedChange={(checked) => onUpdate({ showImage: checked })} />
      </div>
      <div className="space-y-2">
        <Label>URL Gambar</Label>
        <Input value={(config?.image as string) || ''} onChange={(e) => onUpdate({ image: e.target.value })} placeholder="https://..." />
      </div>
    </div>
  );
}

function ProductsFields({ config, onUpdate }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Mode Tampilan</Label>
        <Select value={(config?.displayMode as string) || 'featured'} onValueChange={(value) => onUpdate({ displayMode: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Produk Unggulan</SelectItem>
            <SelectItem value="latest">Produk Terbaru</SelectItem>
            <SelectItem value="all">Semua Produk</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Jumlah Produk</Label>
        <Input type="number" min={1} max={20} value={(config?.limit as number) || 8} onChange={(e) => onUpdate({ limit: parseInt(e.target.value) || 8 })} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Tampilkan Tombol Lihat Semua</Label>
        <Switch checked={(config?.showViewAll as boolean) ?? true} onCheckedChange={(checked) => onUpdate({ showViewAll: checked })} />
      </div>
    </div>
  );
}

function CtaFields({ config, onUpdate }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Teks Tombol</Label>
        <Input value={(config?.buttonText as string) || ''} onChange={(e) => onUpdate({ buttonText: e.target.value })} placeholder="Mulai Belanja" />
      </div>
      <div className="space-y-2">
        <Label>Link Tombol</Label>
        <Input value={(config?.buttonLink as string) || ''} onChange={(e) => onUpdate({ buttonLink: e.target.value })} placeholder="/products" />
      </div>
      <div className="space-y-2">
        <Label>Style Tombol</Label>
        <Select value={(config?.style as string) || 'primary'} onValueChange={(value) => onUpdate({ style: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
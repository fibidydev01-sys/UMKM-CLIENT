'use client';

import { useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
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

import { tenantsApi } from '@/lib/api';
import { DEFAULT_LANDING_CONFIG } from '@/types/landing';
import type { TenantLandingConfig } from '@/types';

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
// SECTION DEFINITIONS (Lucide Icons)
// ==========================================

const SECTIONS = [
  {
    key: 'hero',
    title: 'Hero Section',
    description: 'Banner utama di bagian atas halaman',
    icon: Target,
  },
  {
    key: 'about',
    title: 'Tentang Kami',
    description: 'Informasi tentang toko Anda',
    icon: BookOpen,
  },
  {
    key: 'products',
    title: 'Produk',
    description: 'Tampilkan produk unggulan',
    icon: ShoppingBag,
  },
  {
    key: 'testimonials',
    title: 'Testimoni',
    description: 'Ulasan dari pelanggan',
    icon: Star,
  },
  {
    key: 'contact',
    title: 'Kontak',
    description: 'Informasi kontak toko',
    icon: Phone,
  },
  {
    key: 'cta',
    title: 'Call to Action',
    description: 'Ajakan untuk berbelanja',
    icon: Rocket,
  },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

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
  // HANDLERS - Now using parent state
  // ==========================================

  const handleToggleSection = (key: SectionKey, enabled: boolean) => {
    onConfigChange({
      ...config,
      [key]: {
        ...config[key],
        enabled,
      },
    });
  };

  const handleUpdateSection = (
    key: SectionKey,
    updates: Partial<TenantLandingConfig[SectionKey]>
  ) => {
    onConfigChange({
      ...config,
      [key]: {
        ...config[key],
        ...updates,
      },
    });
  };

  const handleUpdateSectionConfig = (
    key: SectionKey,
    configUpdates: Record<string, unknown>
  ) => {
    onConfigChange({
      ...config,
      [key]: {
        ...config[key],
        config: {
          ...config[key]?.config,
          ...configUpdates,
        },
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await tenantsApi.update({ landingConfig: config });
      toast.success('Landing page berhasil disimpan');
      onSave?.();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Gagal menyimpan landing page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    onConfigChange(DEFAULT_LANDING_CONFIG);
    toast.info('Konfigurasi direset ke default');
  };

  const handlePreview = () => {
    window.open(`/store/${tenantSlug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Landing Page Builder</h3>
          <p className="text-sm text-muted-foreground">
            Kustomisasi halaman landing toko Anda
          </p>
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
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan
          </Button>
        </div>
      </div>

      {/* Global Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">
                Aktifkan Landing Page Custom
              </Label>
              <p className="text-sm text-muted-foreground">
                Jika dimatikan, akan menggunakan tampilan default
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) =>
                onConfigChange({ ...config, enabled })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      {config.enabled && (
        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="space-y-4"
        >
          {SECTIONS.map((section) => {
            const IconComponent = section.icon;
            const isEnabled = config[section.key]?.enabled ?? false;

            return (
              <AccordionItem
                key={section.key}
                value={section.key}
                className="border rounded-lg"
              >
                {/* FIXED LAYOUT: Icon/Text (flex-1) | Toggle | Arrow */}
                <div className="flex items-center gap-4 px-4 py-2">
                  <div className="flex items-center gap-3 flex-1">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">{section.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(enabled) =>
                      handleToggleSection(section.key, enabled)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <AccordionTrigger className="hover:no-underline py-2" />
                </div>
                <AccordionContent className="px-4 pb-4">
                  <Separator className="mb-4" />
                  <SectionEditor
                    sectionKey={section.key}
                    config={config[section.key]}
                    onUpdate={(updates) =>
                      handleUpdateSection(section.key, updates)
                    }
                    onUpdateConfig={(configUpdates) =>
                      handleUpdateSectionConfig(section.key, configUpdates)
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

// ==========================================
// SECTION EDITOR
// ==========================================

interface SectionEditorProps {
  sectionKey: SectionKey;
  config: TenantLandingConfig[SectionKey];
  onUpdate: (updates: Partial<TenantLandingConfig[SectionKey]>) => void;
  onUpdateConfig: (configUpdates: Record<string, unknown>) => void;
}

function SectionEditor({
  sectionKey,
  config,
  onUpdate,
  onUpdateConfig,
}: SectionEditorProps) {
  return (
    <div className="space-y-4">
      {/* Common Fields: Title & Subtitle */}
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

      {/* Section-Specific Fields */}
      {sectionKey === 'hero' && (
        <HeroFields config={config?.config} onUpdate={onUpdateConfig} />
      )}
      {sectionKey === 'about' && (
        <AboutFields config={config?.config} onUpdate={onUpdateConfig} />
      )}
      {sectionKey === 'products' && (
        <ProductsFields config={config?.config} onUpdate={onUpdateConfig} />
      )}
      {sectionKey === 'cta' && (
        <CtaFields config={config?.config} onUpdate={onUpdateConfig} />
      )}
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
        <Select
          value={(config?.layout as string) || 'centered'}
          onValueChange={(value) => onUpdate({ layout: value })}
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
          value={(config?.ctaText as string) || ''}
          onChange={(e) => onUpdate({ ctaText: e.target.value })}
          placeholder="Lihat Produk"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Tampilkan Tombol CTA</Label>
        <Switch
          checked={(config?.showCta as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ showCta: checked })}
        />
      </div>
    </div>
  );
}

function AboutFields({ config, onUpdate }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Tampilkan Gambar</Label>
        <Switch
          checked={(config?.showImage as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ showImage: checked })}
        />
      </div>
      <div className="space-y-2">
        <Label>URL Gambar</Label>
        <Input
          value={(config?.image as string) || ''}
          onChange={(e) => onUpdate({ image: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}

function ProductsFields({ config, onUpdate }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Mode Tampilan</Label>
        <Select
          value={(config?.displayMode as string) || 'featured'}
          onValueChange={(value) => onUpdate({ displayMode: value })}
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
          value={(config?.limit as number) || 8}
          onChange={(e) => onUpdate({ limit: parseInt(e.target.value) || 8 })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Tampilkan Tombol Lihat Semua</Label>
        <Switch
          checked={(config?.showViewAll as boolean) ?? true}
          onCheckedChange={(checked) => onUpdate({ showViewAll: checked })}
        />
      </div>
    </div>
  );
}

function CtaFields({ config, onUpdate }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Teks Tombol</Label>
        <Input
          value={(config?.buttonText as string) || ''}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
          placeholder="Mulai Belanja"
        />
      </div>
      <div className="space-y-2">
        <Label>Link Tombol</Label>
        <Input
          value={(config?.buttonLink as string) || ''}
          onChange={(e) => onUpdate({ buttonLink: e.target.value })}
          placeholder="/products"
        />
      </div>
      <div className="space-y-2">
        <Label>Style Tombol</Label>
        <Select
          value={(config?.style as string) || 'primary'}
          onValueChange={(value) => onUpdate({ style: value })}
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
  );
}
/**
 * ============================================================================
 * FILE: src/components/landing-builder/landing-builder-simplified.tsx
 * PURPOSE: Simplified Landing Builder - Block Selection Only
 * ============================================================================
 *
 * REFACTORED: Data input removed, now handled in Settings > Landing Content
 * This component only handles:
 * - Enable/disable section toggle
 * - Block selection (hero1-200, about1-200, etc.)
 * - Read-only preview of data from tenant fields
 *
 * ============================================================================
 */

'use client';

import { useState, useCallback } from 'react';
import {
  Target,
  BookOpen,
  ShoppingBag,
  Star,
  Phone,
  Rocket,
  AlertCircle,
  AlertTriangle,
  X,
  Info,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';
import {
  extractHeroData,
  extractAboutData,
  extractTestimonialsData,
  extractContactData,
  extractCtaData,
} from '@/lib/landing/helpers';

// ============================================================================
// TYPES
// ============================================================================

interface LandingBuilderSimplifiedProps {
  config: TenantLandingConfig;
  tenant: Tenant | PublicTenant;
  onConfigChange: (config: TenantLandingConfig) => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  validationErrors?: string[];
  onPublish: () => Promise<boolean>;
  onDiscard: () => void;
  onReset: () => Promise<boolean>;
  onClearErrors?: () => void;
  activeSection?: string | null;
}

// ============================================================================
// SECTION DEFINITIONS
// ============================================================================

const SECTIONS = [
  {
    key: 'hero' as const,
    title: 'Hero Section',
    description: 'Banner utama di bagian atas halaman',
    icon: Target,
    blockPrefix: 'hero',
    blockCount: 200,
  },
  {
    key: 'about' as const,
    title: 'Tentang Kami',
    description: 'Informasi tentang toko Anda',
    icon: BookOpen,
    blockPrefix: 'about',
    blockCount: 200,
  },
  {
    key: 'products' as const,
    title: 'Produk Unggulan',
    description: 'Tampilkan produk terbaik Anda',
    icon: ShoppingBag,
    blockPrefix: 'products',
    blockCount: 200,
  },
  {
    key: 'testimonials' as const,
    title: 'Testimoni',
    description: 'Ulasan dari pelanggan',
    icon: Star,
    blockPrefix: 'testimonials',
    blockCount: 200,
  },
  {
    key: 'contact' as const,
    title: 'Kontak',
    description: 'Informasi kontak toko',
    icon: Phone,
    blockPrefix: 'contact',
    blockCount: 200,
  },
  {
    key: 'cta' as const,
    title: 'Call to Action',
    description: 'Ajakan untuk berbelanja',
    icon: Rocket,
    blockPrefix: 'cta',
    blockCount: 200,
  },
];

type SectionKey = (typeof SECTIONS)[number]['key'];

// ============================================================================
// BLOCK OPTIONS GENERATOR
// ============================================================================

function generateBlockOptions(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LandingBuilderSimplified({
  config,
  tenant,
  onConfigChange,
  hasUnsavedChanges,
  validationErrors = [],
  onDiscard,
  onReset,
  onClearErrors,
  activeSection,
}: LandingBuilderSimplifiedProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // Filter sections based on activeSection prop
  const visibleSections = activeSection
    ? SECTIONS.filter((section) => section.key === activeSection)
    : SECTIONS;

  // ==========================================================================
  // TOGGLE SECTION
  // ==========================================================================
  const handleToggleSection = useCallback(
    (key: SectionKey, enabled: boolean) => {
      const currentSection = config[key] || {};
      onConfigChange({
        ...config,
        [key]: {
          ...currentSection,
          enabled,
        },
      });
    },
    [config, onConfigChange]
  );

  // ==========================================================================
  // UPDATE BLOCK SELECTION
  // ==========================================================================
  const handleBlockChange = useCallback(
    (key: SectionKey, block: string) => {
      const currentSection = config[key] || {};
      onConfigChange({
        ...config,
        [key]: {
          ...currentSection,
          block,
        },
      });
    },
    [config, onConfigChange]
  );

  // ==========================================================================
  // ACTION HANDLERS
  // ==========================================================================
  const handleConfirmDiscard = () => {
    onDiscard();
    setShowDiscardDialog(false);
  };

  const handleConfirmReset = async () => {
    await onReset();
    setShowResetDialog(false);
  };

  // ==========================================================================
  // EXTRACT DATA FROM TENANT
  // ==========================================================================
  const heroData = extractHeroData(tenant, config);
  const aboutData = extractAboutData(tenant, config);
  const testimonialsData = extractTestimonialsData(tenant, config);
  const contactData = extractContactData(tenant, config);
  const ctaData = extractCtaData(tenant, config);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Konten landing page dikelola di{' '}
            <strong>Pengaturan &gt; Landing</strong>. Di sini Anda hanya memilih
            tampilan (block) yang ingin digunakan.
          </span>
          <Link href="/dashboard/settings" className="ml-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Ke Pengaturan
            </Button>
          </Link>
        </AlertDescription>
      </Alert>

      {/* Validation Errors Display */}
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
                  <li
                    key={index}
                    className="text-xs text-red-700 dark:text-red-300 flex items-start gap-1"
                  >
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
                Klik &quot;Publish&quot; untuk menyimpan perubahan
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Section Editors */}
      <div className="space-y-6">
        {visibleSections.map((section) => {
          const IconComponent = section.icon;
          const sectionConfig = config[section.key];
          const isEnabled = sectionConfig?.enabled ?? false;
          const currentBlock =
            (sectionConfig?.block as string) || `${section.blockPrefix}1`;

          // Get preview data for this section
          let previewTitle = '';
          let previewSubtitle = '';

          switch (section.key) {
            case 'hero':
              previewTitle = heroData.title;
              previewSubtitle = heroData.subtitle;
              break;
            case 'about':
              previewTitle = aboutData.title;
              previewSubtitle = aboutData.subtitle;
              break;
            case 'testimonials':
              previewTitle = testimonialsData.title;
              previewSubtitle = `${testimonialsData.items.length} testimoni`;
              break;
            case 'contact':
              previewTitle = contactData.title;
              previewSubtitle = contactData.subtitle;
              break;
            case 'cta':
              previewTitle = ctaData.title;
              previewSubtitle = ctaData.subtitle;
              break;
            case 'products':
              previewTitle = 'Produk Kami';
              previewSubtitle = 'Dari katalog produk';
              break;
          }

          return (
            <Card key={section.key} className="p-6">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      isEnabled
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{section.title}</h3>
                      {isEnabled && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          Aktif
                        </Badge>
                      )}
                    </div>
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
                />
              </div>

              {/* Block Selection & Preview */}
              {isEnabled && (
                <>
                  <Separator className="my-4" />

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Block Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Pilih Desain Block
                      </label>
                      <Select
                        value={currentBlock}
                        onValueChange={(value) =>
                          handleBlockChange(section.key, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih block..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {generateBlockOptions(
                            section.blockPrefix,
                            section.blockCount
                          ).map((block) => (
                            <SelectItem key={block} value={block}>
                              {block.charAt(0).toUpperCase() + block.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Tersedia {section.blockCount} variasi desain
                      </p>
                    </div>

                    {/* Data Preview */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Preview Konten
                      </label>
                      <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                        <p className="text-sm font-medium truncate">
                          {previewTitle || (
                            <span className="text-muted-foreground italic">
                              Belum diisi
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {previewSubtitle || '-'}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Edit konten di{' '}
                        <Link
                          href="/dashboard/settings"
                          className="text-primary hover:underline"
                        >
                          Pengaturan &gt; Landing
                        </Link>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Landing Page?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua konfigurasi landing page akan direset ke default. Perubahan
              ini akan langsung dipublish. Lanjutkan?
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

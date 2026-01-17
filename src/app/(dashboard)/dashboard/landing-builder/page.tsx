/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/landing-builder/page.tsx
 * ============================================================================
 * Route: /dashboard/landing-builder
 * Description: Dedicated Landing Page Builder with Template System
 * Created: January 2026
 * ============================================================================
 */
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/dashboard';
import { LandingBuilder, LandingErrorBoundary } from '@/components/landing';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/use-landing-config';
import { Palette, Layout, Wand2 } from 'lucide-react';
import type { TenantLandingConfig } from '@/types';

// ============================================================================
// TEMPLATE DEFINITIONS - Easy to add more templates!
// ============================================================================

interface LandingTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  defaultConfig: Partial<TenantLandingConfig>;
  preview?: string;
}

const LANDING_TEMPLATES: LandingTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Template klasik dengan semua section - cocok untuk semua use case',
    icon: <Layout className="h-5 w-5" />,
    defaultConfig: {
      enabled: true,
      hero: {
        enabled: true,
        title: 'Selamat Datang di Toko Kami',
        subtitle: 'Temukan produk berkualitas dengan harga terbaik',
        config: {
          layout: 'centered',
          showImage: true,
          ctaText: 'Lihat Produk',
          ctaLink: '/products',
        },
      },
      about: {
        enabled: true,
        title: 'Tentang Kami',
        subtitle: 'Kenali lebih dekat dengan toko kami',
        config: {
          showImage: true,
        },
      },
      products: {
        enabled: true,
        title: 'Produk Kami',
        subtitle: 'Koleksi produk pilihan terbaik',
        config: {
          displayMode: 'featured',
          itemsPerRow: 4,
        },
      },
      testimonials: {
        enabled: true,
        title: 'Testimoni',
        subtitle: 'Apa kata pelanggan kami',
        config: {
          testimonials: [],
        },
      },
      contact: {
        enabled: true,
        title: 'Hubungi Kami',
        subtitle: 'Kami siap membantu Anda',
        config: {
          showMap: true,
          showForm: true,
        },
      },
      cta: {
        enabled: true,
        title: 'Mulai Belanja Sekarang',
        subtitle: 'Jangan lewatkan penawaran spesial kami',
        config: {
          ctaText: 'Belanja Sekarang',
          ctaLink: '/products',
        },
      },
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple & clean - fokus pada produk, cocok untuk brand modern',
    icon: <Palette className="h-5 w-5" />,
    defaultConfig: {
      enabled: true,
      hero: {
        enabled: true,
        title: 'Minimalist Store',
        subtitle: 'Less is more',
        config: {
          layout: 'centered',
          showImage: false,
          ctaText: 'Explore',
          ctaLink: '/products',
        },
      },
      about: {
        enabled: false,
      },
      products: {
        enabled: true,
        title: 'Products',
        subtitle: 'Our curated collection',
        config: {
          displayMode: 'all',
          itemsPerRow: 3,
        },
      },
      testimonials: {
        enabled: false,
      },
      contact: {
        enabled: true,
        title: 'Get in Touch',
        config: {
          showMap: false,
          showForm: true,
        },
      },
      cta: {
        enabled: false,
      },
    },
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Pro',
    description: 'Optimized untuk online store - fokus konversi & penjualan',
    icon: <Wand2 className="h-5 w-5" />,
    defaultConfig: {
      enabled: true,
      hero: {
        enabled: true,
        title: 'Belanja Online Lebih Mudah',
        subtitle: 'Gratis ongkir, harga termurah, kualitas terjamin',
        config: {
          layout: 'left',
          showImage: true,
          ctaText: 'Mulai Belanja',
          ctaLink: '/products',
        },
      },
      about: {
        enabled: false,
      },
      products: {
        enabled: true,
        title: 'Produk Terlaris',
        subtitle: 'Paling banyak dibeli bulan ini',
        config: {
          displayMode: 'featured',
          itemsPerRow: 4,
        },
      },
      testimonials: {
        enabled: true,
        title: 'Dipercaya Ribuan Pelanggan',
        subtitle: 'Rating 5.0 dari 1000+ review',
        config: {
          testimonials: [],
        },
      },
      contact: {
        enabled: false,
      },
      cta: {
        enabled: true,
        title: 'Dapatkan Diskon 20% Hari Ini',
        subtitle: 'Promo terbatas! Buruan checkout sekarang',
        config: {
          ctaText: 'Belanja Sekarang',
          ctaLink: '/products',
        },
      },
    },
  },
  // TEMPLATE 4 & 5 - Easy to add more!
  // Just copy the structure above and customize
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LandingBuilderPage() {
  const { tenant, refresh } = useTenant();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'builder'>('templates');

  const {
    config: landingConfig,
    hasUnsavedChanges,
    isSaving,
    validationErrors,
    updateConfig: setLandingConfig,
    publishChanges: handlePublish,
    discardChanges: handleDiscard,
    resetToDefaults: handleReset,
    clearValidationErrors: clearErrors,
  } = useLandingConfig({
    initialConfig: tenant?.landingConfig,
    onSaveSuccess: () => refresh(),
  });

  const tenantLoading = tenant === null;

  // ---------------------------------------------------------------------------
  // Template Selection Handler
  // ---------------------------------------------------------------------------
  const handleSelectTemplate = useCallback(
    (templateId: string) => {
      const template = LANDING_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;

      // Apply template config
      setLandingConfig(template.defaultConfig as TenantLandingConfig);
      setSelectedTemplate(templateId);
      setActiveTab('builder');
    },
    [setLandingConfig]
  );

  const handleBackToTemplates = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm(
        'Anda memiliki perubahan yang belum disimpan. Yakin ingin kembali ke pilihan template?'
      );
      if (!confirm) return;
      handleDiscard();
    }
    setActiveTab('templates');
    setSelectedTemplate(null);
  }, [hasUnsavedChanges, handleDiscard]);

  const handleStartFromScratch = useCallback(() => {
    setActiveTab('builder');
    setSelectedTemplate('custom');
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div>
      <PageHeader
        title="Landing Page Builder"
        description="Buat landing page yang menarik dengan sistem template yang flexible - any use case, any template!"
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'templates' | 'builder')} className="mt-6">
        {activeTab === 'builder' && (
          <div className="mb-4 flex items-center justify-between">
            <Button variant="outline" onClick={handleBackToTemplates}>
              ← Kembali ke Template
            </Button>
            {selectedTemplate && (
              <Badge variant="secondary">
                Template: {LANDING_TEMPLATES.find((t) => t.id === selectedTemplate)?.name || 'Custom'}
              </Badge>
            )}
          </div>
        )}

        {/* TEMPLATE SELECTION VIEW */}
        <TabsContent value="templates" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Pilih Template Landing Page</CardTitle>
              <CardDescription>
                Pilih template yang sesuai dengan brand dan use case Anda. Semua template bisa dikustomisasi!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {LANDING_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="mt-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Gunakan Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {/* Custom / Start from Scratch */}
                <Card
                  className="cursor-pointer border-dashed transition-all hover:shadow-lg hover:border-primary"
                  onClick={handleStartFromScratch}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-3 text-muted-foreground">
                        <Wand2 className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Custom</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      Mulai dari nol dan buat design sendiri sesuai keinginan Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Buat Custom
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BUILDER VIEW */}
        <TabsContent value="builder" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Landing Page Editor
                {hasUnsavedChanges && (
                  <Badge
                    variant="outline"
                    className="text-yellow-600 border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                  >
                    Belum dipublish
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Kustomisasi halaman landing toko Anda. Perubahan tidak akan terlihat sampai Anda klik &quot;Publish&quot;.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tenantLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : tenant ? (
                <LandingErrorBoundary>
                  <LandingBuilder
                    config={landingConfig}
                    onConfigChange={setLandingConfig}
                    tenantSlug={tenant.slug}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isSaving={isSaving}
                    validationErrors={validationErrors}
                    onPublish={handlePublish}
                    onDiscard={handleDiscard}
                    onReset={handleReset}
                    onClearErrors={clearErrors}
                  />
                </LandingErrorBoundary>
              ) : (
                <p className="text-muted-foreground">Gagal memuat data tenant</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

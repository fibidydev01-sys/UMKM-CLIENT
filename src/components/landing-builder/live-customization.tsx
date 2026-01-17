'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLandingConfig } from '@/hooks/use-landing-config';
import { useTenantStore } from '@/store/tenant-store';
import { TEMPLATE_METADATA } from '@/lib/landing/templates/template-metadata';
import { LivePreview } from './live-preview';
import { ConfigurationPanel } from './configuration-panel';
import { ResponsiveToggle, DeviceType } from './responsive-toggle';
import { ArrowLeft, Save, Eye, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveCustomization() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { tenant } = useTenantStore();

  const templateId = searchParams.get('template') || 'modern-starter';
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [previewKey, setPreviewKey] = useState(0); // For forcing preview refresh

  // Get template metadata
  const currentTemplate = TEMPLATE_METADATA.find((t) => t.id === currentTemplateId) || TEMPLATE_METADATA[0];

  // Landing config hook
  const {
    config,
    hasUnsavedChanges,
    isSaving,
    validationErrors,
    updateConfig,
    publishChanges,
    discardChanges,
  } = useLandingConfig({
    initialConfig: tenant?.landingConfig,
  });

  // Initialize with template variants when template changes
  useEffect(() => {
    if (currentTemplate && !config.template) {
      updateConfig({
        enabled: true,
        template: currentTemplate.id,
        hero: {
          enabled: true,
          variant: currentTemplate.variants.hero,
        },
        about: {
          enabled: true,
          variant: currentTemplate.variants.about,
        },
        products: {
          enabled: true,
          variant: currentTemplate.variants.products,
        },
        testimonials: currentTemplate.variants.testimonials
          ? {
              enabled: true,
              variant: currentTemplate.variants.testimonials,
            }
          : undefined,
        contact: currentTemplate.variants.contact
          ? {
              enabled: true,
              variant: currentTemplate.variants.contact,
            }
          : undefined,
        cta: currentTemplate.variants.cta
          ? {
              enabled: true,
              variant: currentTemplate.variants.cta,
            }
          : undefined,
      });
    }
  }, [currentTemplate, config.template, updateConfig]);

  const handleTemplateChange = (newTemplateId: string) => {
    const newTemplate = TEMPLATE_METADATA.find((t) => t.id === newTemplateId);
    if (!newTemplate) return;

    // Update config with new template variants
    updateConfig({
      ...config,
      template: newTemplate.id,
      hero: {
        ...config.hero,
        variant: newTemplate.variants.hero,
      },
      about: {
        ...config.about,
        variant: newTemplate.variants.about,
      },
      products: {
        ...config.products,
        variant: newTemplate.variants.products,
      },
      testimonials: newTemplate.variants.testimonials
        ? {
            ...config.testimonials,
            variant: newTemplate.variants.testimonials,
          }
        : config.testimonials,
      contact: newTemplate.variants.contact
        ? {
            ...config.contact,
            variant: newTemplate.variants.contact,
          }
        : config.contact,
      cta: newTemplate.variants.cta
        ? {
            ...config.cta,
            variant: newTemplate.variants.cta,
          }
        : config.cta,
    });

    setCurrentTemplateId(newTemplateId);
    setPreviewKey((prev) => prev + 1); // Force preview refresh
    router.replace(`/dashboard/landing/customize?template=${newTemplateId}`);
  };

  const handleSave = async () => {
    try {
      await publishChanges();
      toast({
        title: 'Changes saved',
        description: 'Your landing page configuration has been saved successfully.',
      });
      setPreviewKey((prev) => prev + 1); // Refresh preview
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save changes',
        variant: 'destructive',
      });
    }
  };

  const handlePublish = async () => {
    try {
      await publishChanges();
      toast({
        title: 'Landing page published',
        description: 'Your landing page is now live!',
      });
      setPreviewKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: 'Publish failed',
        description: error instanceof Error ? error.message : 'Failed to publish landing page',
        variant: 'destructive',
      });
    }
  };

  const handleDiscard = () => {
    discardChanges();
    setPreviewKey((prev) => prev + 1);
    toast({
      title: 'Changes discarded',
      description: 'Your changes have been reverted.',
    });
  };

  const handleConfigUpdate = (updates: Partial<typeof config>) => {
    updateConfig({
      ...config,
      ...updates,
    });
    setPreviewKey((prev) => prev + 1); // Refresh preview on any config change
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back + Template Selector */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/landing')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Template:</span>
              <Select value={currentTemplateId} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_METADATA.filter((t) => t.id !== 'custom').map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Unsaved Changes Indicator */}
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Unsaved Changes
              </Badge>
            )}
          </div>

          {/* Center: Responsive Toggle */}
          <ResponsiveToggle deviceType={deviceType} onDeviceChange={setDeviceType} />

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Button variant="ghost" size="sm" onClick={handleDiscard} disabled={isSaving}>
                Discard
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={handlePublish}
              disabled={!hasUnsavedChanges || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="px-4 pb-3">
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm font-medium text-destructive mb-1">Validation Errors:</p>
              <ul className="text-sm text-destructive/80 list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* Main Content: Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Live Preview (60-70%) */}
        <div className="flex-1 bg-muted/30 overflow-auto">
          <LivePreview
            key={previewKey}
            config={config}
            deviceType={deviceType}
            templateId={currentTemplateId}
          />
        </div>

        {/* Right: Configuration Panel (30-40%) */}
        <div className="w-[400px] border-l bg-card overflow-auto">
          <ConfigurationPanel config={config} onConfigUpdate={handleConfigUpdate} />
        </div>
      </div>
    </div>
  );
}

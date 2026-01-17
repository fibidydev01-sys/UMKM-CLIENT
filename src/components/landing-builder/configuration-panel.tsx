'use client';

import { TenantLandingConfig } from '@/types/landing';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionConfig } from './section-config';
import { Sparkles } from 'lucide-react';

interface ConfigurationPanelProps {
  config: TenantLandingConfig;
  onConfigUpdate: (updates: Partial<TenantLandingConfig>) => void;
}

export function ConfigurationPanel({ config, onConfigUpdate }: ConfigurationPanelProps) {
  const handleSectionToggle = (section: keyof TenantLandingConfig, enabled: boolean) => {
    onConfigUpdate({
      [section]: {
        ...(config[section] as any),
        enabled,
      },
    });
  };

  const handleSectionUpdate = (section: keyof TenantLandingConfig, updates: any) => {
    onConfigUpdate({
      [section]: {
        ...(config[section] as any),
        ...updates,
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Configuration</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Customize each section and see changes in real-time
        </p>
      </div>

      {/* Sections */}
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={['hero', 'about', 'products']} className="px-4 pb-4">
          {/* Hero Section */}
          <AccordionItem value="hero">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">Hero Section</span>
                <Switch
                  checked={config.hero?.enabled ?? true}
                  onCheckedChange={(checked) => handleSectionToggle('hero', checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {config.hero?.enabled && (
                <SectionConfig
                  section="hero"
                  config={config.hero}
                  onUpdate={(updates) => handleSectionUpdate('hero', updates)}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* About Section */}
          <AccordionItem value="about">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">About Section</span>
                <Switch
                  checked={config.about?.enabled ?? false}
                  onCheckedChange={(checked) => handleSectionToggle('about', checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {config.about?.enabled && (
                <SectionConfig
                  section="about"
                  config={config.about}
                  onUpdate={(updates) => handleSectionUpdate('about', updates)}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Products Section */}
          <AccordionItem value="products">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">Products Section</span>
                <Switch
                  checked={config.products?.enabled ?? false}
                  onCheckedChange={(checked) => handleSectionToggle('products', checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {config.products?.enabled && (
                <SectionConfig
                  section="products"
                  config={config.products}
                  onUpdate={(updates) => handleSectionUpdate('products', updates)}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Testimonials Section */}
          <AccordionItem value="testimonials">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">Testimonials Section</span>
                <Switch
                  checked={config.testimonials?.enabled ?? false}
                  onCheckedChange={(checked) => handleSectionToggle('testimonials', checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {config.testimonials?.enabled && (
                <SectionConfig
                  section="testimonials"
                  config={config.testimonials}
                  onUpdate={(updates) => handleSectionUpdate('testimonials', updates)}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Contact Section */}
          <AccordionItem value="contact">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">Contact Section</span>
                <Switch
                  checked={config.contact?.enabled ?? false}
                  onCheckedChange={(checked) => handleSectionToggle('contact', checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {config.contact?.enabled && (
                <SectionConfig
                  section="contact"
                  config={config.contact}
                  onUpdate={(updates) => handleSectionUpdate('contact', updates)}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* CTA Section */}
          <AccordionItem value="cta">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">Call-to-Action Section</span>
                <Switch
                  checked={config.cta?.enabled ?? false}
                  onCheckedChange={(checked) => handleSectionToggle('cta', checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {config.cta?.enabled && (
                <SectionConfig
                  section="cta"
                  config={config.cta}
                  onUpdate={(updates) => handleSectionUpdate('cta', updates)}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}

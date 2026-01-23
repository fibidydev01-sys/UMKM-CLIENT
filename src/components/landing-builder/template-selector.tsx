'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Palette } from 'lucide-react';
import { getAllTemplates, useTemplate } from '@/lib/landing';
import type { LandingTemplate } from '@/lib/landing';

/**
 * Template Selector Component
 *
 * Allows users to switch between different landing page templates
 * Displays template cards with name, description, and selection state
 */
export function TemplateSelector() {
  const { currentTemplate, setTemplate } = useTemplate();
  const templates = getAllTemplates();

  const handleSelectTemplate = (template: LandingTemplate) => {
    setTemplate(template.id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle>Template Design</CardTitle>
        </div>
        <CardDescription>
          Pilih template untuk mengubah tampilan keseluruhan landing page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((template) => {
            const isSelected = currentTemplate.id === template.id;

            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary/50'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        {isSelected && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

                      {/* Block Info */}
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Hero:</span>
                          <span className="capitalize">{template.blocks.hero}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">About:</span>
                          <span className="capitalize">{template.blocks.about}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Products:</span>
                          <span className="capitalize">{template.blocks.products}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                      {template.category}
                    </span>
                  </div>

                  {/* Select Button (only show when not selected) */}
                  {!isSelected && (
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Pilih Template
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Template aktif:</strong> {currentTemplate.name} • Template ini mengubah layout dan
            style dari setiap section tanpa mengubah konten yang sudah ada.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

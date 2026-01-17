/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/landing-builder/gallery/page.tsx
 * ============================================================================
 * Route: /dashboard/landing-builder/gallery
 * Description: Template Gallery - Step 1 of Landing Builder
 * Browse and select from 11 pre-built templates
 * ============================================================================
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/dashboard';
import { getAllTemplates } from '@/lib/landing';
import { Search, Palette, Wand2 } from 'lucide-react';
import type { LandingTemplate } from '@/lib/landing';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TemplateGalleryPage() {
  const router = useRouter();
  const templates = getAllTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Extract unique categories
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Handle template selection
  const handleSelectTemplate = (template: LandingTemplate) => {
    router.push(`/dashboard/landing-builder/customize?template=${template.id}`);
  };

  // Handle start from scratch
  const handleStartFromScratch = () => {
    router.push('/dashboard/landing-builder/customize?template=custom');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div>
      <PageHeader
        title="Landing Page Templates"
        description="Pilih template untuk memulai, atau buat dari nol"
      />

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 mt-6 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                <span className="capitalize">{category}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 && 's'}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Template Cards */}
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary relative overflow-hidden group"
            onClick={() => handleSelectTemplate(template)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="capitalize flex-shrink-0">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Variant Info */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-muted-foreground">Included Variants:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary/60" />
                    <span className="capitalize">{template.variants.hero}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500/60" />
                    <span className="capitalize">{template.variants.about}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500/60" />
                    <span className="capitalize">{template.variants.products}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                <Palette className="h-4 w-4 mr-2" />
                Customize This Template
              </Button>
            </CardContent>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Card>
        ))}

        {/* Custom / Start from Scratch Card */}
        <Card
          className="cursor-pointer border-dashed transition-all hover:shadow-lg hover:border-primary relative overflow-hidden group"
          onClick={handleStartFromScratch}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg">Custom Template</CardTitle>
                <CardDescription className="mt-1">
                  Mulai dari nol dan buat design sendiri sesuai keinginan Anda
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex-shrink-0">
                Custom
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-4 p-4 rounded-lg bg-muted/30 text-center">
              <Wand2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Full creative control
              </p>
            </div>

            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
              <Wand2 className="h-4 w-4 mr-2" />
              Start from Scratch
            </Button>
          </CardContent>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Card>
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your search.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

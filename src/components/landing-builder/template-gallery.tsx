'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATE_METADATA } from '@/lib/landing/templates/template-metadata';
import { TemplateCategory } from '@/types/landing';
import { ArrowRight, Search, Sparkles, Zap, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
  creative: 'Creative',
  professional: 'Professional',
  catalog: 'Catalog',
};

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  modern: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  classic: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  minimal: 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
  creative: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  professional: 'bg-green-500/10 text-green-700 dark:text-green-400',
  catalog: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
};

export function TemplateGallery() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Get all templates except 'custom'
  const templates = TEMPLATE_METADATA.filter((t) => t.id !== 'custom');

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/dashboard/landing/customize?template=${templateId}`);
  };

  const handleQuickPreview = (templateId: string, slug: string) => {
    // Open in new tab
    window.open(`/store/${slug}?preview=template&templateId=${templateId}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Choose Your Template</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Select a professionally designed template and customize it to match your brand
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TemplateCategory | 'all')}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No templates found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                'group relative overflow-hidden transition-all duration-300 cursor-pointer',
                'hover:shadow-xl hover:scale-[1.02] hover:border-primary/50',
                hoveredTemplate === template.id && 'ring-2 ring-primary'
              )}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Template Preview Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
                {/* Preview Placeholder - In production, this would be actual screenshot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Zap className="h-12 w-12 mx-auto text-primary/40" />
                    <p className="text-sm text-muted-foreground font-medium">{template.name}</p>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
                    'flex items-center justify-center gap-2',
                    hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickPreview(template.id, 'preview');
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Quick Preview
                  </Button>
                </div>

                {/* Category Badge */}
                <Badge className={cn('absolute top-3 right-3', CATEGORY_COLORS[template.category])}>
                  {CATEGORY_LABELS[template.category]}
                </Badge>
              </div>

              {/* Template Info */}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{template.name}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>

              {/* Template Features */}
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {template.variants.hero} Hero
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.variants.about} About
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.variants.products} Products
                  </Badge>
                  {template.variants.testimonials && (
                    <Badge variant="outline" className="text-xs">
                      Testimonials
                    </Badge>
                  )}
                  {template.variants.contact && (
                    <Badge variant="outline" className="text-xs">
                      Contact
                    </Badge>
                  )}
                  {template.variants.cta && (
                    <Badge variant="outline" className="text-xs">
                      CTA
                    </Badge>
                  )}
                </div>
              </CardContent>

              {/* Action */}
              <CardFooter>
                <Button
                  className="w-full gap-2"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  Customize This Template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Custom Template Option */}
      <div className="mt-12 p-6 border-2 border-dashed rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">Want to start from scratch?</h3>
        <p className="text-muted-foreground mb-4">Create a custom template with your own section combinations</p>
        <Button variant="outline" onClick={() => handleTemplateSelect('custom')}>
          Start Custom Template
        </Button>
      </div>
    </div>
  );
}

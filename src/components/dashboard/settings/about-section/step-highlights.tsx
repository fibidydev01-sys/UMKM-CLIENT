'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageUpload } from '@/components/shared/upload';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { AboutFormData, FeatureItem } from '@/types';

interface StepHighlightsProps {
  formData: AboutFormData;
  updateFormData: <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => void;
  isDesktop?: boolean;
}

export function StepHighlights({ formData, updateFormData, isDesktop = false }: StepHighlightsProps) {

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const justAddedRef = useRef(false);

  useEffect(() => {
    if (!carouselApi || !justAddedRef.current) return;
    justAddedRef.current = false;
    carouselApi.scrollTo(formData.aboutFeatures.length - 1);
  }, [formData.aboutFeatures.length, carouselApi]);

  const handleAdd = () => {
    updateFormData('aboutFeatures', [...formData.aboutFeatures, { title: '', description: '' }]);
    justAddedRef.current = true;
  };

  const handleRemove = (i: number) => {
    updateFormData('aboutFeatures', formData.aboutFeatures.filter((_, idx) => idx !== i));
  };

  const handleUpdate = (i: number, field: keyof FeatureItem, val: string) => {
    const updated = [...formData.aboutFeatures];
    updated[i] = { ...updated[i], [field]: val };
    updateFormData('aboutFeatures', updated);
  };

  // ── DESKTOP ────────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div id="tour-about-highlights" className="space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Key Highlights
            </p>
            <p className="text-xs text-muted-foreground">
              {formData.aboutFeatures.length === 0
                ? 'No highlights yet — add your store\'s selling points'
                : `${formData.aboutFeatures.length} highlight${formData.aboutFeatures.length === 1 ? '' : 's'} added`
              }
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAdd}
            className="gap-1.5 h-8 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Highlight
          </Button>
        </div>

        {/* Empty state */}
        {formData.aboutFeatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-lg gap-3">
            <p className="text-sm text-muted-foreground">No highlights yet</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAdd}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Your First Highlight
            </Button>
          </div>
        ) : (
          <Carousel className="w-full" setApi={setCarouselApi}>
            <CarouselContent className="-ml-4">
              {formData.aboutFeatures.map((feature, i) => (
                <CarouselItem key={i} className="pl-4 basis-auto">
                  <div className="relative group space-y-3 w-[260px]">

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      aria-label="Remove highlight"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold">
                      #{i + 1}
                    </div>

                    {/* Portrait image — fixed width, AspectRatio 3:4 */}
                    <AspectRatio ratio={3 / 4} className="rounded-lg overflow-hidden border bg-muted">
                      <ImageUpload
                        value={feature.icon}
                        onChange={(url) => handleUpdate(i, 'icon', url ?? '')}
                        onRemove={() => handleUpdate(i, 'icon', '')}
                        folder="fibidy/feature-icons"
                        aspectRatio={3 / 4}
                        placeholder="Upload image"
                        className="w-full h-full"
                      />
                    </AspectRatio>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                        Title
                      </Label>
                      <Input
                        placeholder="Premium Quality"
                        value={feature.title}
                        onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                        className="h-9 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                        Description
                      </Label>
                      <Input
                        placeholder="High quality products guaranteed"
                        value={feature.description}
                        onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                        className="h-9 text-sm placeholder:font-normal placeholder:text-muted-foreground/50"
                      />
                    </div>

                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        {formData.aboutFeatures.length > 0 && (
          <p className="text-[11px] text-muted-foreground">
            Recommended: <span className="font-medium text-foreground">Portrait 3:4</span> · 600×800px for a balanced layout
          </p>
        )}
      </div>
    );
  }

  // ── MOBILE ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4">

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleAdd}
        className="gap-1.5 h-8 text-xs font-medium"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Highlight
      </Button>

      {formData.aboutFeatures.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full max-w-sm border-2 border-dashed rounded-lg gap-2 px-6 text-center">
          <p className="text-sm text-muted-foreground">No highlights yet</p>
          <p className="text-[11px] text-muted-foreground">
            Click &quot;Add Highlight&quot; above to get started
          </p>
        </div>
      ) : (
        <div id="tour-about-highlights" className="w-full max-w-sm space-y-3">
          {formData.aboutFeatures.map((feature, i) => (
            <Card key={i} className="border shadow-none overflow-hidden">
              <CardContent className="p-0">

                {/* Portrait image */}
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove highlight"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold">
                    #{i + 1}
                  </div>
                  <AspectRatio ratio={3 / 4}>
                    <ImageUpload
                      value={feature.icon}
                      onChange={(url) => handleUpdate(i, 'icon', url ?? '')}
                      onRemove={() => handleUpdate(i, 'icon', '')}
                      folder="fibidy/feature-icons"
                      aspectRatio={3 / 4}
                      placeholder="Upload image"
                      className="w-full h-full"
                    />
                  </AspectRatio>
                </div>

                {/* Title & Desc */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                      Title
                    </Label>
                    <Input
                      placeholder="Premium Quality"
                      value={feature.title}
                      onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                      className="text-center h-9 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                      Description
                    </Label>
                    <Input
                      placeholder="High quality products guaranteed"
                      value={feature.description}
                      onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                      className="text-center h-9 text-sm placeholder:font-normal placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {formData.aboutFeatures.length > 0 && (
        <p className="text-[11px] text-muted-foreground text-center">
          Recommended: <span className="font-medium text-foreground">Portrait 3:4</span> · 600×800px for a balanced layout
        </p>
      )}
    </div>
  );
}
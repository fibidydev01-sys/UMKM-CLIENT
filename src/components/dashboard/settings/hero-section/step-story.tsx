'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FieldLabel } from '@/components/ui/field';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { HeroFormData } from '@/types';

const HINTS = {
  heroTitle: {
    title: 'Headline Tips',
    desc: 'The first thing visitors see. Max 6 words. e.g. "Premium Burgers with Asian Fusion Flavors"',
  },
  heroSubtitle: {
    title: 'Subheading Tips',
    desc: 'One sentence capturing your store\'s main value. e.g. "Delivered in 30 minutes, guaranteed fresh."',
  },
  description: {
    title: 'Store Tagline Tips',
    desc: 'Your store tagline shown in profile & search. 1–2 sentences. e.g. "Premium burgers with authentic Asian fusion flavors."',
  },
} as const;

const FIELDS = [
  {
    key: 'heroTitle' as const,
    label: 'Headline',
    placeholder: 'Write your main store headline...',
    hint: 'Short & punchy · max 6 words',
  },
  {
    key: 'heroSubtitle' as const,
    label: 'Subheading',
    placeholder: 'One sentence capturing your store\'s main value...',
    hint: '1 sentence · straight to the point',
  },
  {
    key: 'description' as const,
    label: 'Store Tagline',
    placeholder: 'Your store\'s unique tagline...',
    hint: 'Shown in your store profile & search results',
  },
] as const;

interface StepStoryProps {
  formData: HeroFormData;
  updateFormData: <K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) => void;
  isDesktop?: boolean;
}

// ─── Fill counter ──────────────────────────────────────────────────────────
function FillCount({ formData }: { formData: HeroFormData }) {
  const filled = [formData.heroTitle, formData.heroSubtitle, formData.description].filter(Boolean).length;
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 bg-border rounded-full h-px overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(filled / 3) * 100}%` }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
        {filled}/3 filled
      </span>
    </div>
  );
}

export function StepStory({ formData, updateFormData, isDesktop = false }: StepStoryProps) {
  const [activeHint, setActiveHint] = useState<keyof typeof HINTS | null>(null);

  // ── DESKTOP: 3-column grid ────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <TooltipProvider delayDuration={200}>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {FIELDS.map((field) => {
              const val = formData[field.key] as string;
              return (
                <div key={field.key} className="flex flex-col gap-2">

                  {/* Label row */}
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor={`d-${field.key}`}
                      className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground"
                    >
                      {field.label}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="rounded-full p-0.5 hover:bg-muted transition-colors"
                          aria-label={`Info ${field.label}`}
                        >
                          <Info className="w-3 h-3 text-muted-foreground/60" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] text-xs">
                        {HINTS[field.key].desc}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Textarea */}
                  <Textarea
                    id={`d-${field.key}`}
                    placeholder={field.placeholder}
                    value={val}
                    onChange={(e) => updateFormData(field.key, e.target.value)}
                    className="resize-none text-sm font-medium leading-relaxed flex-1 placeholder:font-normal placeholder:text-muted-foreground/50"
                    rows={6}
                  />

                  {/* Bottom row: hint + filled dot */}
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">{field.hint}</p>
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${val ? 'bg-primary' : 'bg-border'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <FillCount formData={formData} />
        </div>
      </TooltipProvider>
    );
  }

  // ── MOBILE: carousel ─────────────────────────────────────────────────────
  return (
    <>
      <Dialog open={!!activeHint} onOpenChange={() => setActiveHint(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              {activeHint ? HINTS[activeHint].title : ''}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {activeHint ? HINTS[activeHint].desc : ''}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Swipe hint */}
      <p className="text-center text-[11px] text-muted-foreground mb-3 tracking-wide">
        Swipe to fill all fields
      </p>

      <div className="flex justify-center px-8">
        <Carousel className="w-full max-w-sm">
          <CarouselContent>
            {FIELDS.map((field) => (
              <CarouselItem key={field.key}>
                <Card className="border shadow-none">
                  <CardContent className="pt-5 pb-5 flex flex-col gap-3">

                    {/* Card label row */}
                    <div className="flex items-center justify-center gap-1.5">
                      <FieldLabel
                        htmlFor={`m-${field.key}`}
                        className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground"
                      >
                        {field.label}
                      </FieldLabel>
                      <button
                        type="button"
                        onClick={() => setActiveHint(field.key)}
                        className="rounded-full p-0.5 hover:bg-muted transition-colors"
                        aria-label={`Info ${field.label}`}
                      >
                        <Info className="w-3 h-3 text-muted-foreground/60" />
                      </button>
                    </div>

                    {/* Textarea */}
                    <Textarea
                      id={`m-${field.key}`}
                      placeholder={field.placeholder}
                      value={formData[field.key] as string}
                      onChange={(e) => updateFormData(field.key, e.target.value)}
                      className="text-center resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
                      rows={4}
                    />

                    {/* Hint */}
                    <p className="text-[11px] text-muted-foreground text-center">{field.hint}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Dot + count */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${formData[f.key] ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
        <span className="text-[11px] text-muted-foreground ml-1">
          {[formData.heroTitle, formData.heroSubtitle, formData.description].filter(Boolean).length}/3 filled
        </span>
      </div>
    </>
  );
}
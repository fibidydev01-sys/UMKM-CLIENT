'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import type { AboutFormData } from '@/types';

interface StepContentProps {
  formData: AboutFormData;
  updateFormData: <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => void;
  onRemoveAboutImage: () => void;
  isRemovingAboutImage: boolean;
  isDesktop?: boolean;
}

export function StepContent({
  formData,
  updateFormData,
  onRemoveAboutImage,
  isRemovingAboutImage,
  isDesktop = false,
}: StepContentProps) {

  const charCount = formData.aboutContent.length;
  const wordCount = formData.aboutContent.trim()
    ? formData.aboutContent.trim().split(/\s+/).length
    : 0;

  // ── DESKTOP: side-by-side ─────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[1fr_auto] gap-10 items-start">

        {/* Left — Textarea */}
        <div className="space-y-2">
          <Label htmlFor="aboutContent-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Store Story
          </Label>
          <Textarea
            id="aboutContent-d"
            placeholder="Tell your story — who you are, what you sell, and what makes you special..."
            rows={10}
            value={formData.aboutContent}
            onChange={(e) => updateFormData('aboutContent', e.target.value)}
            className="resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
          />

          {/* Word / char counter */}
          <div className="flex items-center justify-between">
            <div className="border-l-2 border-muted-foreground/20 pl-3 py-0.5">
              <p className="text-xs text-muted-foreground">
                Recommended <span className="font-medium text-foreground">150–300 words</span> for a strong story
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground tabular-nums">
              <span>
                <span className={wordCount >= 150 && wordCount <= 300 ? 'text-primary font-medium' : ''}>
                  {wordCount}
                </span>{' '}words
              </span>
              <span className="text-border">·</span>
              <span>{charCount} characters</span>
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div className="flex flex-col items-center gap-3 pt-6">
          <div className="w-[200px]">
            <ImageUpload
              value={formData.aboutImage}
              onChange={(url) => updateFormData('aboutImage', url ?? '')}
              onRemove={onRemoveAboutImage}
              disabled={isRemovingAboutImage}
              folder="fibidy/about-images"
              aspectRatio={1.5}
              placeholder="Upload about image"
            />
          </div>
          <div className="text-center space-y-0.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              About Image
            </p>
            <p className="text-[11px] text-muted-foreground">
              800×533px · JPG/PNG
            </p>
          </div>
        </div>

      </div>
    );
  }

  // ── MOBILE: portrait card ─────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col gap-5">

          {/* Textarea */}
          <div className="space-y-1.5">
            <Label htmlFor="aboutContent-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Store Story
            </Label>
            <Textarea
              id="aboutContent-m"
              placeholder="Tell your story..."
              rows={5}
              value={formData.aboutContent}
              onChange={(e) => updateFormData('aboutContent', e.target.value)}
              className="text-center resize-none text-sm font-medium leading-relaxed placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
              <span>Recommended 150–300 words</span>
              <span className={`tabular-nums font-mono ${wordCount >= 150 && wordCount <= 300 ? 'text-primary font-semibold' : ''}`}>
                {wordCount} words
              </span>
            </div>
          </div>

          <div className="w-full border-t" />

          {/* Image */}
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              About Image
            </p>
            <div className="w-full max-w-[200px]">
              <ImageUpload
                value={formData.aboutImage}
                onChange={(url) => updateFormData('aboutImage', url ?? '')}
                onRemove={onRemoveAboutImage}
                disabled={isRemovingAboutImage}
                folder="fibidy/about-images"
                aspectRatio={1.5}
                placeholder="Upload about image"
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              800×533px · JPG/PNG
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
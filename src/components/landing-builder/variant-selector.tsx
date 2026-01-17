'use client';

// ==========================================
// VARIANT SELECTOR COMPONENT
// Visual selector for section variants
// ==========================================

import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type {
  HeroVariant,
  AboutVariant,
  ProductsVariant,
  TestimonialsVariant,
  ContactVariant,
  CtaVariant,
} from '@/types/landing';

// ==========================================
// VARIANT METADATA
// ==========================================

interface VariantOption {
  value: string;
  label: string;
  description: string;
}

const HERO_VARIANTS: VariantOption[] = [
  { value: 'gradient-overlay', label: 'Gradient Overlay', description: 'Background with gradient overlay' },
  { value: 'centered-minimal', label: 'Centered Minimal', description: 'Minimalist centered design' },
  { value: 'split-screen', label: 'Split Screen', description: 'Content on left, image on right' },
  { value: 'video-background', label: 'Video Background', description: 'Video or animated background' },
  { value: 'parallax', label: 'Parallax', description: 'Parallax scrolling effect' },
  { value: 'animated-gradient', label: 'Animated Gradient', description: 'Animated gradient background' },
  { value: 'glass-morphism', label: 'Glass Morphism', description: 'Glassmorphism effect' },
];

const ABOUT_VARIANTS: VariantOption[] = [
  { value: 'side-by-side', label: 'Side by Side', description: 'Image alongside content' },
  { value: 'centered', label: 'Centered', description: 'Centered content layout' },
  { value: 'timeline', label: 'Timeline', description: 'Timeline-style layout' },
  { value: 'cards', label: 'Cards', description: 'Card-based layout' },
  { value: 'magazine', label: 'Magazine', description: 'Magazine-style layout' },
  { value: 'storytelling', label: 'Storytelling', description: 'Story-focused layout' },
];

const PRODUCTS_VARIANTS: VariantOption[] = [
  { value: 'grid-hover', label: 'Grid Hover', description: 'Grid with hover effects' },
  { value: 'masonry', label: 'Masonry', description: 'Pinterest-style masonry grid' },
  { value: 'carousel', label: 'Carousel', description: 'Sliding carousel' },
  { value: 'featured-hero', label: 'Featured Hero', description: 'Hero product with grid' },
  { value: 'catalog', label: 'Catalog', description: 'Catalog list view' },
  { value: 'minimal-list', label: 'Minimal List', description: 'Minimalist list layout' },
];

const TESTIMONIALS_VARIANTS: VariantOption[] = [
  { value: 'card-slider', label: 'Card Slider', description: 'Sliding cards' },
  { value: 'quote-highlight', label: 'Quote Highlight', description: 'Highlighted quotes' },
  { value: 'grid-cards', label: 'Grid Cards', description: 'Grid of testimonial cards' },
  { value: 'single-focus', label: 'Single Focus', description: 'One testimonial at a time' },
  { value: 'video-testimonials', label: 'Video Testimonials', description: 'Video-based testimonials' },
  { value: 'social-proof', label: 'Social Proof', description: 'Social proof style' },
];

const CONTACT_VARIANTS: VariantOption[] = [
  { value: 'split-form', label: 'Split Form', description: 'Form with info split' },
  { value: 'centered', label: 'Centered', description: 'Centered contact form' },
  { value: 'map-focus', label: 'Map Focus', description: 'Map-focused layout' },
  { value: 'minimal', label: 'Minimal', description: 'Minimalist contact' },
  { value: 'social-focused', label: 'Social Focused', description: 'Social media focused' },
];

const CTA_VARIANTS: VariantOption[] = [
  { value: 'bold-center', label: 'Bold Center', description: 'Bold centered CTA' },
  { value: 'gradient-banner', label: 'Gradient Banner', description: 'Gradient background banner' },
  { value: 'split-action', label: 'Split Action', description: 'Split with multiple actions' },
  { value: 'floating', label: 'Floating', description: 'Floating CTA card' },
  { value: 'minimal-line', label: 'Minimal Line', description: 'Minimal single line' },
];

const VARIANT_OPTIONS_MAP = {
  hero: HERO_VARIANTS,
  about: ABOUT_VARIANTS,
  products: PRODUCTS_VARIANTS,
  testimonials: TESTIMONIALS_VARIANTS,
  contact: CONTACT_VARIANTS,
  cta: CTA_VARIANTS,
} as const;

// ==========================================
// TYPES
// ==========================================

type SectionType = keyof typeof VARIANT_OPTIONS_MAP;
type VariantType = HeroVariant | AboutVariant | ProductsVariant | TestimonialsVariant | ContactVariant | CtaVariant;

interface VariantSelectorProps {
  section: SectionType;
  selectedVariant?: string;
  onSelect: (variant: string) => void;
  disabled?: boolean;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function VariantSelector({
  section,
  selectedVariant,
  onSelect,
  disabled = false,
}: VariantSelectorProps) {
  const variants = VARIANT_OPTIONS_MAP[section];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Variant Style</Label>
      <div className="grid grid-cols-2 gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant === variant.value;

          return (
            <Card
              key={variant.value}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'border-2 border-primary bg-primary/5',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !disabled && onSelect(variant.value)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{variant.label}</p>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {variant.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected indicator */}
      {selectedVariant && (
        <p className="text-xs text-muted-foreground">
          Selected: <span className="font-medium">{variants.find((v) => v.value === selectedVariant)?.label}</span>
        </p>
      )}
    </div>
  );
}

// ==========================================
// EXPORT VARIANT OPTIONS for external use
// ==========================================

export { HERO_VARIANTS, ABOUT_VARIANTS, PRODUCTS_VARIANTS, TESTIMONIALS_VARIANTS, CONTACT_VARIANTS, CTA_VARIANTS };

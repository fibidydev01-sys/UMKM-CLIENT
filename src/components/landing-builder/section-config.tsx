'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VariantSelector } from './variant-selector';
import {
  HeroVariant,
  AboutVariant,
  ProductsVariant,
  TestimonialsVariant,
  ContactVariant,
  CtaVariant,
  LandingSection,
} from '@/types/landing';

type SectionType = 'hero' | 'about' | 'products' | 'testimonials' | 'contact' | 'cta';

interface SectionConfigProps {
  section: SectionType;
  config: LandingSection<any>;
  onUpdate: (updates: Partial<LandingSection<any>>) => void;
}

// Variant options for each section
const HERO_VARIANTS: { value: HeroVariant; label: string; description: string }[] = [
  { value: 'centered', label: 'Centered', description: 'Classic centered layout with CTA buttons' },
  { value: 'split-screen', label: 'Split Screen', description: 'Text on left, visual on right' },
  { value: 'glass-morphism', label: 'Glass Morphism', description: 'Modern glassmorphic card design' },
  { value: 'video-background', label: 'Video Background', description: 'Full-screen video with overlay' },
  { value: 'animated-gradient', label: 'Animated Gradient', description: 'Dynamic gradient animation' },
  { value: 'parallax', label: 'Parallax', description: 'Parallax scrolling effect' },
];

const ABOUT_VARIANTS: { value: AboutVariant; label: string; description: string }[] = [
  { value: 'centered', label: 'Centered', description: 'Simple centered text layout' },
  { value: 'side-by-side', label: 'Side by Side', description: 'Image and text side by side' },
  { value: 'cards', label: 'Cards', description: 'Feature cards with icons' },
  { value: 'grid', label: 'Grid', description: 'Grid layout with images' },
  { value: 'timeline', label: 'Timeline', description: 'Story timeline with milestones' },
  { value: 'magazine', label: 'Magazine', description: 'Editorial magazine-style layout' },
  { value: 'storytelling', label: 'Storytelling', description: 'Immersive narrative format' },
];

const PRODUCTS_VARIANTS: { value: ProductsVariant; label: string; description: string }[] = [
  { value: 'grid', label: 'Grid', description: 'Classic product grid layout' },
  { value: 'carousel', label: 'Carousel', description: 'Horizontal scrolling carousel' },
];

const TESTIMONIALS_VARIANTS: { value: TestimonialsVariant; label: string; description: string }[] = [
  { value: 'carousel', label: 'Carousel', description: 'Rotating testimonial cards' },
  { value: 'grid', label: 'Grid', description: 'Grid of testimonial cards' },
  { value: 'masonry', label: 'Masonry', description: 'Pinterest-style masonry layout' },
];

const CONTACT_VARIANTS: { value: ContactVariant; label: string; description: string }[] = [
  { value: 'simple', label: 'Simple', description: 'Clean contact form with info' },
  { value: 'split', label: 'Split', description: 'Form on left, map on right' },
  { value: 'card', label: 'Card', description: 'Card-based contact layout' },
];

const CTA_VARIANTS: { value: CtaVariant; label: string; description: string }[] = [
  { value: 'banner', label: 'Banner', description: 'Full-width banner with CTA' },
  { value: 'centered', label: 'Centered', description: 'Centered CTA with gradient' },
  { value: 'split', label: 'Split', description: 'Split layout with visual' },
];

export function SectionConfig({ section, config, onUpdate }: SectionConfigProps) {
  const getVariantOptions = () => {
    switch (section) {
      case 'hero':
        return HERO_VARIANTS;
      case 'about':
        return ABOUT_VARIANTS;
      case 'products':
        return PRODUCTS_VARIANTS;
      case 'testimonials':
        return TESTIMONIALS_VARIANTS;
      case 'contact':
        return CONTACT_VARIANTS;
      case 'cta':
        return CTA_VARIANTS;
      default:
        return [];
    }
  };

  const variantOptions = getVariantOptions();

  return (
    <div className="space-y-4 pt-2">
      {/* Variant Selector */}
      {variantOptions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">VARIANT</Label>
          <VariantSelector
            variants={variantOptions}
            selectedVariant={config.variant || variantOptions[0].value}
            onVariantChange={(variant) => onUpdate({ variant })}
          />
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor={`${section}-title`} className="text-xs font-medium text-muted-foreground">
          TITLE
        </Label>
        <Input
          id={`${section}-title`}
          value={config.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={`Enter ${section} title...`}
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label htmlFor={`${section}-subtitle`} className="text-xs font-medium text-muted-foreground">
          SUBTITLE
        </Label>
        <Textarea
          id={`${section}-subtitle`}
          value={config.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder={`Enter ${section} subtitle...`}
          rows={3}
        />
      </div>

      {/* Section-specific configs */}
      {section === 'hero' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="hero-cta-primary" className="text-xs font-medium text-muted-foreground">
              PRIMARY CTA TEXT
            </Label>
            <Input
              id="hero-cta-primary"
              value={(config.config as any)?.ctaPrimary || ''}
              onChange={(e) =>
                onUpdate({
                  config: { ...(config.config || {}), ctaPrimary: e.target.value },
                })
              }
              placeholder="e.g., Get Started"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-cta-secondary" className="text-xs font-medium text-muted-foreground">
              SECONDARY CTA TEXT
            </Label>
            <Input
              id="hero-cta-secondary"
              value={(config.config as any)?.ctaSecondary || ''}
              onChange={(e) =>
                onUpdate({
                  config: { ...(config.config || {}), ctaSecondary: e.target.value },
                })
              }
              placeholder="e.g., Learn More"
            />
          </div>
        </>
      )}

      {section === 'products' && (
        <div className="space-y-2">
          <Label htmlFor="products-limit" className="text-xs font-medium text-muted-foreground">
            NUMBER OF PRODUCTS TO SHOW
          </Label>
          <Input
            id="products-limit"
            type="number"
            min="3"
            max="12"
            value={(config.config as any)?.limit || 6}
            onChange={(e) =>
              onUpdate({
                config: { ...(config.config || {}), limit: parseInt(e.target.value) },
              })
            }
          />
        </div>
      )}

      {section === 'cta' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="cta-button" className="text-xs font-medium text-muted-foreground">
              BUTTON TEXT
            </Label>
            <Input
              id="cta-button"
              value={(config.config as any)?.buttonText || ''}
              onChange={(e) =>
                onUpdate({
                  config: { ...(config.config || {}), buttonText: e.target.value },
                })
              }
              placeholder="e.g., Start Shopping"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta-link" className="text-xs font-medium text-muted-foreground">
              BUTTON LINK
            </Label>
            <Input
              id="cta-link"
              value={(config.config as any)?.buttonLink || ''}
              onChange={(e) =>
                onUpdate({
                  config: { ...(config.config || {}), buttonLink: e.target.value },
                })
              }
              placeholder="e.g., /products"
            />
          </div>
        </>
      )}
    </div>
  );
}

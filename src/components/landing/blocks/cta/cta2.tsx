'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cta2 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - ctaTitle: CTA heading
 * @prop subtitle - ctaSubtitle: CTA description
 * @prop buttonText - ctaButtonText: Button label
 * @prop buttonLink - ctaButtonLink: Button destination URL
 * @prop buttonVariant - ctaButtonStyle: 'default' | 'secondary' | 'outline'
 */
interface Cta2Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta2
 * Design: Bold Center
 */
export function Cta2({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta2Props) {
  return (
    <section className="py-20 my-8">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <Link href={buttonLink}>
          <Button size="lg" variant={buttonVariant} className="gap-2 h-14 px-8 text-lg">
            {buttonText}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

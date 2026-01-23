'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta1Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta1
 * Design: Default
 *
 * Classic gradient banner CTA
 */
export function Cta1({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta1Props) {
  return (
    <section className="py-16 my-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2 mb-6">{subtitle}</p>}
        <Link href={buttonLink}>
          <Button size="lg" variant={buttonVariant} className="gap-2 mt-4">
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

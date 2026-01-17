'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { extractSectionText, getAboutConfig, extractAboutImage } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import type { TenantLandingConfig } from '@/types';

interface TenantAboutProps {
  config?: TenantLandingConfig['about'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
  };
}

export function TenantAbout({ config, fallbacks = {} }: TenantAboutProps) {
  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.ABOUT,
    subtitle: fallbacks.subtitle,
  });

  const aboutConfig = getAboutConfig(config);
  const content = aboutConfig?.content || fallbacks.content || '';
  const image = extractAboutImage(aboutConfig, fallbacks.image);
  const features = aboutConfig?.features || [];

  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        {image && (
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {content && (
            <p className="text-muted-foreground leading-relaxed">{content}</p>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
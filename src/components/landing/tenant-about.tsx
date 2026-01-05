'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import type { PublicTenant, TenantLandingConfig } from '@/types';

interface TenantAboutProps {
  tenant: PublicTenant;
  config?: TenantLandingConfig['about'];
}

export function TenantAbout({ tenant, config }: TenantAboutProps) {
  const title = config?.title || 'Tentang Kami';
  const subtitle = config?.subtitle || '';
  const content = config?.config?.content || tenant.description || '';
  const showImage = config?.config?.showImage ?? true;
  const image = config?.config?.image || tenant.banner;
  const features = config?.config?.features || [];

  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        {showImage && image && (
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
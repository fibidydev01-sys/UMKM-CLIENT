'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';

/**
 * About2 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - aboutTitle: Section heading
 * @prop subtitle - aboutSubtitle: Section subheading
 * @prop content - aboutContent: Main description text
 * @prop image - aboutImage: Cloudinary URL (800x600px)
 * @prop features - aboutFeatures: Array<{icon (Cloudinary URL), title, description}>
 */
interface About10Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about10
 * Design: Side by Side with Feature Gallery
 */
export function About10({ title, subtitle, content, image, features = [] }: About10Props) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Main Image */}
        {image && (
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Right: Content */}
        <div className="space-y-6">
          {content && (
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          )}

          {/* Features Gallery - Display as image cards */}
          {features.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-xl border bg-card p-4 hover:shadow-lg transition-all"
                >
                  {/* Feature Image */}
                  {feature.icon && (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                      <OptimizedImage
                        src={feature.icon}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

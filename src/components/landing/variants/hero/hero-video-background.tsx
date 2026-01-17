'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';

interface HeroVideoBackgroundProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Variant: Video Background
 *
 * Hero with video dialog - click to play promotional video
 * Great for brands that want to showcase video content
 */
export function HeroVideoBackground({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroVideoBackgroundProps) {
  // You can configure video URL from tenant settings in the future
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Placeholder

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Video Background Section */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc={videoUrl}
            thumbnailSrc={backgroundImage}
            thumbnailAlt={storeName || title}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
            <div className="text-center p-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-10 w-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Add a video URL to see video background
              </p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-4xl px-6 py-12 text-center space-y-6">
        {/* Logo */}
        {logo && (
          <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
            <OptimizedImage
              src={logo}
              alt={storeName || title}
              fill
              crop="fill"
              gravity="auto"
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-bold text-foreground drop-shadow-lg">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-md">
            {subtitle}
          </p>
        )}

        {showCta && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href={ctaLink}>
              <Button size="lg" className="gap-2 shadow-lg">
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {backgroundImage && (
              <Button size="lg" variant="outline" className="gap-2 bg-background/80 backdrop-blur-sm">
                <Play className="h-4 w-4" />
                Watch Video
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

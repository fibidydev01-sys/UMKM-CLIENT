// src/components/platform-landing/lazy-testimonials.tsx
'use client';

import dynamic from 'next/dynamic';

// ══════════════════════════════════════════════════════════════
// LAZY TESTIMONIALS WRAPPER
// This is a Client Component that wraps TestimonialsSection
// with ssr: false to prevent SSR issues
// ══════════════════════════════════════════════════════════════

// Loading skeleton for testimonials
function TestimonialsSkeleton() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mx-auto mb-4" />
          <div className="h-10 w-80 bg-muted rounded mx-auto mb-4" />
          <div className="h-5 w-64 bg-muted rounded mx-auto" />
        </div>

        {/* Cards skeleton - Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[280px] bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>

        {/* Categories skeleton */}
        <div className="pt-12 border-t mt-16">
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Dynamic import with ssr: false (allowed in Client Component)
const TestimonialsSection = dynamic(
  () =>
    import('./testimonials-section').then((mod) => mod.TestimonialsSection),
  {
    ssr: false,
    loading: () => <TestimonialsSkeleton />,
  }
);

// Export the wrapper component
export function LazyTestimonialsSection() {
  return <TestimonialsSection />;
}
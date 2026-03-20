'use client';

// ══════════════════════════════════════════════════════════════
// LAZY TESTIMONIALS WRAPPER
// V9.0 — skeleton 1 card
// ══════════════════════════════════════════════════════════════

import dynamic from 'next/dynamic';

function TestimonialsSkeleton() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-10 w-48 bg-muted rounded mx-auto" />
        </div>
        {/* Card skeleton */}
        <div className="max-w-xl mx-auto">
          <div className="h-[280px] bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

const TestimonialsSection = dynamic(
  () => import('./testimonials-section').then((mod) => mod.TestimonialsSection),
  {
    ssr: false,
    loading: () => <TestimonialsSkeleton />,
  }
);

export function LazyTestimonialsSection() {
  return <TestimonialsSection />;
}
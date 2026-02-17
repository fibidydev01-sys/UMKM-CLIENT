'use client';

import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import { useRef, useState, useCallback } from 'react';
import type { Product } from '@/types';

interface Products4Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products4
 * Design: ELEGANT CAROUSEL
 */
export function Products4({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products4Props) {
  const displayProducts = products.slice(0, limit);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (displayProducts.length === 0) return null;

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < maxScroll - 4);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('[data-card]')?.clientWidth ?? 300;
    const gap = 20;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -(cardWidth + gap) * 2 : (cardWidth + gap) * 2,
      behavior: 'smooth',
    });
    setTimeout(handleScroll, 350);
  }, [handleScroll]);

  return (
    <section id="products" className="py-20 md:py-28">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">

        {/* Left: Title */}
        <div className="space-y-2.5 min-w-0">
          <div className="w-8 h-px bg-foreground" />
          <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Nav + View all */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Sebelumnya"
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center
                       text-foreground transition-all duration-200
                       hover:bg-foreground hover:text-background hover:border-foreground
                       disabled:opacity-20 disabled:cursor-not-allowed
                       disabled:hover:bg-transparent disabled:hover:text-foreground disabled:hover:border-border"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Selanjutnya"
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center
                       text-foreground transition-all duration-200
                       hover:bg-foreground hover:text-background hover:border-foreground
                       disabled:opacity-20 disabled:cursor-not-allowed
                       disabled:hover:bg-transparent disabled:hover:text-foreground disabled:hover:border-border"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {showViewAll && <div className="w-px h-5 bg-border mx-1" />}
          {showViewAll && (
            <Link
              href={productsLink}
              className="group inline-flex items-center gap-1.5 text-sm font-medium
                         text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Semua
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Carousel ── */}
      <div className="relative">
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10
                     bg-gradient-to-l from-background to-transparent transition-opacity duration-300"
          style={{ opacity: canScrollRight ? 1 : 0 }}
        />
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-12 z-10
                     bg-gradient-to-r from-background to-transparent transition-opacity duration-300"
          style={{ opacity: canScrollLeft ? 1 : 0 }}
        />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              data-card
              className="flex-shrink-0 snap-start
                         w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-15px)]"
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <ProductCard product={product} storeSlug={storeSlug} />
            </div>
          ))}
          <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true" />
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-border relative overflow-hidden rounded-full">
          <div
            className="absolute left-0 top-0 h-full bg-foreground rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40 shrink-0">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>

    </section>
  );
}
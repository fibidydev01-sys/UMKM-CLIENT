'use client';

// ══════════════════════════════════════════════════════════════
// PRODUCTS3 - STATEMENT MASONRY
// ✅ FIX: Tambah currency prop, pass ke setiap ProductCard
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products3Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  currency?: string;     // ✅ FIX: tambah currency prop
  limit?: number;
}

/**
 * Products Block: products3
 * Design: STATEMENT MASONRY
 */
export function Products3({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  currency = 'IDR',      // ✅ FIX: default fallback IDR
  limit = 8,
}: Products3Props) {
  const displayProducts = products.slice(0, limit);
  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-20 md:py-28">

      {/* ── Split Header ── */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-12 md:mb-16">

        {/* Left: Accent bar + title */}
        <div className="flex gap-5 items-stretch">
          <div className="w-0.5 bg-foreground rounded-full self-stretch shrink-0" />
          <div className="space-y-2.5">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Koleksi Pilihan
            </p>
            <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
              {title}
            </h2>
          </div>
        </div>

        {/* Right: Subtitle + CTA */}
        <div className="flex flex-col items-start lg:items-end gap-4 max-w-xs lg:max-w-[260px]">
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed lg:text-right">
              {subtitle}
            </p>
          )}
          {showViewAll && (
            <Link
              href={productsLink}
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground
                         hover:text-foreground/60 transition-colors duration-200"
            >
              <span className="border-b border-foreground/30 group-hover:border-foreground/0 transition-colors duration-200 pb-px">
                Lihat Semua
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Masonry Grid ── */}
      <div className="columns-2 md:columns-3 lg:columns-4" style={{ columnGap: '1.25rem' }}>
        {displayProducts.map((product) => (
          <div key={product.id} className="break-inside-avoid mb-4 md:mb-5">
            {/* ✅ FIX: pass currency ke ProductCard */}
            <ProductCard product={product} storeSlug={storeSlug} currency={currency} />
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="mt-10 md:mt-14 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40 shrink-0">
          {displayProducts.length} Item
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

    </section>
  );
}
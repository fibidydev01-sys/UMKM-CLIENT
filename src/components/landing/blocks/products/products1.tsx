'use client';

// ══════════════════════════════════════════════════════════════
// PRODUCTS1 - EDITORIAL GRID
// ✅ FIX: Tambah currency prop, pass ke setiap ProductCard
// ══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products1Props {
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
 * Products Block: products1
 * Design: EDITORIAL GRID
 */
export function Products1({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  currency = 'IDR',      // ✅ FIX: default fallback IDR
  limit = 8,
}: Products1Props) {
  const displayProducts = products.slice(0, limit);
  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-20 md:py-28">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-16">
        <div className="space-y-3">
          <div className="w-8 h-px bg-foreground" />
          <h2 className="text-[36px] sm:text-[42px] lg:text-[52px] font-black leading-[1.0] tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {subtitle}
            </p>
          )}
        </div>

        {showViewAll && (
          <Link
            href={productsLink}
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground
                       border-b border-foreground/30 pb-0.5 hover:border-foreground
                       transition-colors duration-200 shrink-0 self-end sm:self-auto"
          >
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
        {displayProducts.map((product, index) => (
          <div key={product.id} className="flex flex-col gap-3">
            <span className="text-[10px] font-mono text-muted-foreground/50 tracking-[0.2em] uppercase select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              {/* ✅ FIX: pass currency ke ProductCard */}
              <ProductCard product={product} storeSlug={storeSlug} currency={currency} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between mt-12 md:mt-16 pt-6 border-t border-border/60">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40">
          {String(displayProducts.length).padStart(2, '0')} Produk
        </span>
        {showViewAll && (
          <Link
            href={productsLink}
            className="group inline-flex items-center gap-2 text-[10px] font-mono
                       tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground
                       transition-colors duration-200"
          >
            Semua Koleksi
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        )}
      </div>

    </section>
  );
}
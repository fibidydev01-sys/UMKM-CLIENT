'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products5Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products5
 * Design: HERO + BENTO GRID
 *
 * LAYOUT DIAGRAM (desktop, 3-col):
 *
 *   Col:  [    1    ] [    2    ] [    3    ]
 *         ┌───────────┬───────────┬───────────┐
 *   Row1  │           │     B     │     C     │  ROW_H = 360px
 *         │   HERO    ├───────────┼───────────┤
 *   Row2  │  (1×2)    │     D     │     E     │  ROW_H = 360px
 *         └───────────┴───────────┴───────────┘
 *
 *   HERO_H = 360 + 20 + 360 = 740px
 */

const ROW_H = 360;
const GAP = 20;
const HERO_H = ROW_H * 2 + GAP; // 740px

export function Products5({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 5,
}: Products5Props) {
  const displayProducts = products.slice(0, limit);
  if (displayProducts.length === 0) return null;

  const [hero, ...rest] = displayProducts;
  const sideCards = rest.slice(0, 4);

  return (
    <section id="products" className="py-20 md:py-28">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 md:mb-14">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-foreground" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Katalog
            </span>
          </div>
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
            className="group inline-flex items-center gap-2 text-sm font-medium
                       text-foreground hover:text-foreground/60 transition-colors
                       duration-200 shrink-0 self-end sm:self-auto"
          >
            <span className="border-b border-foreground/30 group-hover:border-transparent transition-colors duration-200 pb-px">
              Lihat Semua
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* ── MOBILE (<md) ── */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {hero && (
          <div className="col-span-2">
            <ProductCard product={hero} storeSlug={storeSlug} />
          </div>
        )}
        {sideCards.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} storeSlug={storeSlug} />
          </div>
        ))}
      </div>

      {/* ── DESKTOP (≥md) ── */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: `${ROW_H}px ${ROW_H}px`,
          gridTemplateAreas: `
            "hero b c"
            "hero d e"
          `,
          gap: `${GAP}px`,
        }}
      >
        {/* HERO */}
        {hero && (
          <div
            style={{ gridArea: 'hero', height: `${HERO_H}px` }}
            className="overflow-hidden rounded-xl
                       [&>div]:h-full
                       [&_a]:h-full [&_a]:flex [&_a]:flex-col
                       [&_.aspect-square]:flex-1 [&_.aspect-square]:aspect-auto"
          >
            <ProductCard product={hero} storeSlug={storeSlug} />
          </div>
        )}

        {sideCards[0] && (
          <div style={{ gridArea: 'b' }} className="overflow-hidden rounded-xl">
            <ProductCard product={sideCards[0]} storeSlug={storeSlug} />
          </div>
        )}
        {sideCards[1] && (
          <div style={{ gridArea: 'c' }} className="overflow-hidden rounded-xl">
            <ProductCard product={sideCards[1]} storeSlug={storeSlug} />
          </div>
        )}
        {sideCards[2] && (
          <div style={{ gridArea: 'd' }} className="overflow-hidden rounded-xl">
            <ProductCard product={sideCards[2]} storeSlug={storeSlug} />
          </div>
        )}
        {sideCards[3] && (
          <div style={{ gridArea: 'e' }} className="overflow-hidden rounded-xl">
            <ProductCard product={sideCards[3]} storeSlug={storeSlug} />
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between mt-10 md:mt-14 pt-6 border-t border-border/60">
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
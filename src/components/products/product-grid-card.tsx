'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types';

// ============================================================================
// SKELETON
// ============================================================================

export function ProductGridCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-square w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// PRODUCT GRID CARD
// Minimal card with thumbnail, name appears on hover
// ============================================================================

interface ProductGridCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductGridCard({ product, onClick }: ProductGridCardProps) {
  const imageUrl = product.images?.[0];

  return (
    <button
      onClick={() => onClick(product)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Hover overlay with name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-medium text-sm line-clamp-2">
              {product.name}
            </h3>
            {product.category && (
              <p className="text-white/70 text-xs mt-1">{product.category}</p>
            )}
          </div>
        </div>

        {/* Inactive badge */}
        {!product.isActive && (
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-500/90 text-white text-xs px-2 py-0.5 rounded">
              Draft
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

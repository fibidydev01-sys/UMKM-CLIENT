// ══════════════════════════════════════════════════════════════
// TENANT CARD COMPONENTS - V2.0 REFACTORED
// Uses centralized lib/discover utilities
// ══════════════════════════════════════════════════════════════

'use client';

import Image from 'next/image';
import { Store, Package, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { ShowcaseTenant } from '@/types/discover';
import { getCategoryLabel, getCategoryColor, getInitials } from '@/lib/discover';

// Re-export for backward compatibility
export type { ShowcaseTenant } from '@/types/discover';

// ══════════════════════════════════════════════════════════════
// SKELETON LOADER
// ══════════════════════════════════════════════════════════════

export function TenantCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="flex items-center gap-3 mt-3 px-1">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TENANT CARD
// ══════════════════════════════════════════════════════════════

interface TenantCardProps {
  tenant: ShowcaseTenant;
  onClick: (tenant: ShowcaseTenant) => void;
}

export function TenantCard({ tenant, onClick }: TenantCardProps) {
  const productCount = tenant._count?.products || 0;
  const categoryColor = getCategoryColor(tenant.category);

  return (
    <button
      onClick={() => onClick(tenant)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted">
        {tenant.heroBackgroundImage ? (
          <Image
            src={tenant.heroBackgroundImage}
            alt={tenant.name || 'Store'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}20, ${categoryColor}05)`,
            }}
          >
            <Store className="h-12 w-12" style={{ color: `${categoryColor}40` }} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {tenant.description && (
              <p className="text-white/90 text-sm line-clamp-2 mb-3">
                {tenant.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0 text-xs gap-1"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryColor }}
                />
                {getCategoryLabel(tenant.category)}
              </Badge>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Package className="h-3.5 w-3.5" />
                <span>{productCount} produk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 px-1">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-background">
          {tenant.logo ? (
            <Image
              src={tenant.logo}
              alt={tenant.name || 'Logo'}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-muted-foreground">
              {getInitials(tenant.name)}
            </span>
          )}
        </div>
        <h3 className="font-medium text-sm text-foreground truncate flex-1 group-hover:text-primary transition-colors">
          {tenant.name || 'Unnamed Store'}
        </h3>
        <span className="text-xs text-muted-foreground shrink-0">
          {productCount} items
        </span>
      </div>
    </button>
  );
}
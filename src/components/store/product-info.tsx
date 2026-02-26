// ══════════════════════════════════════════════════════════════
// PRODUCT INFO - v2.3 (MULTI-CURRENCY FIX)
// ✅ FIX: currency diterima sebagai prop dari parent page
// ✅ FIX: formatPrice selalu pakai currency dinamis, tidak hardcode IDR
// ══════════════════════════════════════════════════════════════

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
  currency: string; // ✅ FIX: wajib dari parent (tenant.currency)
}

export function ProductInfo({ product, currency }: ProductInfoProps) {
  const isCustomPrice = product.price === 0;
  const hasDiscount =
    !isCustomPrice &&
    product.comparePrice &&
    product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
      ((product.comparePrice! - product.price) / product.comparePrice!) * 100
    )
    : 0;
  const isOutOfStock = product.trackStock && (product.stock ?? 0) <= 0;

  return (
    <div className="space-y-4">
      {/* Category */}
      {product.category && (
        <p className="text-sm text-muted-foreground">{product.category}</p>
      )}

      {/* Product Name */}
      <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.isFeatured && (
          <Badge className="bg-primary">⭐ Produk Unggulan</Badge>
        )}
        {isOutOfStock && (
          <Badge variant="destructive">Stok Habis</Badge>
        )}
        {product.trackStock &&
          !isOutOfStock &&
          (product.stock ?? 0) <= (product.minStock ?? 5) &&
          (product.stock ?? 0) > 0 && (
            <Badge variant="secondary">Stok Terbatas</Badge>
          )}
      </div>

      {/* ✅ FIX: Semua formatPrice pakai currency dari prop */}
      {!isCustomPrice && (
        <>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price, currency)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice!, currency)}
                </span>
                <Badge variant="destructive">-{discountPercent}%</Badge>
              </>
            )}
          </div>

          {/* Unit */}
          {product.unit && (
            <p className="text-sm text-muted-foreground">
              Harga per {product.unit}
            </p>
          )}
        </>
      )}

      <Separator />

      {/* Stock Info */}
      {product.trackStock && product.stock !== null && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Stok:</span>
          <span className={isOutOfStock ? 'text-destructive' : 'font-medium'}>
            {product.stock} {product.unit || 'pcs'}
          </span>
        </div>
      )}

      {/* SKU */}
      {product.sku && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">SKU:</span>
          <span className="font-mono">{product.sku}</span>
        </div>
      )}
    </div>
  );
}
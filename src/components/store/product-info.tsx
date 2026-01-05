import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

// ==========================================
// PRODUCT INFO COMPONENT
// ==========================================

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
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
        {product.trackStock && !isOutOfStock && (product.stock ?? 0) <= (product.minStock ?? 5) && (product.stock ?? 0) > 0 && (
          <Badge variant="secondary">Stok Terbatas</Badge>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.comparePrice!)}
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
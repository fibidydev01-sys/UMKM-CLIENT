// ══════════════════════════════════════════════════════════════
// PRODUCT PREVIEW DRAWER
// Shows product details in drawer when clicked from list
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
  Package,
  Tag,
  DollarSign,
  Box,
  BarChart3,
  Calendar,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatPrice, formatDateShort } from '@/lib/format';
import type { Product } from '@/types';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface ProductPreviewDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleActive?: (product: Product) => void;
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function ProductPreviewDrawer({
  product,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductPreviewDrawerProps) {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  // ════════════════════════════════════════════════════════════
  // SCROLL TO TOP when product changes
  // ════════════════════════════════════════════════════════════
  const prevProductIdRef = useRef(product?.id);
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      // Only scroll to top if product changed
      if (prevProductIdRef.current !== product?.id) {
        scrollContainerRef.current.scrollTop = 0;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedImageIndex(0);
        prevProductIdRef.current = product?.id;
      }
    }
  }, [product?.id, open]);

  // ════════════════════════════════════════════════════════════
  // STICKY HEADER DETECTION
  // ════════════════════════════════════════════════════════════
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const sentinel = headerSentinelRef.current;

    if (!scrollContainer || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderSticky(!entry.isIntersecting);
      },
      {
        root: scrollContainer,
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open]);

  // Reset states when drawer closes
  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setIsHeaderSticky(false); // eslint-disable-line react-hooks/set-state-in-effect
      setSelectedImageIndex(0);
    }
    prevOpenRef.current = open;
  }, [open]);

  // ════════════════════════════════════════════════════════════
  // HANDLERS
  // ════════════════════════════════════════════════════════════

  const handleEdit = useCallback(() => {
    if (product && onEdit) {
      onEdit(product);
      onOpenChange(false);
    }
  }, [product, onEdit, onOpenChange]);

  const handleDelete = useCallback(() => {
    if (product && onDelete) {
      onDelete(product);
      onOpenChange(false);
    }
  }, [product, onDelete, onOpenChange]);

  const handleToggleActive = useCallback(() => {
    if (product && onToggleActive) {
      onToggleActive(product);
    }
  }, [product, onToggleActive]);

  if (!product) return null;

  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages ? product.images[selectedImageIndex] : null;
  const stock = product.stock ?? 0;
  const minStock = product.minStock ?? 5;
  const isLowStock = product.trackStock && stock <= minStock;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        {/* Overlay */}
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />

        {/* Content */}
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'max-h-[92vh] outline-none',
            'flex flex-col'
          )}
          aria-describedby="drawer-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              {product.name ? `Preview ${product.name}` : 'Preview Produk'}
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="drawer-description">
              {product.description || `Lihat detail produk ${product.name || ''}`}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Sticky Header */}
          <div
            className={cn(
              'px-4 pb-4 border-b shrink-0 transition-shadow duration-200',
              'sticky top-0 bg-background z-10',
              isHeaderSticky && 'shadow-md'
            )}
          >
            <div className="flex items-center justify-between min-w-0">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-base truncate">{product.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  {product.sku && <span>SKU: {product.sku}</span>}
                  {product.category && (
                    <>
                      <span>·</span>
                      <span>{product.category}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                  {product.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            {/* Sentinel for sticky detection */}
            <div ref={headerSentinelRef} className="h-0" />

            {/* Product Images */}
            <div className="px-4 py-6">
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Main Image */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Tidak ada gambar
                      </p>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {hasImages && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                          'relative aspect-square rounded-lg overflow-hidden bg-muted',
                          'border-2 transition-all',
                          selectedImageIndex === idx
                            ? 'border-primary'
                            : 'border-transparent hover:border-muted-foreground/20'
                        )}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="px-4 pb-8 max-w-2xl mx-auto">
              {/* Price Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Harga
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Deskripsi
                  </h3>
                  <p className="text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Category */}
                {product.category && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kategori</p>
                      <p className="text-sm font-medium">{product.category}</p>
                    </div>
                  </div>
                )}

                {/* SKU */}
                {product.sku && (
                  <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">SKU</p>
                      <p className="text-sm font-medium font-mono">{product.sku}</p>
                    </div>
                  </div>
                )}

                {/* Stock */}
                {product.trackStock && (
                  <div className="flex items-start gap-3">
                    <Box className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Stok</p>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isLowStock && 'text-orange-500'
                        )}
                      >
                        {stock} {product.unit || 'pcs'}
                        {isLowStock && ' (Rendah)'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cost Price */}
                {product.costPrice && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Harga Modal</p>
                      <p className="text-sm font-medium">
                        {formatPrice(product.costPrice)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Dibuat</p>
                    <p className="text-sm font-medium">
                      {formatDateShort(product.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge variant="secondary" className="mt-1">
                        Unggulan
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {onToggleActive && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleToggleActive}
                  >
                    {product.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Nonaktifkan
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Aktifkan
                      </>
                    )}
                  </Button>
                )}

                {onEdit && (
                  <Button variant="default" className="w-full" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {onDelete && (
                <Button
                  variant="outline"
                  className="w-full mt-3 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Produk
                </Button>
              )}
            </div>
          </div>

          {/* Floating Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur border shadow-sm hover:bg-muted transition-colors z-20"
            aria-label="Tutup preview"
          >
            <X className="h-4 w-4" />
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

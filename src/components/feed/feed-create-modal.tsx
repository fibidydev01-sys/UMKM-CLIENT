'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Store, Check } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { productsApi, feedApi, getErrorMessage } from '@/lib/api';
import type { Product } from '@/types';

interface FeedCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FeedCreateModal({ open, onClose, onSuccess }: FeedCreateModalProps) {
  const [step, setStep] = useState<'select-product' | 'write-caption'>('select-product');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products when modal opens
  useEffect(() => {
    if (!open) return;

    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await productsApi.getAll({ limit: 100, isActive: true });
        setProducts(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [open]);

  // Reset state when modal closes
  const handleClose = () => {
    setStep('select-product');
    setSelectedProduct(null);
    setCaption('');
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    setSubmitting(true);
    setError(null);

    try {
      await feedApi.create({
        productId: selectedProduct.id,
        caption: caption.trim() || undefined,
      });

      handleClose();
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const productImage = (product: Product) => product.images?.[0];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'select-product' ? 'Pilih Produk' : 'Tulis Caption'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {step === 'select-product' && (
          <div className="space-y-2">
            {loadingProducts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <Skeleton className="w-14 h-14 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Belum ada produk aktif
              </p>
            ) : (
              products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition text-left"
                  onClick={() => {
                    setSelectedProduct(product);
                    setStep('write-caption');
                    setError(null);
                  }}
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {productImage(product) ? (
                      <Image
                        src={productImage(product)!}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-sm text-primary font-semibold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {step === 'write-caption' && selectedProduct && (
          <div className="space-y-4">
            {/* Selected Product Preview */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-background flex-shrink-0">
                {productImage(selectedProduct) ? (
                  <Image
                    src={productImage(selectedProduct)!}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Store className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{selectedProduct.name}</p>
                <p className="text-sm text-primary font-semibold">
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            </div>

            {/* Caption Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Caption (Opsional)
              </label>
              <Textarea
                placeholder="Ceritakan tentang produk ini..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {caption.length}/500
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('select-product');
                  setError(null);
                }}
                disabled={submitting}
              >
                Kembali
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Posting...' : 'Post ke Feed'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

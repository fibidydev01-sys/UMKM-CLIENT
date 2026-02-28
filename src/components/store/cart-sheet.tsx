'use client';

// ==========================================
// CART SHEET
// ==========================================

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  useCartStore,
  useCartItems,
  useCartTotalPrice,
  useCartIsEmpty,
  useCartHydrated,
} from '@/stores';
import { formatPrice } from '@/lib/format';
import { getThumbnailUrl } from '@/lib/cloudinary';
import { WhatsAppCheckoutDialog } from './whatsapp-checkout-dialog';
import type { PublicTenant } from '@/types';

interface CartSheetProps {
  tenant: PublicTenant;
}

export function CartSheet({ tenant }: CartSheetProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Semua hooks harus dipanggil sebelum conditional return
  const items = useCartItems();
  const totalPrice = useCartTotalPrice();
  const isEmpty = useCartIsEmpty();
  const isHydrated = useCartHydrated();

  const incrementQty = useCartStore((state) => state.incrementQty);
  const decrementQty = useCartStore((state) => state.decrementQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // Currency dari tenant
  const currency = tenant?.currency || 'IDR';
  const fmt = (value: number) => formatPrice(value, currency);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const handleCheckout = () => {
    setSheetOpen(false);
    setCheckoutOpen(true);
  };

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {isHydrated && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[11px] font-medium text-primary-foreground flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Cart
              {isHydrated && totalItems > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {!isHydrated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">
                Loading cart...
              </div>
            </div>
          ) : isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add products to get started
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {/* Image */}
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={getThumbnailUrl(item.image)}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {fmt(item.price)}
                          {item.unit && ` / ${item.unit}`}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => decrementQty(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => incrementQty(item.id)}
                            disabled={
                              item.maxStock !== undefined &&
                              item.qty >= item.maxStock
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive ml-auto"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal per item */}
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {fmt(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              {/* Footer */}
              <SheetFooter className="flex-col gap-3 sm:flex-col">
                {/* Total */}
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">{fmt(totalPrice)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="flex-1"
                  >
                    Clear cart
                  </Button>
                  <Button className="flex-1" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* WhatsApp checkout dialog */}
      <WhatsAppCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        tenant={tenant}
      />
    </>
  );
}
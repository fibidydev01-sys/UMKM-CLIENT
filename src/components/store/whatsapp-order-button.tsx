'use client';

// ==========================================
// WHATSAPP ORDER BUTTON
// ==========================================

import { useState, type ReactNode } from 'react';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { MessageCircle, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatPrice, generateWhatsAppLink } from '@/lib/format';
import type { PaymentMethods } from '@/types';

interface Product {
  id: string;
  name: string;
  price: number;
  unit?: string | null;
  stock?: number | null;
  trackStock?: boolean;
}

interface OrderTenant {
  name: string;
  whatsapp?: string;
  currency?: string;
  taxRate?: number;
  paymentMethods?: PaymentMethods;
}

interface WhatsAppOrderButtonProps {
  product: Product;
  tenant: OrderTenant;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: ReactNode;
}

export function WhatsAppOrderButton({
  product,
  tenant,
  className,
  variant = 'default',
  size = 'default',
  children,
}: WhatsAppOrderButtonProps) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Currency dari tenant
  const currency = tenant.currency || 'IDR';
  const fmt = (value: number) => formatPrice(value, currency);

  const isCustomPrice = product.price === 0;
  const maxStock = product.trackStock ? (product.stock ?? 0) : 999;

  const incrementQty = () => { if (qty < maxStock) setQty(qty + 1); };
  const decrementQty = () => { if (qty > 1) setQty(qty - 1); };

  const subtotal = isCustomPrice ? 0 : product.price * qty;
  const taxRate = tenant.taxRate || 0;
  const tax = !isCustomPrice && taxRate > 0 ? subtotal * (taxRate / 100) : 0;
  const total = subtotal + tax;

  const paymentMethods = tenant.paymentMethods as PaymentMethods | undefined;
  const enabledBanks = paymentMethods?.bankAccounts?.filter((b) => b.enabled) || [];
  const enabledEwallets = paymentMethods?.eWallets?.filter((e) => e.enabled) || [];
  const codEnabled = paymentMethods?.cod?.enabled || false;

  const getPaymentInfoString = () => {
    const lines: string[] = [];

    if (enabledBanks.length > 0) {
      lines.push('*Bank Transfer:*');
      enabledBanks.forEach((bank) => {
        lines.push(`${bank.bank}: ${bank.accountNumber} (${bank.accountName})`);
      });
    }

    if (enabledEwallets.length > 0) {
      lines.push('*E-Wallet:*');
      enabledEwallets.forEach((ew) => {
        lines.push(`${ew.provider}: ${ew.number}${ew.name ? ` (${ew.name})` : ''}`);
      });
    }

    if (codEnabled) {
      lines.push('*Cash on Delivery* available');
    }

    return lines.join('\n');
  };

  const handleOrder = async () => {
    setIsSubmitting(true);

    const paymentInfo = getPaymentInfoString();

    const message = isCustomPrice
      ? `Hi ${tenant.name},

I'd like to inquire about pricing for:

*${product.name}*
Quantity: ${qty} ${product.unit || 'pcs'}
${name ? `\nName: ${name}` : ''}${notes ? `\nNotes: ${notes}` : ''}

Could you please share the price and availability?
Thank you! 🙏`
      : `Hi ${tenant.name},

I'd like to order:

*${product.name}*
Quantity: ${qty} ${product.unit || 'pcs'}
Price: ${fmt(product.price)}
${tax > 0 ? `Tax (${taxRate}%): ${fmt(tax)}\n` : ''}*Total: ${fmt(total)}*
${name ? `\nName: ${name}` : ''}${notes ? `\nNotes: ${notes}` : ''}
${paymentInfo ? `\n---\n${paymentInfo}` : ''}

Please confirm availability.
Thank you! 🙏`;

    const link = generateWhatsAppLink(tenant.whatsapp || '', message);
    window.open(link, '_blank');

    setQty(1);
    setName('');
    setNotes('');
    setOpen(false);
    setIsSubmitting(false);
  };

  const isOutOfStock = product.trackStock && (product.stock ?? 0) <= 0;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isOutOfStock}
        >
          {children || (
            <>
              <MessageCircle className="mr-2 h-4 w-4" />
              {isOutOfStock ? 'Out of stock' : 'Order via WhatsApp'}
            </>
          )}
        </Button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'h-[85vh] outline-none',
            'flex flex-col',
          )}
          aria-describedby="wa-order-drawer-description"
        >
          <Drawer.Title asChild>
            <VisuallyHidden.Root>Order {product.name}</VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="wa-order-drawer-description">
              Complete your order details to send to {tenant.name}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="px-6 pb-3 border-b shrink-0">
            <div className="max-w-2xl mx-auto w-full">
              <h3 className="font-semibold text-lg">Order {product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Complete your order details to send to {tenant.name}
              </p>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full px-6 py-4 space-y-4">

              {/* Product info */}
              <div className="rounded-lg bg-muted p-3">
                <p className="font-medium">{product.name}</p>
                {!isCustomPrice && (
                  <p className="text-sm text-muted-foreground">
                    {fmt(product.price)} / {product.unit || 'pcs'}
                  </p>
                )}
                {product.trackStock && (
                  <p className="text-xs text-muted-foreground mt-1">
                    In stock: {product.stock}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrementQty}
                    disabled={qty <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    max={maxStock}
                    value={qty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQty(Math.min(Math.max(val, 1), maxStock));
                    }}
                    className="w-20 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={incrementQty}
                    disabled={qty >= maxStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {product.unit || 'pcs'}
                  </span>
                </div>
              </div>

              {/* Customer name */}
              <div className="space-y-2">
                <Label htmlFor="order-name">Name (optional)</Label>
                <Input
                  id="order-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="order-notes">Notes (optional)</Label>
                <Textarea
                  id="order-notes"
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Order total */}
              {!isCustomPrice && (
                <div className="rounded-lg border p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tax ({taxRate}%)
                      </span>
                      <span>{fmt(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-1 border-t">
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 shrink-0">
            <div className="max-w-2xl mx-auto w-full flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleOrder} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="mr-2 h-4 w-4" />
                )}
                Send via WhatsApp
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
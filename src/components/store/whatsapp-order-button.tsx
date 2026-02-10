'use client';

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

  const maxStock = product.trackStock ? (product.stock ?? 0) : 999;

  const incrementQty = () => {
    if (qty < maxStock) setQty(qty + 1);
  };

  const decrementQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  // Calculate totals
  const subtotal = product.price * qty;
  const taxRate = tenant.taxRate || 0;
  const tax = taxRate > 0 ? subtotal * (taxRate / 100) : 0;
  const total = subtotal + tax;

  // Get enabled payment options for info
  const paymentMethods = tenant.paymentMethods as PaymentMethods | undefined;
  const enabledBanks = paymentMethods?.bankAccounts?.filter(b => b.enabled) || [];
  const enabledEwallets = paymentMethods?.eWallets?.filter(e => e.enabled) || [];
  const codEnabled = paymentMethods?.cod?.enabled || false;

  // Build payment info string
  const getPaymentInfoString = () => {
    const lines: string[] = [];

    if (enabledBanks.length > 0) {
      lines.push('*Transfer Bank:*');
      enabledBanks.forEach(bank => {
        lines.push(`${bank.bank}: ${bank.accountNumber} (${bank.accountName})`);
      });
    }

    if (enabledEwallets.length > 0) {
      lines.push('*E-Wallet:*');
      enabledEwallets.forEach(ew => {
        lines.push(`${ew.provider}: ${ew.number}${ew.name ? ` (${ew.name})` : ''}`);
      });
    }

    if (codEnabled) {
      lines.push('*COD* (Bayar di Tempat) tersedia');
    }

    return lines.join('\n');
  };

  const handleOrder = async () => {
    setIsSubmitting(true);

    const paymentInfo = getPaymentInfoString();

    const message = `Halo ${tenant.name},

Saya ingin memesan:

*${product.name}*
Jumlah: ${qty} ${product.unit || 'pcs'}
Harga: ${formatPrice(product.price)}
${tax > 0 ? `Pajak (${taxRate}%): ${formatPrice(tax)}\n` : ''}*Total: ${formatPrice(total)}*
${name ? `\nNama: ${name}` : ''}${notes ? `\nCatatan: ${notes}` : ''}
${paymentInfo ? `\n---\n${paymentInfo}` : ''}

Mohon konfirmasi ketersediaan.
Terima kasih! 🙏`;

    const link = generateWhatsAppLink(tenant.whatsapp || '', message);
    window.open(link, '_blank');

    // Reset form
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
              {isOutOfStock ? 'Stok Habis' : 'Pesan via WhatsApp'}
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
            <VisuallyHidden.Root>Pesan {product.name}</VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="wa-order-drawer-description">
              Lengkapi detail pesanan untuk dikirim ke {tenant.name}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="px-6 pb-3 border-b shrink-0">
            <div className="max-w-2xl mx-auto w-full">
              <h3 className="font-semibold text-lg">Pesan {product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Lengkapi detail pesanan untuk dikirim ke {tenant.name}
              </p>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full px-6 py-4 space-y-4">
              {/* Product Info */}
              <div className="rounded-lg bg-muted p-3">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(product.price)} / {product.unit || 'pcs'}
                </p>
                {product.trackStock && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Stok tersedia: {product.stock}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Jumlah</Label>
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

              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="order-name">Nama (Opsional)</Label>
                <Input
                  id="order-name"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="order-notes">Catatan (Opsional)</Label>
                <Textarea
                  id="order-notes"
                  placeholder="Catatan tambahan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Total */}
              <div className="rounded-lg border p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak ({taxRate}%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-1 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="border-t px-6 py-4 shrink-0">
            <div className="max-w-2xl mx-auto w-full flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button className="flex-1" onClick={handleOrder} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="mr-2 h-4 w-4" />
                )}
                Kirim via WhatsApp
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

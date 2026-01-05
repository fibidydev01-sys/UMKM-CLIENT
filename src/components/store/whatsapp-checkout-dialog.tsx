'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatPrice, generateWhatsAppLink } from '@/lib/format';
import { useCartStore, useCartItems, useCartTotalPrice } from '@/stores';

// ==========================================
// WHATSAPP CHECKOUT DIALOG
// Modal for cart checkout via WhatsApp
// ==========================================

interface WhatsAppCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  storeWhatsApp: string;
}

export function WhatsAppCheckoutDialog({
  open,
  onOpenChange,
  storeName,
  storeWhatsApp,
}: WhatsAppCheckoutDialogProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const items = useCartItems();
  const totalPrice = useCartTotalPrice();
  const clearCart = useCartStore((state) => state.clearCart);

  const handleOrder = () => {
    // Build items list
    const itemsList = items
      .map((item) => `• ${item.name} x${item.qty} = ${formatPrice(item.price * item.qty)}`)
      .join('\n');

    const message = `Halo ${storeName},

Saya ingin memesan:

${itemsList}

*Total: ${formatPrice(totalPrice)}*
${name ? `\nNama: ${name}` : ''}${notes ? `\nCatatan: ${notes}` : ''}

Mohon konfirmasi ketersediaan.
Terima kasih!`;

    const link = generateWhatsAppLink(storeWhatsApp, message);
    window.open(link, '_blank');

    // Clear cart after order
    clearCart();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pesan via WhatsApp</DialogTitle>
          <DialogDescription>
            Isi detail pesanan Anda, lalu klik tombol pesan untuk langsung
            terhubung dengan penjual via WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Items */}
          <div className="rounded-lg bg-muted p-4">
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground"> x{item.qty}</span>
                    </div>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Name (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="checkout-name">Nama (opsional)</Label>
            <Input
              id="checkout-name"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="checkout-notes">Catatan (opsional)</Label>
            <Textarea
              id="checkout-notes"
              placeholder="Catatan tambahan untuk penjual..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleOrder} disabled={items.length === 0}>
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pesan Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
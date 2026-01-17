'use client';

import { useState, useMemo } from 'react';
import { MessageCircle, Truck, CreditCard, Banknote, Wallet } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice, generateWhatsAppLink } from '@/lib/format';
import { useCartStore, useCartItems, useCartTotalPrice } from '@/stores';
import type { PublicTenant, PaymentMethods, ShippingMethods } from '@/types';

interface WhatsAppCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: PublicTenant;
}

export function WhatsAppCheckoutDialog({
  open,
  onOpenChange,
  tenant,
}: WhatsAppCheckoutDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const items = useCartItems();
  const subtotal = useCartTotalPrice();
  const clearCart = useCartStore((state) => state.clearCart);

  // ✅ FIXED: Add null safety checks and memoization
  // Get payment methods with safe access
  const paymentMethods = useMemo(() =>
    (tenant?.paymentMethods as PaymentMethods | undefined) ?? {
      bankAccounts: [],
      eWallets: [],
      cod: { enabled: false, note: '' },
    }, [tenant?.paymentMethods]
  );

  const shippingMethods = useMemo(() =>
    (tenant?.shippingMethods as ShippingMethods | undefined) ?? {
      couriers: [],
    }, [tenant?.shippingMethods]
  );

  // Get enabled payment options
  const enabledBanks = useMemo(() =>
    paymentMethods?.bankAccounts?.filter(b => b.enabled) || [],
    [paymentMethods]
  );
  const enabledEwallets = useMemo(() =>
    paymentMethods?.eWallets?.filter(e => e.enabled) || [],
    [paymentMethods]
  );
  const codEnabled = paymentMethods?.cod?.enabled || false;

  // Get enabled couriers
  const enabledCouriers = useMemo(() =>
    shippingMethods?.couriers?.filter(c => c.enabled) || [],
    [shippingMethods]
  );

  // Calculate totals with null safety
  const taxRate = tenant?.taxRate || 0;
  const tax = taxRate > 0 ? subtotal * (taxRate / 100) : 0;

  const freeShippingThreshold = tenant?.freeShippingThreshold;
  const defaultShippingCost = tenant?.defaultShippingCost || 0;
  const shipping = (freeShippingThreshold && subtotal >= freeShippingThreshold)
    ? 0
    : defaultShippingCost;

  const total = subtotal + tax + shipping;

  // Build payment options for radio group
  const paymentOptions = useMemo(() => {
    const options: { id: string; label: string; sublabel: string; type: 'bank' | 'ewallet' | 'cod' }[] = [];

    enabledBanks.forEach(bank => {
      options.push({
        id: `bank-${bank.id}`,
        label: bank.bank,
        sublabel: `${bank.accountNumber} (${bank.accountName})`,
        type: 'bank',
      });
    });

    enabledEwallets.forEach(ewallet => {
      options.push({
        id: `ewallet-${ewallet.id}`,
        label: ewallet.provider,
        sublabel: ewallet.number + (ewallet.name ? ` (${ewallet.name})` : ''),
        type: 'ewallet',
      });
    });

    if (codEnabled) {
      options.push({
        id: 'cod',
        label: 'COD (Bayar di Tempat)',
        sublabel: paymentMethods?.cod?.note || 'Bayar saat barang diterima',
        type: 'cod',
      });
    }

    return options;
  }, [enabledBanks, enabledEwallets, codEnabled, paymentMethods]);

  const handleOrder = () => {
    // Build items list
    const itemsList = items
      .map((item) => `• ${item.name} x${item.qty} = ${formatPrice(item.price * item.qty)}`)
      .join('\n');

    // Get selected payment info
    let paymentInfo = '';
    if (selectedPayment) {
      const option = paymentOptions.find(o => o.id === selectedPayment);
      if (option) {
        if (option.type === 'bank') {
          paymentInfo = `Transfer ${option.label}: ${option.sublabel}`;
        } else if (option.type === 'ewallet') {
          paymentInfo = `${option.label}: ${option.sublabel}`;
        } else {
          paymentInfo = 'COD (Bayar di Tempat)';
        }
      }
    }

    // Get selected courier
    const courierInfo = selectedCourier
      ? enabledCouriers.find(c => c.id === selectedCourier)?.name || ''
      : '';

    // Build the WhatsApp message
    const storeName = tenant?.name || 'Toko';
    const message = `Halo ${storeName},

Saya ingin memesan:

${itemsList}

---
Subtotal: ${formatPrice(subtotal)}${tax > 0 ? `\nPajak (${taxRate}%): ${formatPrice(tax)}` : ''}
Ongkir: ${shipping === 0 ? 'GRATIS 🎉' : formatPrice(shipping)}${freeShippingThreshold && shipping === 0 ? ` (min. belanja ${formatPrice(freeShippingThreshold)})` : ''}
*Total: ${formatPrice(total)}*
---
${name ? `\nNama: ${name}` : ''}${address ? `\nAlamat: ${address}` : ''}${courierInfo ? `\nKurir: ${courierInfo}` : ''}${paymentInfo ? `\nPembayaran: ${paymentInfo}` : ''}${notes ? `\nCatatan: ${notes}` : ''}

Mohon konfirmasi ketersediaan.
Terima kasih! 🙏`;

    const link = generateWhatsAppLink(tenant?.whatsapp || '', message);
    window.open(link, '_blank');

    // Clear cart after order
    clearCart();
    onOpenChange(false);
  };

  const hasPaymentOptions = paymentOptions.length > 0;
  const hasCouriers = enabledCouriers.length > 0;

  // ✅ Early return if tenant is not available
  if (!tenant) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Checkout via WhatsApp</DialogTitle>
          <DialogDescription>
            Lengkapi detail pesanan Anda untuk dikirim ke {tenant.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Order Items */}
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Ringkasan Pesanan
              </h4>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.name} x{item.qty}
                    </span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkout-name">Nama</Label>
                <Input
                  id="checkout-name"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-address">Alamat Pengiriman</Label>
                <Textarea
                  id="checkout-address"
                  placeholder="Alamat lengkap untuk pengiriman"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Courier Selection */}
            {hasCouriers && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Pilih Kurir
                  </Label>
                  <RadioGroup value={selectedCourier} onValueChange={setSelectedCourier}>
                    <div className="grid grid-cols-2 gap-2">
                      {enabledCouriers.map((courier) => (
                        <div key={courier.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={courier.id} id={`courier-${courier.id}`} />
                          <Label htmlFor={`courier-${courier.id}`} className="text-sm cursor-pointer">
                            {courier.name}
                            {courier.note && (
                              <span className="text-xs text-muted-foreground block">
                                {courier.note}
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Payment Method Selection */}
            {hasPaymentOptions && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Metode Pembayaran
                  </Label>
                  <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                    <div className="space-y-2">
                      {paymentOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              {option.type === 'bank' && <Banknote className="h-4 w-4 text-muted-foreground" />}
                              {option.type === 'ewallet' && <Wallet className="h-4 w-4 text-muted-foreground" />}
                              {option.type === 'cod' && <Truck className="h-4 w-4 text-muted-foreground" />}
                              <span className="font-medium">{option.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{option.sublabel}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Notes */}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="checkout-notes">Catatan (Opsional)</Label>
              <Textarea
                id="checkout-notes"
                placeholder="Catatan tambahan untuk penjual..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            {/* Order Summary */}
            <div className="rounded-lg border p-4 space-y-2">
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ongkos Kirim</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
                </span>
              </div>
              {freeShippingThreshold && shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  💡 Belanja min. {formatPrice(freeShippingThreshold)} untuk gratis ongkir!
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleOrder} disabled={items.length === 0}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Kirim Pesanan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
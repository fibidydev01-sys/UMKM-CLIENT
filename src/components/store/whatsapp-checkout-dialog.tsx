'use client';

// ==========================================
// WHATSAPP CHECKOUT DIALOG
// ==========================================

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Truck, CreditCard, Banknote, Wallet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { API_URL } from '@/config/constants';

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
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const items = useCartItems();
  const subtotal = useCartTotalPrice();
  const clearCart = useCartStore((state) => state.clearCart);

  // Currency dari tenant
  const currency = tenant?.currency || 'IDR';
  const fmt = (value: number) => formatPrice(value, currency);

  const paymentMethods = useMemo(
    () =>
      (tenant?.paymentMethods as PaymentMethods | undefined) ?? {
        bankAccounts: [],
        eWallets: [],
        cod: { enabled: false, note: '' },
      },
    [tenant?.paymentMethods]
  );

  const shippingMethods = useMemo(
    () =>
      (tenant?.shippingMethods as ShippingMethods | undefined) ?? {
        couriers: [],
      },
    [tenant?.shippingMethods]
  );

  const enabledBanks = useMemo(
    () => paymentMethods?.bankAccounts?.filter((b) => b.enabled) || [],
    [paymentMethods]
  );
  const enabledEwallets = useMemo(
    () => paymentMethods?.eWallets?.filter((e) => e.enabled) || [],
    [paymentMethods]
  );
  const codEnabled = paymentMethods?.cod?.enabled || false;

  const enabledCouriers = useMemo(
    () => shippingMethods?.couriers?.filter((c) => c.enabled) || [],
    [shippingMethods]
  );

  const taxRate = tenant?.taxRate || 0;
  const tax = taxRate > 0 ? subtotal * (taxRate / 100) : 0;

  const freeShippingThreshold = tenant?.freeShippingThreshold;
  const defaultShippingCost = tenant?.defaultShippingCost || 0;
  const shipping =
    freeShippingThreshold && subtotal >= freeShippingThreshold
      ? 0
      : defaultShippingCost;

  const total = subtotal + tax + shipping;

  const paymentOptions = useMemo(() => {
    const options: {
      id: string;
      label: string;
      sublabel: string;
      type: 'bank' | 'ewallet' | 'cod';
    }[] = [];

    enabledBanks.forEach((bank) => {
      options.push({
        id: `bank-${bank.id}`,
        label: bank.bank,
        sublabel: `${bank.accountNumber} (${bank.accountName})`,
        type: 'bank',
      });
    });

    enabledEwallets.forEach((ewallet) => {
      options.push({
        id: `ewallet-${ewallet.id}`,
        label: ewallet.provider,
        sublabel:
          ewallet.number + (ewallet.name ? ` (${ewallet.name})` : ''),
        type: 'ewallet',
      });
    });

    if (codEnabled) {
      options.push({
        id: 'cod',
        label: 'Cash on Delivery',
        sublabel:
          paymentMethods?.cod?.note || 'Pay when your order arrives',
        type: 'cod',
      });
    }

    return options;
  }, [enabledBanks, enabledEwallets, codEnabled, paymentMethods]);

  const handleOrder = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!phone.trim()) { toast.error('WhatsApp number is required'); return; }
    if (!address.trim()) { toast.error('Shipping address is required'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/store/${tenant.slug}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
          })),
          paymentMethod: selectedPayment || undefined,
          courier: selectedCourier
            ? enabledCouriers.find((c) => c.id === selectedCourier)?.name
            : undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }

      const data = await response.json();
      const { order, trackingUrl } = data;

      toast.success('Order placed successfully!');

      if (tenant?.whatsapp) {
        const itemsList = items
          .map(
            (item) =>
              `• ${item.name} x${item.qty} = ${fmt(item.price * item.qty)}`
          )
          .join('\n');

        const courierInfo = selectedCourier
          ? enabledCouriers.find((c) => c.id === selectedCourier)?.name || ''
          : '';

        let paymentInfo = '';
        if (selectedPayment) {
          const option = paymentOptions.find((o) => o.id === selectedPayment);
          if (option) {
            if (option.type === 'bank') {
              paymentInfo = `Bank Transfer — ${option.label}: ${option.sublabel}`;
            } else if (option.type === 'ewallet') {
              paymentInfo = `${option.label}: ${option.sublabel}`;
            } else {
              paymentInfo = 'Cash on Delivery';
            }
          }
        }

        const message = `Hi ${tenant.name},

I just placed an order: *${order.orderNumber}*

Order summary:
${itemsList}

---
Subtotal: ${fmt(subtotal)}${tax > 0 ? `\nTax (${taxRate}%): ${fmt(tax)}` : ''}
Shipping: ${shipping === 0 ? 'FREE 🎉' : fmt(shipping)}
*Total: ${fmt(total)}*
---

Name: ${name}
WhatsApp: ${phone}
Address: ${address}${courierInfo ? `\nCourier: ${courierInfo}` : ''}${paymentInfo ? `\nPayment: ${paymentInfo}` : ''}${notes ? `\nNotes: ${notes}` : ''}

Tracking: ${window.location.origin}${trackingUrl}

Thank you! 🙏`;

        const link = generateWhatsAppLink(tenant.whatsapp, message);
        window.open(link, '_blank');
      }

      clearCart();
      onOpenChange(false);
      router.push(trackingUrl);
    } catch (error) {
      console.error('[WhatsAppCheckout] Gagal membuat pesanan:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to place order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasPaymentOptions = paymentOptions.length > 0;
  const hasCouriers = enabledCouriers.length > 0;

  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Checkout via WhatsApp</DialogTitle>
          <DialogDescription>
            Complete your order details to send to {tenant.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Order items */}
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Order summary
              </h4>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.name} x{item.qty}
                    </span>
                    <span>{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Customer info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkout-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="checkout-name"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-phone">
                  WhatsApp number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="checkout-phone"
                  type="tel"
                  placeholder="e.g. 081234567890 or +6281234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-address">
                  Shipping address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="checkout-address"
                  placeholder="Full shipping address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Courier selection */}
            {hasCouriers && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Courier
                  </Label>
                  <RadioGroup
                    value={selectedCourier}
                    onValueChange={setSelectedCourier}
                    disabled={isLoading}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {enabledCouriers.map((courier) => (
                        <div
                          key={courier.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={courier.id}
                            id={`courier-${courier.id}`}
                            disabled={isLoading}
                          />
                          <Label
                            htmlFor={`courier-${courier.id}`}
                            className="text-sm cursor-pointer"
                          >
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

            {/* Payment method selection */}
            {hasPaymentOptions && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment method
                  </Label>
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                    disabled={isLoading}
                  >
                    <div className="space-y-2">
                      {paymentOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-0.5"
                            disabled={isLoading}
                          />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {option.type === 'bank' && (
                                <Banknote className="h-4 w-4 text-muted-foreground" />
                              )}
                              {option.type === 'ewallet' && (
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                              )}
                              {option.type === 'cod' && (
                                <Truck className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium">{option.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {option.sublabel}
                            </span>
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
              <Label htmlFor="checkout-notes">Notes (optional)</Label>
              <Textarea
                id="checkout-notes"
                placeholder="Any notes for the seller..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                disabled={isLoading}
              />
            </div>

            {/* Order total */}
            <div className="rounded-lg border p-4 space-y-2">
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span
                  className={
                    shipping === 0 ? 'text-green-600 font-medium' : ''
                  }
                >
                  {shipping === 0 ? 'FREE' : fmt(shipping)}
                </span>
              </div>
              {freeShippingThreshold && shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  💡 Spend {fmt(freeShippingThreshold)} or more for free shipping!
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOrder}
            disabled={items.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Place order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
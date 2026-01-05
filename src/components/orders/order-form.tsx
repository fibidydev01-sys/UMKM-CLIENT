'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCreateOrder } from '@/hooks';
import { formatPrice } from '@/lib/format';
import type { Product, Customer } from '@/types';

// ==========================================
// ZOD SCHEMA
// ==========================================

const orderFormSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(1, 'Nama pelanggan wajib diisi'),
  customerPhone: z.string().min(10, 'Nomor telepon tidak valid'),
  notes: z.string().optional(),
  paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface OrderFormProps {
  products: Product[];
  customers: Customer[];
  initialCustomerId?: string;
}

export function OrderForm({ products, customers, initialCustomerId }: OrderFormProps) {
  const router = useRouter();
  const { createOrder, isLoading } = useCreateOrder();

  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  // ✅ FIX: Customer search state
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // ✅ FIX: Use useMemo instead of useEffect + setState
  const filteredCustomers = useMemo(() => {
    if (customerSearch.length >= 2) {
      const searchLower = customerSearch.toLowerCase();
      return customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.phone.includes(customerSearch)
      );
    }
    return customers.slice(0, 10); // Show first 10 by default
  }, [customerSearch, customers]);

  const initialCustomer = customers.find((c) => c.id === initialCustomerId);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: initialCustomer?.id || '',
      customerName: initialCustomer?.name || '',
      customerPhone: initialCustomer?.phone || '',
      notes: '',
      paymentMethod: 'cash',
    },
  });

  const customerName = useWatch({
    control: form.control,
    name: 'customerName',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingIndex = items.findIndex((i) => i.productId === product.id);
    if (existingIndex >= 0) {
      setItems((prev) =>
        prev.map((item, index) =>
          index === existingIndex ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
        },
      ]);
    }

    setSelectedProduct('');
  };

  const handleUpdateQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty } : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectCustomer = (customer: Customer) => {
    form.setValue('customerId', customer.id);
    form.setValue('customerName', customer.name);
    form.setValue('customerPhone', customer.phone);
    setCustomerSearchOpen(false);
    setCustomerSearch('');
  };

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    if (items.length === 0) {
      return;
    }

    try {
      await createOrder({
        customerId: data.customerId || undefined,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        notes: data.notes || undefined,
        paymentMethod: data.paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
      });

      router.push('/dashboard/orders');
    } catch {
      // Error handled in hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Pilih produk..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter((p) => p.isActive)
                        .map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {formatPrice(product.price)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddProduct}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg border"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(index, item.qty - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(index, item.qty + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <p className="w-24 text-right font-medium">
                          {formatPrice(item.price * item.qty)}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada produk ditambahkan
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ✅ FIX: Customer Section dengan useMemo */}
            <Card>
              <CardHeader>
                <CardTitle>Pelanggan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Cari Pelanggan
                  </label>
                  <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {customerName || 'Ketik nama/telepon...'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Cari nama atau nomor telepon..."
                          value={customerSearch}
                          onValueChange={setCustomerSearch}
                        />
                        <CommandList>
                          {filteredCustomers.length === 0 ? (
                            <CommandEmpty>
                              {customerSearch.length >= 2
                                ? 'Pelanggan tidak ditemukan'
                                : 'Ketik minimal 2 karakter...'}
                            </CommandEmpty>
                          ) : (
                            <CommandGroup heading={`${filteredCustomers.length} Pelanggan`}>
                              {filteredCustomers.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  value={customer.id}
                                  onSelect={() => handleSelectCustomer(customer)}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{customer.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {customer.phone}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  atau isi manual
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama pelanggan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Catatan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={`Contoh:\n- Alamat: Jl. Merdeka No. 10\n- Kirim sore jam 5\n- Hutang, bayar minggu depan`}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Bisa diisi alamat pengiriman, catatan khusus, dll.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah Item</span>
                  <span>{items.reduce((sum, i) => sum + i.qty, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Tunai</SelectItem>
                          <SelectItem value="transfer">Transfer Bank</SelectItem>
                          <SelectItem value="ewallet">E-Wallet</SelectItem>
                          <SelectItem value="cod">COD</SelectItem>
                          <SelectItem value="debt">Hutang</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || items.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Buat Pesanan
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks';
import { customerSchema, type CustomerFormData } from '@/lib/validations';
import type { Customer } from '@/types';

// ==========================================
// CUSTOMER FORM COMPONENT
// ==========================================

/**
 * Helper: Strip phone prefix for display/form value
 * "6281234567890" → "81234567890"
 * "081234567890" → "81234567890"
 */
function stripPhonePrefix(phone: string | null | undefined): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

interface CustomerFormProps {
  customer?: Customer;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const isEditing = !!customer;

  const { createCustomer, isLoading: isCreating } = useCreateCustomer();
  const { updateCustomer, isLoading: isUpdating } = useUpdateCustomer();
  const isLoading = isCreating || isUpdating;

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      phone: stripPhonePrefix(customer?.phone),
      email: customer?.email || '',
      address: customer?.address || '',
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      // Format phone number - add 62 prefix for storage
      let phone = data.phone.replace(/\D/g, '');
      if (phone.startsWith('0')) {
        phone = phone.slice(1);
      }
      phone = '62' + phone;

      // ✅ Only send fields that backend accepts (NO notes!)
      const customerData = {
        name: data.name,
        phone,
        email: data.email || undefined,
        address: data.address || undefined,
      };

      if (isEditing) {
        await updateCustomer(customer.id, customerData);
      } else {
        await createCustomer(customerData);
      }

      router.push('/dashboard/customers');
    } catch {
      // Error handled in hooks
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pelanggan</CardTitle>
                <CardDescription>
                  Data pelanggan untuk keperluan pesanan dan komunikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Ahmad Budi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon *</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
                            +62
                          </span>
                          <Input
                            type="tel"
                            placeholder="81234567890"
                            className="rounded-l-none"
                            {...field}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.startsWith('62')) {
                                value = value.slice(2);
                              } else if (value.startsWith('0')) {
                                value = value.slice(1);
                              }
                              field.onChange(value);
                            }}
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Nomor WhatsApp untuk menghubungi pelanggan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="pelanggan@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Alamat lengkap pelanggan..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes - DISABLED */}
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Catatan
                    <span className="ml-2 text-xs font-normal">(Coming Soon)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Fitur catatan akan segera hadir..."
                      rows={3}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground/70">
                    Fitur ini sedang dalam pengembangan
                  </FormDescription>
                </FormItem>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditing ? 'Menyimpan...' : 'Membuat...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Simpan Perubahan' : 'Simpan Pelanggan'}
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

            {/* Stats (for editing) */}
            {isEditing && customer && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Statistik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Pesanan</span>
                    <span className="font-medium">{customer.totalOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Belanja</span>
                    <span className="font-medium">
                      Rp {(customer.totalSpent || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
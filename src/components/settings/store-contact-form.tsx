'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
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
import { useUpdateTenant } from '@/hooks';
import type { Tenant } from '@/types';

// ==========================================
// STORE CONTACT FORM
// ==========================================

const storeContactSchema = z.object({
  phone: z.string().min(10, 'Nomor telepon tidak valid'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
});

type StoreContactData = z.infer<typeof storeContactSchema>;

interface StoreContactFormProps {
  tenant: Tenant;
}

export function StoreContactForm({ tenant }: StoreContactFormProps) {
  const router = useRouter();
  const { updateTenant, isLoading } = useUpdateTenant();

  const form = useForm<StoreContactData>({
    resolver: zodResolver(storeContactSchema),
    defaultValues: {
      phone: tenant.phone || '',
      email: tenant.email || '',
      address: tenant.address || '',
      instagram: tenant.socialMedia?.instagram || '',
      facebook: tenant.socialMedia?.facebook || '',
      tiktok: tenant.socialMedia?.tiktok || '',
    },
  });

  const onSubmit = async (data: StoreContactData) => {
    try {
      await updateTenant({
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
        socialMedia: {
          instagram: data.instagram || undefined,
          facebook: data.facebook || undefined,
          tiktok: data.tiktok || undefined,
        },
      });
      router.refresh();
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Kontak</CardTitle>
          <CardDescription>
            Informasi kontak yang akan ditampilkan kepada pelanggan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp *</FormLabel>
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
                            if (value.startsWith('0')) {
                              value = value.slice(1);
                            }
                            if (value.startsWith('62')) {
                              value = value.slice(2);
                            }
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Nomor ini digunakan untuk menerima pesanan via WhatsApp
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
                        placeholder="toko@email.com"
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
                        placeholder="Alamat lengkap toko..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media Sosial</CardTitle>
          <CardDescription>
            Link media sosial yang akan ditampilkan di toko
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
                          instagram.com/
                        </span>
                        <Input
                          placeholder="username"
                          className="rounded-l-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
                          facebook.com/
                        </span>
                        <Input
                          placeholder="username"
                          className="rounded-l-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
                          tiktok.com/@
                        </span>
                        <Input
                          placeholder="username"
                          className="rounded-l-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
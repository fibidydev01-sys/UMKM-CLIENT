'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Loader2, Save, Upload, X, Store, ImageIcon } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateTenant } from '@/hooks';
import { BUSINESS_CATEGORIES } from '@/config/constants';
import type { Tenant } from '@/types';

// ==========================================
// STORE PROFILE FORM
// ==========================================

const storeProfileSchema = z.object({
  name: z.string().min(2, 'Nama toko minimal 2 karakter'),
  description: z.string().optional(),
  category: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
});

type StoreProfileData = z.infer<typeof storeProfileSchema>;

interface StoreProfileFormProps {
  tenant: Tenant;
}

export function StoreProfileForm({ tenant }: StoreProfileFormProps) {
  const router = useRouter();
  const { updateTenant, isLoading } = useUpdateTenant();

  const [logo, setLogo] = useState(tenant.logo || '');
  const [banner, setBanner] = useState(tenant.banner || '');

  const form = useForm<StoreProfileData>({
    resolver: zodResolver(storeProfileSchema),
    defaultValues: {
      name: tenant.name || '',
      description: tenant.description || '',
      category: tenant.category || '',
      logo: tenant.logo || '',
      banner: tenant.banner || '',
    },
  });

  const onSubmit = async (data: StoreProfileData) => {
    try {
      await updateTenant({
        ...data,
        logo,
        banner,
      });
      router.refresh();
    } catch {
      // Error handled in hook
    }
  };

  // Placeholder image upload handlers
  const handleLogoUpload = () => {
    const url = prompt('Masukkan URL logo:');
    if (url) setLogo(url);
  };

  const handleBannerUpload = () => {
    const url = prompt('Masukkan URL banner:');
    if (url) setBanner(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Toko</CardTitle>
        <CardDescription>
          Informasi dasar tentang toko Anda yang akan ditampilkan kepada pelanggan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo & Banner */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Logo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo Toko</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                    {logo ? (
                      <>
                        <Image
                          src={logo}
                          alt="Logo"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        <button
                          type="button"
                          onClick={() => setLogo('')}
                          className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground z-10"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Store className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLogoUpload}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 200x200 pixels
                </p>
              </div>

              {/* Banner */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Banner Toko</label>
                <div className="relative h-20 w-full rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                  {banner ? (
                    <>
                      <Image
                        src={banner}
                        alt="Banner"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <button
                        type="button"
                        onClick={() => setBanner('')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground z-10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBannerUpload}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Banner
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Rekomendasi: 1200x400 pixels
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Toko *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama toko Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Alamat Toko</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/store/
                </span>
                <Input value={tenant.slug} disabled className="max-w-[200px]" />
              </div>
              <p className="text-xs text-muted-foreground">
                Alamat toko tidak dapat diubah
              </p>
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Usaha</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ceritakan tentang toko Anda..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Deskripsi ini akan ditampilkan di halaman toko Anda
                  </FormDescription>
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
  );
}
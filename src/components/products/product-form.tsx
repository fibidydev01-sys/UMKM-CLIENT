'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCreateProduct, useUpdateProduct } from '@/hooks';
import { productSchema, type ProductFormData } from '@/lib/validations';
import { UNIT_OPTIONS } from '@/config/constants';
import { MultiImageUpload } from '@/components/upload';
import type { Product } from '@/types';

// ==========================================
// PRODUCT FORM COMPONENT
// ==========================================

interface ProductFormProps {
  product?: Product;
  categories?: string[];
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const isLoading = isCreating || isUpdating;

  // ✅ State untuk category combobox
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      sku: product?.sku || '',
      price: product?.price || 0,
      comparePrice: product?.comparePrice || undefined,
      costPrice: product?.costPrice || undefined,
      stock: product?.stock || undefined,
      minStock: product?.minStock || 5,
      trackStock: product?.trackStock ?? true,
      unit: product?.unit || 'pcs',
      images: product?.images || [],
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchTrackStock = form.watch('trackStock');
  const watchCategory = form.watch('category');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const watchImages = form.watch('images');

  // ✅ Filter categories berdasarkan search
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // ✅ Check apakah search adalah kategori baru
  const isNewCategory =
    categorySearch.trim() !== '' &&
    !categories.some((cat) => cat.toLowerCase() === categorySearch.toLowerCase());

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }

      router.push('/dashboard/products');
    } catch {
      // Error handled in hooks
    }
  };

  // ✅ Handle select category (existing or new)
  const handleSelectCategory = (value: string) => {
    form.setValue('category', value);
    setCategorySearch('');
    setCategoryOpen(false);
  };

  // ✅ Handle create new category
  const handleCreateCategory = () => {
    const newCategory = categorySearch.trim();
    if (newCategory) {
      form.setValue('category', newCategory);
      setCategorySearch('');
      setCategoryOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Produk</CardTitle>
                <CardDescription>
                  Informasi dasar tentang produk Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Nasi Goreng Spesial" {...field} />
                      </FormControl>
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
                          placeholder="Deskripsi produk..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category & SKU */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Category Combobox */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Kategori</FormLabel>
                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={categoryOpen}
                                className={cn(
                                  "w-full justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value || "Pilih atau ketik kategori"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder="Cari atau buat kategori..."
                                value={categorySearch}
                                onValueChange={setCategorySearch}
                              />
                              <CommandList>
                                <CommandEmpty className="py-2 px-4 text-sm text-muted-foreground">
                                  {categorySearch ? (
                                    <span>Tidak ada kategori &quot;{categorySearch}&quot;</span>
                                  ) : (
                                    <span>Ketik untuk mencari atau membuat kategori baru</span>
                                  )}
                                </CommandEmpty>

                                {/* Existing Categories */}
                                {filteredCategories.length > 0 && (
                                  <CommandGroup heading="Kategori">
                                    {filteredCategories.map((cat) => (
                                      <CommandItem
                                        key={cat}
                                        value={cat}
                                        onSelect={() => handleSelectCategory(cat)}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            watchCategory === cat ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {cat}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}

                                {/* Create New Category */}
                                {isNewCategory && (
                                  <CommandGroup heading="Buat Baru">
                                    <CommandItem
                                      value={`create-${categorySearch}`}
                                      onSelect={handleCreateCategory}
                                      className="text-primary"
                                    >
                                      <span className="mr-2">+</span>
                                      Buat &quot;{categorySearch}&quot;
                                    </CommandItem>
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Pilih kategori yang ada atau ketik untuk membuat baru
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="SKU-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ✅ CLOUDINARY IMAGE UPLOAD */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Produk</CardTitle>
                <CardDescription>
                  Upload gambar produk (maksimal 5 gambar). Gambar pertama akan jadi thumbnail utama.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiImageUpload
                          value={field.value || []}
                          onChange={field.onChange}
                          folder="fibidy/products"
                          maxImages={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Harga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Jual *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              Rp
                            </span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Compare Price */}
                  <FormField
                    control={form.control}
                    name="comparePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Coret</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              Rp
                            </span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Harga sebelum diskon
                        </FormDescription>

                      </FormItem>
                    )}
                  />

                  {/* Cost Price */}
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Modal</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              Rp
                            </span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Track Stock */}
                <FormField
                  control={form.control}
                  name="trackStock"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Lacak Stok</FormLabel>
                        <FormDescription>
                          Aktifkan untuk melacak jumlah stok produk
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Stock Fields */}
                {watchTrackStock && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Stok</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stok Minimum</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Peringatan jika stok di bawah ini
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Satuan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || 'pcs'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {UNIT_OPTIONS.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Aktif</FormLabel>
                        <FormDescription>
                          Tampilkan di toko
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Unggulan</FormLabel>
                        <FormDescription>
                          Tampilkan di halaman utama
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
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
                      {isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}
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
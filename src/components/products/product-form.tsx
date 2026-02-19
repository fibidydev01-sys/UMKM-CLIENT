'use client';

// ============================================================
// PRODUCT FORM - v2.1
// Supports Produk & Jasa with smart field show/hide logic
// + showPrice toggle (Tampilkan Harga / Harga Atas Permintaan)
// Zero backend changes — uses metadata to store preferences
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  Save,
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Package,
  Wrench,
  MessageCircle,
} from 'lucide-react';
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
import { UNIT_OPTIONS_PRODUK, UNIT_OPTIONS_JASA } from '@/config/constants';
import { MultiImageUpload } from '@/components/upload';
import type { Product } from '@/types';

// ============================================================
// TYPES
// ============================================================

type ProductType = 'produk' | 'jasa';

interface ProductFormProps {
  product?: Product;
  categories?: string[];
}

// ============================================================
// HELPERS
// ============================================================

function getProductType(product?: Product): ProductType {
  const meta = product?.metadata as Record<string, unknown> | null | undefined;
  if (meta?.type === 'jasa') return 'jasa';
  return 'produk';
}

function getShowPrice(product?: Product): boolean {
  const meta = product?.metadata as Record<string, unknown> | null | undefined;
  // Default true — harga ditampilkan
  if (meta?.showPrice === false) return false;
  return true;
}

// ============================================================
// PRODUCT FORM COMPONENT
// ============================================================

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const isLoading = isCreating || isUpdating;

  // ── Type toggle state ──────────────────────────────────────
  const [productType, setProductType] = useState<ProductType>(
    getProductType(product)
  );
  const isJasa = productType === 'jasa';

  // ── Show price toggle ──────────────────────────────────────
  const [showPrice, setShowPrice] = useState<boolean>(getShowPrice(product));

  // ── Category combobox state ────────────────────────────────
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  // ── Form ──────────────────────────────────────────────────
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

  const watchTrackStock = form.watch('trackStock');
  const watchCategory = form.watch('category');

  // ── Field visibility logic ─────────────────────────────────
  const showSKU = !isJasa;
  const showCostPrice = !isJasa && showPrice;   // modal hanya jika produk + harga ditampilkan
  const showTrackStock = !isJasa;
  const showStockFields = !isJasa && watchTrackStock;
  const showUnit = isJasa || watchTrackStock;

  // ── Unit options berdasarkan tipe ──────────────────────────
  const unitOptions = isJasa ? UNIT_OPTIONS_JASA : UNIT_OPTIONS_PRODUK;

  // ── Category filter ────────────────────────────────────────
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const isNewCategory =
    categorySearch.trim() !== '' &&
    !categories.some(
      (cat) => cat.toLowerCase() === categorySearch.toLowerCase()
    );

  // ── Submit ────────────────────────────────────────────────
  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload: ProductFormData = {
        ...data,
        // Jika harga disembunyikan → kirim price = 0 agar schema valid (min: 0)
        price: showPrice ? data.price : 0,
        // Jika harga disembunyikan → bersihkan field harga lainnya
        ...(!showPrice && {
          comparePrice: undefined,
          costPrice: undefined,
        }),
        metadata: {
          ...(typeof data.metadata === 'object' && data.metadata !== null
            ? data.metadata
            : {}),
          type: productType,
          showPrice,          // ← disimpan di metadata
        },
        // Reset field yang tidak relevan untuk jasa
        ...(isJasa && {
          sku: undefined,
          trackStock: false,
          stock: undefined,
          minStock: undefined,
          costPrice: undefined,
        }),
      };

      if (isEditing) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      router.push('/dashboard/products');
    } catch {
      // Error handled in hooks
    }
  };

  // ── Category handlers ──────────────────────────────────────
  const handleSelectCategory = (value: string) => {
    form.setValue('category', value);
    setCategorySearch('');
    setCategoryOpen(false);
  };

  const handleCreateCategory = () => {
    const newCategory = categorySearch.trim();
    if (newCategory) {
      form.setValue('category', newCategory);
      setCategorySearch('');
      setCategoryOpen(false);
    }
  };

  // ── Handle type switch ─────────────────────────────────────
  const handleTypeChange = (type: ProductType) => {
    setProductType(type);
    if (type === 'jasa') {
      form.setValue('trackStock', false);
      form.setValue('stock', undefined);
      form.setValue('minStock', undefined);
      form.setValue('sku', '');
      form.setValue('costPrice', undefined);
      form.setValue('unit', 'jam');
    } else {
      form.setValue('trackStock', true);
      form.setValue('unit', 'pcs');
    }
  };

  // ── Handle showPrice toggle ────────────────────────────────
  const handleShowPriceChange = (checked: boolean) => {
    setShowPrice(checked);
    if (!checked) {
      // Reset semua input harga saat dinonaktifkan
      form.setValue('price', 0);
      form.setValue('comparePrice', undefined);
      form.setValue('costPrice', undefined);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* ── TYPE TOGGLE ─────────────────────────────────── */}
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
          <button
            type="button"
            onClick={() => handleTypeChange('produk')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              productType === 'produk'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Package className="h-4 w-4" />
            Produk
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('jasa')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              productType === 'jasa'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Wrench className="h-4 w-4" />
            Jasa
          </button>
        </div>

        {/* ── HINT LABEL ──────────────────────────────────── */}
        <p className="text-sm text-muted-foreground -mt-4">
          {isJasa
            ? 'Mode Jasa: field stok & SKU disembunyikan otomatis.'
            : 'Mode Produk: semua field tersedia.'}
        </p>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ════════════════════════════════════════════════
              MAIN CONTENT
          ════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── INFORMASI DASAR ─────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isJasa ? 'Informasi Jasa' : 'Informasi Produk'}
                </CardTitle>
                <CardDescription>
                  {isJasa
                    ? 'Informasi dasar tentang layanan yang Anda tawarkan'
                    : 'Informasi dasar tentang produk Anda'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isJasa ? 'Nama Jasa *' : 'Nama Produk *'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            isJasa
                              ? 'Contoh: Desain Logo, Jasa Cuci AC'
                              : 'Contoh: Nasi Goreng Spesial'
                          }
                          {...field}
                        />
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
                          placeholder={
                            isJasa
                              ? 'Jelaskan layanan yang Anda tawarkan, proses pengerjaan, dan apa yang termasuk...'
                              : 'Deskripsi produk...'
                          }
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category + SKU */}
                <div className={cn(
                  'grid gap-4',
                  showSKU ? 'sm:grid-cols-2' : 'sm:grid-cols-1'
                )}>

                  {/* Category */}
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
                                  'w-full justify-between font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value || 'Pilih atau ketik kategori'}
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
                                    <span>
                                      Tidak ada kategori &quot;{categorySearch}&quot;
                                    </span>
                                  ) : (
                                    <span>
                                      Ketik untuk mencari atau membuat kategori baru
                                    </span>
                                  )}
                                </CommandEmpty>

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
                                            'mr-2 h-4 w-4',
                                            watchCategory === cat
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {cat}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}

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

                  {/* SKU — hanya produk */}
                  {showSKU && (
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
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ── GAMBAR ──────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isJasa ? 'Foto Portofolio / Contoh Kerja' : 'Gambar Produk'}
                </CardTitle>
                <CardDescription>
                  {isJasa
                    ? 'Upload foto portofolio atau contoh hasil kerja (maksimal 5 foto). Foto pertama akan jadi thumbnail utama.'
                    : 'Upload gambar produk (maksimal 5 gambar). Gambar pertama akan jadi thumbnail utama.'}
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

            {/* ── HARGA ───────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle>Harga</CardTitle>
                <CardDescription>
                  {isJasa
                    ? 'Harga per sesi, jam, atau paket layanan'
                    : 'Atur harga jual dan harga modal produk'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* ── SHOW PRICE TOGGLE — persis seperti trackStock ── */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium leading-none">
                      Tampilkan Harga
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nonaktifkan jika harga bersifat negosiasi atau hubungi kami
                    </p>
                  </div>
                  <Switch
                    checked={showPrice}
                    onCheckedChange={handleShowPriceChange}
                  />
                </div>

                {/* ── PRICE OFF — info badge ─────────────────── */}
                {!showPrice && (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/40 p-4">
                    <MessageCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Harga Atas Permintaan</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Pembeli akan melihat tombol &quot;Hubungi Kami&quot; tanpa angka harga.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── PRICE INPUTS — hanya jika showPrice aktif ── */}
                {showPrice && (
                  <div className={cn(
                    'grid gap-4',
                    showCostPrice ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                  )}>

                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {isJasa ? 'Harga Layanan *' : 'Harga Jual *'}
                          </FormLabel>
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
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
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
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </div>
                          </FormControl>
                          <FormDescription>Harga sebelum diskon</FormDescription>
                        </FormItem>
                      )}
                    />

                    {/* Cost Price — hanya produk + showPrice aktif */}
                    {showCostPrice && (
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
                                      e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── INVENTORI / SATUAN ───────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isJasa ? 'Satuan Layanan' : 'Inventori'}
                </CardTitle>
                {isJasa && (
                  <CardDescription>
                    Tentukan satuan layanan yang Anda tawarkan
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Track Stock Toggle — hanya produk */}
                {showTrackStock && (
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
                )}

                {/* Unit & Stock fields */}
                {showUnit && (
                  <div className={cn(
                    'grid gap-4',
                    showStockFields ? 'sm:grid-cols-3' : 'sm:grid-cols-1 max-w-[200px]'
                  )}>

                    {/* Stock — hanya produk + trackStock */}
                    {showStockFields && (
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
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Min Stock — hanya produk + trackStock */}
                    {showStockFields && (
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
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
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
                    )}

                    {/* Unit */}
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Satuan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || (isJasa ? 'jam' : 'pcs')}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitOptions.map((unit) => (
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

          {/* ════════════════════════════════════════════════
              SIDEBAR
          ════════════════════════════════════════════════ */}
          <div className="space-y-6">

            {/* ── STATUS ──────────────────────────────────── */}
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
                        <FormDescription>Tampilkan di toko</FormDescription>
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
                        <FormDescription>Tampilkan di halaman utama</FormDescription>
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

            {/* ── SUMMARY CARD ─────────────────────────────── */}
            <Card className="border-dashed">
              <CardContent className="pt-4 space-y-3">

                {/* Tipe */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Tipe Postingan
                  </p>
                  <div className="flex items-center gap-2">
                    {isJasa ? (
                      <>
                        <Wrench className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">Jasa</span>
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">Produk</span>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Mode Harga */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Mode Harga
                  </p>
                  <div className="flex items-center gap-2">
                    {showPrice ? (
                      <span className="text-sm font-medium text-foreground">
                        Harga ditampilkan
                      </span>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-600">
                          Hubungi Kami
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {isJasa
                    ? 'SKU & stok disembunyikan. Unit layanan tersedia.'
                    : 'Semua field tersedia termasuk stok & SKU.'}
                </p>
              </CardContent>
            </Card>

            {/* ── ACTIONS ─────────────────────────────────── */}
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
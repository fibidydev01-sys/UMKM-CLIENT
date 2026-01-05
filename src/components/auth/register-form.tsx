'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { useRegister, useCheckSlug, useDebounce } from '@/hooks';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { getCategoryOptions } from '@/config/categories';
import { cn } from '@/lib/cn';

// ==========================================
// REGISTER FORM COMPONENT
// ==========================================

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Store info, 2: Account info
  const { register, isLoading, error } = useRegister();
  const { checkSlug, isChecking, isAvailable, reset: resetSlug } = useCheckSlug();

  const categories = getCategoryOptions();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      slug: '',
      name: '',
      category: '',
      email: '',
      password: '',
      whatsapp: '',
      description: '',
    },
    mode: 'onChange',
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const slugValue = form.watch('slug');
  const debouncedSlug = useDebounce(slugValue, 500);

  // Check slug availability
  useEffect(() => {
    if (debouncedSlug && debouncedSlug.length >= 3) {
      checkSlug(debouncedSlug);
    } else {
      resetSlug();
    }
  }, [debouncedSlug, checkSlug, resetSlug]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 30);

    if (!form.getValues('slug') || form.getValues('slug') === '') {
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
    } catch {
      // Error handled in hook
    }
  };

  const goToStep2 = async () => {
    const isValid = await form.trigger(['slug', 'name', 'category', 'description']);
    if (isValid && isAvailable !== false) {
      setStep(2);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
              step === 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            1
          </div>
          <div className="w-12 h-0.5 bg-muted" />
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
              step === 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            2
          </div>
        </div>

        {/* STEP 1: Store Information */}
        {step === 1 && (
          <>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Informasi Toko
            </p>

            {/* Store Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Toko</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Warung Bu Sari"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Toko</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="warung-bu-sari"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, '');
                          field.onChange(value);
                        }}
                      />
                      {/* Availability Indicator */}
                      {field.value.length >= 3 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isChecking ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : isAvailable === true ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : isAvailable === false ? (
                            <X className="h-4 w-4 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    fibidy.com/store/{field.value || 'nama-toko'}
                  </FormDescription>
                  {isAvailable === false && (
                    <p className="text-sm text-destructive">
                      Alamat toko sudah digunakan
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      {categories.map((cat) => (
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

            {/* Description (Optional) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ceritakan tentang toko Anda..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Next Button */}
            <Button
              type="button"
              className="w-full"
              onClick={goToStep2}
              disabled={isAvailable === false}
            >
              Lanjutkan
            </Button>
          </>
        )}

        {/* STEP 2: Account Information */}
        {step === 2 && (
          <>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Informasi Akun
            </p>

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
                      placeholder="nama@email.com"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* WhatsApp */}
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WhatsApp</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
                        +62
                      </span>
                      <Input
                        type="tel"
                        placeholder="81234567890"
                        className="rounded-l-none"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          // Remove leading 0 or 62
                          if (value.startsWith('0')) {
                            value = value.slice(1);
                          }
                          if (value.startsWith('62')) {
                            value = value.slice(2);
                          }
                          // Add 62 prefix
                          field.onChange('62' + value);
                        }}
                        value={field.value.replace(/^62/, '')}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Nomor ini akan digunakan untuk menerima pesanan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Kembali
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>
            </div>
          </>
        )}

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya toko?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Masuk
          </Link>
        </p>
      </form>
    </Form>
  );
}
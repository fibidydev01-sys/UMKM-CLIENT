import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password tidak boleh kosong'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(30, 'Slug maksimal 30 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan strip (-)'),
  name: z
    .string()
    .min(3, 'Nama toko minimal 3 karakter')
    .max(100, 'Nama toko maksimal 100 karakter'),
  category: z
    .string()
    .min(1, 'Pilih kategori usaha'),
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter'),
  whatsapp: z
    .string()
    .min(1, 'Nomor WhatsApp tidak boleh kosong')
    .regex(/^62[0-9]{9,13}$/, 'Format WhatsApp harus diawali 62 (contoh: 6281234567890)'),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Password lama tidak boleh kosong'),
  newPassword: z
    .string()
    .min(6, 'Password baru minimal 6 karakter'),
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password tidak boleh kosong'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama produk tidak boleh kosong')
    .max(200, 'Nama produk maksimal 200 karakter'),
  description: z
    .string()
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .optional(),
  category: z
    .string()
    .max(100, 'Kategori maksimal 100 karakter')
    .optional(),
  price: z
    .number()
    .min(0, 'Harga tidak boleh negatif'),
  comparePrice: z
    .number()
    .min(0, 'Harga coret tidak boleh negatif')
    .optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const storeSettingsSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama toko minimal 3 karakter')
    .max(100, 'Nama toko maksimal 100 karakter'),
  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
  whatsapp: z
    .string()
    .min(1, 'Nomor WhatsApp tidak boleh kosong')
    .regex(/^62[0-9]{9,13}$/, 'Format WhatsApp harus diawali 62'),
  phone: z.string().optional(),
  address: z
    .string()
    .max(300, 'Alamat maksimal 300 karakter')
    .optional(),
  logo: z.string().optional(),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
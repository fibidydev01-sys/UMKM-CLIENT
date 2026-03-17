import { z } from 'zod';

// ==========================================
// VALIDATION SCHEMAS (ZOD)
// ==========================================

/**
 * Login form schema
 */
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

/**
 * Register form schema
 */
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

/**
 * Change password schema
 */
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

/**
 * Product form schema
 */
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
  sku: z
    .string()
    .max(50, 'SKU maksimal 50 karakter')
    .optional(),
  price: z
    .number()
    .min(0, 'Harga tidak boleh negatif'),
  comparePrice: z
    .number()
    .min(0, 'Harga coret tidak boleh negatif')
    .optional(),
  costPrice: z
    .number()
    .min(0, 'Harga modal tidak boleh negatif')
    .optional(),
  stock: z
    .number()
    .min(0, 'Stok tidak boleh negatif')
    .optional(),
  minStock: z
    .number()
    .min(0, 'Stok minimum tidak boleh negatif')
    .optional(),
  trackStock: z.boolean().optional(),
  unit: z
    .string()
    .max(20, 'Satuan maksimal 20 karakter')
    .optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Customer form schema
 * ✅ Phone validation untuk format TANPA prefix (81234567890)
 * ✅ Notes field REMOVED (not supported by backend yet)
 */
export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama pelanggan tidak boleh kosong')
    .max(100, 'Nama maksimal 100 karakter'),
  phone: z
    .string()
    .min(9, 'Nomor telepon minimal 9 digit')
    .max(13, 'Nomor telepon maksimal 13 digit')
    .regex(/^[0-9]{9,13}$/, 'Format nomor telepon tidak valid (contoh: 81234567890)'),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(300, 'Alamat maksimal 300 karakter')
    .optional(),
  // notes - REMOVED (backend tidak support)
});

export type CustomerFormData = z.infer<typeof customerSchema>;

/**
 * Order item schema
 */
export const orderItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1, 'Nama item tidak boleh kosong'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  qty: z.number().min(1, 'Jumlah minimal 1'),
  notes: z.string().optional(),
});

/**
 * Order form schema
 */
export const orderSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Minimal 1 item dalam order'),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

/**
 * Store settings schema
 */
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
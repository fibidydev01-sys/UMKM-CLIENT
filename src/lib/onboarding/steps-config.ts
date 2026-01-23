import { OnboardingStep } from './types';

// ============================================
// ONBOARDING STEPS CONFIGURATION
// Aligned with TENANT-PROFILE-PROGRESS.md
// ============================================

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // ===== CRITICAL ITEMS (Required to publish) =====
  {
    id: 'logo',
    title: 'Upload logo toko',
    description: 'Logo adalah identitas brand utama. Akan tampil di header dan semua halaman toko Anda.',
    field: 'logo',
    points: 4,
    isCritical: true,
    actionLabel: 'Upload Logo',
    actionHref: '/dashboard/settings',
    category: 'identity',
    checkType: 'string',
  },
  {
    id: 'hero-background',
    title: 'Tambah gambar hero background',
    description: 'First impression di landing page. Membuat toko terlihat profesional dan menarik.',
    field: 'heroBackgroundImage',
    points: 7,
    isCritical: true,
    actionLabel: 'Upload Hero Image',
    actionHref: '/dashboard/settings',
    category: 'hero',
    checkType: 'string',
  },

  // ===== HIGH IMPACT (Recommended) =====
  {
    id: 'first-product',
    title: 'Tambah produk pertama',
    description: 'Upload produk untuk mulai berjualan online. Pelanggan bisa langsung melihat katalog Anda.',
    field: 'products',
    points: 10,
    isCritical: false,
    actionLabel: 'Tambah Produk',
    actionHref: '/dashboard/products/new',
    category: 'products',
    checkType: 'array_min',
    minCount: 1,
  },
  {
    id: 'whatsapp',
    title: 'Hubungkan WhatsApp',
    description: 'Aktifkan komunikasi langsung dengan pelanggan untuk orderan dan pertanyaan.',
    field: 'whatsapp',
    points: 5,
    isCritical: false,
    actionLabel: 'Tambah WhatsApp',
    actionHref: '/dashboard/settings',
    category: 'contact',
    checkType: 'string',
  },
  {
    id: 'testimonial',
    title: 'Tambah testimoni pelanggan',
    description: 'Social proof membangun kepercayaan. Tambah minimal 1 testimoni dari pelanggan puas Anda.',
    field: 'testimonials',
    points: 4,
    isCritical: false,
    actionLabel: 'Tambah Testimoni',
    actionHref: '/dashboard/settings',
    category: 'testimonials',
    checkType: 'array_min',
    minCount: 1,
  },
  {
    id: 'branding',
    title: 'Kustomisasi warna tema',
    description: 'Pilih warna tema yang sesuai dengan brand Anda untuk tampilan toko yang unik.',
    field: 'theme.primaryColor',
    points: 4,
    isCritical: false,
    actionLabel: 'Atur Warna',
    actionHref: '/dashboard/settings',
    category: 'identity',
    checkType: 'string',
  },
];

// Get step by ID
export function getStepById(id: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find(step => step.id === id);
}

// Get critical steps only
export function getCriticalSteps(): OnboardingStep[] {
  return ONBOARDING_STEPS.filter(step => step.isCritical);
}

// Get non-critical steps
export function getOptionalSteps(): OnboardingStep[] {
  return ONBOARDING_STEPS.filter(step => !step.isCritical);
}

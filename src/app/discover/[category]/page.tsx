// ══════════════════════════════════════════════════════════════
// DISCOVER BY CATEGORY PAGE
// Route: /discover/[category]
// Example: /discover/bengkel-motor
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageClient } from './client';
import { CATEGORY_CONFIG } from '@/config/categories';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

// Convert slug to category key: "bengkel-motor" -> "BENGKEL_MOTOR"
function slugToCategoryKey(slug: string): string {
  return slug.toUpperCase().replace(/-/g, '_');
}

// Convert category key to slug: "BENGKEL_MOTOR" -> "bengkel-motor"
function categoryKeyToSlug(key: string): string {
  return key.toLowerCase().replace(/_/g, '-');
}

// Get category config from slug
function getCategoryFromSlug(slug: string) {
  const key = slugToCategoryKey(slug);
  return CATEGORY_CONFIG[key] || null;
}

// ══════════════════════════════════════════════════════════════
// GENERATE STATIC PARAMS (Optional - for SSG)
// ══════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  return Object.keys(CATEGORY_CONFIG).map((key) => ({
    category: categoryKeyToSlug(key),
  }));
}

// ══════════════════════════════════════════════════════════════
// GENERATE METADATA
// ══════════════════════════════════════════════════════════════

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryFromSlug(categorySlug);

  if (!category) {
    return {
      title: 'Kategori Tidak Ditemukan | Fibidy',
    };
  }

  return {
    title: `${category.label} - Discover UMKM | Fibidy`,
    description: `Temukan UMKM ${category.label} di Indonesia. ${category.description}. Lihat daftar ${category.labels.product.toLowerCase()}, harga, dan pesan langsung via WhatsApp.`,
    keywords: [
      category.label.toLowerCase(),
      'umkm',
      category.labels.product.toLowerCase(),
      'toko online',
      'fibidy',
      'indonesia',
    ],
    openGraph: {
      title: `${category.label} - Discover UMKM | Fibidy`,
      description: `Temukan UMKM ${category.label} di Indonesia. ${category.description}.`,
      type: 'website',
      locale: 'id_ID',
      siteName: 'Fibidy',
    },
  };
}

// ══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categoryKey = slugToCategoryKey(categorySlug);
  const category = CATEGORY_CONFIG[categoryKey];

  // 404 if category not found
  if (!category) {
    notFound();
  }

  return <CategoryPageClient categoryKey={categoryKey} categorySlug={categorySlug} />;
}
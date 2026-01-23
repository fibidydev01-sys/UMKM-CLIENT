// ══════════════════════════════════════════════════════════════
// DISCOVER BY CATEGORY PAGE
// Route: /discover/[category]
// Example: /discover/bengkel-motor OR /discover/distro-streetwear
// Supports BOTH predefined AND dynamic categories
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPageClient } from './client';
import {
  getCategoryConfig,
  fetchAllCategoriesFromDB,
  slugToCategoryKey,
  categoryKeyToSlug,
} from '@/lib/categories/unified-service';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// ══════════════════════════════════════════════════════════════
// GENERATE STATIC PARAMS (For both predefined & top dynamic categories)
// ══════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  try {
    // Get all categories from DB (includes predefined + dynamic)
    const allCategories = await fetchAllCategoriesFromDB();

    return allCategories.map((category) => ({
      category: categoryKeyToSlug(category),
    }));
  } catch {
    // Fallback: return empty array if API fails
    return [];
  }
}

// ══════════════════════════════════════════════════════════════
// GENERATE METADATA
// ══════════════════════════════════════════════════════════════

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categoryKey = slugToCategoryKey(categorySlug);

  // Get all categories from DB to check if it exists
  const allCategories = await fetchAllCategoriesFromDB();
  const category = getCategoryConfig(categoryKey, allCategories);

  if (!category) {
    return {
      title: 'Kategori Tidak Ditemukan | Fibidy',
      description: 'Kategori UMKM yang Anda cari tidak ditemukan.',
    };
  }

  // Generate metadata based on category type
  const label = category.isPredefined ? category.label : category.key;
  const description = category.isPredefined
    ? `Temukan UMKM ${category.label} di Indonesia. ${category.description}. Lihat daftar ${category.labels.product.toLowerCase()}, harga, dan pesan langsung via WhatsApp.`
    : `Temukan UMKM ${label} di Indonesia. Lihat daftar produk, harga, dan pesan langsung via WhatsApp.`;

  return {
    title: `${label} - Discover UMKM | Fibidy`,
    description,
    keywords: [
      label.toLowerCase(),
      'umkm',
      'toko online',
      'fibidy',
      'indonesia',
      ...(category.isPredefined ? [category.labels.product.toLowerCase()] : []),
    ],
    openGraph: {
      title: `${label} - Discover UMKM | Fibidy`,
      description,
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

  // Get all categories from DB
  const allCategories = await fetchAllCategoriesFromDB();

  // Check if category exists (predefined OR dynamic)
  const category = getCategoryConfig(categoryKey, allCategories);

  // 404 only if category truly doesn't exist in DB
  if (!category && !allCategories.includes(categoryKey)) {
    notFound();
  }

  return (
    <CategoryPageClient
      categoryKey={categoryKey}
      categorySlug={categorySlug}
      isDynamic={category ? !category.isPredefined : true}
    />
  );
}

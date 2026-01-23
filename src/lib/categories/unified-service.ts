import { CATEGORY_CONFIG } from '@/config/categories';
import type {
  Category,
  PredefinedCategory,
  DynamicCategory,
  CategoryStatsResponse,
} from '@/types/category';

// ==========================================
// CONFIG
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ==========================================
// FETCH CATEGORIES FROM API
// ==========================================

/**
 * Fetch all unique categories from backend
 */
export async function fetchAllCategoriesFromDB(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch category stats (with counts)
 */
export async function fetchCategoryStats(): Promise<CategoryStatsResponse[]> {
  try {
    const res = await fetch(`${API_URL}/categories/stats`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Search categories (autocomplete)
 */
export async function searchCategories(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `${API_URL}/categories/search?q=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ==========================================
// UNIFIED CATEGORY LOGIC
// ==========================================

/**
 * Get predefined categories (15 with icons)
 */
export function getPredefinedCategories(): PredefinedCategory[] {
  return Object.values(CATEGORY_CONFIG).map((cat) => ({
    ...cat,
    isPredefined: true as const,
  }));
}

/**
 * Check if category is predefined
 */
export function isPredefinedCategory(categoryKey: string): boolean {
  return categoryKey in CATEGORY_CONFIG;
}

/**
 * Get category config (predefined or dynamic)
 */
export function getCategoryConfig(
  categoryKey: string,
  dynamicCategories: string[] = []
): Category | null {
  // Check predefined first
  if (isPredefinedCategory(categoryKey)) {
    return {
      ...CATEGORY_CONFIG[categoryKey],
      isPredefined: true as const,
    };
  }

  // Check dynamic categories
  if (dynamicCategories.includes(categoryKey)) {
    return {
      key: categoryKey,
      label: categoryKey,
      isPredefined: false as const,
    };
  }

  return null;
}

/**
 * Get all categories (predefined + dynamic)
 */
export async function getAllCategories(): Promise<Category[]> {
  const predefined = getPredefinedCategories();
  const dbCategories = await fetchAllCategoriesFromDB();

  // Filter out predefined from DB results
  const dynamicKeys = dbCategories.filter((cat) => !isPredefinedCategory(cat));

  const dynamic: DynamicCategory[] = dynamicKeys.map((key) => ({
    key,
    label: key,
    isPredefined: false as const,
  }));

  return [...predefined, ...dynamic];
}

/**
 * Get all categories with stats
 */
export async function getAllCategoriesWithStats(): Promise<Category[]> {
  const predefined = getPredefinedCategories();
  const stats = await fetchCategoryStats();

  // Create map for quick lookup
  const statsMap = new Map(stats.map((s) => [s.category, s.count]));

  // Add counts to predefined
  const predefinedWithCounts = predefined.map((cat) => ({
    ...cat,
    count: statsMap.get(cat.key) || 0,
  }));

  // Get dynamic categories (not in predefined)
  const dynamicStats = stats.filter((s) => !isPredefinedCategory(s.category));
  const dynamic: DynamicCategory[] = dynamicStats.map((s) => ({
    key: s.category,
    label: s.category,
    count: s.count,
    isPredefined: false as const,
  }));

  return [...predefinedWithCounts, ...dynamic];
}

/**
 * Convert slug to category key
 * "bengkel-motor" -> "BENGKEL_MOTOR"
 */
export function slugToCategoryKey(slug: string): string {
  return slug.toUpperCase().replace(/-/g, '_');
}

/**
 * Convert category key to slug
 * "BENGKEL_MOTOR" -> "bengkel-motor"
 */
export function categoryKeyToSlug(key: string): string {
  return key.toLowerCase().replace(/_/g, '-');
}

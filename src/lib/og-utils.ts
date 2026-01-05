// ==========================================
// OPEN GRAPH IMAGE UTILITIES
// ==========================================

// Standard OG Image dimensions
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Color palette (Pink theme - Fibidy branding)
export const OG_COLORS = {
  // Primary colors
  primary: '#ec4899',
  primaryDark: '#db2777',
  primaryLight: '#f472b6',

  // Background colors
  background: '#ffffff',
  backgroundDark: '#0f172a',
  backgroundGray: '#f8fafc',

  // Text colors
  text: '#1e293b',
  textLight: '#64748b',
  textWhite: '#ffffff',

  // Accent colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
} as const;

// Font sizes for OG images
export const OG_FONTS = {
  title: '56px',
  titleLarge: '72px',
  subtitle: '32px',
  body: '24px',
  small: '20px',
  tiny: '16px',
} as const;

/**
 * Format price for display in OG images
 */
export function formatOgPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Truncate text for OG images
 */
export function truncateOgText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Get initials from name (for avatar fallback)
 */
export function getOgInitials(name: string): string {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}
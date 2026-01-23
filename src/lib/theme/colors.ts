/**
 * ============================================================================
 * THEME COLOR UTILITIES
 * ============================================================================
 * Centralized theme color management for consistent theming across the app
 * Used in both store layout and settings preview
 * ============================================================================
 */

/**
 * Theme color in OKLCH format for light and dark modes
 */
export interface ThemeColor {
  light: string;
  dark: string;
}

/**
 * Predefined OKLCH values for each theme color
 * These are optimized for accessibility and visual consistency
 */
export const THEME_OKLCH_MAP: Record<string, ThemeColor> = {
  // Sky/Default (#0ea5e9)
  '#0ea5e9': {
    light: 'oklch(0.685 0.169 237.323)',
    dark: 'oklch(0.746 0.16 232.661)',
  },
  // Emerald (#10b981)
  '#10b981': {
    light: 'oklch(0.696 0.17 162.48)',
    dark: 'oklch(0.765 0.177 163.223)',
  },
  // Rose (#f43f5e)
  '#f43f5e': {
    light: 'oklch(0.645 0.246 16.439)',
    dark: 'oklch(0.712 0.194 13.428)',
  },
  // Amber (#f59e0b)
  '#f59e0b': {
    light: 'oklch(0.769 0.188 70.08)',
    dark: 'oklch(0.822 0.165 68.293)',
  },
  // Violet (#8b5cf6)
  '#8b5cf6': {
    light: 'oklch(0.606 0.25 292.717)',
    dark: 'oklch(0.702 0.183 293.541)',
  },
  // Orange (#f97316)
  '#f97316': {
    light: 'oklch(0.705 0.213 47.604)',
    dark: 'oklch(0.762 0.182 50.939)',
  },
};

/**
 * Default theme (pink) - fallback when no theme is specified
 * Matches the default --primary in globals.css
 */
export const DEFAULT_THEME: ThemeColor = {
  light: 'oklch(0.656 0.241 354.308)',
  dark: 'oklch(0.718 0.202 349.761)',
};

/**
 * Get OKLCH theme colors for a given hex color
 * Returns default theme if hex is not in the map
 *
 * @param hexColor - Hex color code (e.g., '#0ea5e9')
 * @returns Theme color in OKLCH format for light and dark modes
 */
export function getThemeColors(hexColor?: string): ThemeColor {
  if (!hexColor) return DEFAULT_THEME;

  const normalizedHex = hexColor.toLowerCase();
  return THEME_OKLCH_MAP[normalizedHex] || DEFAULT_THEME;
}

/**
 * Generate CSS variables for theme injection
 *
 * @param hexColor - Hex color code (e.g., '#0ea5e9')
 * @returns CSS string with theme variables
 */
export function generateThemeCSS(hexColor?: string): string {
  const themeColors = getThemeColors(hexColor);

  return `
    /* Light Mode */
    .tenant-theme {
      --primary: ${themeColors.light};
      --ring: ${themeColors.light};
      --sidebar-primary: ${themeColors.light};
      --sidebar-ring: ${themeColors.light};
      --chart-1: ${themeColors.light};
    }

    /* Dark Mode */
    .dark .tenant-theme,
    .tenant-theme.dark {
      --primary: ${themeColors.dark};
      --ring: ${themeColors.dark};
      --sidebar-primary: ${themeColors.dark};
      --sidebar-ring: ${themeColors.dark};
      --chart-1: ${themeColors.dark};
    }
  `;
}

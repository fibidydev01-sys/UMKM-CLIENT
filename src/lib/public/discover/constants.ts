// ══════════════════════════════════════════════════════════════
// DISCOVER MODULE CONSTANTS
// Centralized constants for discover feature
// ══════════════════════════════════════════════════════════════

/**
 * API base URL
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Maximum tenants to fetch (default for main discover page)
 */
export const MAX_TENANTS = 24;

/**
 * Maximum tenants for category page
 */
export const MAX_TENANTS_CATEGORY = 50;

/**
 * Cache duration in milliseconds (5 minutes)
 */
export const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Default product count when not available
 */
export const DEFAULT_PRODUCT_COUNT = 0;

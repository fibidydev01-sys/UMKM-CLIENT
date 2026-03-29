/**
 * ============================================================================
 * FILE: src/lib/public/og-utils.ts
 * PURPOSE: Utilities for Open Graph image generation
 * ============================================================================
 */

/**
 * Get API URL - safe for both Edge and Node.js runtime
 * Supports: local dev, Vercel deployment, custom API URL
 */
export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  return 'http://localhost:8000/api';
}
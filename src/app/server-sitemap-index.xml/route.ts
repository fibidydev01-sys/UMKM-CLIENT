import { getServerSideSitemapIndex } from 'next-sitemap';

// ==========================================
// DYNAMIC SITEMAP INDEX
// Generates index pointing to tenant/product sitemaps
// Route: /server-sitemap-index.xml
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fibidy.com';
const URLS_PER_SITEMAP = 45000;

export async function GET() {
  try {
    // Fetch stats to calculate how many sitemap pages needed
    const response = await fetch(`${API_URL}/sitemap/stats`, {
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) {
      // Fallback: return single sitemap
      return getServerSideSitemapIndex([
        `${SITE_URL}/server-sitemap/0.xml`,
      ]);
    }

    const data = await response.json();
    const totalUrls = data.stats?.estimatedUrls || 0;

    // Calculate number of sitemap pages needed
    const sitemapCount = Math.max(1, Math.ceil(totalUrls / URLS_PER_SITEMAP));

    // Generate sitemap URLs
    const sitemaps = Array.from({ length: sitemapCount }, (_, index) =>
      `${SITE_URL}/server-sitemap/${index}.xml`
    );

    return getServerSideSitemapIndex(sitemaps);
  } catch (error) {
    console.error('Error generating sitemap index:', error);

    // Fallback
    return getServerSideSitemapIndex([
      `${SITE_URL}/server-sitemap/0.xml`,
    ]);
  }
}
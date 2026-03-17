// ==========================================
// CLOUDINARY UTILITIES - V3 FIXED
// Handles both Cloudinary URLs AND external URLs (Unsplash, etc)
// ==========================================

/**
 * Cloudinary config constants
 */
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',

  // Folder structure
  folders: {
    products: 'fibidy/products',
    logos: 'fibidy/logos',
    testimonials: 'fibidy/testimonials',
  },
} as const;

/**
 * Image transformation presets
 */
export const IMAGE_PRESETS = {
  product: {
    thumbnail: { width: 150, height: 150 },
    card: { width: 300, height: 300 },
    detail: { width: 600, height: 600 },
    zoom: { width: 1200, height: 1200 },
  },
  landing: {
    hero: { width: 1920, height: 1080 },
    heroMobile: { width: 768, height: 1024 },
    section: { width: 800, height: 600 },
  },
  avatar: {
    small: { width: 80, height: 80 },
    large: { width: 150, height: 150 },
  },
  branding: {
    logo: { width: 200, height: 200 },
  },
} as const;

// ==========================================
// URL DETECTION HELPERS
// ==========================================

/**
 * Check if URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.includes('res.cloudinary.com');
}

/**
 * Check if string is an external URL (not Cloudinary)
 * e.g., Unsplash, placeholder images, etc.
 */
export function isExternalUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  // Check if it's a full URL but NOT Cloudinary
  const isFullUrl = url.startsWith('http://') || url.startsWith('https://');
  return isFullUrl && !isCloudinaryUrl(url);
}

/**
 * Check if string is a Cloudinary public_id (not a full URL)
 */
export function isCloudinaryPublicId(str: string | undefined | null): boolean {
  if (!str) return false;
  // Not a full URL = probably a public_id
  const isFullUrl = str.startsWith('http://') || str.startsWith('https://');
  return !isFullUrl;
}

// ==========================================
// IMAGE SOURCE HELPERS
// ==========================================

/**
 * Extract public_id from Cloudinary URL
 */
export function extractPublicId(url: string): string {
  if (!url) return '';
  if (!isCloudinaryUrl(url)) return url;

  // Extract from: .../upload/v123/folder/image.jpg → folder/image
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/);
  return match ? match[1] : url;
}

/**
 * Determine image type and source for components
 * Returns: { type: 'cloudinary' | 'external' | 'none', src: string }
 */
export function getImageSource(urlOrPublicId: string | undefined | null): {
  type: 'cloudinary' | 'external' | 'none';
  src: string;
} {
  if (!urlOrPublicId) {
    return { type: 'none', src: '' };
  }

  // External URL (Unsplash, placeholder, etc.) - use next/image
  if (isExternalUrl(urlOrPublicId)) {
    return { type: 'external', src: urlOrPublicId };
  }

  // Cloudinary URL - extract public_id for CldImage
  if (isCloudinaryUrl(urlOrPublicId)) {
    return { type: 'cloudinary', src: extractPublicId(urlOrPublicId) };
  }

  // Assume it's a Cloudinary public_id
  return { type: 'cloudinary', src: urlOrPublicId };
}

/**
 * Get CldImage source (only for Cloudinary images)
 * Returns empty string if not a Cloudinary image
 * 
 * @deprecated Use getImageSource() instead for proper type handling
 */
export function getCldImageSrc(urlOrPublicId: string | undefined | null): string {
  const { type, src } = getImageSource(urlOrPublicId);

  // Only return src if it's a Cloudinary image
  if (type === 'cloudinary') {
    return src;
  }

  return '';
}

/**
 * Check if image should use CldImage (Cloudinary) or next/image (external)
 */
export function shouldUseCldImage(urlOrPublicId: string | undefined | null): boolean {
  const { type } = getImageSource(urlOrPublicId);
  return type === 'cloudinary';
}

// ==========================================
// URL BUILDERS (for non-CldImage usage)
// ==========================================

/**
 * Build Cloudinary URL manually
 * Only use when CldImage component is not possible (e.g., CSS backgrounds)
 */
export function buildCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'limit';
    gravity?: 'auto' | 'face' | 'faces' | 'center';
  } = {}
): string {
  const cloudName = CLOUDINARY_CONFIG.cloudName;
  if (!cloudName) return publicId;

  const transforms: string[] = ['f_auto', 'q_auto'];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}

/**
 * Get optimized URL for any image source
 * - Cloudinary: builds optimized URL
 * - External: returns as-is
 */
export function getOptimizedImageUrl(
  urlOrPublicId: string | undefined | null,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'limit';
    gravity?: 'auto' | 'face' | 'faces' | 'center';
  } = {}
): string {
  if (!urlOrPublicId) return '';

  const { type, src } = getImageSource(urlOrPublicId);

  if (type === 'cloudinary') {
    return buildCloudinaryUrl(src, options);
  }

  // External URLs: return as-is (next/image will handle optimization)
  return urlOrPublicId;
}

// ==========================================
// LEGACY HELPERS (backward compatibility)
// Used by cart-sheet.tsx and other components
// ==========================================

export function getCloudinaryUrl(
  publicIdOrUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
    gravity?: 'auto' | 'face' | 'center';
    quality?: 'auto' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  const cloudName = CLOUDINARY_CONFIG.cloudName;

  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return publicIdOrUrl;
  }

  // If it's an external URL, return as-is
  if (isExternalUrl(publicIdOrUrl)) {
    return publicIdOrUrl;
  }

  let publicId = publicIdOrUrl;
  if (isCloudinaryUrl(publicIdOrUrl)) {
    publicId = extractPublicId(publicIdOrUrl);
  }

  const transforms: string[] = [];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);

  const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}

export function getThumbnailUrl(publicIdOrUrl: string): string {
  // Handle external URLs
  if (isExternalUrl(publicIdOrUrl)) {
    return publicIdOrUrl;
  }

  return getCloudinaryUrl(publicIdOrUrl, {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto',
  });
}

export function getProductImageUrl(publicIdOrUrl: string): string {
  if (isExternalUrl(publicIdOrUrl)) {
    return publicIdOrUrl;
  }

  return getCloudinaryUrl(publicIdOrUrl, {
    width: 800,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}

export function getBannerUrl(publicIdOrUrl: string): string {
  if (isExternalUrl(publicIdOrUrl)) {
    return publicIdOrUrl;
  }

  return getCloudinaryUrl(publicIdOrUrl, {
    width: 1200,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}

export function getLogoUrl(publicIdOrUrl: string): string {
  if (isExternalUrl(publicIdOrUrl)) {
    return publicIdOrUrl;
  }

  return getCloudinaryUrl(publicIdOrUrl, {
    width: 200,
    height: 200,
    crop: 'fit',
    quality: 'auto',
    format: 'auto',
  });
}
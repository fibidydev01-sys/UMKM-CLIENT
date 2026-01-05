// ==========================================
// CLOUDINARY UTILITIES
// ==========================================

/**
 * Get optimized Cloudinary URL with transformations
 */
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
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return publicIdOrUrl;
  }

  // If it's already a full URL, extract the public_id
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('cloudinary.com')) {
    const match = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (match) {
      publicId = match[1];
      // Remove file extension if present
      publicId = publicId.replace(/\.[^/.]+$/, '');
    }
  }

  // Build transformation string
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

/**
 * Get thumbnail URL (400x400, cropped)
 */
export function getThumbnailUrl(publicIdOrUrl: string): string {
  return getCloudinaryUrl(publicIdOrUrl, {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Get product image URL (800px max width)
 */
export function getProductImageUrl(publicIdOrUrl: string): string {
  return getCloudinaryUrl(publicIdOrUrl, {
    width: 800,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Get banner URL (1200px width)
 */
export function getBannerUrl(publicIdOrUrl: string): string {
  return getCloudinaryUrl(publicIdOrUrl, {
    width: 1200,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Get logo URL (200x200)
 */
export function getLogoUrl(publicIdOrUrl: string): string {
  return getCloudinaryUrl(publicIdOrUrl, {
    width: 200,
    height: 200,
    crop: 'fit',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Check if URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

/**
 * Extract public_id from Cloudinary URL
 */
export function extractPublicId(url: string): string {
  if (!isCloudinaryUrl(url)) return url;

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/);
  return match ? match[1] : url;
}
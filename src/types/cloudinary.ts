// ==========================================
// CLOUDINARY TYPE DEFINITIONS
// ==========================================

export interface CloudinaryUploadResult {
  event: 'success' | 'close' | 'display-changed' | string;
  info: CloudinaryUploadInfo;
}

export interface CloudinaryUploadInfo {
  id: string;
  batchId: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  original_extension: string;
  api_key: string;
  // Thumbnail info
  thumbnail_url?: string;
  eager?: Array<{
    transformation: string;
    width: number;
    height: number;
    bytes: number;
    format: string;
    url: string;
    secure_url: string;
  }>;
}

export interface CloudinaryUploadOptions {
  uploadPreset?: string;
  folder?: string;
  maxFiles?: number;
  maxFileSize?: number;
  clientAllowedFormats?: string[];
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  cropping?: boolean;
  croppingAspectRatio?: number;
  showSkipCropButton?: boolean;
  sources?: Array<'local' | 'url' | 'camera' | 'dropbox' | 'google_drive'>;
  multiple?: boolean;
  defaultSource?: 'local' | 'url' | 'camera';
  styles?: {
    palette?: {
      window?: string;
      windowBorder?: string;
      tabIcon?: string;
      menuIcons?: string;
      textDark?: string;
      textLight?: string;
      link?: string;
      action?: string;
      inactiveTabIcon?: string;
      error?: string;
      inProgress?: string;
      complete?: string;
      sourceBg?: string;
    };
  };
}

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'free';
  placeholder?: string;
  disabled?: boolean;
}

export interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  disabled?: boolean;
}
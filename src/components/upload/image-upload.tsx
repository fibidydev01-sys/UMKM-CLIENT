"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { ImagePlus, Trash2, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import Script from "next/script";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Cloudinary types
declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: CloudinaryWidgetOptions,
        callback: CloudinaryCallback
      ) => CloudinaryWidget;
    };
  }
}

interface CloudinaryWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  sources?: string[];
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  cropping?: boolean;
  croppingAspectRatio?: number;
  showSkipCropButton?: boolean;
  resourceType?: string;
  clientAllowedFormats?: string[];
  maxFileSize?: number;
  styles?: {
    palette?: Record<string, string>;
    fonts?: Record<string, unknown>;
  };
}

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

interface CloudinaryResult {
  event: string;
  info?: {
    secure_url?: string;
    public_id?: string;
    original_filename?: string;
    format?: string;
    resource_type?: string;
    bytes?: number;
    width?: number;
    height?: number;
  };
}

type CloudinaryCallback = (error: Error | null, result: CloudinaryResult) => void;

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  aspectRatio?: number;
  folder?: string;
  placeholder?: string;
  showPreview?: boolean;
}

// Check if cloudinary is already loaded (runs only on client)
function getInitialScriptState(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.cloudinary;
}

// Validate URL helper function
function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  aspectRatio = 1,
  folder = "tenant-uploads",
  placeholder = "Upload gambar",
  showPreview = true,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(getInitialScriptState);
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  // Validate image URL
  const isValidImageUrl = isValidUrl(value || '');

  // 🔥 FIX: Check if script is already loaded after mount
  // Using layout effect to avoid ESLint warning and ensure sync check
  useEffect(() => {
    const checkScript = () => {
      if (typeof window !== 'undefined' && window.cloudinary) {
        setIsScriptLoaded(true);
      }
    };

    if (!isScriptLoaded) {
      checkScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ EMPTY ARRAY - cuma run sekali pas mount// Empty deps - only run on mount

  // ==========================================
  // CLOUDINARY WIDGET SETUP
  // ==========================================
  const openWidget = useCallback(() => {
    if (disabled || isLoading) return;

    if (!window.cloudinary) {
      console.error("Cloudinary not loaded yet. Please wait...");
      return;
    }

    // Destroy old widget if exists (to update config)
    if (widgetRef.current) {
      widgetRef.current.destroy();
      widgetRef.current = null;
    }

    // Create new widget
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFiles: 1,
        folder,
        cropping: true,
        croppingAspectRatio: aspectRatio,
        showSkipCropButton: false,
        resourceType: "image",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif"],
        maxFileSize: 5000000, // 5MB
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
        },
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          setIsLoading(false);
          document.body.style.overflow = "";
          return;
        }

        // Handle success
        if (result.event === "success" && result.info?.secure_url) {
          const imageUrl = result.info.secure_url.trim();
          onChange(imageUrl);
          setIsLoading(false);
          document.body.style.overflow = "";
        }

        // Handle close/abort
        if (result.event === "close" || result.event === "abort") {
          setIsLoading(false);
          document.body.style.overflow = "";
        }

        // Handle upload start
        if (result.event === "queues-start") {
          setIsLoading(true);
        }

        // Handle upload end (completed or failed)
        if (result.event === "queues-end") {
          setIsLoading(false);
        }
      }
    );

    widgetRef.current.open();
  }, [disabled, isLoading, folder, aspectRatio, onChange]);

  const handleRemove = () => {
    if (isLoading) return; // Prevent remove during upload

    setIsLoading(false); // Reset loading state

    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  return (
    <>
      {!isScriptLoaded && (
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />
      )}

      <div className={cn("relative group", className)}>
        {isValidImageUrl && showPreview ? (
          // Preview Mode
          <div
            className="relative overflow-hidden rounded-lg border bg-muted"
            style={{ aspectRatio }}
          >
            <Image
              src={value!.trim()}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={openWidget}
                  disabled={isLoading || !isScriptLoaded}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-1" />
                  )}
                  Ganti
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Upload Mode
          <button
            type="button"
            onClick={openWidget}
            disabled={disabled || isLoading || !isScriptLoaded}
            className={cn(
              "w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer",
              disabled && "cursor-not-allowed opacity-50",
              isLoading && "cursor-wait",
              !isScriptLoaded && "cursor-wait opacity-70"
            )}
            style={{ aspectRatio }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-8 w-8 mb-2 text-muted-foreground animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Mengupload...
                </span>
              </>
            ) : !isScriptLoaded ? (
              <>
                <Loader2 className="h-8 w-8 mb-2 text-muted-foreground animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Memuat...
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{placeholder}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP (max 5MB)
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
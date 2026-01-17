"use client";

import { useCallback, useRef, useState } from "react";
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
  // Use lazy initial state to check if script already loaded
  const [isScriptLoaded, setIsScriptLoaded] = useState(getInitialScriptState);
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  // ==========================================
  // CLOUDINARY WIDGET SETUP
  // ==========================================
  const openWidget = useCallback(() => {
    if (disabled) return;

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
          console.error("Upload error details:", {
            message: error.message,
            stack: error.stack,
            folder,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            hasPreset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          });
          setIsLoading(false);
          // FIX: Reset body overflow on error
          document.body.style.overflow = "";
          return;
        }

        if (result.event === "success" && result.info?.secure_url) {
          onChange(result.info.secure_url);
          setIsLoading(false);
          // FIX: Reset body overflow on success
          document.body.style.overflow = "";
        }

        // FIX: Reset body overflow on close
        if (result.event === "close") {
          setIsLoading(false);
          document.body.style.overflow = "";
        }

        if (result.event === "queues-start") {
          setIsLoading(true);
        }
      }
    );

    widgetRef.current.open();
  }, [disabled, folder, aspectRatio, onChange]);

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  // Handle script load
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  return (
    <>
      {/* Load Cloudinary Script - only if not already loaded */}
      {!isScriptLoaded && (
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />
      )}

      <div className={cn("relative group", className)}>
        {value && showPreview ? (
          // Preview Mode
          <div
            className="relative overflow-hidden rounded-lg border bg-muted"
            style={{ aspectRatio }}
          >
            <Image
              src={value}
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
                  <Upload className="h-4 w-4 mr-1" />
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
'use client';

// =================================================================
// src/components/upload/multi-image-upload.tsx
//
// Multi-image upload dengan:
// - Vanilla Cloudinary widget  → script load SEKALI via module singleton
// - @dnd-kit/sortable          → drag-to-reorder (tanpa @dnd-kit/utilities)
// - valueRef pattern           → widget callback tidak pernah stale
// =================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { GripVertical, ImagePlus, Loader2, X } from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MultiImageUploadProps } from '@/types/cloudinary';

// -----------------------------------------------------------------
// Script singleton
// Cloudinary script di-inject ke <head> SEKALI per browser session.
// Semua instance komponen share singleton ini — tidak ada re-load.
// -----------------------------------------------------------------

let _loaded = false;
let _loading = false;
const _queue: Array<() => void> = [];

function ensureCloudinaryScript(cb: () => void) {
  if (_loaded) { cb(); return; }
  _queue.push(cb);
  if (_loading) return;
  _loading = true;
  const s = document.createElement('script');
  s.src = 'https://upload-widget.cloudinary.com/global/all.js';
  s.async = true;
  s.onload = () => {
    _loaded = true;
    _loading = false;
    _queue.forEach((fn) => fn());
    _queue.length = 0;
  };
  document.head.appendChild(s);
}

// -----------------------------------------------------------------
// Transform helper (menggantikan CSS.Transform dari @dnd-kit/utilities
// yang tidak ada di package.json)
// -----------------------------------------------------------------

type DndTransform = { x: number; y: number; scaleX: number; scaleY: number } | null;

function toTransform(t: DndTransform): string | undefined {
  if (!t) return undefined;
  return `translate3d(${t.x}px, ${t.y}px, 0) scaleX(${t.scaleX}) scaleY(${t.scaleY})`;
}

// -----------------------------------------------------------------
// SortableImage
// -----------------------------------------------------------------

interface SortableImageProps {
  url: string;
  index: number;
  onRemove: () => void;
  disabled: boolean;
}

function SortableImage({ url, index, onRemove, disabled }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: toTransform(transform), transition, zIndex: isDragging ? 50 : undefined }}
      className={cn(
        'relative aspect-square rounded-lg overflow-hidden border bg-muted group select-none',
        isDragging && 'opacity-50 shadow-xl ring-2 ring-primary/40',
      )}
    >
      {/* Image */}
      <Image
        src={url}
        alt={`Image ${index + 1}`}
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors" />

      {/* Badge */}
      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold leading-tight">
        {index === 0 ? '★ Main' : String(index + 1)}
      </div>

      {/* Remove */}
      {!disabled && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-7 w-7"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Drag handle */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute bottom-0 inset-x-0 flex items-center justify-center py-1.5',
            'bg-gradient-to-t from-black/50 to-transparent',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'cursor-grab active:cursor-grabbing touch-none',
          )}
        >
          <GripVertical className="h-4 w-4 text-white/80" />
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// MultiImageUpload
// -----------------------------------------------------------------

export function MultiImageUpload({
  value = [],
  onChange,
  folder = 'fibidy/products',
  maxImages = 5,
  disabled = false,
}: MultiImageUploadProps) {
  const [scriptReady, setScriptReady] = useState(_loaded);
  const [isUploading, setIsUploading] = useState(false);

  const widgetRef = useRef<{ open: () => void; destroy: () => void } | null>(null);

  /**
   * valueRef — widget callback membaca ini, bukan value dari closure.
   * Ini mencegah stale closure saat beberapa gambar diupload berurutan.
   */
  const valueRef = useRef(value);
  valueRef.current = value;

  const remaining = maxImages - value.length;
  const canUploadMore = remaining > 0 && !disabled;

  // Load script
  useEffect(() => {
    ensureCloudinaryScript(() => setScriptReady(true));
  }, []);

  // Build widget — panggil sebelum setiap open() supaya maxFiles selalu akurat
  const buildWidget = useCallback(() => {
    if (!window.cloudinary) return;

    widgetRef.current?.destroy();
    widgetRef.current = null;

    const slots = maxImages - valueRef.current.length;
    if (slots <= 0) return;

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '',
        folder,
        maxFiles: slots,
        multiple: slots > 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxFileSize: 10_000_000,
        sources: ['local', 'url', 'camera'],
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#E5E7EB',
            tabIcon: '#10B981',
            menuIcons: '#6B7280',
            textDark: '#111827',
            textLight: '#FFFFFF',
            link: '#10B981',
            action: '#10B981',
            inactiveTabIcon: '#9CA3AF',
            error: '#EF4444',
            inProgress: '#10B981',
            complete: '#10B981',
            sourceBg: '#F9FAFB',
          },
        },
      },
      (error, result) => {
        if (error) { setIsUploading(false); return; }

        switch (result.event) {
          case 'queues-start':
            setIsUploading(true);
            break;
          case 'success':
            if (result.info?.secure_url) {
              const url = result.info.secure_url;
              const current = valueRef.current;
              if (!current.includes(url)) onChange([...current, url]);
            }
            break;
          case 'close':
          case 'queues-end':
            setIsUploading(false);
            buildWidget(); // rebuild → maxFiles fresh untuk sesi berikutnya
            break;
        }
      }
    );
  }, [folder, maxImages, onChange]);

  // Initial build setelah script ready
  useEffect(() => {
    if (scriptReady) buildWidget();
    return () => { widgetRef.current?.destroy(); widgetRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady]);

  const handleOpen = () => {
    if (!scriptReady || isUploading) return;
    buildWidget();
    widgetRef.current?.open();
  };

  const handleRemove = (url: string) =>
    onChange(value.filter((u) => u !== url));

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = value.indexOf(active.id as string);
    const to = value.indexOf(over.id as string);
    onChange(arrayMove(value, from, to));
  };

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={value} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {value.map((url, i) => (
              <SortableImage
                key={url}
                url={url}
                index={i}
                onRemove={() => handleRemove(url)}
                disabled={disabled}
              />
            ))}

            {canUploadMore && (
              <button
                type="button"
                onClick={handleOpen}
                disabled={!scriptReady || isUploading}
                className={cn(
                  'aspect-square rounded-lg border-2 border-dashed',
                  'flex flex-col items-center justify-center gap-1.5',
                  'transition-colors hover:border-primary/50 hover:bg-muted/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                {!scriptReady || isUploading ? (
                  <>
                    <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {!scriptReady ? 'Loading...' : 'Uploading...'}
                    </span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-7 w-7 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Add photo
                    </span>
                    {value.length > 0 && (
                      <span className="text-[10px] text-muted-foreground/50">
                        {remaining} slot{remaining !== 1 ? 's' : ''} left
                      </span>
                    )}
                  </>
                )}
              </button>
            )}

          </div>
        </SortableContext>
      </DndContext>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="tabular-nums">{value.length} / {maxImages} photos</span>
        {value.length > 1 && (
          <span className="flex items-center gap-1 opacity-60">
            <GripVertical className="h-3 w-3" />
            Drag to reorder · first is main thumbnail
          </span>
        )}
        {value.length === 1 && <span>This photo is the main thumbnail</span>}
      </div>
    </div>
  );
}
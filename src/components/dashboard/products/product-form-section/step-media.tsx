'use client';

// ─── Step 2: Media ─────────────────────────────────────────────────────────
// Satu grid terintegrasi: foto terisi + slot kosong + slot locked (Crown)

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Crown, GripVertical, ImagePlus, Loader2, X } from 'lucide-react';
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
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shared/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/shared/validations';
import type { ProductType } from './types';

// ─── Constants ────────────────────────────────────────────────────────────
const TOTAL_SLOTS = 5;
const FREE_SLOTS = 3;

// ─── Cloudinary script singleton ──────────────────────────────────────────
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

// ─── DnD transform helper ─────────────────────────────────────────────────
type DndTransform = { x: number; y: number; scaleX: number; scaleY: number } | null;
function toTransform(t: DndTransform): string | undefined {
  if (!t) return undefined;
  return `translate3d(${t.x}px, ${t.y}px, 0) scaleX(${t.scaleX}) scaleY(${t.scaleY})`;
}

// ─── Filled Slot ──────────────────────────────────────────────────────────
function FilledSlot({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: toTransform(transform), transition, zIndex: isDragging ? 50 : undefined }}
      className={cn(
        'relative aspect-square rounded-xl overflow-hidden border bg-muted group select-none',
        isDragging && 'opacity-50 shadow-xl ring-2 ring-primary/40',
      )}
    >
      <Image
        src={url}
        alt={`Foto ${index + 1}`}
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 640px) 50vw, 20vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors" />
      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
        {index === 0 ? '★ Main' : String(index + 1)}
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button type="button" variant="destructive" size="icon" className="h-7 w-7" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-0 inset-x-0 flex items-center justify-center py-1.5 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-4 w-4 text-white/80" />
      </div>
    </div>
  );
}

// ─── Empty Slot ───────────────────────────────────────────────────────────
function EmptySlot({
  index,
  onClick,
  isLoading,
}: {
  index: number;
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'aspect-square rounded-xl border-2 border-dashed border-border',
        'flex flex-col items-center justify-center gap-2',
        'bg-muted/30 hover:bg-muted/60 hover:border-primary/40',
        'transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60',
      )}
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
      ) : (
        <>
          <ImagePlus className="h-6 w-6 text-muted-foreground/50" />
          <span className="text-[11px] font-medium text-muted-foreground/60">
            Foto {index + 1}
          </span>
        </>
      )}
    </button>
  );
}

// ─── Locked Slot ─────────────────────────────────────────────────────────
function LockedSlot({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'aspect-square rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700',
        'flex flex-col items-center justify-center gap-2',
        'bg-amber-50/50 dark:bg-amber-950/20',
        'hover:bg-amber-100/60 dark:hover:bg-amber-900/30',
        'transition-colors group cursor-pointer',
      )}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 group-hover:bg-amber-200 transition-colors">
        <Crown className="h-4 w-4 text-amber-500" />
      </div>
      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
        Business
      </span>
    </button>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────
interface StepMediaProps {
  form: UseFormReturn<ProductFormData>;
  productType: ProductType;
  maxImages: number;
  isBusiness: boolean;
  onUpgrade: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────
export function StepMedia({ form, productType, maxImages, isBusiness, onUpgrade }: StepMediaProps) {
  const isService = productType === 'service';

  const [scriptReady, setScriptReady] = useState(_loaded);
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef<{ open: () => void; destroy: () => void } | null>(null);
  const valueRef = useRef<string[]>([]);

  useEffect(() => {
    ensureCloudinaryScript(() => setScriptReady(true));
    return () => { widgetRef.current?.destroy(); widgetRef.current = null; };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => {
        valueRef.current = field.value || [];
        const images: string[] = field.value || [];

        const buildAndOpen = () => {
          if (!scriptReady || isUploading || !window.cloudinary) return;
          const current = valueRef.current;
          const slots = maxImages - current.length;
          if (slots <= 0) return;

          widgetRef.current?.destroy();
          widgetRef.current = null;

          widgetRef.current = window.cloudinary.createUploadWidget(
            {
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
              uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '',
              folder: 'fibidy/products',
              maxFiles: slots,
              multiple: slots > 1,
              resourceType: 'image',
              clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
              maxFileSize: 10_000_000,
              sources: ['local', 'url', 'camera'],
              styles: {
                palette: {
                  window: '#FFFFFF', windowBorder: '#E5E7EB',
                  tabIcon: '#10B981', menuIcons: '#6B7280',
                  textDark: '#111827', textLight: '#FFFFFF',
                  link: '#10B981', action: '#10B981',
                  inactiveTabIcon: '#9CA3AF', error: '#EF4444',
                  inProgress: '#10B981', complete: '#10B981', sourceBg: '#F9FAFB',
                },
              },
            },
            (error: unknown, result: any) => {
              if (error) { setIsUploading(false); return; }
              switch (result.event) {
                case 'queues-start': setIsUploading(true); break;
                case 'success':
                  if (result.info?.secure_url) {
                    const url = result.info.secure_url as string;
                    const cur = valueRef.current;
                    if (!cur.includes(url)) field.onChange([...cur, url]);
                  }
                  break;
                case 'close':
                case 'queues-end':
                  setIsUploading(false);
                  break;
              }
            }
          );

          widgetRef.current.open();
        };

        const handleRemove = (url: string) =>
          field.onChange(images.filter((u) => u !== url));

        const handleDragEnd = ({ active, over }: DragEndEvent) => {
          if (!over || active.id === over.id) return;
          const from = images.indexOf(active.id as string);
          const to = images.indexOf(over.id as string);
          field.onChange(arrayMove(images, from, to));
        };

        return (
          <FormItem>
            <FormControl>
              <div className="space-y-4">

                {/* Context label */}
                <div className={cn(
                  'rounded-xl border px-4 py-3 text-sm',
                  isService
                    ? 'bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-400'
                    : 'bg-muted/50 border-border text-muted-foreground'
                )}>
                  {isService ? (
                    <p><span className="font-semibold">Portfolio mode —</span>{' '}
                      upload sampel karya kamu. Foto pertama jadi thumbnail utama.</p>
                  ) : (
                    <p><span className="font-semibold">Foto produk —</span>{' '}
                      {isBusiness
                        ? 'Upload hingga 5 foto. Foto pertama jadi thumbnail utama.'
                        : `Upload hingga ${FREE_SLOTS} foto. Slot 4 & 5 tersedia di Business Plan.`
                      }
                    </p>
                  )}
                </div>

                {/* Grid 5 slot */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={images} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
                        // Slot terisi → tampilkan foto
                        if (i < images.length) {
                          return (
                            <FilledSlot
                              key={images[i]}
                              url={images[i]}
                              index={i}
                              onRemove={() => handleRemove(images[i])}
                            />
                          );
                        }

                        // Slot locked (Business only)
                        if (!isBusiness && i >= FREE_SLOTS) {
                          return <LockedSlot key={`locked-${i}`} onClick={onUpgrade} />;
                        }

                        // Slot kosong — klik untuk upload
                        return (
                          <EmptySlot
                            key={`empty-${i}`}
                            index={i}
                            onClick={buildAndOpen}
                            isLoading={isUploading && i === images.length}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="tabular-nums">{images.length} / {maxImages} foto</span>
                  <div className="flex items-center gap-3">
                    {images.length > 1 && (
                      <span className="flex items-center gap-1 opacity-60">
                        <GripVertical className="h-3 w-3" />
                        Drag untuk urutkan
                      </span>
                    )}
                    {!isBusiness && (
                      <button
                        type="button"
                        onClick={onUpgrade}
                        className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        <Crown className="h-3 w-3" />
                        Upgrade ke Business
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
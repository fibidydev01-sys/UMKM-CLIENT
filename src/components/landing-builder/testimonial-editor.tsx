'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ImageUpload } from '@/components/upload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LANDING_CONSTANTS } from '@/lib/landing';
import type { Testimonial } from '@/types';

// ==========================================
// TYPES
// ==========================================

interface TestimonialEditorProps {
  items: Testimonial[];
  onChange: (items: Testimonial[]) => void;
}

// Generate unique ID
const generateId = () => `testi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const DEFAULT_TESTIMONIAL: Omit<Testimonial, 'id'> = {
  name: '',
  role: '',
  content: '',
  avatar: '',
  rating: 5,
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export function TestimonialEditor({ items, onChange }: TestimonialEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Testimonial>({
    id: '',
    ...DEFAULT_TESTIMONIAL,
  });

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: generateId(),
      ...DEFAULT_TESTIMONIAL
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      const newItems = items.filter((item) => item.id !== deletingId);
      onChange(newItems);
      toast.success('Testimonial berhasil dihapus');
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleSave = () => {
    // Validasi
    if (!formData.name || !formData.name.trim()) {
      toast.error('Nama wajib diisi');
      return;
    }
    if (!formData.content || !formData.content.trim()) {
      toast.error('Isi testimonial wajib diisi');
      return;
    }

    // Pastikan ID selalu ada
    const savedItem: Testimonial = {
      ...formData,
      id: formData.id || generateId(),
      name: formData.name.trim(),
      content: formData.content.trim(),
      role: formData.role?.trim() || '',
      avatar: formData.avatar || '',
      rating: formData.rating || 5,
    };

    let newItems: Testimonial[];

    if (editingItem) {
      // Update existing
      newItems = items.map((item) =>
        item.id === editingItem.id ? savedItem : item
      );
      toast.success('Testimonial berhasil diperbarui');
    } else {
      // Add new
      newItems = [...items, savedItem];
      toast.success('Testimonial berhasil ditambahkan');
    }

    onChange(newItems);
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({ id: '', ...DEFAULT_TESTIMONIAL });
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset form saat dialog ditutup
      setEditingItem(null);
      setFormData({ id: '', ...DEFAULT_TESTIMONIAL });
    }
    setDialogOpen(open);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {items.length} testimonial
          </p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Tambah
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-2">Belum ada testimonial</p>
          <p className="text-sm text-muted-foreground mb-4">
            Tambahkan testimonial dari pelanggan untuk meningkatkan kepercayaan
          </p>
          <Button size="sm" variant="outline" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Tambah Testimonial Pertama
          </Button>
        </div>
      )}

      {/* Testimonial List */}
      {items.length > 0 && (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <Card key={item.id || `fallback-${index}`} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    {item.avatar && <AvatarImage src={item.avatar} alt={item.name} />}
                    <AvatarFallback>
                      {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{item.name || 'Tanpa Nama'}</p>
                        {item.role && (
                          <p className="text-sm text-muted-foreground">
                            {item.role}
                          </p>
                        )}
                      </div>
                      {/* Rating */}
                      {typeof item.rating === 'number' && item.rating > 0 && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-4 w-4',
                                star <= item.rating!
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-200'
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      &quot;{item.content || 'Tidak ada konten'}&quot;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Testimonial' : 'Tambah Testimonial'}
            </DialogTitle>
            <DialogDescription>
              Masukkan detail testimonial dari pelanggan Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Avatar */}
            <div className="space-y-2">
              <Label>Foto (Opsional)</Label>
              <div className="flex justify-center">
                <div className="w-24 h-24">
                  <ImageUpload
                    value={formData.avatar}
                    onChange={(url) => setFormData({ ...formData, avatar: url || '' })}
                    onRemove={() => setFormData({ ...formData, avatar: '' })}
                    folder={LANDING_CONSTANTS.IMAGE_FOLDERS.TESTIMONIALS}
                    aspectRatio={1}
                    placeholder="Foto"
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-name">Nama *</Label>
              <Input
                id="testimonial-name"
                placeholder="Nama pelanggan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-role">Jabatan / Keterangan</Label>
              <Input
                id="testimonial-role"
                placeholder="CEO, Pengusaha, Ibu Rumah Tangga, dll"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={cn(
                        'h-6 w-6',
                        star <= (formData.rating || 5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {formData.rating || 5} bintang
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-content">Isi Testimonial *</Label>
              <Textarea
                id="testimonial-content"
                placeholder="Tulis testimonial dari pelanggan..."
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Testimonial akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
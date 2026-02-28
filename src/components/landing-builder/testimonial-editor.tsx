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
      toast.success('Testimonial deleted');
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.content || !formData.content.trim()) {
      toast.error('Testimonial content is required');
      return;
    }

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
      newItems = items.map((item) =>
        item.id === editingItem.id ? savedItem : item
      );
      toast.success('Testimonial updated');
    } else {
      newItems = [...items, savedItem];
      toast.success('Testimonial added');
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
            {items.length} {items.length === 1 ? 'testimonial' : 'testimonials'}
          </p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-2">No testimonials yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add customer testimonials to build trust with new visitors
          </p>
          <Button size="sm" variant="outline" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add First Testimonial
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
                        <p className="font-medium">{item.name || 'Unnamed'}</p>
                        {item.role && (
                          <p className="text-sm text-muted-foreground">
                            {item.role}
                          </p>
                        )}
                      </div>
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
                      &quot;{item.content || 'No content'}&quot;
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
              {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
            </DialogTitle>
            <DialogDescription>
              Enter the customer&apos;s testimonial details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Avatar */}
            <div className="space-y-2">
              <Label>Photo (optional)</Label>
              <div className="flex justify-center">
                <div className="w-24 h-24">
                  <ImageUpload
                    value={formData.avatar}
                    onChange={(url) => setFormData({ ...formData, avatar: url || '' })}
                    onRemove={() => setFormData({ ...formData, avatar: '' })}
                    folder={LANDING_CONSTANTS.IMAGE_FOLDERS.TESTIMONIALS}
                    aspectRatio={1}
                    placeholder="Photo"
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-name">Name *</Label>
              <Input
                id="testimonial-name"
                placeholder="Customer name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-role">Title / Description</Label>
              <Input
                id="testimonial-role"
                placeholder="CEO, Business Owner, Stay-at-home Parent, etc."
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
                  {formData.rating || 5} {(formData.rating || 5) === 1 ? 'star' : 'stars'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-content">Testimonial *</Label>
              <Textarea
                id="testimonial-content"
                placeholder="Write the customer's testimonial..."
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The testimonial will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
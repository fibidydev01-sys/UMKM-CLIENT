'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/upload';
import type { TestimonialsFormData } from '@/types';
import type { Testimonial } from '@/types';

interface StepTestimoniProps {
  formData: TestimonialsFormData;
  updateFormData: <K extends keyof TestimonialsFormData>(key: K, value: TestimonialsFormData[K]) => void;
}

export function StepTestimoni({ formData, updateFormData }: StepTestimoniProps) {
  const handleAdd = () => {
    const newTestimonial: Testimonial = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      role: '',
      content: '',
    };
    updateFormData('testimonials', [...formData.testimonials, newTestimonial]);
  };

  const handleRemove = (index: number) => {
    updateFormData('testimonials', formData.testimonials.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof Testimonial, value: string) => {
    const updated = [...formData.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData('testimonials', updated);
  };

  return (
    <div className="flex flex-col items-center gap-4">

      <Button type="button" size="sm" variant="outline" onClick={handleAdd}>
        + Tambah Testimonial
      </Button>

      {formData.testimonials.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] w-full max-w-sm border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground text-center px-4">
            Belum ada testimonial. Klik &quot;Tambah Testimonial&quot; untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {formData.testimonials.map((testimonial, index) => (
            <Card key={testimonial.id || index}>
              <CardContent className="pt-4 flex flex-col gap-3">

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Testimonial #{index + 1}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-6 px-2 text-xs"
                    onClick={() => handleRemove(index)}
                  >
                    Hapus
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <Label className="text-xs text-muted-foreground">Avatar (Opsional)</Label>
                  <div className="w-[80px]">
                    <ImageUpload
                      value={testimonial.avatar}
                      onChange={(url) => handleUpdate(index, 'avatar', url ?? '')}
                      onRemove={() => handleUpdate(index, 'avatar', '')}
                      folder="fibidy/testimonial-avatars"
                      aspectRatio={1}
                      placeholder="Avatar"
                    />
                  </div>
                </div>

                <div className="w-full border-t" />

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Nama Pelanggan</Label>
                  <Input
                    placeholder="Nama pelanggan..."
                    value={testimonial.name}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                    className="text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Role (Opsional)</Label>
                  <Input
                    placeholder="Food Blogger"
                    value={testimonial.role ?? ''}
                    onChange={(e) => handleUpdate(index, 'role', e.target.value)}
                    className="text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Isi Testimoni</Label>
                  <Textarea
                    placeholder="Tulis testimoni pelanggan..."
                    rows={3}
                    value={testimonial.content}
                    onChange={(e) => handleUpdate(index, 'content', e.target.value)}
                    className="text-center resize-none"
                  />
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
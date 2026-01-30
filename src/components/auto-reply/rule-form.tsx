'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, X, Info, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { MessageEditor } from './message-editor';
import type { AutoReplyRule, TriggerType, MatchType, CreateAutoReplyRuleInput } from '@/types/chat';

// ==========================================
// FORM SCHEMA
// ==========================================

const ruleFormSchema = z.object({
  name: z.string().min(1, 'Nama aturan wajib diisi'),
  description: z.string().optional(),
  triggerType: z.enum(['WELCOME', 'KEYWORD', 'TIME_BASED', 'ORDER_STATUS', 'PAYMENT_STATUS']),
  keywords: z.array(z.string()).optional(),
  matchType: z.enum(['EXACT', 'CONTAINS', 'STARTS_WITH']).optional(),
  caseSensitive: z.boolean().optional(),
  workingHoursStart: z.string().optional(),
  workingHoursEnd: z.string().optional(),
  workingHoursTimezone: z.string().optional(),
  workingHoursDays: z.array(z.number()).optional(),
  statusTrigger: z.string().optional(), // For ORDER_STATUS & PAYMENT_STATUS
  responseMessage: z.string().min(1, 'Pesan balasan wajib diisi'),
  priority: z.number().min(0).max(100).optional(),
  delaySeconds: z.number().min(1).max(60).optional(),
  isActive: z.boolean().optional(),
});

type RuleFormData = z.infer<typeof ruleFormSchema>;

// ==========================================
// RULE FORM COMPONENT
// ==========================================

interface RuleFormProps {
  initialData?: AutoReplyRule;
  onSubmit: (data: CreateAutoReplyRuleInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function RuleForm({ initialData, onSubmit, isSubmitting }: RuleFormProps) {
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || []);
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialData?.workingHours?.days || [1, 2, 3, 4, 5]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RuleFormData>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      triggerType: initialData?.triggerType || 'KEYWORD',
      matchType: initialData?.matchType || 'CONTAINS',
      caseSensitive: initialData?.caseSensitive || false,
      workingHoursStart: initialData?.workingHours?.start || '09:00',
      workingHoursEnd: initialData?.workingHours?.end || '21:00',
      workingHoursTimezone: initialData?.workingHours?.timezone || 'Asia/Jakarta',
      statusTrigger: initialData?.statusTrigger || '',
      responseMessage: initialData?.responseMessage || '',
      priority: initialData?.priority ?? 50,
      delaySeconds: initialData?.delaySeconds ?? 2,
      isActive: initialData?.isActive ?? true,
    },
  });

  const triggerType = watch('triggerType');
  const statusTrigger = watch('statusTrigger');
  const responseMessage = watch('responseMessage');
  const priority = watch('priority');
  const delaySeconds = watch('delaySeconds');

  // Add keyword
  const handleAddKeyword = useCallback(() => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  }, [keywordInput, keywords]);

  // Remove keyword
  const handleRemoveKeyword = useCallback(
    (keyword: string) => {
      setKeywords(keywords.filter((k) => k !== keyword));
    },
    [keywords]
  );

  // Toggle day
  const handleToggleDay = useCallback((day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  // Submit handler
  const handleFormSubmit = useCallback(
    async (data: RuleFormData) => {
      const payload: CreateAutoReplyRuleInput = {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        responseMessage: data.responseMessage,
        priority: data.priority ?? 50,
        delaySeconds: data.delaySeconds ?? 2,
        isActive: data.isActive ?? true,
      };

      if (data.triggerType === 'KEYWORD') {
        payload.keywords = keywords;
        payload.matchType = data.matchType;
        payload.caseSensitive = data.caseSensitive ?? false;
      }

      if (data.triggerType === 'TIME_BASED') {
        payload.workingHours = {
          start: data.workingHoursStart || '09:00',
          end: data.workingHoursEnd || '21:00',
          timezone: data.workingHoursTimezone || 'Asia/Jakarta',
          days: selectedDays,
        };
      }

      if (data.triggerType === 'ORDER_STATUS' || data.triggerType === 'PAYMENT_STATUS') {
        payload.statusTrigger = data.statusTrigger;
      }

      await onSubmit(payload);
    },
    [keywords, selectedDays, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>Nama dan deskripsi aturan auto-reply</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Aturan *</Label>
            <Input id="name" placeholder="Contoh: Pesan Selamat Datang" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi singkat tentang aturan ini..."
              rows={2}
              {...register('description')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Trigger Type */}
      <Card>
        <CardHeader>
          <CardTitle>Tipe Pemicu</CardTitle>
          <CardDescription>Kapan auto-reply ini akan aktif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe Pemicu *</Label>
            <Select
              value={triggerType}
              onValueChange={(value) => setValue('triggerType', value as TriggerType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WELCOME">Pesan Pertama (Welcome)</SelectItem>
                <SelectItem value="KEYWORD">Kata Kunci (Keyword)</SelectItem>
                <SelectItem value="TIME_BASED">Di Luar Jam Kerja (Time-Based)</SelectItem>
                <SelectItem value="ORDER_STATUS">Status Pesanan (Order Status)</SelectItem>
                <SelectItem value="PAYMENT_STATUS">Status Pembayaran (Payment Status)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trigger type info */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {triggerType === 'WELCOME' &&
                'Akan membalas otomatis ketika pelanggan pertama kali mengirim pesan.'}
              {triggerType === 'KEYWORD' &&
                'Akan membalas otomatis ketika pesan mengandung kata kunci tertentu.'}
              {triggerType === 'TIME_BASED' &&
                'Akan membalas otomatis ketika pesan diterima di luar jam kerja.'}
              {triggerType === 'ORDER_STATUS' &&
                'Akan mengirim notifikasi otomatis ketika status pesanan diubah (PENDING, PROCESSING, COMPLETED, CANCELLED).'}
              {triggerType === 'PAYMENT_STATUS' &&
                'Akan mengirim notifikasi otomatis ketika status pembayaran diubah (PAID, PARTIAL, FAILED).'}
            </p>
          </div>

          {/* Keyword options */}
          {triggerType === 'KEYWORD' && (
            <div className="space-y-4 pt-4 border-t">
              {/* Keywords input */}
              <div className="space-y-2">
                <Label>Kata Kunci *</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Ketik kata kunci, lalu tekan Enter"
                  />
                  <Button type="button" onClick={handleAddKeyword} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="gap-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Match type */}
              <div className="space-y-2">
                <Label>Tipe Pencocokan</Label>
                <Select
                  value={watch('matchType') || 'CONTAINS'}
                  onValueChange={(value) => setValue('matchType', value as MatchType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTAINS">Mengandung kata kunci</SelectItem>
                    <SelectItem value="EXACT">Sama persis</SelectItem>
                    <SelectItem value="STARTS_WITH">Diawali dengan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Case sensitive */}
              <div className="flex items-center justify-between">
                <Label htmlFor="caseSensitive">Peka huruf besar/kecil</Label>
                <Switch
                  id="caseSensitive"
                  checked={watch('caseSensitive')}
                  onCheckedChange={(checked) => setValue('caseSensitive', checked)}
                />
              </div>
            </div>
          )}

          {/* Time-based options */}
          {triggerType === 'TIME_BASED' && (
            <div className="space-y-4 pt-4 border-t">
              {/* Working hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jam Mulai Kerja</Label>
                  <Input type="time" {...register('workingHoursStart')} />
                </div>
                <div className="space-y-2">
                  <Label>Jam Selesai Kerja</Label>
                  <Input type="time" {...register('workingHoursEnd')} />
                </div>
              </div>

              {/* Working days */}
              <div className="space-y-2">
                <Label>Hari Kerja</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <Button
                      key={day.value}
                      type="button"
                      variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleDay(day.value)}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">
                  Auto-reply akan aktif di luar hari dan jam kerja yang dipilih
                </p>
              </div>
            </div>
          )}

          {/* Order Status options */}
          {triggerType === 'ORDER_STATUS' && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Status Pemicu *</Label>
                <Select
                  value={statusTrigger || ''}
                  onValueChange={(value) => setValue('statusTrigger', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pesanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending (Menunggu)</SelectItem>
                    <SelectItem value="PROCESSING">Processing (Diproses)</SelectItem>
                    <SelectItem value="COMPLETED">Completed (Selesai)</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled (Dibatalkan)</SelectItem>
                  </SelectContent>
                </Select>
                {!statusTrigger && (
                  <p className="text-sm text-yellow-600">Pilih status yang akan memicu notifikasi</p>
                )}
              </div>

              {/* Auto-assigned info */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Priority dan delay akan diatur otomatis oleh sistem untuk pengalaman chat yang natural.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Payment Status options */}
          {triggerType === 'PAYMENT_STATUS' && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Status Pemicu *</Label>
                <Select
                  value={statusTrigger || ''}
                  onValueChange={(value) => setValue('statusTrigger', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAID">Paid (Lunas)</SelectItem>
                    <SelectItem value="PARTIAL">Partial (Sebagian)</SelectItem>
                    <SelectItem value="FAILED">Failed (Gagal)</SelectItem>
                  </SelectContent>
                </Select>
                {!statusTrigger && (
                  <p className="text-sm text-yellow-600">Pilih status yang akan memicu notifikasi</p>
                )}
              </div>

              {/* Auto-assigned info */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Priority dan delay akan diatur otomatis oleh sistem untuk pengalaman chat yang natural.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Message */}
      <Card>
        <CardHeader>
          <CardTitle>Pesan Balasan</CardTitle>
          <CardDescription>Pesan yang akan dikirim secara otomatis</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="responseMessage">Pesan Balasan *</Label>
          <div className="mt-2">
            <MessageEditor
              value={responseMessage}
              onChange={(value) => setValue('responseMessage', value)}
              triggerType={triggerType}
              error={errors.responseMessage?.message}
              placeholder={
                triggerType === 'WELCOME'
                  ? 'Halo {{name}}! Terima kasih telah menghubungi kami...'
                  : triggerType === 'ORDER_STATUS'
                    ? 'Hi {{name}}! Order {{order_number}} sedang diproses...\n\nCek status: {{tracking_link}}'
                    : triggerType === 'PAYMENT_STATUS'
                      ? 'Terima kasih {{name}}! Pembayaran order {{order_number}} sudah diterima.\n\nTotal: {{total}}'
                      : 'Halo {{name}}! Terima kasih telah menghubungi kami...'
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan</CardTitle>
          <CardDescription>
            {triggerType === 'ORDER_STATUS' || triggerType === 'PAYMENT_STATUS'
              ? 'Status aturan'
              : 'Prioritas dan delay'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Priority & Delay - Hidden for ORDER_STATUS & PAYMENT_STATUS */}
          {triggerType !== 'ORDER_STATUS' && triggerType !== 'PAYMENT_STATUS' && (
            <>
              {/* Priority */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Prioritas</Label>
                  <span className="text-sm font-medium">{priority}</span>
                </div>
                <Slider
                  value={[priority || 50]}
                  onValueChange={([value]) => setValue('priority', value)}
                  min={0}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-zinc-500">
                  Prioritas lebih tinggi akan diproses lebih dulu. Jika ada beberapa aturan yang cocok,
                  hanya aturan dengan prioritas tertinggi yang akan dijalankan.
                </p>
              </div>

              {/* Delay */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Delay (detik)</Label>
                  <span className="text-sm font-medium">{delaySeconds}s</span>
                </div>
                <Slider
                  value={[delaySeconds || 2]}
                  onValueChange={([value]) => setValue('delaySeconds', value)}
                  min={1}
                  max={60}
                  step={1}
                />
                <p className="text-xs text-zinc-500">
                  Waktu tunggu sebelum mengirim balasan otomatis. Delay yang wajar membuat balasan
                  terasa lebih natural.
                </p>
              </div>
            </>
          )}

          {/* Auto-assigned info for ORDER_STATUS & PAYMENT_STATUS */}
          {(triggerType === 'ORDER_STATUS' || triggerType === 'PAYMENT_STATUS') && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">Priority dan delay diatur otomatis:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Priority: 70-80 (urgensi tinggi untuk notifikasi order)</li>
                  <li>Delay: 2-5 detik (disesuaikan dengan jenis status untuk efek natural)</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Active */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <Label>Status Aktif</Label>
              <p className="text-sm text-zinc-500">Aturan hanya akan berjalan jika diaktifkan</p>
            </div>
            <Switch
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {initialData ? 'Simpan Perubahan' : 'Buat Aturan'}
        </Button>
      </div>
    </form>
  );
}

// ==========================================
// CONSTANTS
// ==========================================

const DAYS = [
  { value: 0, label: 'Min' },
  { value: 1, label: 'Sen' },
  { value: 2, label: 'Sel' },
  { value: 3, label: 'Rab' },
  { value: 4, label: 'Kam' },
  { value: 5, label: 'Jum' },
  { value: 6, label: 'Sab' },
];

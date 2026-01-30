'use client';

import { useEffect, useState } from 'react';
import { useAutoReply } from '@/hooks/use-auto-reply';
import { useSampleOrder } from '@/hooks/use-orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Plus, AlertCircle, Loader2, Edit, Trash2, Clock, Send, MessageSquare } from 'lucide-react';
import type { AutoReplyRule } from '@/types/chat';
import { WelcomeRuleForm } from './components/welcome-rule-form';

// ==========================================
// WELCOME MESSAGE PAGE
// ==========================================

export default function WelcomePage() {
  const { rules, isLoading, isDeleting, fetchRules, deleteRule } = useAutoReply();
  const { sampleData } = useSampleOrder();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // Get WELCOME rule (should be only 1 or 0)
  const welcomeRule = rules.find((r) => r.triggerType === 'WELCOME');

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Welcome Message</strong> - Pesan otomatis yang dikirim saat customer kontak
          pertama kali melalui WhatsApp. Maksimal 1 welcome message per tenant.
        </AlertDescription>
      </Alert>

      {/* Existing Welcome Rule */}
      {welcomeRule ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Welcome Message</CardTitle>
                </div>
                <CardDescription>
                  Dikirim otomatis saat customer kontak pertama kali
                </CardDescription>
              </div>
              <Badge variant={welcomeRule.isActive ? 'success' : 'secondary'}>
                {welcomeRule.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rule Name */}
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Rule Name:
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {welcomeRule.name}
              </p>
            </div>

            {/* Message Preview - LIVE with Real Data */}
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Live Preview:
              </p>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                <pre className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-sans">
                  {welcomeRule.responseMessage
                    .replace(/\{\{name\}\}/g, sampleData.name)
                    .replace(/\{\{phone\}\}/g, sampleData.phone)}
                </pre>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Send className="h-4 w-4" />
                  <span>Total Sent</span>
                </div>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {welcomeRule.totalTriggered}x
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Clock className="h-4 w-4" />
                  <span>Delay</span>
                </div>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {welcomeRule.delaySeconds}s
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Priority</p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {welcomeRule.priority}
                </p>
                <p className="text-xs text-zinc-400">(Highest)</p>
              </div>
            </div>

            {/* Last Triggered */}
            {welcomeRule.lastTriggeredAt && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Last sent:{' '}
                {new Date(welcomeRule.lastTriggeredAt).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => setEditingRule(welcomeRule)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Welcome Message
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteId(welcomeRule.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Empty State - No Welcome Rule
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum ada Welcome Message</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-center mb-8 max-w-md">
              Buat pesan sambutan otomatis yang akan dikirim saat customer menghubungi bisnis Anda
              untuk pertama kalinya melalui WhatsApp
            </p>
            <Button size="lg" onClick={() => setIsCreating(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Create Welcome Message
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Box - How it Works */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">💡 Cara Kerja Welcome Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            ✅ <strong>Trigger:</strong> Customer mengirim pesan pertama kali ke nomor WhatsApp
            bisnis Anda
          </p>
          <p>
            ✅ <strong>Priority:</strong> Highest (100) - dikirim sebelum auto-reply lainnya
          </p>
          <p>
            ✅ <strong>Variables:</strong> Gunakan {'{'}
            {'{'}name{'}'} untuk nama customer, {'{'}
            {'{'}phone{'}'} untuk nomor telepon
          </p>
          <p>
            ✅ <strong>Best Practice:</strong> Buat pesan yang ramah dan informatif tentang bisnis
            Anda
          </p>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Welcome Message?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Customer baru tidak akan menerima pesan
              sambutan otomatis lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Form Modal */}
      <WelcomeRuleForm
        rule={editingRule}
        open={!!(isCreating || editingRule)}
        onClose={() => {
          setIsCreating(false);
          setEditingRule(null);
        }}
        onSuccess={() => {
          fetchRules();
        }}
      />
    </div>
  );
}

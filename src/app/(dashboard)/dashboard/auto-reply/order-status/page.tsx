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
import { Plus, AlertCircle, Loader2, Edit, Trash2, Clock, Send } from 'lucide-react';
import type { AutoReplyRule } from '@/types/chat';
import { OrderStatusRuleForm } from './components/order-status-rule-form';

// ==========================================
// ORDER STATUS PAGE
// ==========================================

// Define available order statuses
const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending (Menunggu)', color: 'yellow', description: 'Order baru diterima' },
  { value: 'PROCESSING', label: 'Processing (Diproses)', color: 'blue', description: 'Sedang dikerjakan' },
  { value: 'COMPLETED', label: 'Completed (Selesai)', color: 'green', description: 'Order selesai' },
  { value: 'CANCELLED', label: 'Cancelled (Dibatalkan)', color: 'red', description: 'Order dibatalkan' },
] as const;

export default function OrderStatusPage() {
  const { rules, isLoading, isDeleting, fetchRules, deleteRule } = useAutoReply();
  const { sampleData } = useSampleOrder();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [creatingStatus, setCreatingStatus] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // Filter ORDER_STATUS rules only
  const orderStatusRules = rules.filter((r) => r.triggerType === 'ORDER_STATUS');

  // Get which statuses already have rules (check keywords[0])
  const existingStatuses = orderStatusRules
    .filter((r) => r.keywords && r.keywords.length > 0)
    .map((r) => r.keywords[0]);

  // Get available statuses (not yet created)
  const availableStatuses = ORDER_STATUSES.filter(
    (s) => !existingStatuses.includes(s.value)
  );

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'warning' as const;
      case 'blue':
        return 'default' as const;
      case 'green':
        return 'success' as const;
      case 'red':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Order Status Notifications</strong> - Kirim WhatsApp otomatis saat owner
          update status order. Maksimal 1 rule per status. Priority & delay diatur otomatis
          oleh system.
        </AlertDescription>
      </Alert>

      {/* Existing Rules */}
      {orderStatusRules.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Active Rules ({orderStatusRules.length}/4)
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {orderStatusRules.map((rule) => {
              const status = ORDER_STATUSES.find(
                (s) => rule.keywords && rule.keywords[0] === s.value
              );

              if (!status) return null;

              return (
                <Card key={rule.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{status.label}</CardTitle>
                        <CardDescription>{status.description}</CardDescription>
                      </div>
                      <Badge variant={getBadgeVariant(status.color)}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Message Preview - LIVE with Real Data */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-md">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 whitespace-pre-wrap">
                        {rule.responseMessage
                          .replace(/\{\{name\}\}/g, sampleData.name)
                          .replace(/\{\{order_number\}\}/g, sampleData.orderNumber)
                          .replace(/\{\{total\}\}/g, sampleData.total)
                          .replace(/\{\{tracking_link\}\}/g, sampleData.trackingLink)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Send className="h-4 w-4" />
                        <span>Sent: {rule.totalTriggered}x</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Delay: {rule.delaySeconds}s</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setEditingRule(rule)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(rule.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Statuses (Not Yet Created) */}
      {availableStatuses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Create New Rule ({availableStatuses.length} available)
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {availableStatuses.map((status) => (
              <Button
                key={status.value}
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() => setCreatingStatus(status.value)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">{status.label}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {status.description}
                </p>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* All Slots Filled */}
      {availableStatuses.length === 0 && orderStatusRules.length === 4 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ✅ Semua status order sudah memiliki rule. Edit atau hapus rule existing untuk
            membuat perubahan.
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {orderStatusRules.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum ada rule untuk Order Status</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-center mb-6 max-w-md">
              Buat rule pertama untuk mengirim notifikasi WhatsApp otomatis saat status order berubah
            </p>
            <Button onClick={() => setCreatingStatus(ORDER_STATUSES[0].value)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Rule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Rule akan dihapus secara permanen dan tidak akan
              mengirim notifikasi lagi.
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
      <OrderStatusRuleForm
        status={creatingStatus}
        rule={editingRule}
        open={!!(creatingStatus || editingRule)}
        onClose={() => {
          setCreatingStatus(null);
          setEditingRule(null);
        }}
        onSuccess={() => {
          fetchRules();
        }}
      />
    </div>
  );
}

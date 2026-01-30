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
import { Plus, AlertCircle, Loader2, Edit, Trash2, Clock, Send, Key, Hash } from 'lucide-react';
import type { AutoReplyRule } from '@/types/chat';
import { KeywordRuleForm } from './components/keyword-rule-form';

// ==========================================
// KEYWORDS AUTO-REPLY PAGE
// ==========================================

export default function KeywordsPage() {
  const { rules, isLoading, isDeleting, fetchRules, deleteRule } = useAutoReply();
  const { sampleData } = useSampleOrder();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // Filter KEYWORD rules only
  const keywordRules = rules.filter((r) => r.triggerType === 'KEYWORD');

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  const getMatchTypeBadge = (matchType: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      EXACT: { label: 'Exact Match', variant: 'default' },
      CONTAINS: { label: 'Contains', variant: 'secondary' },
      STARTS_WITH: { label: 'Starts With', variant: 'outline' },
    };
    return variants[matchType] || variants.CONTAINS;
  };

  if (isLoading && rules.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <Alert className="mb-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Keyword Auto-Reply</strong> - Balas otomatis saat customer kirim kata kunci
              tertentu. Bisa buat multiple rules dengan keywords berbeda.
            </AlertDescription>
          </Alert>
        </div>
        <Button onClick={() => setIsCreating(true)} className="ml-4 shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Rules List */}
      {keywordRules.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Active Rules ({keywordRules.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {keywordRules.map((rule) => (
              <Card key={rule.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">{rule.name}</CardTitle>
                      </div>
                      {rule.description && (
                        <CardDescription className="text-xs line-clamp-1">
                          {rule.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={rule.isActive ? 'success' : 'secondary'} className="shrink-0">
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Keywords */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-3 w-3 text-zinc-400" />
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Keywords ({rule.keywords?.length || 0}):
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rule.keywords && rule.keywords.length > 0 ? (
                        rule.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-400">No keywords</span>
                      )}
                    </div>
                  </div>

                  {/* Match Type */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getMatchTypeBadge(rule.matchType || 'CONTAINS').variant}
                      className="text-xs"
                    >
                      {getMatchTypeBadge(rule.matchType || 'CONTAINS').label}
                    </Badge>
                    {rule.caseSensitive && (
                      <Badge variant="outline" className="text-xs">
                        Case Sensitive
                      </Badge>
                    )}
                  </div>

                  {/* Message Preview - LIVE with Real Data */}
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-md">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {rule.responseMessage
                        .replace(/\{\{name\}\}/g, sampleData.name)
                        .replace(/\{\{phone\}\}/g, sampleData.phone)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      <span>Sent: {rule.totalTriggered}x</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
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
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(rule.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Empty State
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <Key className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum ada Keyword Rules</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-center mb-8 max-w-md">
              Buat rule pertama untuk membalas otomatis saat customer mengirim kata kunci
              tertentu seperti "harga", "promo", "katalog", dll.
            </p>
            <Button size="lg" onClick={() => setIsCreating(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Create First Rule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Box - Examples */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">💡 Contoh Penggunaan Keyword Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <strong>Rule 1: Info Harga</strong>
            <br />
            Keywords: "harga", "price", "berapa"
            <br />
            Response: "Untuk info harga lengkap, silakan cek katalog kami di..."
          </div>
          <div>
            <strong>Rule 2: Info Promo</strong>
            <br />
            Keywords: "promo", "diskon", "sale"
            <br />
            Response: "Kami punya promo spesial bulan ini! Diskon hingga 50%..."
          </div>
          <div>
            <strong>Rule 3: Cara Order</strong>
            <br />
            Keywords: "order", "pesan", "beli"
            <br />
            Response: "Cara order sangat mudah! 1) Pilih produk, 2) Konfirmasi, 3)..."
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Keyword Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Rule akan dihapus dan tidak akan membalas
              keyword ini lagi.
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
      <KeywordRuleForm
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

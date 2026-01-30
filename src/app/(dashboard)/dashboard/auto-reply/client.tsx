'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Key,
  ShoppingCart,
  DollarSign,
  Plus,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  Clock,
  Send,
  Power,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useAutoReply } from '@/hooks/use-auto-reply';
import type { AutoReplyRule } from '@/types/chat';

// Import form components from sub-pages
import { WelcomeRuleForm } from './welcome/components/welcome-rule-form';
import { KeywordRuleForm } from './keywords/components/keyword-rule-form';
import { OrderStatusRuleForm } from './order-status/components/order-status-rule-form';
import { PaymentStatusRuleForm } from './payment/components/payment-status-rule-form';

// ══════════════════════════════════════════════════════════════
// AUTO-REPLY CLIENT - INSTANT TABS with List/Grid (like Dashboard)
// ══════════════════════════════════════════════════════════════

type TabType = 'welcome' | 'keywords' | 'order-status' | 'payment';
type ViewMode = 'list' | 'grid';
type TriggerType = 'WELCOME' | 'KEYWORD' | 'ORDER_STATUS' | 'PAYMENT_STATUS';

const TABS = [
  {
    id: 'welcome' as const,
    label: 'Welcome',
    icon: MessageSquare,
    triggerType: 'WELCOME' as TriggerType,
    description: 'Pesan otomatis yang dikirim saat customer kontak pertama kali.',
  },
  {
    id: 'keywords' as const,
    label: 'Keywords',
    icon: Key,
    triggerType: 'KEYWORD' as TriggerType,
    description: 'Balas otomatis berdasarkan kata kunci tertentu.',
  },
  {
    id: 'order-status' as const,
    label: 'Order Status',
    icon: ShoppingCart,
    triggerType: 'ORDER_STATUS' as TriggerType,
    description: 'Notifikasi otomatis saat status order berubah.',
  },
  {
    id: 'payment' as const,
    label: 'Payment',
    icon: DollarSign,
    triggerType: 'PAYMENT_STATUS' as TriggerType,
    description: 'Notifikasi otomatis saat status pembayaran berubah.',
  },
];

// ══════════════════════════════════════════════════════════════
// MAIN CLIENT COMPONENT
// ══════════════════════════════════════════════════════════════

export function AutoReplyClient() {
  const [activeTab, setActiveTab] = useState<TabType>('welcome');
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STATIC HEADER - No layout shift                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{currentTab.label}</strong> - {currentTab.description}
        </AlertDescription>
      </Alert>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB CONTENT                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div>
        {activeTab === 'welcome' && <WelcomeTabContent />}
        {activeTab === 'keywords' && <KeywordsTabContent />}
        {activeTab === 'order-status' && <OrderStatusTabContent />}
        {activeTab === 'payment' && <PaymentTabContent />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB HEADER - View toggle + Action button (same as Dashboard)
// ══════════════════════════════════════════════════════════════

function TabHeader({
  viewMode,
  onViewModeChange,
  onAdd,
  actionLabel,
  disabled,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAdd: () => void;
  actionLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(v) => v && onViewModeChange(v as ViewMode)}
      >
        <ToggleGroupItem value="list" aria-label="List view" size="sm">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Button onClick={onAdd} disabled={disabled}>
        <Plus className="h-4 w-4 mr-2" />
        {actionLabel}
      </Button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// GRID SKELETON
// ══════════════════════════════════════════════════════════════

function RulesGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          {/* Header - same as RulesGrid CardHeader */}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <Skeleton className="h-5 w-32" /> {/* Title */}
                <Skeleton className="h-4 w-48" /> {/* Description */}
              </div>
              <Skeleton className="h-5 w-16 rounded-full ml-2" /> {/* Badge */}
            </div>
          </CardHeader>

          {/* Content - same as RulesGrid CardContent */}
          <CardContent className="space-y-4">
            {/* Message Preview - same bg and padding */}
            <div className="bg-muted/50 p-3 rounded-md">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-8" />
            </div>

            {/* Actions - same border-t and padding */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Skeleton className="h-5 w-10 rounded-full" /> {/* Switch */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" /> {/* Edit */}
                <Skeleton className="h-8 w-8 rounded" /> {/* Delete */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RULES GRID - Card view
// ══════════════════════════════════════════════════════════════

function RulesGrid({
  rules,
  onEdit,
  onDelete,
  onToggle,
}: {
  rules: AutoReplyRule[];
  onEdit: (rule: AutoReplyRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rules.map((rule) => (
        <Card key={rule.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <CardTitle className="text-base truncate">{rule.name}</CardTitle>
                {rule.description && (
                  <CardDescription className="line-clamp-2">{rule.description}</CardDescription>
                )}
              </div>
              <Badge variant={rule.isActive ? 'success' : 'secondary'} className="ml-2 shrink-0">
                {rule.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message Preview */}
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                {rule.responseMessage}
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Send className="h-3.5 w-3.5" />
                <span>{rule.totalTriggered}x</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{rule.delaySeconds}s</span>
              </div>
              {rule.keywords && rule.keywords.length > 0 && (
                <div className="flex items-center gap-1">
                  <Key className="h-3.5 w-3.5" />
                  <span>{rule.keywords.length}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Switch checked={rule.isActive} onCheckedChange={() => onToggle(rule.id)} />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(rule)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(rule.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RULES TABLE - List view
// ══════════════════════════════════════════════════════════════

function RulesTable({
  rules,
  onEdit,
  onDelete,
  onToggle,
}: {
  rules: AutoReplyRule[];
  onEdit: (rule: AutoReplyRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-center">Sent</TableHead>
            <TableHead className="text-center">Delay</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium max-w-[150px]">
                <div className="truncate">{rule.name}</div>
                {rule.keywords && rule.keywords.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {rule.keywords.slice(0, 3).join(', ')}
                    {rule.keywords.length > 3 && ` +${rule.keywords.length - 3}`}
                  </div>
                )}
              </TableCell>
              <TableCell className="max-w-[250px]">
                <p className="text-sm text-muted-foreground truncate">{rule.responseMessage}</p>
              </TableCell>
              <TableCell className="text-center">{rule.totalTriggered}x</TableCell>
              <TableCell className="text-center">{rule.delaySeconds}s</TableCell>
              <TableCell className="text-center">
                <Switch checked={rule.isActive} onCheckedChange={() => onToggle(rule.id)} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(rule.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EMPTY STATE
// ══════════════════════════════════════════════════════════════

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: typeof MessageSquare;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-8 max-w-md">{description}</p>
        <Button size="lg" onClick={onAction}>
          <Plus className="h-5 w-5 mr-2" />
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════
// DELETE DIALOG
// ══════════════════════════════════════════════════════════════

function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Auto-Reply Rule?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Rule akan dihapus permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ══════════════════════════════════════════════════════════════
// WELCOME TAB CONTENT
// ══════════════════════════════════════════════════════════════

function WelcomeTabContent() {
  const { rules, isLoading, isDeleting, fetchRules, deleteRule, toggleRule } = useAutoReply();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRules();
    }
  }, [fetchRules]);

  const welcomeRules = rules.filter((r) => r.triggerType === 'WELCOME');

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <>
        <TabHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAdd={() => setIsCreating(true)}
          actionLabel="Tambah Welcome"
          disabled
        />
        <RulesGridSkeleton />
      </>
    );
  }

  return (
    <>
      <TabHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => setIsCreating(true)}
        actionLabel="Tambah Welcome"
      />

      {welcomeRules.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Belum ada Welcome Message"
          description="Buat pesan sambutan otomatis untuk customer yang kontak pertama kali"
          actionLabel="Create Welcome Message"
          onAction={() => setIsCreating(true)}
        />
      ) : viewMode === 'list' ? (
        <RulesTable
          rules={welcomeRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      ) : (
        <RulesGrid
          rules={welcomeRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      )}

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <WelcomeRuleForm
        rule={editingRule}
        open={!!(isCreating || editingRule)}
        onClose={() => {
          setIsCreating(false);
          setEditingRule(null);
        }}
        onSuccess={() => fetchRules()}
      />
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// KEYWORDS TAB CONTENT
// ══════════════════════════════════════════════════════════════

function KeywordsTabContent() {
  const { rules, isLoading, isDeleting, fetchRules, deleteRule, toggleRule } = useAutoReply();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRules();
    }
  }, [fetchRules]);

  const keywordRules = rules.filter((r) => r.triggerType === 'KEYWORD');

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <>
        <TabHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAdd={() => setIsCreating(true)}
          actionLabel="Tambah Keyword"
          disabled
        />
        <RulesGridSkeleton />
      </>
    );
  }

  return (
    <>
      <TabHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => setIsCreating(true)}
        actionLabel="Tambah Keyword"
      />

      {keywordRules.length === 0 ? (
        <EmptyState
          icon={Key}
          title="Belum ada Keyword Rules"
          description="Buat auto-reply yang aktif saat customer mengirim kata kunci tertentu"
          actionLabel="Create Keyword Rule"
          onAction={() => setIsCreating(true)}
        />
      ) : viewMode === 'list' ? (
        <RulesTable
          rules={keywordRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      ) : (
        <RulesGrid
          rules={keywordRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      )}

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <KeywordRuleForm
        rule={editingRule}
        open={!!(isCreating || editingRule)}
        onClose={() => {
          setIsCreating(false);
          setEditingRule(null);
        }}
        onSuccess={() => fetchRules()}
      />
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// ORDER STATUS TAB CONTENT
// ══════════════════════════════════════════════════════════════

function OrderStatusTabContent() {
  const { rules, isLoading, isDeleting, fetchRules, deleteRule, toggleRule } = useAutoReply();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRules();
    }
  }, [fetchRules]);

  const orderStatusRules = rules.filter((r) => r.triggerType === 'ORDER_STATUS');

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <>
        <TabHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAdd={() => setIsCreating(true)}
          actionLabel="Tambah Rule"
          disabled
        />
        <RulesGridSkeleton />
      </>
    );
  }

  return (
    <>
      <TabHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => setIsCreating(true)}
        actionLabel="Tambah Rule"
      />

      {orderStatusRules.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Belum ada Order Status Rules"
          description="Buat notifikasi otomatis saat status order berubah (diproses, dikirim, selesai)"
          actionLabel="Create Order Status Rule"
          onAction={() => setIsCreating(true)}
        />
      ) : viewMode === 'list' ? (
        <RulesTable
          rules={orderStatusRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      ) : (
        <RulesGrid
          rules={orderStatusRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      )}

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <OrderStatusRuleForm
        rule={editingRule}
        open={!!(isCreating || editingRule)}
        onClose={() => {
          setIsCreating(false);
          setEditingRule(null);
        }}
        onSuccess={() => fetchRules()}
      />
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// PAYMENT TAB CONTENT
// ══════════════════════════════════════════════════════════════

function PaymentTabContent() {
  const { rules, isLoading, isDeleting, fetchRules, deleteRule, toggleRule } = useAutoReply();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRules();
    }
  }, [fetchRules]);

  const paymentRules = rules.filter((r) => r.triggerType === 'PAYMENT_STATUS');

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <>
        <TabHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAdd={() => setIsCreating(true)}
          actionLabel="Tambah Rule"
          disabled
        />
        <RulesGridSkeleton />
      </>
    );
  }

  return (
    <>
      <TabHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => setIsCreating(true)}
        actionLabel="Tambah Rule"
      />

      {paymentRules.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="Belum ada Payment Rules"
          description="Buat notifikasi otomatis saat status pembayaran berubah (pending, paid, expired)"
          actionLabel="Create Payment Rule"
          onAction={() => setIsCreating(true)}
        />
      ) : viewMode === 'list' ? (
        <RulesTable
          rules={paymentRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      ) : (
        <RulesGrid
          rules={paymentRules}
          onEdit={setEditingRule}
          onDelete={setDeleteId}
          onToggle={toggleRule}
        />
      )}

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <PaymentStatusRuleForm
        rule={editingRule}
        open={!!(isCreating || editingRule)}
        onClose={() => {
          setIsCreating(false);
          setEditingRule(null);
        }}
        onSuccess={() => fetchRules()}
      />
    </>
  );
}

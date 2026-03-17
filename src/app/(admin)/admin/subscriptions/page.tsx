'use client';

// ==========================================
// ADMIN SUBSCRIPTIONS PAGE
// File: src/app/(admin)/admin/subscriptions/page.tsx
// ==========================================

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useAdminSubscriptions, useExtendSubscription } from '@/hooks/admin';
import type { AdminSubscription } from '@/types/admin';

// ==========================================
// EXTEND DIALOG
// ==========================================

interface ExtendDialogProps {
  subscription: AdminSubscription | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function ExtendDialog({ subscription, open, onClose, onSuccess }: ExtendDialogProps) {
  const [days, setDays] = useState('30');
  const [reason, setReason] = useState('');
  const { extend, isLoading } = useExtendSubscription();

  const handleExtend = async () => {
    if (!subscription || !reason.trim()) return;
    await extend(subscription.id, Number(days), reason);
    setDays('30');
    setReason('');
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Extend Subscription</DialogTitle>
        </DialogHeader>

        {subscription && (
          <div className="space-y-4 py-2">
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <p className="font-medium">{subscription.tenant.name}</p>
              <p className="text-muted-foreground">{subscription.plan} · {subscription.status}</p>
              {subscription.currentPeriodEnd && (
                <p className="text-xs text-muted-foreground mt-1">
                  Aktif sampai: {new Date(subscription.currentPeriodEnd).toLocaleDateString('id-ID')}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="days">Extend berapa hari?</Label>
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger id="days">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 hari</SelectItem>
                  <SelectItem value="14">14 hari</SelectItem>
                  <SelectItem value="30">30 hari</SelectItem>
                  <SelectItem value="90">90 hari</SelectItem>
                  <SelectItem value="180">180 hari</SelectItem>
                  <SelectItem value="365">365 hari</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason">
                Alasan <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Contoh: Kompensasi downtime, bonus loyalitas..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            onClick={handleExtend}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Extending...</>
            ) : (
              'Extend'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// PAGE
// ==========================================

export default function AdminSubscriptionsPage() {
  const [status, setStatus] = useState('');
  const [plan, setPlan] = useState('');
  const [page, setPage] = useState(1);
  const [extendTarget, setExtendTarget] = useState<AdminSubscription | null>(null);

  const { result, isLoading, refetch } = useAdminSubscriptions({
    page,
    limit: 20,
    status: status || undefined,
    plan: plan || undefined,
  });

  const totalPages = result ? Math.ceil(result.total / 20) : 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">
          {result ? `${result.total} subscription` : 'Memuat...'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={status || 'ALL'} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={plan || 'ALL'} onValueChange={(v) => { setPlan(v === 'ALL' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua plan</SelectItem>
            <SelectItem value="STARTER">Starter</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aktif Sampai</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : result?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              result?.data.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sub.tenant.name}</div>
                      <div className="text-xs text-muted-foreground">{sub.tenant.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{sub.plan}</span>
                      {sub.isTrial && (
                        <Badge variant="secondary" className="text-xs">trial</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={sub.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {sub.currentPeriodEnd
                      ? new Date(sub.currentPeriodEnd).toLocaleDateString('id-ID')
                      : '—'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {sub.priceAmount === 0
                      ? 'Gratis'
                      : `Rp ${sub.priceAmount.toLocaleString('id-ID')}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExtendTarget(sub)}
                        className="h-8 text-xs"
                      >
                        <PlusCircle className="mr-1 h-3 w-3" />
                        Extend
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/tenants/${sub.tenant.id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Extend Dialog */}
      <ExtendDialog
        subscription={extendTarget}
        open={!!extendTarget}
        onClose={() => setExtendTarget(null)}
        onSuccess={refetch}
      />
    </div>
  );
}
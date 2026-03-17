'use client';

// ==========================================
// ADMIN TENANT DETAIL PAGE
// File: src/app/(admin)/admin/tenants/[id]/page.tsx
//
// ✅ UPDATED: Tambah OverrideSubscriptionDialog
// Admin bisa edit plan, status, period end, reset cancellation
// ==========================================

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  ShieldOff,
  ShieldCheck,
  Loader2,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminTenantDetail, useSuspendTenant } from '@/hooks/admin';
import { adminApi } from '@/lib/api/admin';
import { toast } from '@/providers';
import { getErrorMessage } from '@/lib/api';

// ==========================================
// INFO ROW
// ==========================================

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? '—'}</span>
    </div>
  );
}

// ==========================================
// OVERRIDE SUBSCRIPTION DIALOG
// ==========================================

interface OverrideSubDialogProps {
  subscription: NonNullable<ReturnType<typeof useAdminTenantDetail>['tenant']>['subscription'];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function OverrideSubscriptionDialog({
  subscription,
  open,
  onClose,
  onSuccess,
}: OverrideSubDialogProps) {
  const [plan, setPlan] = useState(subscription?.plan ?? 'STARTER');
  const [status, setStatus] = useState(subscription?.status ?? 'ACTIVE');
  const [periodEnd, setPeriodEnd] = useState(
    subscription?.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd).toISOString().split('T')[0]
      : '',
  );
  const [resetCancellation, setResetCancellation] = useState(false);
  const [isTrial, setIsTrial] = useState(subscription?.isTrial ?? false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!subscription?.id || !reason.trim()) return;

    setIsLoading(true);
    try {
      await adminApi.overrideSubscription(subscription.id, {
        plan,
        status,
        currentPeriodEnd: periodEnd || undefined,
        resetCancellation,
        isTrial,
        reason,
      });
      toast.success('Subscription diupdate');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Gagal update subscription', getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setResetCancellation(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Override Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Current state info */}
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground space-y-1">
            <p>Current: <strong>{subscription?.plan}</strong> · <strong>{subscription?.status}</strong></p>
            {subscription?.currentPeriodEnd && (
              <p>Aktif sampai: {new Date(subscription.currentPeriodEnd).toLocaleDateString('id-ID')}</p>
            )}
            {subscription?.cancelledAt && (
              <p>Dibatalkan: {new Date(subscription.cancelledAt).toLocaleDateString('id-ID')}</p>
            )}
          </div>

          {/* Plan */}
          <div className="space-y-1.5">
            <Label>Plan</Label>
            <Select value={plan} onValueChange={(v) => setPlan(v as 'STARTER' | 'BUSINESS')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STARTER">STARTER</SelectItem>
                <SelectItem value="BUSINESS">BUSINESS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                <SelectItem value="PAST_DUE">PAST_DUE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Period End */}
          <div className="space-y-1.5">
            <Label htmlFor="period-end">
              Aktif Sampai <span className="text-muted-foreground">(opsional)</span>
            </Label>
            <Input
              id="period-end"
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>

          {/* isTrial */}
          <div className="flex items-center justify-between rounded-md border px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Trial</p>
              <p className="text-xs text-muted-foreground">
                Aktifkan/nonaktifkan flag trial
              </p>
            </div>
            <Switch
              checked={isTrial}
              onCheckedChange={setIsTrial}
            />
          </div>

          {/* Reset Cancellation */}
          {subscription?.cancelledAt && (
            <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Reset Cancellation</p>
                <p className="text-xs text-muted-foreground">
                  Clear cancelledAt + cancelReason
                </p>
              </div>
              <Switch
                checked={resetCancellation}
                onCheckedChange={setResetCancellation}
              />
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="reason">
              Alasan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Contoh: Manual activation for testing, customer request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : (
              'Simpan'
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

export default function AdminTenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { tenant, isLoading, refetch } = useAdminTenantDetail(id);
  const { suspend, unsuspend, isLoading: isActing } = useSuspendTenant();

  const [suspendReason, setSuspendReason] = useState('');
  const [overrideSubOpen, setOverrideSubOpen] = useState(false);

  const handleSuspend = async () => {
    if (!suspendReason.trim()) return;
    await suspend(id, suspendReason);
    setSuspendReason('');
    refetch();
  };

  const handleUnsuspend = async () => {
    await unsuspend(id);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Tenant tidak ditemukan
      </div>
    );
  }

  const isSuspended = tenant.status === 'SUSPENDED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            <Badge variant={isSuspended ? 'destructive' : 'default'}>
              {tenant.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{tenant.slug}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/store/${tenant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat Toko
            </a>
          </Button>

          {isSuspended ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isActing}>
                  {isActing
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    : <ShieldCheck className="mr-2 h-4 w-4" />
                  }
                  Unsuspend
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unsuspend Tenant?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tenant <strong>{tenant.name}</strong> akan diaktifkan kembali.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUnsuspend}>
                    Ya, Aktifkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isActing}>
                  {isActing
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    : <ShieldOff className="mr-2 h-4 w-4" />
                  }
                  Suspend
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Suspend Tenant?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tenant <strong>{tenant.name}</strong> tidak bisa login setelah di-suspend.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="px-6 pb-2">
                  <Label htmlFor="reason" className="text-sm">
                    Alasan suspend <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Tuliskan alasan suspend..."
                    className="mt-1.5"
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSuspendReason('')}>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSuspend}
                    disabled={!suspendReason.trim()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Ya, Suspend
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Tenant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Toko</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow label="Email" value={tenant.email} />
            <InfoRow label="Kategori" value={tenant.category} />
            <InfoRow label="WhatsApp" value={tenant.whatsapp} />
            <InfoRow label="Telepon" value={tenant.phone} />
            <InfoRow label="Total Produk" value={tenant._count.products} />
            <InfoRow
              label="Custom Domain"
              value={
                tenant.customDomain
                  ? `${tenant.customDomain} (${tenant.customDomainVerified ? '✓ verified' : 'pending'})`
                  : undefined
              }
            />
            <InfoRow
              label="Bergabung"
              value={new Date(tenant.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />
            <InfoRow
              label="Diupdate"
              value={new Date(tenant.updatedAt).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Subscription</CardTitle>
              {/* ✅ Edit button — hanya tampil kalau ada subscription */}
              {tenant.subscription && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOverrideSubOpen(true)}
                >
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {tenant.subscription ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Plan" value={tenant.subscription.plan} />
                  <InfoRow label="Status" value={tenant.subscription.status} />
                  <InfoRow
                    label="Trial"
                    value={tenant.subscription.isTrial ? 'Ya' : 'Tidak'}
                  />
                  <InfoRow
                    label="Aktif Sampai"
                    value={
                      tenant.subscription.currentPeriodEnd
                        ? new Date(tenant.subscription.currentPeriodEnd).toLocaleDateString('id-ID')
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Harga"
                    value={
                      tenant.subscription.priceAmount === 0
                        ? 'Gratis'
                        : `Rp ${tenant.subscription.priceAmount.toLocaleString('id-ID')}`
                    }
                  />
                  <InfoRow
                    label="Dibatalkan"
                    value={
                      tenant.subscription.cancelledAt
                        ? new Date(tenant.subscription.cancelledAt).toLocaleDateString('id-ID')
                        : undefined
                    }
                  />
                </div>

                {/* Payment History */}
                {tenant.subscription.payments?.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Riwayat Pembayaran
                      </p>
                      <div className="space-y-2">
                        {tenant.subscription.payments.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {new Date(p.createdAt).toLocaleDateString('id-ID')}
                            </span>
                            <span>Rp {p.amount.toLocaleString('id-ID')}</span>
                            <Badge
                              variant={
                                p.paymentStatus === 'paid' || p.paymentStatus === 'settled'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {p.paymentStatus}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada subscription
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Override Subscription Dialog */}
      {tenant.subscription && (
        <OverrideSubscriptionDialog
          subscription={tenant.subscription}
          open={overrideSubOpen}
          onClose={() => setOverrideSubOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
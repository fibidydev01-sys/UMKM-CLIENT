'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Rocket,
  Crown,
  Check,
  Loader2,
  ShieldCheck,
  Calendar,
  Receipt,
  AlertTriangle,
  Info,
  Sparkles,
  Clock,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  subscriptionApi,
  type SubscriptionInfo,
  type PaymentHistory,
} from '@/lib/api/subscription';
import { useSnapPayment } from '@/hooks/use-snap-payment';

const PLAN_FEATURES = [
  { feature: 'Produk/Layanan', starter: 'Max 50', business: 'Unlimited' },
  { feature: 'Pelanggan/Klien', starter: 'Max 200', business: 'Unlimited' },
  { feature: 'Landing Page', starter: 'Subdomain gratis', business: 'Subdomain gratis' },
  { feature: 'Component Blocks', starter: '10 variants', business: '50+ variants + update' },
  { feature: 'WhatsApp Integration', starter: 'Connect + Auto-reply', business: 'Connect + Auto-reply' },
] as const;

const PAYMENT_STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  settlement: { label: 'Lunas', variant: 'default' },
  capture: { label: 'Lunas', variant: 'default' },
  pending: { label: 'Menunggu', variant: 'outline' },
  expire: { label: 'Kedaluwarsa', variant: 'secondary' },
  cancel: { label: 'Dibatalkan', variant: 'secondary' },
  deny: { label: 'Ditolak', variant: 'destructive' },
  failure: { label: 'Gagal', variant: 'destructive' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getDaysRemaining(dateStr: string): number {
  const end = new Date(dateStr);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const [planInfo, setPlanInfo] = useState<SubscriptionInfo | null>(null);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
  const { isLoaded, pay } = useSnapPayment({ clientKey, isProduction });

  const refreshData = async () => {
    const [plan, history] = await Promise.all([
      subscriptionApi.getMyPlan(),
      subscriptionApi.getPaymentHistory(),
    ]);
    setPlanInfo(plan);
    setPayments(history);
  };

  // Fetch data
  useEffect(() => {
    refreshData().catch(console.error).finally(() => setLoading(false));
  }, []);

  // Handle redirect dari Midtrans
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'finish') {
      toast.success('Pembayaran berhasil! Plan Business aktif.');
      refreshData();
    } else if (paymentStatus === 'unfinish') {
      toast.info('Pembayaran belum selesai. Silakan coba lagi kapan saja.');
    } else if (paymentStatus === 'error') {
      toast.error('Pembayaran gagal. Silakan coba lagi.');
    }
  }, [searchParams]);

  // Handle upgrade / retry payment
  const handleUpgrade = async () => {
    if (!isLoaded) {
      toast.error('Sistem pembayaran sedang dimuat, tunggu sebentar...');
      return;
    }

    setUpgrading(true);
    try {
      const response = await subscriptionApi.createUpgradePayment();

      pay(response.token, {
        onSuccess: () => {
          toast.success('Pembayaran berhasil! Plan Business aktif.');
          refreshData();
          setUpgrading(false);
        },
        onPending: () => {
          toast.info('Selesaikan pembayaran sesuai instruksi yang diberikan.');
          refreshData();
          setUpgrading(false);
        },
        onError: () => {
          toast.error('Pembayaran gagal. Silakan coba lagi.');
          setUpgrading(false);
        },
        onClose: () => {
          setUpgrading(false);
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Gagal memproses pembayaran');
      setUpgrading(false);
    }
  };

  // Handle cancel subscription
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await subscriptionApi.cancelSubscription();
      toast.success('Langganan dibatalkan. Akses Business tetap aktif sampai akhir periode.');
      refreshData();
    } catch (error: any) {
      toast.error(error.message || 'Gagal membatalkan langganan');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const plan = planInfo?.subscription.plan;
  const status = planInfo?.subscription.status;
  const isStarter = plan === 'STARTER';
  const isBusiness = plan === 'BUSINESS';
  const isActive = status === 'ACTIVE';
  const isCancelled = status === 'CANCELLED';
  const isExpired = status === 'EXPIRED';
  const isTrial = planInfo?.subscription.isTrial ?? false;
  const trialEndsAt = planInfo?.subscription.trialEndsAt;
  const periodEnd = planInfo?.subscription.currentPeriodEnd;
  const daysRemaining = trialEndsAt ? getDaysRemaining(trialEndsAt) : periodEnd ? getDaysRemaining(periodEnd) : null;
  const showUpgrade = isStarter || isExpired || (isBusiness && isTrial);
  const showCancel = isBusiness && isActive && !isTrial && !planInfo?.subscription.cancelledAt;
  const overLimitProducts = planInfo?.isOverLimit?.products ?? false;
  const overLimitCustomers = planInfo?.isOverLimit?.customers ?? false;
  const hasOverLimit = overLimitProducts || overLimitCustomers;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Langganan</h1>
        <p className="text-muted-foreground">Kelola plan dan pembayaran Anda</p>
      </div>

      {/* Trial Banner */}
      {isTrial && isBusiness && isActive && trialEndsAt && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  Trial Business Gratis - {daysRemaining} hari tersisa
                </p>
                <p className="text-sm text-muted-foreground">
                  Nikmati semua fitur Business sampai <strong>{formatDate(trialEndsAt)}</strong>.
                  Setelah trial berakhir, akun akan otomatis beralih ke plan Starter.
                </p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={handleUpgrade}
                  disabled={upgrading}
                >
                  {upgrading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  <Crown className="mr-2 h-3 w-3" />
                  Upgrade ke Business - Rp 100.000/bulan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancellation Notice */}
      {isBusiness && isCancelled && periodEnd && (
        <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Langganan dibatalkan</p>
                <p className="text-sm text-muted-foreground">
                  Akses Business Anda tetap aktif sampai <strong>{formatDate(periodEnd)}</strong>.
                  Setelah itu, akun akan kembali ke plan Starter.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleUpgrade}
                  disabled={upgrading}
                >
                  {upgrading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  Perpanjang Langganan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Over-Limit Banner (grandfathered data) */}
      {isStarter && hasOverLimit && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Data melebihi batas plan Starter</p>
                <p className="text-sm text-muted-foreground">
                  {overLimitProducts && overLimitCustomers
                    ? `Anda memiliki ${planInfo?.usage.products} produk (limit ${planInfo?.limits.maxProducts}) dan ${planInfo?.usage.customers} pelanggan (limit ${planInfo?.limits.maxCustomers}).`
                    : overLimitProducts
                      ? `Anda memiliki ${planInfo?.usage.products} produk (limit ${planInfo?.limits.maxProducts}).`
                      : `Anda memiliki ${planInfo?.usage.customers} pelanggan (limit ${planInfo?.limits.maxCustomers}).`}
                  {' '}Data yang sudah ada tetap aman, tapi Anda tidak bisa menambah baru.
                  Upgrade untuk membuka limit.
                </p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={handleUpgrade}
                  disabled={upgrading}
                >
                  {upgrading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  <Crown className="mr-2 h-3 w-3" />
                  Upgrade ke Business - Rp 100.000/bulan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isStarter ? (
                <Rocket className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Crown className="h-6 w-6 text-primary" />
              )}
              <div>
                <CardTitle>
                  Plan {plan}
                  {isTrial && ' (Trial)'}
                </CardTitle>
                <CardDescription>
                  {isStarter
                    ? 'Gratis selamanya'
                    : isTrial
                      ? 'Trial gratis 30 hari'
                      : `Rp ${planInfo?.subscription.priceAmount.toLocaleString('id-ID')}/bulan`}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={
                isTrial ? 'outline' :
                isBusiness && isActive ? 'default' :
                isCancelled ? 'outline' :
                'secondary'
              }
            >
              {isTrial && isActive && 'Trial'}
              {isTrial && isCancelled && 'Trial (Dibatalkan)'}
              {!isTrial && isActive && 'Aktif'}
              {!isTrial && isCancelled && 'Dibatalkan'}
              {isExpired && 'Kedaluwarsa'}
              {!isActive && !isCancelled && !isExpired && !isTrial && status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Produk</p>
              <p className="text-lg font-bold">
                {planInfo?.usage.products}
                <span className="text-sm font-normal text-muted-foreground">
                  {' / '}
                  {planInfo?.limits.maxProducts === Infinity
                    ? 'Unlimited'
                    : planInfo?.limits.maxProducts}
                </span>
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Pelanggan</p>
              <p className="text-lg font-bold">
                {planInfo?.usage.customers}
                <span className="text-sm font-normal text-muted-foreground">
                  {' / '}
                  {planInfo?.limits.maxCustomers === Infinity
                    ? 'Unlimited'
                    : planInfo?.limits.maxCustomers}
                </span>
              </p>
            </div>
          </div>

          {/* Period / Trial countdown */}
          {isBusiness && (trialEndsAt || periodEnd) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isTrial ? <Clock className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
              <span>
                {isTrial
                  ? `Trial berakhir: ${formatDate(trialEndsAt!)} (${daysRemaining} hari lagi)`
                  : isCancelled
                    ? `Akses aktif sampai: ${formatDate(periodEnd!)}`
                    : `Berlaku sampai: ${formatDate(periodEnd!)}`}
              </span>
            </div>
          )}

          {/* Upgrade Button */}
          {showUpgrade && (
            <Button onClick={handleUpgrade} disabled={upgrading} className="w-full" size="lg">
              {upgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Crown className="mr-2 h-4 w-4" />
              {isTrial
                ? 'Lanjutkan Business'
                : isExpired
                  ? 'Aktifkan Kembali Business'
                  : 'Upgrade ke Business'}{' '}
              - Rp 100.000/bulan
            </Button>
          )}

          {/* Cancel Button */}
          {showCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                  Batalkan langganan
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Batalkan Langganan Business?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <span className="block">
                      Akses Business Anda tetap aktif sampai akhir periode ({periodEnd ? formatDate(periodEnd) : '-'}).
                      Setelah itu, akun akan kembali ke plan Starter.
                    </span>
                    <span className="block flex items-start gap-2 rounded-md border p-3 text-foreground">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="text-xs">
                        Tidak ada pengembalian dana untuk periode yang sedang berjalan.
                        Anda bisa menggunakan semua fitur Business sampai periode berakhir.
                      </span>
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Tetap Berlangganan</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ya, Batalkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      {showUpgrade && (
        <Card>
          <CardHeader>
            <CardTitle>Kenapa Upgrade?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 pb-3 border-b font-medium text-sm">
                <span>Fitur</span>
                <span className="text-center text-muted-foreground">Starter</span>
                <span className="text-center text-primary">Business</span>
              </div>

              {PLAN_FEATURES.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-3 gap-4 py-3 border-b last:border-0 text-sm"
                >
                  <span>{row.feature}</span>
                  <div className="flex justify-center">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )
                    ) : (
                      <span className="text-muted-foreground">{row.starter}</span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {typeof row.business === 'boolean' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="font-medium text-primary">{row.business}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods + Policy */}
      {showUpgrade && (
        <div className="space-y-2 text-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>
              Bank Transfer, GoPay, ShopeePay, QRIS, Kartu Kredit - diproses aman oleh Midtrans
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Bisa dibatalkan kapan saja. Tidak ada pengembalian dana untuk periode berjalan.
          </p>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Riwayat Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => {
                const statusInfo = PAYMENT_STATUS_LABELS[payment.paymentStatus] || {
                  label: payment.paymentStatus,
                  variant: 'secondary' as const,
                };
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Business Plan -{' '}
                        {new Date(payment.periodStart).toLocaleDateString('id-ID', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                        {payment.paymentType && ` - ${payment.paymentType}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Rp {payment.amount.toLocaleString('id-ID')}
                      </p>
                      <Badge variant={statusInfo.variant} className="text-xs">
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

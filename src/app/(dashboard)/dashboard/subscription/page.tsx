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

const PLAN_FEATURES: Array<{
  feature: string;
  starter: string | boolean;
  business: string | boolean;
}> = [
    { feature: 'Products', starter: 'Max 50', business: 'Unlimited' },
    { feature: 'Customers', starter: 'Max 200', business: 'Unlimited' },
    { feature: 'Landing Page', starter: 'Free subdomain', business: 'Free subdomain' },
    { feature: 'Component Blocks', starter: '10 variants', business: '50+ variants + updates' },
    { feature: 'WhatsApp Integration', starter: 'Connect + Auto-reply', business: 'Connect + Auto-reply' },
  ];

const PAYMENT_STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  settlement: { label: 'Paid', variant: 'default' },
  capture: { label: 'Paid', variant: 'default' },
  pending: { label: 'Pending', variant: 'outline' },
  expire: { label: 'Expired', variant: 'secondary' },
  cancel: { label: 'Cancelled', variant: 'secondary' },
  deny: { label: 'Declined', variant: 'destructive' },
  failure: { label: 'Failed', variant: 'destructive' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
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

  useEffect(() => {
    refreshData().catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'finish') {
      toast.success('Payment successful! Business plan is now active.');
      refreshData();
    } else if (paymentStatus === 'unfinish') {
      toast.info('Payment incomplete. You can try again anytime.');
    } else if (paymentStatus === 'error') {
      toast.error('Payment failed. Please try again.');
    }
  }, [searchParams]);

  const handleUpgrade = async () => {
    if (!isLoaded) {
      toast.error('Payment system is loading, please wait a moment...');
      return;
    }

    setUpgrading(true);
    try {
      const response = await subscriptionApi.createUpgradePayment();

      pay(response.token, {
        onSuccess: () => {
          toast.success('Payment successful! Business plan is now active.');
          refreshData();
          setUpgrading(false);
        },
        onPending: () => {
          toast.info('Complete your payment using the instructions provided.');
          refreshData();
          setUpgrading(false);
        },
        onError: () => {
          toast.error('Payment failed. Please try again.');
          setUpgrading(false);
        },
        onClose: () => {
          setUpgrading(false);
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment';
      toast.error(errorMessage);
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await subscriptionApi.cancelSubscription();
      toast.success('Subscription cancelled. Business access remains active until the end of your billing period.');
      refreshData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel subscription';
      toast.error(errorMessage);
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
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and billing</p>
      </div>

      {/* Trial Banner */}
      {isTrial && isBusiness && isActive && trialEndsAt && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  Free Business Trial — {daysRemaining} days remaining
                </p>
                <p className="text-sm text-muted-foreground">
                  Enjoy all Business features until <strong>{formatDate(trialEndsAt)}</strong>.
                  After your trial ends, your account will automatically revert to the Starter plan.
                </p>
                <Button size="sm" className="mt-2" onClick={handleUpgrade} disabled={upgrading}>
                  {upgrading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  <Crown className="mr-2 h-3 w-3" />
                  Upgrade to Business — Rp 100,000/mo
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
                <p className="font-medium text-sm">Subscription cancelled</p>
                <p className="text-sm text-muted-foreground">
                  Your Business access remains active until <strong>{formatDate(periodEnd)}</strong>.
                  After that, your account will revert to the Starter plan.
                </p>
                <Button variant="outline" size="sm" className="mt-2" onClick={handleUpgrade} disabled={upgrading}>
                  {upgrading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  Renew subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Over-Limit Banner */}
      {isStarter && hasOverLimit && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">You&apos;ve exceeded your Starter plan limits</p>
                <p className="text-sm text-muted-foreground">
                  {overLimitProducts && overLimitCustomers
                    ? `You have ${planInfo?.usage.products} products (limit ${planInfo?.limits.maxProducts}) and ${planInfo?.usage.customers} customers (limit ${planInfo?.limits.maxCustomers}).`
                    : overLimitProducts
                      ? `You have ${planInfo?.usage.products} products (limit ${planInfo?.limits.maxProducts}).`
                      : `You have ${planInfo?.usage.customers} customers (limit ${planInfo?.limits.maxCustomers}).`}
                  {' '}Your existing data is safe, but you can&apos;t add new entries.
                  Upgrade to unlock your limits.
                </p>
                <Button size="sm" className="mt-2" onClick={handleUpgrade} disabled={upgrading}>
                  {upgrading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  <Crown className="mr-2 h-3 w-3" />
                  Upgrade to Business — Rp 100,000/mo
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
                  {plan} Plan
                  {isTrial && ' (Trial)'}
                </CardTitle>
                <CardDescription>
                  {isStarter
                    ? 'Free forever'
                    : isTrial
                      ? '30-day free trial'
                      : `Rp ${planInfo?.subscription.priceAmount.toLocaleString('id-ID')}/mo`}
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
              {isTrial && isCancelled && 'Trial (Cancelled)'}
              {!isTrial && isActive && 'Active'}
              {!isTrial && isCancelled && 'Cancelled'}
              {isExpired && 'Expired'}
              {!isActive && !isCancelled && !isExpired && !isTrial && status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Products</p>
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
              <p className="text-sm text-muted-foreground">Customers</p>
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
                  ? `Trial ends: ${formatDate(trialEndsAt!)} (${daysRemaining} days left)`
                  : isCancelled
                    ? `Access active until: ${formatDate(periodEnd!)}`
                    : `Renews: ${formatDate(periodEnd!)}`}
              </span>
            </div>
          )}

          {/* Upgrade Button */}
          {showUpgrade && (
            <Button onClick={handleUpgrade} disabled={upgrading} className="w-full" size="lg">
              {upgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Crown className="mr-2 h-4 w-4" />
              {isTrial
                ? 'Continue with Business'
                : isExpired
                  ? 'Reactivate Business'
                  : 'Upgrade to Business'}{' '}
              — Rp 100,000/mo
            </Button>
          )}

          {/* Cancel Button */}
          {showCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                  Cancel subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Business subscription?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <span className="block">
                      Your Business access remains active until the end of your billing period ({periodEnd ? formatDate(periodEnd) : '-'}).
                      After that, your account will revert to the Starter plan.
                    </span>
                    <span className="block flex items-start gap-2 rounded-md border p-3 text-foreground">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="text-xs">
                        No refunds are issued for the current billing period.
                        You can continue using all Business features until it ends.
                      </span>
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Yes, cancel
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
            <CardTitle>Why upgrade?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="grid grid-cols-3 gap-4 pb-3 border-b font-medium text-sm">
                <span>Feature</span>
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
              Bank Transfer, GoPay, ShopeePay, QRIS, Credit Card — securely processed by Midtrans
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Cancel anytime. No refunds for the current billing period.
          </p>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment history
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
                        Business Plan —{' '}
                        {new Date(payment.periodStart).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString('en-US')}
                        {payment.paymentType && ` — ${payment.paymentType}`}
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
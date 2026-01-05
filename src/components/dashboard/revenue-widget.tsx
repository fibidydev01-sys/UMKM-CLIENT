import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';

// ==========================================
// REVENUE WIDGET WITH PROGRESS BAR
// ==========================================

interface RevenueWidgetProps {
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  trend: number;
}

export function RevenueWidget({
  thisWeek,
  thisMonth,
  lastMonth,
  trend,
}: RevenueWidgetProps) {
  const weekPercentage =
    thisMonth > 0 ? Math.min((thisWeek / thisMonth) * 100, 100) : 0;
  const monthPercentage =
    lastMonth > 0 ? Math.min((thisMonth / lastMonth) * 100, 200) : 100;
  const targetMet = thisMonth >= lastMonth;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Pendapatan
          </CardTitle>
          {trend !== 0 && (
            <span
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                trend > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              )}
            >
              {trend > 0 ? '+' : ''}
              {trend}% dari bulan lalu
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* This Week */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Minggu ini</span>
            <span className="font-semibold">{formatPrice(thisWeek)}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${weekPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {weekPercentage.toFixed(0)}% dari pendapatan bulan ini
          </p>
        </div>

        {/* This Month */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Bulan ini</span>
            <span className="font-semibold">{formatPrice(thisMonth)}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                targetMet ? 'bg-green-500' : 'bg-amber-500'
              )}
              style={{ width: `${Math.min(monthPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">
              vs bulan lalu: {formatPrice(lastMonth)}
            </p>
            {targetMet && (
              <span className="flex items-center text-xs text-green-600 font-medium">
                <Target className="h-3 w-3 mr-1" />
                Target tercapai!
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

// ==========================================
// STATS CARD WITH TREND
// ==========================================

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  href?: string;
  trend?: number;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  href,
  trend,
}: StatsCardProps) {
  const content = (
    <Card
      className={cn(
        'relative overflow-hidden',
        href && 'hover:bg-muted/50 transition-colors cursor-pointer'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend !== undefined && <TrendBadge value={trend} />}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// ==========================================
// TREND BADGE
// ==========================================

function TrendBadge({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="flex items-center text-xs text-muted-foreground">
        <Minus className="h-3 w-3 mr-1" />
        0%
      </span>
    );
  }

  const isPositive = value > 0;

  return (
    <span
      className={cn(
        'flex items-center text-xs font-medium',
        isPositive ? 'text-green-600' : 'text-red-600'
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {isPositive ? '+' : ''}
      {value}%
    </span>
  );
}
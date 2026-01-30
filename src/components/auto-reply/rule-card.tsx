'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, MessageSquare, Clock, Zap, Edit, Trash2, Activity } from 'lucide-react';
import { cn, formatNumber, formatRelativeTime } from '@/lib/utils';
import type { AutoReplyRule, TriggerType } from '@/types/chat';
import Link from 'next/link';

// ==========================================
// RULE CARD COMPONENT
// ==========================================

interface RuleCardProps {
  rule: AutoReplyRule;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RuleCard({ rule, onToggle, onDelete }: RuleCardProps) {
  return (
    <Card className={cn(!rule.isActive && 'opacity-60')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TriggerIcon type={rule.triggerType} />
              <CardTitle className="text-base truncate">{rule.name}</CardTitle>
            </div>
            <CardDescription className="line-clamp-1">
              {rule.description || getTriggerDescription(rule)}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <Switch checked={rule.isActive} onCheckedChange={() => onToggle(rule.id)} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/auto-reply/${rule.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete(rule.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Trigger Info */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <TriggerBadge type={rule.triggerType} />
          {rule.triggerType === 'KEYWORD' && rule.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {rule.keywords.slice(0, 3).map((keyword, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {rule.keywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{rule.keywords.length - 3} lagi
                </Badge>
              )}
            </div>
          )}
          <Badge variant="outline" className="text-xs">
            Prioritas: {rule.priority}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Delay: {rule.delaySeconds}s
          </Badge>
        </div>

        {/* Response Preview */}
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 mb-3">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
            {rule.responseMessage}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" />
            <span>{formatNumber(rule.totalTriggered)} kali dipicu</span>
          </div>
          {rule.lastTriggeredAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Terakhir: {formatRelativeTime(rule.lastTriggeredAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==========================================
// TRIGGER ICON
// ==========================================

interface TriggerIconProps {
  type: TriggerType;
}

function TriggerIcon({ type }: TriggerIconProps) {
  switch (type) {
    case 'WELCOME':
      return <MessageSquare className="h-4 w-4 text-emerald-500" />;
    case 'KEYWORD':
      return <Zap className="h-4 w-4 text-blue-500" />;
    case 'TIME_BASED':
      return <Clock className="h-4 w-4 text-orange-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-zinc-500" />;
  }
}

// ==========================================
// TRIGGER BADGE
// ==========================================

interface TriggerBadgeProps {
  type: TriggerType;
}

function TriggerBadge({ type }: TriggerBadgeProps) {
  const config = {
    WELCOME: {
      label: 'Pesan Pertama',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    KEYWORD: {
      label: 'Kata Kunci',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    TIME_BASED: {
      label: 'Luar Jam Kerja',
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
  };

  const { label, className } = config[type] || config.KEYWORD;

  return (
    <Badge variant="secondary" className={cn('text-xs', className)}>
      {label}
    </Badge>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getTriggerDescription(rule: AutoReplyRule): string {
  switch (rule.triggerType) {
    case 'WELCOME':
      return 'Membalas otomatis ketika pelanggan pertama kali menghubungi';
    case 'KEYWORD':
      return `Membalas ketika pesan mengandung: ${rule.keywords.slice(0, 3).join(', ')}${rule.keywords.length > 3 ? '...' : ''}`;
    case 'TIME_BASED':
      if (rule.workingHours) {
        return `Membalas di luar jam ${rule.workingHours.start} - ${rule.workingHours.end}`;
      }
      return 'Membalas di luar jam kerja';
    default:
      return 'Aturan auto-reply';
  }
}

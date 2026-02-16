'use client';

import { Badge } from '@/components/ui/badge';
import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { DnsRecordStatus } from '@/types';

interface DnsStatusBadgeProps {
  status: DnsRecordStatus;
}

export function DnsStatusBadge({ status }: DnsStatusBadgeProps) {
  const variants = {
    pending: {
      variant: 'secondary' as const,
      icon: Clock,
      label: 'Menunggu',
      className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
    checking: {
      variant: 'secondary' as const,
      icon: Loader2,
      label: 'Memeriksa...',
      className: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    verified: {
      variant: 'default' as const,
      icon: CheckCircle2,
      label: 'Terverifikasi',
      className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    },
    failed: {
      variant: 'destructive' as const,
      icon: XCircle,
      label: 'Gagal',
      className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className={`h-3 w-3 mr-1 ${status === 'checking' ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  );
}
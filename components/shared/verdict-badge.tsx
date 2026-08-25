'use client';

import { cn } from '@/lib/utils';
import type { AuditVerdict } from '@/lib/types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const verdictConfig: Record<AuditVerdict, { bg: string; text: string; border: string; Icon: React.ComponentType<{ className?: string }> }> = {
  VERIFIED: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', Icon: CheckCircle2 },
  REJECTED: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', Icon: XCircle },
  NEEDS_REVIEW: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', Icon: AlertTriangle },
};

export function VerdictBadge({ verdict, size = 'default' }: { verdict: AuditVerdict; size?: 'default' | 'lg' }) {
  const config = verdictConfig[verdict];
  const { Icon } = config;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border rounded-lg font-bold uppercase tracking-wider',
        config.bg,
        config.text,
        config.border,
        size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1 text-xs'
      )}
    >
      <Icon className={cn(size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      {verdict}
    </span>
  );
}

'use client';

import { cn } from '@/lib/utils';
import type { SeverityLevel } from '@/lib/types';

const severityConfig: Record<SeverityLevel, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Critical' },
  high: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'High' },
  medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Medium' },
  low: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Low' },
};

export function SeverityBadge({ severity, className }: { severity: SeverityLevel; className?: string }) {
  const config = severityConfig[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide',
        config.bg,
        config.text,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          severity === 'critical' ? 'bg-red-400 animate-pulse' : '',
          severity === 'high' ? 'bg-orange-400' : '',
          severity === 'medium' ? 'bg-amber-400' : '',
          severity === 'low' ? 'bg-emerald-400' : ''
        )}
      />
      {config.label}
    </span>
  );
}

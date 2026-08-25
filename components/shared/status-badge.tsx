'use client';

import { cn } from '@/lib/utils';
import type { GrievanceStatus, IncidentStatus } from '@/lib/types';
import { Circle, ArrowRight, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

type AnyStatus = GrievanceStatus | IncidentStatus;

const statusConfig: Record<AnyStatus, { bg: string; text: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  open: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Open', Icon: Circle },
  dispatched: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Dispatched', Icon: ArrowRight },
  resolved: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Resolved', Icon: CheckCircle2 },
  verified: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Verified', Icon: ShieldCheck },
  closed: { bg: 'bg-zinc-500/15', text: 'text-zinc-400', label: 'Closed', Icon: XCircle },
};

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  const config = statusConfig[status] || statusConfig.open;
  const { Icon } = config;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide',
        config.bg,
        config.text,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

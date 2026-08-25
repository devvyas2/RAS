'use client';

import { LiveFeed } from '@/components/dashboard/live-feed';
import { IncidentPanel } from '@/components/dashboard/incident-panel';
import { DemoControls } from '@/components/demo/demo-controls';
import { useRASStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Box,
  Train,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const { grievances, incidents, workOrders } = useRASStore();

  const openCount = grievances.filter((g) => g.status === 'open').length;
  const recurringCount = incidents.filter((i) => i.recurrence_flag).length;

  const stats = [
    {
      label: 'Total Grievances',
      value: grievances.length,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/15',
    },
    {
      label: 'Active Incidents',
      value: incidents.length,
      icon: Box,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
    },
    {
      label: 'Open Tickets',
      value: openCount,
      icon: Train,
      color: 'text-purple-400',
      bg: 'bg-purple-500/15',
    },
    {
      label: 'Recurrence Alerts',
      value: recurringCount,
      icon: AlertTriangle,
      color: recurringCount > 0 ? 'text-red-400' : 'text-zinc-400',
      bg: recurringCount > 0 ? 'bg-red-500/15' : 'bg-zinc-500/15',
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-foreground">
          Operator Dashboard
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time grievance monitoring & asset intelligence
        </p>
      </div>

      {/* Stats Row */}
      <div className="px-6 py-3 grid grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              layout
              className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/30"
            >
              <div
                className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg}`}
              >
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <motion.p
                  key={stat.value}
                  initial={{ scale: 1.3, color: '#f59e0b' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  className="text-xl font-bold text-foreground"
                >
                  {stat.value}
                </motion.p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Split Panel: Feed + Incidents */}
      <div className="flex-1 px-6 pb-6 grid grid-cols-2 gap-4 min-h-0">
        <LiveFeed />
        <IncidentPanel />
      </div>

      <DemoControls />
    </div>
  );
}

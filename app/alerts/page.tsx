'use client';

import { useRASStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { DemoControls } from '@/components/demo/demo-controls';
import { StatusBadge } from '@/components/shared/status-badge';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  AlertTriangle,
  Box,
  Train,
  Calendar,
  Eye,
  ArrowRight,
} from 'lucide-react';

export default function AlertsPage() {
  const { incidents, grievances, grievanceLinks } = useRASStore();

  const recurringIncidents = incidents.filter((i) => i.recurrence_flag);

  // Calculate stats for each recurring coach
  const coachStats = recurringIncidents.reduce(
    (acc, inc) => {
      if (!acc[inc.coach_asset_id]) {
        acc[inc.coach_asset_id] = {
          coachId: inc.coach_asset_id,
          category: inc.canonical_category,
          incidentCount: 0,
          trainNumbers: new Set<string>(),
          grievanceIds: [] as string[],
          dateRange: { start: '', end: '' },
        };
      }
      const stat = acc[inc.coach_asset_id];
      stat.incidentCount++;

      // Get linked grievances
      const linkIds = grievanceLinks
        .filter((l) => l.incident_id === inc.incident_id)
        .map((l) => l.grievance_id);
      const linkedGrvs = grievances.filter((g) =>
        linkIds.includes(g.grievance_id)
      );

      linkedGrvs.forEach((g) => {
        stat.trainNumbers.add(g.train_number);
        stat.grievanceIds.push(g.grievance_id);
        if (!stat.dateRange.start || g.travel_date < stat.dateRange.start)
          stat.dateRange.start = g.travel_date;
        if (!stat.dateRange.end || g.travel_date > stat.dateRange.end)
          stat.dateRange.end = g.travel_date;
      });

      return acc;
    },
    {} as Record<string, {
      coachId: string;
      category: string;
      incidentCount: number;
      trainNumbers: Set<string>;
      grievanceIds: string[];
      dateRange: { start: string; end: string };
    }>
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-red-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Recurrence Alerts
            </h1>
            <p className="text-xs text-muted-foreground">
              Coaches flagged with RECURRING_ASSET_FAULT
            </p>
          </div>
          {recurringIncidents.length > 0 && (
            <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 animate-pulse">
              {recurringIncidents.length} active alert{recurringIncidents.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Recurrence Rule */}
          <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-400 mb-0.5">
                  Recurrence Detection Rule
                </p>
                <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                  &quot;Same coach_asset_id and category, at least 2 incidents, across
                  at least 2 distinct train numbers, inside a rolling 14-day
                  window.&quot;
                </p>
              </div>
            </CardContent>
          </Card>

          {recurringIncidents.length === 0 ? (
            <div className="text-center py-20">
              <AlertTriangle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No recurrence alerts active
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Use Demo Controls to trigger cross-train recurrence
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.values(coachStats).map((stat, i) => (
                <motion.div
                  key={stat.coachId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-red-500/40 bg-red-500/5 shadow-lg shadow-red-500/10 overflow-hidden">
                    {/* Alert banner */}
                    <div className="bg-red-500/10 px-5 py-2.5 border-b border-red-500/20 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                        ⚠ Critical Recurrence — {stat.coachId}
                      </span>
                    </div>

                    <CardContent className="p-5">
                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
                          <p className="text-2xl font-bold text-red-400">
                            {stat.grievanceIds.length}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Failures
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
                          <p className="text-2xl font-bold text-amber-400">
                            {stat.trainNumbers.size}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Trains
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
                          <p className="text-2xl font-bold text-orange-400">
                            {stat.incidentCount}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Incidents
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
                          <p className="text-lg font-bold text-foreground">
                            {stat.category}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Category
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Box className="w-3 h-3 text-amber-400" />
                          {stat.coachId}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Train className="w-3 h-3 text-blue-400" />
                          Trains: {[...stat.trainNumbers].join(', ')}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          {stat.dateRange.start} → {stat.dateRange.end}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="mt-4 flex items-center gap-3">
                        <Link
                          href={`/asset/${stat.coachId}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-semibold hover:bg-amber-500/25 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Asset History
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          href="/compare"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-colors"
                        >
                          Legacy vs Sentinel View
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DemoControls />
    </div>
  );
}

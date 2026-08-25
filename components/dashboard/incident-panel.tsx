'use client';

import { useState } from 'react';
import { useRASStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Train,
  Box,
  Users,
  AlertTriangle,
  Wrench,
  Eye,
} from 'lucide-react';
import type { PersistentIncident } from '@/lib/types';

function IncidentCard({ incident }: { incident: PersistentIncident }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getGrievancesForIncident, getWorkOrderForIncident } = useRASStore();

  const grievances = getGrievancesForIncident(incident.incident_id);
  const workOrder = getWorkOrderForIncident(incident.incident_id);
  const trainNumbers = [...new Set(grievances.map((g) => g.train_number))];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`border overflow-hidden transition-all duration-300 ${
          incident.recurrence_flag
            ? 'border-red-500/40 bg-red-500/5 shadow-red-500/10 shadow-lg'
            : 'border-border/50 bg-card/50 hover:bg-card/80'
        }`}
      >
        <div
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start gap-3">
            <div
              className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                incident.recurrence_flag
                  ? 'bg-red-500/20'
                  : 'bg-amber-500/15'
              }`}
            >
              {incident.recurrence_flag ? (
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <Box className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-foreground">
                  {incident.incident_id}
                </span>
                <StatusBadge status={incident.status} />
                {incident.recurrence_flag && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    Recurring
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  <Box className="w-3 h-3" />
                  {incident.coach_asset_id}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Train className="w-3 h-3" />
                  {trainNumbers.join(', ')}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                  <Users className="w-3 h-3" />
                  {grievances.length} report{grievances.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] px-2 py-0.5 bg-muted/50 rounded-md text-muted-foreground font-medium">
                  {incident.canonical_category}
                </span>
                {workOrder && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-purple-400">
                    <Wrench className="w-3 h-3" />
                    {workOrder.assigned_staff}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/asset/${incident.coach_asset_id}`}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Link>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 border-t border-border/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-3 mb-2">
                  Linked Grievances
                </p>
                <div className="space-y-1.5">
                  {grievances.map((g) => (
                    <div
                      key={g.grievance_id}
                      className="p-2.5 rounded-lg bg-background/50 border border-border/20"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-semibold text-foreground">
                          {g.grievance_id}
                        </span>
                        <SeverityBadge severity={g.severity_predicted} />
                        <span className="text-[10px] text-muted-foreground">
                          Train {g.train_number} · Coach {g.coach_label_reported}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {g.raw_text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function IncidentPanel() {
  const { incidents } = useRASStore();

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (a.recurrence_flag !== b.recurrence_flag) return b.recurrence_flag ? 1 : -1;
    return new Date(b.first_seen_at).getTime() - new Date(a.first_seen_at).getTime();
  });

  return (
    <Card className="h-full flex flex-col border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Box className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-semibold text-foreground">
          Persistent Incidents
        </h2>
        <span className="ml-auto text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-full">
          {incidents.length} active
        </span>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedIncidents.map((incident) => (
              <IncidentCard key={incident.incident_id} incident={incident} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Card>
  );
}

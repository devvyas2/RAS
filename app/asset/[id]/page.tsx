'use client';

import { useParams } from 'next/navigation';
import { useRASStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { DemoControls } from '@/components/demo/demo-controls';
import { motion } from 'framer-motion';
import {
  Box,
  Train,
  Calendar,
  AlertTriangle,
  ChevronRight,
  History,
} from 'lucide-react';

export default function AssetHistoryPage() {
  const params = useParams();
  const coachId = (params.id as string) || 'COACH-001';

  const { coaches, getCoachHistory, getIncidentsForCoach, grievances, grievanceLinks } =
    useRASStore();

  const coach = coaches.find((c) => c.coach_asset_id === coachId);
  const rakeHistory = getCoachHistory(coachId);
  const incidents = getIncidentsForCoach(coachId);
  const hasRecurrence = incidents.some((i) => i.recurrence_flag);

  // Get all grievances for this coach
  const coachGrievances = grievances.filter(
    (g) => g.coach_asset_id_resolved === coachId
  );

  // Group grievances by train number
  const grievancesByTrain: Record<string, typeof coachGrievances> = {};
  coachGrievances.forEach((g) => {
    if (!grievancesByTrain[g.train_number]) grievancesByTrain[g.train_number] = [];
    grievancesByTrain[g.train_number].push(g);
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              hasRecurrence ? 'bg-red-500/20' : 'bg-amber-500/15'
            }`}
          >
            <Box
              className={`w-5 h-5 ${
                hasRecurrence ? 'text-red-400' : 'text-amber-400'
              }`}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground font-mono">
              {coachId}
            </h1>
            <p className="text-xs text-muted-foreground">
              {coach?.coach_type} • Last service:{' '}
              {coach?.last_service_date || 'N/A'}
            </p>
          </div>
          {hasRecurrence && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                Recurring Asset Fault
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Timeline */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              Rake Assignment Timeline
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border/50" />

              <div className="flex gap-0 relative">
                {rakeHistory.map((rl, i) => {
                  const hasGrievances = coachGrievances.some(
                    (g) => g.train_number === rl.train_number
                  );
                  return (
                    <motion.div
                      key={`${rl.rake_id}-${rl.train_number}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex-1 relative"
                    >
                      {/* Node */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                            hasGrievances
                              ? 'bg-red-500/20 border-red-500/50'
                              : 'bg-card border-border/50'
                          }`}
                        >
                          <Train
                            className={`w-5 h-5 ${
                              hasGrievances
                                ? 'text-red-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                          {hasGrievances && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                              {
                                coachGrievances.filter(
                                  (g) => g.train_number === rl.train_number
                                ).length
                              }
                            </span>
                          )}
                        </div>

                        <div className="mt-3 text-center">
                          <p className="text-sm font-bold text-foreground">
                            Train {rl.train_number}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            Label: {rl.coach_label_on_train}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {rl.effective_start} → {rl.effective_end}
                          </p>
                          <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                            {rl.rake_id}
                          </p>
                        </div>
                      </div>

                      {/* Connector arrow */}
                      {i < rakeHistory.length - 1 && (
                        <div className="absolute top-5 right-0 translate-x-1/2 z-20">
                          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grievances by Train */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              All Grievances — Across All Trains
            </h2>

            <div className="space-y-4">
              {Object.entries(grievancesByTrain).map(([trainNum, grvs]) => (
                <Card
                  key={trainNum}
                  className="border-border/50 bg-card/50"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Train className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-bold text-foreground">
                        Train {trainNum}
                      </span>
                      <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                        {grvs.length} grievance{grvs.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {grvs.map((g) => (
                        <div
                          key={g.grievance_id}
                          className="p-3 rounded-lg bg-background/50 border border-border/20"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-foreground">
                              {g.grievance_id}
                            </span>
                            <SeverityBadge severity={g.severity_predicted} />
                            <StatusBadge status={g.status} />
                            <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {g.travel_date}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2">
                            {g.raw_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {Object.keys(grievancesByTrain).length === 0 && (
                <div className="text-center py-12">
                  <Box className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No grievances recorded for this coach
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Insight */}
          {Object.keys(grievancesByTrain).length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-400">
                        Cross-Train Pattern Detected
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Coach <span className="font-mono text-foreground">{coachId}</span> has
                        received grievances across{' '}
                        <span className="text-foreground font-semibold">
                          {Object.keys(grievancesByTrain).length} different train numbers
                        </span>
                        . In a legacy system keyed by train number, these would appear as
                        unrelated isolated tickets. RAS links them through the physical
                        coach_asset_id.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <DemoControls />
    </div>
  );
}

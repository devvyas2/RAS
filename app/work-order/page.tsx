'use client';

import { useRASStore } from '@/lib/store';
import { DemoControls } from '@/components/demo/demo-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerdictBadge } from '@/components/shared/verdict-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Bell,
  Eye,
  FileText,
  User,
  Box,
} from 'lucide-react';

export default function WorkOrderPage() {
  const {
    workOrders,
    incidents,
    lastAuditResult,
    isAuditing,
    demoStep,
    submitResolutionPhoto,
    getGrievancesForIncident,
  } = useRASStore();

  // Show the demo work order or the first available
  const wo =
    workOrders.find((w) => w.work_order_id === 'WO-DEMO') || workOrders[0];
  const incident = wo
    ? incidents.find((i) => i.incident_id === wo.incident_id)
    : null;
  const grievances = wo
    ? getGrievancesForIncident(wo.incident_id)
    : [];

  if (!wo) {
    return (
      <div className="h-screen flex flex-col">
        <div className="px-6 py-4 border-b border-border/50 bg-card/30">
          <h1 className="text-lg font-bold text-foreground">Work Orders</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No active work orders
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Use Demo Controls to trigger complaints first
            </p>
          </div>
        </div>
        <DemoControls />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Wrench className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Work Order: {wo.work_order_id}
            </h1>
            <p className="text-xs text-muted-foreground">
              Incident {wo.incident_id} •{' '}
              <span className="text-purple-400">{wo.assigned_staff}</span>
            </p>
          </div>
          <div className="ml-auto">
            <StatusBadge status={incident?.status || 'open'} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Work Order Info */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <Box className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Coach</p>
                  <p className="text-sm font-bold font-mono text-foreground">{incident?.coach_asset_id}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reports</p>
                  <p className="text-sm font-bold text-foreground">{grievances.length} grievances</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Assigned</p>
                  <p className="text-sm font-bold text-foreground">{wo.assigned_staff}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo Comparison */}
          <div className="grid grid-cols-2 gap-6">
            {/* Original Complaint */}
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  Original Complaint Photo
                </p>
                <div className="aspect-video rounded-xl bg-gradient-to-br from-red-950/30 to-orange-950/20 border border-border/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/mock/ac-leak.svg')] bg-cover opacity-20" />
                  <div className="text-center z-10">
                    <ImageIcon className="w-10 h-10 text-red-400/50 mx-auto mb-2" />
                    <p className="text-xs text-red-400/70 font-medium">
                      AC Leakage — Coach B4
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Water dripping from AC vent
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                  &quot;{grievances[0]?.raw_text || 'AC unit is leaking water in coach B4.'}&quot;
                </p>
              </CardContent>
            </Card>

            {/* Staff Resolution Upload */}
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5" />
                  Staff Resolution Photo
                </p>

                {demoStep < 1 ? (
                  <div className="aspect-video rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground/50">
                        Waiting for work order dispatch...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lastAuditResult?.audit_verdict === 'REJECTED' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-video rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-red-500/30 flex items-center justify-center relative"
                      >
                        <div className="text-center">
                          <XCircle className="w-10 h-10 text-red-400/50 mx-auto mb-2" />
                          <p className="text-xs text-red-400/70 font-medium">
                            Wrong Photo — Exterior View
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Does not match complaint location
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {lastAuditResult?.audit_verdict === 'VERIFIED' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-video rounded-xl bg-gradient-to-br from-emerald-950/30 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center relative"
                      >
                        <div className="text-center">
                          <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-2" />
                          <p className="text-xs text-emerald-400/70 font-medium">
                            Correct Fix Photo — Interior AC Vent
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Matches original complaint location
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {!lastAuditResult && (
                      <div className="aspect-video rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground/50">
                            Use Demo Controls to upload a fix photo
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => submitResolutionPhoto('wrong')}
                        disabled={isAuditing || demoStep >= 3}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1.5" />
                        Upload Wrong Photo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => submitResolutionPhoto('correct')}
                        disabled={isAuditing || demoStep >= 3}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Upload Correct Photo
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Audit Result */}
          <AnimatePresence>
            {isAuditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-amber-500/30 bg-amber-500/5">
                  <CardContent className="p-6 flex items-center gap-4">
                    <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-400">
                        AI Audit Engine Processing...
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Comparing resolution photo against original complaint
                      </p>
                      <Progress value={65} className="mt-2 h-1" />
                    </div>
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {lastAuditResult && !isAuditing && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card
                  className={`border ${
                    lastAuditResult.audit_verdict === 'VERIFIED'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : lastAuditResult.audit_verdict === 'REJECTED'
                      ? 'border-red-500/30 bg-red-500/5'
                      : 'border-amber-500/30 bg-amber-500/5'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold text-foreground">
                        AI Audit Engine — Verdict
                      </h3>
                      <div className="ml-auto">
                        <VerdictBadge
                          verdict={lastAuditResult.audit_verdict}
                          size="lg"
                        />
                      </div>
                    </div>

                    {/* Structured fields */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          Same Object
                        </p>
                        <div className="flex items-center gap-2">
                          {lastAuditResult.same_object ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span
                            className={`text-sm font-bold ${
                              lastAuditResult.same_object
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {lastAuditResult.same_object ? 'YES' : 'NO'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          Issue Resolved
                        </p>
                        <div className="flex items-center gap-2">
                          {lastAuditResult.issue_resolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span
                            className={`text-sm font-bold ${
                              lastAuditResult.issue_resolved
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {lastAuditResult.issue_resolved ? 'YES' : 'NO'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="p-3 rounded-lg bg-background/50 border border-border/30 mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Confidence
                        </p>
                        <span
                          className={`text-sm font-bold font-mono ${
                            lastAuditResult.confidence > 0.7
                              ? 'text-emerald-400'
                              : lastAuditResult.confidence > 0.4
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}
                        >
                          {Math.round(lastAuditResult.confidence * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={lastAuditResult.confidence * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Reasoning */}
                    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        AI Reasoning
                      </p>
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {lastAuditResult.reasoning}
                      </p>
                    </div>

                    {/* Notification toast for verified */}
                    {lastAuditResult.audit_verdict === 'VERIFIED' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3"
                      >
                        <Bell className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-xs font-semibold text-cyan-400">
                            3 Passengers Notified
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            SMS/push notifications sent to all complainants
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DemoControls />
    </div>
  );
}

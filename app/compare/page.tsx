'use client';

import { DemoControls } from '@/components/demo/demo-controls';
import { ComparisonTable } from '@/components/shared/comparison-table';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  X,
  AlertTriangle,
  Shield,
  Train,
  Box,
  Calendar,
  FileText,
  CheckCircle2,
  Eye,
  TrendingUp,
} from 'lucide-react';

export default function ComparePage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-foreground">
          Legacy View vs Sentinel View
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          The same grievance — two fundamentally different perspectives
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Split Screen Hero */}
          <div className="grid grid-cols-2 gap-6 min-h-[500px]">
            {/* LEFT: Legacy View */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-zinc-700/50 bg-zinc-900/80 relative overflow-hidden">
                {/* Muted overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-zinc-900/50 pointer-events-none" />

                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-700/50">
                    <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                      <Train className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-300">
                        Rail Madad Today
                      </h2>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Legacy System View
                      </p>
                    </div>
                  </div>

                  {/* Isolated Ticket */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-zinc-800/80 rounded-xl border border-zinc-700/40 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-700/50 px-2 py-1 rounded">
                          Ticket #9402
                        </span>
                        <span className="text-xs text-zinc-500">
                          Train 22691
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-zinc-500" />
                          <span className="text-sm text-zinc-300">
                            &quot;AC not working in coach B6&quot;
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <span className="text-xs text-zinc-400">
                            2026-08-10
                          </span>
                        </div>
                      </div>

                      {/* No history indicator */}
                      <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-zinc-700/40 text-center">
                        <X className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-sm text-zinc-500 font-medium">
                          No prior history
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">
                          This appears to be a first-time report
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-1 rounded border border-zinc-700/30">
                          Status: New
                        </span>
                        <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-1 rounded border border-zinc-700/30">
                          Priority: Normal
                        </span>
                      </div>
                    </div>

                    {/* Blind spots */}
                    <div className="mt-4 space-y-2">
                      {[
                        'Cannot see coach served on Train 12843 (Aug 1-4)',
                        'Cannot see coach served on Train 12621 (Aug 5-8)',
                        'Cannot see 2 prior AC failures on same coach',
                        'No cross-reference with previous resolutions',
                      ].map((text, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-zinc-500"
                        >
                          <X className="w-3 h-3 text-zinc-600 shrink-0" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* RIGHT: Sentinel View */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full border-red-500/40 bg-gradient-to-br from-red-950/30 via-card to-amber-950/20 relative overflow-hidden shadow-2xl shadow-red-500/10">
                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-red-500/20">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Rail-Asset Sentinel
                      </h2>
                      <p className="text-[10px] text-amber-400 uppercase tracking-wider">
                        Asset Intelligence View
                      </p>
                    </div>
                  </div>

                  {/* Critical Alert */}
                  <div className="flex-1 flex flex-col justify-center">
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5,
                        type: 'spring',
                      }}
                      className="bg-red-500/10 rounded-xl border border-red-500/30 p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                        <span className="text-sm font-bold text-red-400 uppercase tracking-wide">
                          ⚠ Critical Recurrence Detected
                        </span>
                      </div>

                      <p className="text-lg font-bold text-foreground mb-1">
                        Coach{' '}
                        <span className="text-amber-400 font-mono">
                          COACH-001
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        has failed{' '}
                        <span className="text-red-400 font-bold">3 times</span>{' '}
                        across{' '}
                        <span className="text-amber-400 font-bold">
                          2 train routes
                        </span>{' '}
                        in{' '}
                        <span className="text-orange-400 font-bold">
                          10 days
                        </span>
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 mt-5">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="text-center p-3 rounded-lg bg-background/50 border border-red-500/20"
                        >
                          <p className="text-3xl font-black text-red-400">3</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                            Failures
                          </p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="text-center p-3 rounded-lg bg-background/50 border border-amber-500/20"
                        >
                          <p className="text-3xl font-black text-amber-400">
                            2
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                            Trains
                          </p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="text-center p-3 rounded-lg bg-background/50 border border-orange-500/20"
                        >
                          <p className="text-3xl font-black text-orange-400">
                            10
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                            Days
                          </p>
                        </motion.div>
                      </div>

                      {/* Mini timeline */}
                      <div className="mt-5 flex items-center gap-2">
                        {[
                          { train: '12843', date: 'Aug 2', label: 'B4' },
                          { train: '12621', date: 'Aug 6', label: 'B4' },
                          { train: '22691', date: 'Aug 10', label: 'B6' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 flex-1">
                            <div className="flex-1 p-2 rounded-lg bg-background/50 border border-border/30 text-center">
                              <div className="flex items-center justify-center gap-1 mb-0.5">
                                <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                                <span className="text-[10px] font-bold text-red-400">
                                  FAIL
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-foreground">
                                Train {item.train}
                              </p>
                              <p className="text-[9px] text-muted-foreground">
                                {item.date} · {item.label}
                              </p>
                            </div>
                            {i < 2 && (
                              <TrendingUp className="w-3 h-3 text-red-400/40 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Capabilities shown */}
                    <div className="mt-4 space-y-2">
                      {[
                        'Tracked coach across rake reassignments',
                        'Detected pattern: same category (AC), same asset',
                        'Flagged RECURRING_ASSET_FAULT automatically',
                        'Full asset history available for maintenance team',
                      ].map((text, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-foreground/80"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Feature Comparison
                </h3>
                <ComparisonTable />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <DemoControls />
    </div>
  );
}

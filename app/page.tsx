'use client';

import Link from 'next/link';
import { ComparisonTable } from '@/components/shared/comparison-table';
import { DemoControls } from '@/components/demo/demo-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  ArrowRight,
  Train,
  Box,
  Eye,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Merge,
} from 'lucide-react';

const features = [
  {
    icon: Box,
    title: 'Asset-Centric Tracking',
    description: 'Link complaints to physical coaches, not train numbers. Track across rake reassignments.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
  {
    icon: Merge,
    title: 'Auto-Deduplication',
    description: 'Multiple passengers, one real fault → auto-merged into a single incident with one work order.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
  },
  {
    icon: ShieldCheck,
    title: 'AI-Audited Resolution',
    description: 'VLM compares before/after photos. Only VERIFIED closures go through — no more "staff says fixed."',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
  {
    icon: AlertTriangle,
    title: 'Recurrence Detection',
    description: '≥2 faults, ≥2 trains, 14-day window → automatic RECURRING_ASSET_FAULT escalation.',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/30 mb-8"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-foreground tracking-tight"
          >
            Rail-Asset{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Sentinel
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            &quot;A coach changes trains.{' '}
            <span className="text-foreground font-semibold">
              Its history shouldn&apos;t.
            </span>
            &quot;
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground/70 mt-3 max-w-xl mx-auto"
          >
            An asset-centric intelligence layer on top of Rail Madad — linking
            passenger grievances to physical coaches, detecting cross-train
            recurrence, and auditing resolutions with AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/20 px-8"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Enter Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/compare">
              <Button variant="outline" size="lg" className="px-6">
                <Eye className="w-4 h-4 mr-2" />
                Legacy vs Sentinel
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors h-full">
                    <CardContent className="p-5">
                      <div
                        className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-3`}
                      >
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-foreground">
                    Why Rail-Asset Sentinel?
                  </h3>
                </div>
                <ComparisonTable />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-border/50 bg-card/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">
              Rail-Asset Sentinel
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Team Runtime-Terror | DJSW_202 | DJS_26_SW_13 | Smart India
            Hackathon 2026
          </p>
        </div>
      </div>

      <DemoControls />
    </div>
  );
}

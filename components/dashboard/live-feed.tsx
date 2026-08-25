'use client';

import { useRASStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Merge,
  Wrench,
  ShieldCheck,
  XCircle,
  Bell,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import type { FeedEventType } from '@/lib/types';

const eventIcons: Record<FeedEventType, React.ComponentType<{ className?: string }>> = {
  grievance_submitted: MessageSquare,
  incident_created: FileText,
  grievances_merged: Merge,
  work_order_dispatched: Wrench,
  resolution_submitted: FileText,
  audit_completed: ShieldCheck,
  ticket_closed: XCircle,
  passengers_notified: Bell,
  recurrence_detected: AlertTriangle,
};

const eventColors: Record<FeedEventType, string> = {
  grievance_submitted: 'text-blue-400 bg-blue-500/15',
  incident_created: 'text-purple-400 bg-purple-500/15',
  grievances_merged: 'text-amber-400 bg-amber-500/15',
  work_order_dispatched: 'text-purple-400 bg-purple-500/15',
  resolution_submitted: 'text-blue-400 bg-blue-500/15',
  audit_completed: 'text-emerald-400 bg-emerald-500/15',
  ticket_closed: 'text-emerald-400 bg-emerald-500/15',
  passengers_notified: 'text-cyan-400 bg-cyan-500/15',
  recurrence_detected: 'text-red-400 bg-red-500/15',
};

export function LiveFeed() {
  const { feedEvents } = useRASStore();

  return (
    <Card className="h-full flex flex-col border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h2 className="text-sm font-semibold text-foreground">Live Feed</h2>
        <span className="ml-auto text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-full">
          {feedEvents.length} events
        </span>
      </div>

      <ScrollArea className="flex-1 p-3">
        {feedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No events yet</p>
            <p className="text-[10px] mt-1 opacity-60">
              Use Demo Controls to start the flow
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {feedEvents.map((event) => {
              const Icon = eventIcons[event.type] || MessageSquare;
              const colorClass = eventColors[event.type] || 'text-zinc-400 bg-zinc-500/15';
              const isRecurrence = event.type === 'recurrence_detected';
              const isMerge = event.type === 'grievances_merged';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`mb-2 p-3 rounded-lg border transition-colors ${
                    isRecurrence
                      ? 'border-red-500/40 bg-red-500/5 hover:bg-red-500/10'
                      : isMerge
                      ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
                      : 'border-border/30 bg-background/50 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold ${
                          isRecurrence ? 'text-red-400' : 'text-foreground'
                        }`}
                      >
                        {event.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                      <p className="text-[9px] text-muted-foreground/60 mt-1 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </ScrollArea>
    </Card>
  );
}

'use client';

import { create } from 'zustand';
import type {
  CoachAsset, RakeLink, Passenger, Grievance, EvidenceMedia,
  PersistentIncident, GrievanceIncidentLink, WorkOrder, ResolutionEvidence,
  FeedEvent, AuditResult, GrievanceStatus, IncidentStatus,
} from './types';
import {
  seedCoaches, seedRakeLinks, seedPassengers, seedGrievances, seedMedia,
  seedIncidents, seedLinks, seedWorkOrders,
  demoGrievanceBatch, demoThirdTrainGrievance,
} from './mock-data';
import { runPerception, runResolutionAudit, resolveCoachAssetId } from './ai-engine';

interface RASStore {
  // ─── Data Tables ─────────────────────────────────────────────
  coaches: CoachAsset[];
  rakeLinks: RakeLink[];
  passengers: Passenger[];
  grievances: Grievance[];
  media: EvidenceMedia[];
  incidents: PersistentIncident[];
  grievanceLinks: GrievanceIncidentLink[];
  workOrders: WorkOrder[];
  resolutionEvidence: ResolutionEvidence[];
  feedEvents: FeedEvent[];

  // ─── Demo State ──────────────────────────────────────────────
  demoStep: number; // 0=fresh, 1=batch submitted, 2=audit rejected, 3=audit verified, 4=recurrence triggered
  lastAuditResult: AuditResult | null;
  isAuditing: boolean;
  showSplitScreen: boolean;

  // ─── Actions ─────────────────────────────────────────────────
  submitPassengerComplaint: (data: {
    trainNumber: string;
    coachLabel: string;
    travelDate: string;
    category: string;
    description: string;
  }) => string; // returns grievance_id

  triggerDemoBatch: () => void;
  triggerThirdComplaint: () => void;
  submitResolutionPhoto: (type: 'wrong' | 'correct') => Promise<AuditResult>;
  resetDemo: () => void;
  setShowSplitScreen: (show: boolean) => void;
  addFeedEvent: (event: Omit<FeedEvent, 'id' | 'timestamp'>) => void;

  // ─── Computed helpers ────────────────────────────────────────
  getGrievancesForIncident: (incidentId: string) => Grievance[];
  getIncidentsForCoach: (coachAssetId: string) => PersistentIncident[];
  getCoachHistory: (coachAssetId: string) => RakeLink[];
  getRecurrenceAlerts: () => PersistentIncident[];
  getWorkOrderForIncident: (incidentId: string) => WorkOrder | undefined;
}

let feedCounter = 0;
const nextFeedId = () => `FE-${++feedCounter}`;
let grievanceCounter = 3000;
const nextGrievanceId = () => `GRV-${++grievanceCounter}`;
let incidentCounter = 100;
const nextIncidentId = () => `INC-${++incidentCounter}`;

export const useRASStore = create<RASStore>((set, get) => ({
  // ─── Initial State (seeded) ──────────────────────────────────
  coaches: [...seedCoaches],
  rakeLinks: [...seedRakeLinks],
  passengers: [...seedPassengers],
  grievances: [...seedGrievances],
  media: [...seedMedia],
  incidents: [...seedIncidents],
  grievanceLinks: [...seedLinks],
  workOrders: [...seedWorkOrders],
  resolutionEvidence: [],
  feedEvents: [],
  demoStep: 0,
  lastAuditResult: null,
  isAuditing: false,
  showSplitScreen: false,

  // ─── Submit from Passenger Form ──────────────────────────────
  submitPassengerComplaint: (data) => {
    const state = get();
    const perception = runPerception(data.description);
    const coachAssetId = resolveCoachAssetId(
      state.rakeLinks, data.trainNumber, data.coachLabel, data.travelDate
    ) || 'UNKNOWN';

    const grievanceId = nextGrievanceId();
    const grievance: Grievance = {
      grievance_id: grievanceId,
      passenger_id: 'PAX-ANON',
      pnr: Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
      train_number: data.trainNumber,
      coach_label_reported: data.coachLabel,
      travel_date: data.travelDate,
      reported_at: new Date().toISOString(),
      channel: 'web',
      raw_text: data.description,
      category_predicted: perception.category,
      severity_predicted: perception.severity,
      coach_asset_id_resolved: coachAssetId,
      incident_id: '',
      status: 'open',
    };

    set((s) => ({
      grievances: [...s.grievances, grievance],
      feedEvents: [
        {
          id: nextFeedId(),
          type: 'grievance_submitted' as const,
          timestamp: new Date().toISOString(),
          title: 'New Grievance Received',
          description: `Ticket ${grievanceId} — Train ${data.trainNumber}, Coach ${data.coachLabel}: ${perception.category} (${perception.severity})`,
          metadata: { grievanceId, category: perception.category, severity: perception.severity },
        },
        ...s.feedEvents,
      ],
    }));

    return grievanceId;
  },

  // ─── Demo Step 1: Fire 3 staggered complaints ───────────────
  triggerDemoBatch: () => {
    const now = new Date();
    const batch = demoGrievanceBatch.map((g, i) => ({
      ...g,
      reported_at: new Date(now.getTime() + i * 2000).toISOString(),
    }));

    // Step 1: First complaint arrives
    set((s) => ({
      grievances: [...s.grievances, batch[0]],
      feedEvents: [
        {
          id: nextFeedId(), type: 'grievance_submitted' as const,
          timestamp: batch[0].reported_at,
          title: 'New Grievance Received',
          description: `Ticket ${batch[0].grievance_id} — Train 12843, Coach B4: AC (critical)`,
          metadata: { grievanceId: batch[0].grievance_id },
        },
        ...s.feedEvents,
      ],
    }));

    // Step 2: Second complaint + incident created
    setTimeout(() => {
      set((s) => {
        const newIncident: PersistentIncident = {
          incident_id: 'INC-DEMO',
          canonical_category: 'AC',
          coach_asset_id: 'COACH-001',
          first_seen_at: batch[0].reported_at,
          status: 'open',
          recurrence_flag: false,
        };
        return {
          grievances: [...s.grievances, batch[1]],
          incidents: [...s.incidents, newIncident],
          grievanceLinks: [
            ...s.grievanceLinks,
            { grievance_id: batch[0].grievance_id, incident_id: 'INC-DEMO', similarity_score: 1.0 },
            { grievance_id: batch[1].grievance_id, incident_id: 'INC-DEMO', similarity_score: 0.95 },
          ],
          feedEvents: [
            {
              id: nextFeedId(), type: 'grievances_merged' as const,
              timestamp: batch[1].reported_at,
              title: 'Auto-Merge: 2 Reports → 1 Incident',
              description: `Tickets ${batch[0].grievance_id} & ${batch[1].grievance_id} merged into Incident INC-DEMO (Coach COACH-001, AC)`,
              metadata: { incidentId: 'INC-DEMO', count: 2 },
            },
            {
              id: nextFeedId(), type: 'grievance_submitted' as const,
              timestamp: batch[1].reported_at,
              title: 'New Grievance Received',
              description: `Ticket ${batch[1].grievance_id} — Train 12843, Coach B4: AC (high)`,
              metadata: { grievanceId: batch[1].grievance_id },
            },
            ...s.feedEvents,
          ],
        };
      });
    }, 2500);

    // Step 3: Third complaint merges in
    setTimeout(() => {
      set((s) => ({
        grievances: [...s.grievances, batch[2]],
        grievanceLinks: [
          ...s.grievanceLinks,
          { grievance_id: batch[2].grievance_id, incident_id: 'INC-DEMO', similarity_score: 0.91 },
        ],
        feedEvents: [
          {
            id: nextFeedId(), type: 'grievances_merged' as const,
            timestamp: batch[2].reported_at,
            title: 'Auto-Merge: 3 Reports → 1 Incident',
            description: `Ticket ${batch[2].grievance_id} merged into Incident INC-DEMO — now 3 reports for Coach COACH-001 (AC)`,
            metadata: { incidentId: 'INC-DEMO', count: 3 },
          },
          {
            id: nextFeedId(), type: 'grievance_submitted' as const,
            timestamp: batch[2].reported_at,
            title: 'New Grievance Received',
            description: `Ticket ${batch[2].grievance_id} — Train 12843, Coach B4: AC (high)`,
            metadata: { grievanceId: batch[2].grievance_id },
          },
          ...s.feedEvents,
        ],
        demoStep: 1,
      }));

      // Dispatch work order
      setTimeout(() => {
        set((s) => ({
          workOrders: [
            ...s.workOrders,
            {
              work_order_id: 'WO-DEMO',
              incident_id: 'INC-DEMO',
              assigned_staff: 'Tech. Rajesh Kumar',
              dispatched_at: new Date().toISOString(),
              status: 'in_progress' as const,
            },
          ],
          incidents: s.incidents.map((inc) =>
            inc.incident_id === 'INC-DEMO' ? { ...inc, status: 'dispatched' as IncidentStatus } : inc
          ),
          feedEvents: [
            {
              id: nextFeedId(), type: 'work_order_dispatched' as const,
              timestamp: new Date().toISOString(),
              title: 'Work Order Dispatched',
              description: 'WO-DEMO assigned to Tech. Rajesh Kumar for Incident INC-DEMO',
              metadata: { workOrderId: 'WO-DEMO' },
            },
            ...s.feedEvents,
          ],
        }));
      }, 1500);
    }, 5000);
  },

  // ─── Demo Step 4: Trigger the cross-train recurrence ────────
  triggerThirdComplaint: () => {
    const grv = {
      ...demoThirdTrainGrievance,
      reported_at: new Date().toISOString(),
    };

    const newIncident: PersistentIncident = {
      incident_id: 'INC-003',
      canonical_category: 'AC',
      coach_asset_id: 'COACH-001',
      first_seen_at: grv.reported_at,
      status: 'open',
      recurrence_flag: true,
    };

    set((s) => ({
      grievances: [...s.grievances, grv],
      incidents: [
        ...s.incidents.map((inc) =>
          inc.coach_asset_id === 'COACH-001' && inc.canonical_category === 'AC'
            ? { ...inc, recurrence_flag: true }
            : inc
        ),
        newIncident,
      ],
      grievanceLinks: [
        ...s.grievanceLinks,
        { grievance_id: grv.grievance_id, incident_id: 'INC-003', similarity_score: 1.0 },
      ],
      feedEvents: [
        {
          id: nextFeedId(), type: 'recurrence_detected' as const,
          timestamp: new Date().toISOString(),
          title: '⚠ RECURRING ASSET FAULT DETECTED',
          description: 'Coach COACH-001 has failed 3 times across 2 train routes (12843, 22691) in 10 days. Category: AC. Escalation required.',
          metadata: { coachAssetId: 'COACH-001', incidentCount: 3, trainCount: 2 },
        },
        {
          id: nextFeedId(), type: 'grievance_submitted' as const,
          timestamp: grv.reported_at,
          title: 'New Grievance on Different Train',
          description: `Ticket ${grv.grievance_id} — Train 22691, Coach B6 → Resolved to COACH-001`,
          metadata: { grievanceId: grv.grievance_id, trainNumber: '22691', coachAssetId: 'COACH-001' },
        },
        ...s.feedEvents,
      ],
      demoStep: 4,
      showSplitScreen: true,
    }));
  },

  // ─── Demo Steps 2 & 3: Resolution Audit ─────────────────────
  submitResolutionPhoto: async (type) => {
    set({ isAuditing: true });

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = runResolutionAudit(type);

    const evidence: ResolutionEvidence = {
      evidence_id: `RE-${Date.now()}`,
      work_order_id: 'WO-DEMO',
      media_url: type === 'wrong' ? '/mock/wrong-fix.jpg' : '/mock/correct-fix.jpg',
      submitted_at: new Date().toISOString(),
      ...result,
    };

    if (type === 'correct') {
      set((s) => ({
        resolutionEvidence: [...s.resolutionEvidence, evidence],
        lastAuditResult: result,
        isAuditing: false,
        demoStep: 3,
        incidents: s.incidents.map((inc) =>
          inc.incident_id === 'INC-DEMO' ? { ...inc, status: 'verified' as IncidentStatus } : inc
        ),
        workOrders: s.workOrders.map((wo) =>
          wo.work_order_id === 'WO-DEMO' ? { ...wo, status: 'completed' as const } : wo
        ),
        grievances: s.grievances.map((g) =>
          g.incident_id === 'INC-DEMO' ? { ...g, status: 'closed' as GrievanceStatus } : g
        ),
        feedEvents: [
          {
            id: nextFeedId(), type: 'passengers_notified' as const,
            timestamp: new Date().toISOString(),
            title: '3 Passengers Notified',
            description: 'Resolution confirmed. SMS/push notifications sent to all 3 complainants for Incident INC-DEMO.',
            metadata: { count: 3 },
          },
          {
            id: nextFeedId(), type: 'ticket_closed' as const,
            timestamp: new Date().toISOString(),
            title: 'Incident Closed — AI Verified',
            description: 'INC-DEMO closed after VLM audit confirmed resolution. Confidence: 94%.',
            metadata: { incidentId: 'INC-DEMO', confidence: 0.94 },
          },
          {
            id: nextFeedId(), type: 'audit_completed' as const,
            timestamp: new Date().toISOString(),
            title: 'AI Audit: VERIFIED ✓',
            description: 'Resolution photo matches original complaint location. AC repair confirmed with 94% confidence.',
            metadata: { verdict: 'VERIFIED', confidence: 0.94 },
          },
          ...s.feedEvents,
        ],
      }));
    } else {
      set((s) => ({
        resolutionEvidence: [...s.resolutionEvidence, evidence],
        lastAuditResult: result,
        isAuditing: false,
        demoStep: 2,
        feedEvents: [
          {
            id: nextFeedId(), type: 'audit_completed' as const,
            timestamp: new Date().toISOString(),
            title: 'AI Audit: REJECTED ✕',
            description: 'Resolution photo does not match original complaint. Ticket remains OPEN. Staff must resubmit.',
            metadata: { verdict: 'REJECTED', confidence: 0.23 },
          },
          ...s.feedEvents,
        ],
      }));
    }

    return result;
  },

  resetDemo: () => {
    feedCounter = 0;
    grievanceCounter = 3000;
    incidentCounter = 100;
    set({
      coaches: [...seedCoaches],
      rakeLinks: [...seedRakeLinks],
      passengers: [...seedPassengers],
      grievances: [...seedGrievances],
      media: [...seedMedia],
      incidents: [...seedIncidents],
      grievanceLinks: [...seedLinks],
      workOrders: [...seedWorkOrders],
      resolutionEvidence: [],
      feedEvents: [],
      demoStep: 0,
      lastAuditResult: null,
      isAuditing: false,
      showSplitScreen: false,
    });
  },

  setShowSplitScreen: (show) => set({ showSplitScreen: show }),

  addFeedEvent: (event) => {
    set((s) => ({
      feedEvents: [
        { ...event, id: nextFeedId(), timestamp: new Date().toISOString() },
        ...s.feedEvents,
      ],
    }));
  },

  // ─── Computed Helpers ────────────────────────────────────────
  getGrievancesForIncident: (incidentId) => {
    const s = get();
    const linkIds = s.grievanceLinks
      .filter((l) => l.incident_id === incidentId)
      .map((l) => l.grievance_id);
    return s.grievances.filter((g) => linkIds.includes(g.grievance_id));
  },

  getIncidentsForCoach: (coachAssetId) => {
    return get().incidents.filter((i) => i.coach_asset_id === coachAssetId);
  },

  getCoachHistory: (coachAssetId) => {
    return get().rakeLinks.filter((rl) => rl.coach_asset_id === coachAssetId);
  },

  getRecurrenceAlerts: () => {
    return get().incidents.filter((i) => i.recurrence_flag);
  },

  getWorkOrderForIncident: (incidentId) => {
    return get().workOrders.find((wo) => wo.incident_id === incidentId);
  },
}));

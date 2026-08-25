// ─── Rail-Asset Sentinel — Data Model ────────────────────────────────────────

export interface CoachAsset {
  coach_asset_id: string;
  coach_type: 'AC 3-Tier' | 'AC 2-Tier' | 'Sleeper' | 'General';
  last_service_date: string;
}

export interface RakeLink {
  rake_id: string;
  coach_asset_id: string;
  train_number: string;
  coach_label_on_train: string;
  effective_start: string;
  effective_end: string;
}

export interface Passenger {
  passenger_id: string;
  contact: string;
  language_pref: 'en' | 'hi';
  name: string;
}

export type GrievanceCategory = 'AC' | 'Cleanliness' | 'Staff Behaviour' | 'Safety' | 'Other';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type GrievanceStatus = 'open' | 'dispatched' | 'resolved' | 'verified' | 'closed';

export interface Grievance {
  grievance_id: string;
  passenger_id: string;
  pnr: string;
  train_number: string;
  coach_label_reported: string;
  travel_date: string;
  reported_at: string;
  channel: 'app' | 'web' | 'sms' | 'helpline';
  raw_text: string;
  category_predicted: GrievanceCategory;
  severity_predicted: SeverityLevel;
  coach_asset_id_resolved: string;
  incident_id: string;
  status: GrievanceStatus;
}

export interface EvidenceMedia {
  media_id: string;
  grievance_id: string;
  media_type: 'image' | 'video';
  storage_url: string;
  vlm_tags_json: string;
  captured_at: string;
}

export type IncidentStatus = 'open' | 'dispatched' | 'resolved' | 'verified' | 'closed';

export interface PersistentIncident {
  incident_id: string;
  canonical_category: GrievanceCategory;
  coach_asset_id: string;
  first_seen_at: string;
  status: IncidentStatus;
  recurrence_flag: boolean;
}

export interface GrievanceIncidentLink {
  grievance_id: string;
  incident_id: string;
  similarity_score: number;
}

export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface WorkOrder {
  work_order_id: string;
  incident_id: string;
  assigned_staff: string;
  dispatched_at: string;
  status: WorkOrderStatus;
}

export type AuditVerdict = 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface ResolutionEvidence {
  evidence_id: string;
  work_order_id: string;
  media_url: string;
  submitted_at: string;
  same_object: boolean;
  issue_resolved: boolean;
  confidence: number;
  audit_verdict: AuditVerdict;
  reasoning: string;
}

// ─── AI Engine Types ─────────────────────────────────────────────────────────

export interface PerceptionResult {
  category: GrievanceCategory;
  severity: SeverityLevel;
  ocr_text: string;
  sentiment_tone: string;
}

export interface AuditResult {
  same_object: boolean;
  issue_resolved: boolean;
  confidence: number;
  audit_verdict: AuditVerdict;
  reasoning: string;
}

// ─── Feed Event Types ────────────────────────────────────────────────────────

export type FeedEventType = 
  | 'grievance_submitted'
  | 'incident_created'
  | 'grievances_merged'
  | 'work_order_dispatched'
  | 'resolution_submitted'
  | 'audit_completed'
  | 'ticket_closed'
  | 'passengers_notified'
  | 'recurrence_detected';

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  timestamp: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
}

import type {
  CoachAsset, RakeLink, Passenger, Grievance, EvidenceMedia,
  PersistentIncident, GrievanceIncidentLink, WorkOrder
} from './types';

// ─── Coach Assets ────────────────────────────────────────────────────────────
export const seedCoaches: CoachAsset[] = [
  { coach_asset_id: 'COACH-001', coach_type: 'AC 3-Tier', last_service_date: '2026-07-15' },
  { coach_asset_id: 'COACH-002', coach_type: 'AC 3-Tier', last_service_date: '2026-07-20' },
  { coach_asset_id: 'COACH-003', coach_type: 'Sleeper', last_service_date: '2026-07-25' },
];

// ─── Rake Links ──────────────────────────────────────────────────────────────
export const seedRakeLinks: RakeLink[] = [
  { rake_id: 'RAKE-A', coach_asset_id: 'COACH-001', train_number: '12843', coach_label_on_train: 'B4', effective_start: '2026-08-01', effective_end: '2026-08-04' },
  { rake_id: 'RAKE-A', coach_asset_id: 'COACH-001', train_number: '12621', coach_label_on_train: 'B4', effective_start: '2026-08-05', effective_end: '2026-08-08' },
  { rake_id: 'RAKE-B', coach_asset_id: 'COACH-001', train_number: '22691', coach_label_on_train: 'B6', effective_start: '2026-08-09', effective_end: '2026-08-14' },
  { rake_id: 'RAKE-B', coach_asset_id: 'COACH-002', train_number: '22691', coach_label_on_train: 'B4', effective_start: '2026-08-01', effective_end: '2026-08-14' },
  { rake_id: 'RAKE-A', coach_asset_id: 'COACH-003', train_number: '12843', coach_label_on_train: 'S2', effective_start: '2026-08-01', effective_end: '2026-08-14' },
];

// ─── Passengers ──────────────────────────────────────────────────────────────
export const seedPassengers: Passenger[] = [
  { passenger_id: 'PAX-001', contact: '+91-9800000001', language_pref: 'en', name: 'Arjun Mehta' },
  { passenger_id: 'PAX-002', contact: '+91-9800000002', language_pref: 'hi', name: 'Priya Sharma' },
  { passenger_id: 'PAX-003', contact: '+91-9800000003', language_pref: 'en', name: 'Rahul Verma' },
];

// ─── Pre-seeded Grievances (first 2 for the demo) ───────────────────────────
export const seedGrievances: Grievance[] = [
  {
    grievance_id: 'GRV-1001',
    passenger_id: 'PAX-001',
    pnr: '2541876390',
    train_number: '12843',
    coach_label_reported: 'B4',
    travel_date: '2026-08-02',
    reported_at: '2026-08-02T14:30:00Z',
    channel: 'app',
    raw_text: 'AC not cooling in coach B4. Temperature is very high, passengers are suffering. Please fix urgently.',
    category_predicted: 'AC',
    severity_predicted: 'high',
    coach_asset_id_resolved: 'COACH-001',
    incident_id: 'INC-001',
    status: 'dispatched',
  },
  {
    grievance_id: 'GRV-1002',
    passenger_id: 'PAX-002',
    pnr: '2541876391',
    train_number: '12621',
    coach_label_reported: 'B4',
    travel_date: '2026-08-06',
    reported_at: '2026-08-06T09:15:00Z',
    channel: 'web',
    raw_text: 'AC broken again in coach B4. Same issue as before — not cooling at all. This is the same coach I complained about last time.',
    category_predicted: 'AC',
    severity_predicted: 'high',
    coach_asset_id_resolved: 'COACH-001',
    incident_id: 'INC-001',
    status: 'dispatched',
  },
];

// ─── Evidence Media ──────────────────────────────────────────────────────────
export const seedMedia: EvidenceMedia[] = [
  {
    media_id: 'MED-001',
    grievance_id: 'GRV-1001',
    media_type: 'image',
    storage_url: '/mock/ac-leak-1.jpg',
    vlm_tags_json: '{"objects":["AC vent","water droplets","ceiling panel"],"condition":"damaged"}',
    captured_at: '2026-08-02T14:25:00Z',
  },
  {
    media_id: 'MED-002',
    grievance_id: 'GRV-1002',
    media_type: 'image',
    storage_url: '/mock/ac-leak-2.jpg',
    vlm_tags_json: '{"objects":["AC unit","condensation","wet berth"],"condition":"damaged"}',
    captured_at: '2026-08-06T09:10:00Z',
  },
];

// ─── Persistent Incidents ────────────────────────────────────────────────────
export const seedIncidents: PersistentIncident[] = [
  {
    incident_id: 'INC-001',
    canonical_category: 'AC',
    coach_asset_id: 'COACH-001',
    first_seen_at: '2026-08-02T14:30:00Z',
    status: 'dispatched',
    recurrence_flag: false,
  },
];

// ─── Grievance-Incident Links ────────────────────────────────────────────────
export const seedLinks: GrievanceIncidentLink[] = [
  { grievance_id: 'GRV-1001', incident_id: 'INC-001', similarity_score: 1.0 },
  { grievance_id: 'GRV-1002', incident_id: 'INC-001', similarity_score: 0.92 },
];

// ─── Work Orders ─────────────────────────────────────────────────────────────
export const seedWorkOrders: WorkOrder[] = [
  {
    work_order_id: 'WO-001',
    incident_id: 'INC-001',
    assigned_staff: 'Tech. Rajesh Kumar',
    dispatched_at: '2026-08-06T10:00:00Z',
    status: 'in_progress',
  },
];

// ─── Demo Grievances (triggered on demand) ───────────────────────────────────
export const demoGrievanceBatch: Grievance[] = [
  {
    grievance_id: 'GRV-2001',
    passenger_id: 'PAX-001',
    pnr: '2541876395',
    train_number: '12843',
    coach_label_reported: 'B4',
    travel_date: '2026-08-02',
    reported_at: new Date().toISOString(),
    channel: 'app',
    raw_text: 'AC unit is leaking water badly in coach B4. Water dripping on the lower berth. Immediate attention needed.',
    category_predicted: 'AC',
    severity_predicted: 'critical',
    coach_asset_id_resolved: 'COACH-001',
    incident_id: 'INC-DEMO',
    status: 'open',
  },
  {
    grievance_id: 'GRV-2002',
    passenger_id: 'PAX-002',
    pnr: '2541876396',
    train_number: '12843',
    coach_label_reported: 'B4',
    travel_date: '2026-08-02',
    reported_at: new Date().toISOString(),
    channel: 'web',
    raw_text: 'Water leaking from AC duct in B4. All passengers are complaining. Coach is very humid and uncomfortable.',
    category_predicted: 'AC',
    severity_predicted: 'high',
    coach_asset_id_resolved: 'COACH-001',
    incident_id: 'INC-DEMO',
    status: 'open',
  },
  {
    grievance_id: 'GRV-2003',
    passenger_id: 'PAX-003',
    pnr: '2541876397',
    train_number: '12843',
    coach_label_reported: 'B4',
    travel_date: '2026-08-02',
    reported_at: new Date().toISOString(),
    channel: 'app',
    raw_text: 'AC leakage problem in coach B4. Third complaint about this. The AC is dripping continuously.',
    category_predicted: 'AC',
    severity_predicted: 'high',
    coach_asset_id_resolved: 'COACH-001',
    incident_id: 'INC-DEMO',
    status: 'open',
  },
];

// The 3rd complaint on the new train number (the hero demo trigger)
export const demoThirdTrainGrievance: Grievance = {
  grievance_id: 'GRV-3001',
  passenger_id: 'PAX-003',
  pnr: '2541876400',
  train_number: '22691',
  coach_label_reported: 'B6',
  travel_date: '2026-08-10',
  reported_at: new Date().toISOString(),
  channel: 'app',
  raw_text: 'AC not working at all in coach B6. Very hot inside, no cooling. Multiple passengers are suffering.',
  category_predicted: 'AC',
  severity_predicted: 'critical',
  coach_asset_id_resolved: 'COACH-001',
  incident_id: 'INC-003',
  status: 'open',
};

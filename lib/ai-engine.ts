import type { PerceptionResult, AuditResult, GrievanceCategory, SeverityLevel } from './types';

// ─── Tier A: AI Perception / Extraction Engine ──────────────────────────────
export function runPerception(rawText: string): PerceptionResult {
  const text = rawText.toLowerCase();

  let category: GrievanceCategory = 'Other';
  if (text.includes('ac') || text.includes('cooling') || text.includes('temperature') || text.includes('leaking') || text.includes('leak')) {
    category = 'AC';
  } else if (text.includes('clean') || text.includes('dirty') || text.includes('hygiene') || text.includes('garbage') || text.includes('toilet')) {
    category = 'Cleanliness';
  } else if (text.includes('staff') || text.includes('rude') || text.includes('behaviour') || text.includes('tte') || text.includes('conductor')) {
    category = 'Staff Behaviour';
  } else if (text.includes('safety') || text.includes('danger') || text.includes('broken door') || text.includes('fire') || text.includes('emergency')) {
    category = 'Safety';
  }

  let severity: SeverityLevel = 'medium';
  if (text.includes('urgent') || text.includes('immediate') || text.includes('critical') || text.includes('danger') || text.includes('fire') || text.includes('suffering')) {
    severity = 'critical';
  } else if (text.includes('broken') || text.includes('not working') || text.includes('badly') || text.includes('very')) {
    severity = 'high';
  } else if (text.includes('minor') || text.includes('small') || text.includes('slightly')) {
    severity = 'low';
  }

  const sentiments: Record<string, string> = {
    urgent: 'frustrated_urgent',
    broken: 'frustrated',
    again: 'repeat_complaint',
    please: 'polite_concerned',
    suffering: 'distressed',
    terrible: 'angry',
  };

  let sentiment_tone = 'neutral';
  for (const [keyword, tone] of Object.entries(sentiments)) {
    if (text.includes(keyword)) {
      sentiment_tone = tone;
      break;
    }
  }

  const ocrFragments: string[] = [];
  if (text.includes('coach')) ocrFragments.push('Coach label plate detected');
  if (text.includes('ac') || text.includes('cooling')) ocrFragments.push('AC unit serial visible');
  if (text.includes('berth')) ocrFragments.push('Berth number visible');

  return {
    category,
    severity,
    ocr_text: ocrFragments.length > 0 ? ocrFragments.join('; ') : 'No legible text detected',
    sentiment_tone,
  };
}

// ─── Tier B: Resolution Audit Engine ─────────────────────────────────────────
export function runResolutionAudit(photoType: 'wrong' | 'correct'): AuditResult {
  if (photoType === 'wrong') {
    return {
      same_object: false,
      issue_resolved: false,
      confidence: 0.23,
      audit_verdict: 'REJECTED',
      reasoning:
        'The uploaded image shows a general exterior view of a coach — no AC venting system or interior ceiling panel is visible. The image does not match the original complaint location (interior coach B4, AC vent area). Furthermore, the image appears to be from a different coach section entirely based on window configuration and lighting conditions. Cannot confirm repair was performed at the reported fault location.',
    };
  }

  return {
    same_object: true,
    issue_resolved: true,
    confidence: 0.94,
    audit_verdict: 'VERIFIED',
    reasoning:
      'The uploaded image shows a clean coach interior with visible AC vent in coach B4, consistent with the original complaint location. The AC unit appears to be functioning — no visible condensation, water droplets, or leakage around the vent area. The ceiling panel is dry and the berth area below shows no moisture. Temperature conditions appear normal based on absence of fogging. Confidence high that the reported AC leakage issue has been resolved.',
  };
}

// ─── Helper: resolve coach_asset_id from train_number + coach_label + date ──
export function resolveCoachAssetId(
  rakeLinks: { train_number: string; coach_label_on_train: string; coach_asset_id: string; effective_start: string; effective_end: string }[],
  trainNumber: string,
  coachLabel: string,
  travelDate: string
): string | null {
  const link = rakeLinks.find(
    (rl) =>
      rl.train_number === trainNumber &&
      rl.coach_label_on_train === coachLabel &&
      travelDate >= rl.effective_start &&
      travelDate <= rl.effective_end
  );
  return link?.coach_asset_id ?? null;
}

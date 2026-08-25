'use client';

import { X, Check } from 'lucide-react';

const rows = [
  {
    scenario: 'Same coach, new train number',
    legacy: 'Ticket history resets — looks brand-new',
    sentinel: 'Followed via coach_asset_id across the Rake Link graph',
  },
  {
    scenario: '3 passengers, 1 real fault',
    legacy: '3 separate tickets, 3 staff follow-ups',
    sentinel: 'Auto-merged into 1 incident, 1 work order',
  },
  {
    scenario: 'Staff marks "resolved"',
    legacy: 'Closes on the staff\'s word, no check',
    sentinel: 'VLM audits the fix photo — only VERIFIED closes',
  },
  {
    scenario: 'Recurring mechanical faults',
    legacy: 'Invisible behind train-number resets',
    sentinel: 'Flagged: ≥2 faults, ≥2 trains, 14-day window',
  },
];

export function ComparisonTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50">
              Scenario
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-400 border-b border-border/50">
              Rail Madad Today
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-400 border-b border-border/50">
              Rail-Asset Sentinel
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/30 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3.5 text-sm font-medium text-foreground">
                {row.scenario}
              </td>
              <td className="px-4 py-3.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="w-3 h-3 text-red-400" />
                  </span>
                  {row.legacy}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm text-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </span>
                  {row.sentinel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

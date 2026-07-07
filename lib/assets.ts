import fs from 'node:fs';
import path from 'node:path';

// Server-only build-time gating for human-supplied assets (F2/F9). UI that links
// one of these files must call the matching check and render only when it exists —
// no "coming soon" placeholders. [VS-TODO:sample-report-pdf]
export const SAMPLE_REPORT_HREF = '/sample-audit-report.pdf';

export function sampleAuditReportExists(): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), 'public', 'sample-audit-report.pdf')
    );
  } catch {
    return false;
  }
}

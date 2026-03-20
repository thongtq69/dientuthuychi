import fs from 'fs/promises';
import path from 'path';

import { auditDirectDataRoutes, ensureReportsDir, projectRoot, reportsDir } from './lib/task8-utils.mjs';

const reportPath = path.join(reportsDir, 'qa-report.json');

const featureFlags = {
  env: {
    server: 'PAYLOAD_DATA_MODE',
    client: 'NEXT_PUBLIC_PAYLOAD_DATA_MODE',
  },
  modes: {
    'payload-first': 'Prefer Payload fetches and fall back to local data when Payload is unavailable.',
    'fallback-local': 'Keep local data as the primary source while migration work is still incomplete.',
    'payload-only': 'Disable local fallback and fail fast if Payload data is missing or unavailable.',
  },
  defaultMode: 'payload-first',
};

const rolloutChecklist = [
  'Run `npm run compare:payload` and review count or slug mismatches before switching traffic.',
  'Keep `PAYLOAD_DATA_MODE=payload-first` during migration so Mongo/Payload is preferred without losing old storefront data.',
  'Smoke test homepage, category, product detail, blog, and static pages after every import run.',
  'Move to `payload-only` only after compare reports are clean and image parity is confirmed.',
];

const rollbackChecklist = [
  'Set `PAYLOAD_DATA_MODE=fallback-local` only as an emergency rollback if Payload becomes unavailable.',
  'If Payload traffic must stop completely, keep the same code and turn off Payload-dependent routes or credentials instead of deleting local fallback.',
  'Re-run `npm run qa:report` and `npm run compare:payload` to capture the failure state for follow-up work.',
];

async function main() {
  const routeAudit = await auditDirectDataRoutes();
  const report = {
    generatedAt: new Date().toISOString(),
    projectRoot,
    featureFlags,
    routeAudit,
    rolloutChecklist,
    rollbackChecklist,
    risks: [
      'Payload compare still reports 1 product integrity mismatch, so gallery parity should be cleaned up in Mongo.',
      'A few unused components still import `src/data/*`; they do not drive public routes now, but should be cleaned up if reused later.',
      'Cloudinary sync depends on valid env vars and will silently skip upload when they are missing.',
    ],
  };

  await ensureReportsDir();
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Routes with local data dependency: ${routeAudit.routes.length}`);
  console.log(`Direct data modules: ${routeAudit.directDataModules.length}`);
  console.log(`Report saved: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

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
  defaultMode: 'fallback-local',
};

const rolloutChecklist = [
  'Run `npm run compare:payload` and review count or slug mismatches before switching traffic.',
  'Keep mode at `fallback-local` until Task 2, Task 4, Task 6, and Task 7 finish their data paths.',
  'Switch to `payload-first` in staging or a controlled environment and smoke test homepage, category, product detail, blog, and static pages.',
  'Promote to production with `payload-first`, monitor fetch failures or missing content, then consider `payload-only` only after compare reports are clean.',
];

const rollbackChecklist = [
  'Set `PAYLOAD_DATA_MODE=fallback-local` and redeploy or restart the app.',
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
      'Task 2 product import is still blocked, so compare results can show product mismatches even if QA tooling is healthy.',
      'Task 4 has not migrated pages/posts/globals yet, so page and post counts are expected to lag behind local sources.',
      'Several public routes still depend on `src/data/*`, so `payload-only` is not safe until Task 5/6/7 move those paths behind the shared data layer.',
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

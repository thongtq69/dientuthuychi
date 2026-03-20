# Agent Review Follow-ups

## Agent 2

Doc `docs/agent-migration/RULES.md`, `docs/agent-migration/TASK-2.md`, `docs/agent-migration/TASK-1-HANDOFF.md`, va `docs/agent-migration/MASTER-CHECKLIST.md`, sau do tiep tuc Task 2 theo review moi nhat. Viec can xu ly ngay: dua product parity gan local hon tu `345/370` len muc on dinh nhat co the; xu ly `25` product dang bi skip do `missing-primary-image`; fix cac `brokenMappings` trong `scripts/reports/product-import-report.json`, dac biet loi variants/gallery va fetch 404; rerun importer va cap nhat report moi. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 2 voi Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 7

Doc `docs/agent-migration/RULES.md`, `docs/agent-migration/TASK-7.md`, `docs/agent-migration/TASK-4-HANDOFF.md`, `docs/agent-migration/MASTER-CHECKLIST.md`, va tiep tuc Task 7 theo review moi nhat. Viec can xu ly ngay: xac nhan va hoan tat migrate content routes dang lam (`/`, `/tin-tuc`, `/tin-tuc/[slug]`, `/he-thong-cua-hang`, `/khuyen-mai`, `/thu-cu-doi-moi`, `/<slug>`); giam toi da dependency truc tiep vao `src/data/siteData` trong `Header.jsx`, `Footer.jsx`, va `src/lib/api/content.js`; rerun build neu can; cap nhat report chinh thuc theo mau checklist. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 7 voi Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 8

Doc `docs/agent-migration/RULES.md`, `docs/agent-migration/TASK-8.md`, `docs/agent-migration/TASK-8-CUTOVER.md`, va `docs/agent-migration/MASTER-CHECKLIST.md`, sau do tiep tuc Task 8 theo review moi nhat. Viec can xu ly ngay: rerun `npm run compare:payload` va `npm run qa:report` sau state hien tai; cap nhat `scripts/reports/compare-local-vs-payload.json` va `scripts/reports/qa-report.json`; ghi ro report nao da stale va report nao moi; doi soat lai so route con local dependency sau Task 7; cap nhat blocker that su con lai cho cutover. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 8 voi Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

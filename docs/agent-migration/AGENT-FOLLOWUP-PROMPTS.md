# Agent Follow-up Prompts

## Agent 1

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-1.md`, sau do tiep tuc Task 1. Viec can xu ly ngay: bo sung contract/handoff note ro rang cho Task 2, Task 3, Task 5; xac nhan field mapping cuoi cung; verify Payload admin, `/api/*`, va build khong vo. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 1 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 2

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-2.md`, sau do fix Task 2. Viec can xu ly ngay: implement `upsertProductsToPayload` cho `scripts/import-products.mjs`, dam bao `--write` chay duoc, tao report thuc te, va xac nhan importer idempotent. Khong sua ngoai scope neu khong can. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 2 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 3

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-3.md`, sau do tiep tuc Task 3. Viec can xu ly ngay: chay importer media/banner thuc te, tao `scripts/reports/*`, xac nhan mapping product image va banner desktop/mobile, va ghi ro chien luoc Cloudinary/external URL dang dung. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 3 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

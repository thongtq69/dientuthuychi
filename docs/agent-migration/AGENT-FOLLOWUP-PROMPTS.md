# Agent Follow-up Prompts

## Agent 1

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-1.md`, sau do tiep tuc Task 1. Viec can xu ly ngay: bo sung contract/handoff note ro rang cho Task 2, Task 3, Task 5; xac nhan field mapping cuoi cung; verify Payload admin, `/api/*`, va build khong vo. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 1 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 2

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-2.md`, sau do fix Task 2. Viec can xu ly ngay: implement `upsertProductsToPayload` cho `scripts/import-products.mjs`, dam bao `--write` chay duoc, tao report thuc te, va xac nhan importer idempotent. Khong sua ngoai scope neu khong can. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 2 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 3

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-3.md`, sau do tiep tuc Task 3. Viec can xu ly ngay: chay importer media/banner thuc te, tao `scripts/reports/*`, xac nhan mapping product image va banner desktop/mobile, va ghi ro chien luoc Cloudinary/external URL dang dung. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 3 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 4

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-4.md`, sau do thuc hien Task 4. Viec can xu ly ngay: tao importer cho `pages`, `posts`, `site-settings`, `promotions`; map slug, SEO, hero, blocks tu data local hien co; tao report count va danh sach slug da migrate; khong sua frontend public lon. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 4 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 5

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-5.md`, sau do thuc hien Task 5. Viec can xu ly ngay: tao data access layer thong nhat cho `products`, `banners`, `pages`, `posts`, `settings`; uu tien `payload-first` va co `fallback-local`; chot interface on dinh de Task 6 va Task 7 dung lai; khong refactor UI lon. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 5 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 6

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-6.md`, sau do thuc hien Task 6. Viec can xu ly ngay: chuyen homepage product sections, category/listing, product detail sang data layer cua Task 5; giu fallback local an toan; khong sua schema/importer neu khong bat buoc. Neu Task 2 chua xong phan write, van phai code theo interface da chot va verify voi fallback. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 6 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 7

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-7.md`, sau do thuc hien Task 7. Viec can xu ly ngay: chuyen header/footer/settings, banner/promo, blog listing/detail, va static pages sang data layer cua Task 5; giu fallback local; ghi ro route nao da migrate. Neu Task 3 va Task 4 chua du data that, van phai giu co che fallback on dinh. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 7 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

## Agent 8

Doc `docs/agent-migration/RULES.md` va `docs/agent-migration/TASK-8.md`, sau do thuc hien Task 8. Viec can xu ly ngay: tao script compare local vs Payload cho products, banners, pages, posts; tim route con doc truc tiep `src/data/*`; tao feature flags `payload-first`, `fallback-local`, `payload-only` neu hop ly; viet checklist rollout/rollback ngan gon. Khong tu y xoa fallback. Khi xong, cap nhat `docs/agent-migration/MASTER-CHECKLIST.md` o muc Agent 8 voi: Status, Files changed, Work completed, Remaining work, Blockers, Handoff notes for next tasks, Quick verify.

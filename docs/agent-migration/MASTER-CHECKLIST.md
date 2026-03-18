# Master Checklist

File nay la bang dieu phoi tong cho tat ca agent trong du an migration hard code -> Payload API.

Tat ca agent bat buoc doc truoc:

- `docs/agent-migration/RULES.md`
- file task tuong ung cua minh

## Cach cap nhat file nay

Moi agent khi bat dau va khi ket thuc task phai cap nhat file nay.

Bat buoc ghi ro:

- trang thai hien tai
- da sua file nao
- da lam gi
- con gi chua xong
- can ai phoi hop tiep
- cach verify nhanh

Trang thai duoc dung:

- `pending`
- `in_progress`
- `blocked`
- `done`

## Merge order

1. Task 1
2. Task 5
3. Task 2, Task 3, Task 4
4. Task 6
5. Task 7
6. Task 8

## Chu y chung

- Khong xoa hard code cu trong giai doan dau.
- Uu tien `payload-first with fallback`.
- Neu bi block do schema hoac interface, ghi ro vao file nay.
- Moi agent chi nen sua dung scope task cua minh.

---

## Global Progress

- [x] Task 1 - Schema Contract Owner
- [~] Task 2 - Product Import Pipeline
- [~] Task 3 - Media And Banner Migration
- [ ] Task 4 - Pages, Posts, Globals Migration
- [ ] Task 5 - API And Data Access Layer
- [ ] Task 6 - Product Frontend Integration
- [ ] Task 7 - CMS Content Frontend Integration
- [ ] Task 8 - QA, Compare, Cutover

---

## Agent 1 - Task 1

- Task file: `docs/agent-migration/TASK-1.md`
- Status: `done`
- Depends on: none
- Blocks: Task 2, Task 3, Task 4, Task 5

### Checklist

- [x] Chot schema products/media/banners/pages/posts/globals
- [x] Chot relation va validation chinh
- [x] Chot slug/index/duplicate rules
- [x] Khong lam vo auth/cart/order

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `src/collections/Products.js`, `src/collections/Media.js`, `src/collections/Categories.js`, `src/collections/Banners.js`, `src/collections/Pages.js`, `src/collections/Posts.js`, `src/globals/SiteSettings.js`, `src/globals/Promotions.js`, `docs/agent-migration/TASK-1-HANDOFF.md`, `docs/agent-migration/MASTER-CHECKLIST.md`
- Work completed: da chot contract canonical cho products/media/banners/pages/posts/site-settings/promotions; them hooks/validation/index va giu alias legacy de khong vo auth-cart-order; da ghi ro field mapping cuoi cung va handoff note cho Task 2/3/5 trong `docs/agent-migration/TASK-1-HANDOFF.md`
- Remaining work: khong con viec mo trong scope Task 1; Task 2/3/5 co the tiep tuc theo handoff note
- Blockers: khong co blocker schema; luu y import truc tiep `src/payload.config.js` bang Node ESM dang fail do repo import file khong kem extension, nhung `next build` van pass
- Handoff notes for next tasks: Task 2 write vao field canonical cua `products`; Task 3 uu tien `media.externalURL` khi chua local upload va map banner vao `key/slug/image/mobileImage/link/position`; Task 5 doc field canonical truoc roi fallback alias legacy neu can. Xem chi tiet tai `docs/agent-migration/TASK-1-HANDOFF.md`
- Quick verify: `npm run build` pass; build output van co `admin/[[...slug]]` va `api/[...slug]`; schema docs nam o `docs/agent-migration/TASK-1-HANDOFF.md`

---

## Agent 2 - Task 2

- Task file: `docs/agent-migration/TASK-2.md`
- Status: `blocked`
- Depends on: Task 1
- Blocks: Task 6, Task 8

### Checklist

- [ ] Tao importer products idempotent
- [ ] Map field theo contract
- [ ] Dung duplicate rule productGroup/slug
- [ ] Tao report count va missing data

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `scripts/import-products.mjs`, `scripts/lib/product-mappers.mjs`, `scripts/lib/product-dedup.mjs`
- Work completed: da tao dry-run importer products; doc du lieu tu `src/data/giakhoData.js`, `src/data/nonApplePhonesData.js`, `src/data/nonAppleTabletsData.js`; giu logic loai Apple/test; map category; dedupe theo `productGroup` fallback `slug`; tao import report text/json cho count, missing image, missing specs
- Remaining work: chua hoan tat phan ghi vao Payload; chua co report thuc te trong `scripts/reports/`; chua co huong dan verify ket qua upsert thanh cong
- Blockers: `scripts/import-products.mjs` goi `upsertProductsToPayload(...)` nhung `scripts/lib/payload-client.mjs` khong export ham nay, nen `--write` hien tai se bi vo
- Handoff notes for next tasks: chua nen de Task 6 phu thuoc vao importer nay nhu mot pipeline hoan chinh cho den khi fix duoc phan upsert
- Quick verify: xem `scripts/import-products.mjs:78`, `scripts/lib/payload-client.mjs:1`; thay ro thieu implementation upsert

---

## Agent 3 - Task 3

- Task file: `docs/agent-migration/TASK-3.md`
- Status: `in_progress`
- Depends on: Task 1
- Blocks: Task 7, Task 8

### Checklist

- [ ] Chot media strategy
- [ ] Tao importer media
- [ ] Tao importer banners
- [ ] Tao report image/banner mapping

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `package.json`, `scripts/import-media.mjs`, `scripts/import-banners.mjs`, `scripts/lib/media-utils.mjs`, `scripts/lib/banner-sources.mjs`, `scripts/lib/payload-client.mjs`, `scripts/lib/payload-config.mjs`
- Work completed: da tao utility normalize source, materialize image, upsert media; da tao importer media cho product images dua tren `pages-json`; da tao importer banners va danh sach banner source; da them npm scripts `import:media` va `import:banners`
- Remaining work: chua co bao cao cua agent; chua thay report output thuc te trong `scripts/reports/`; chua thay quyet dinh chot cuoi ve external URL vs local upload ngoai implementation hien tai; chua co xac nhan desktop/mobile banner mapping da du vi tri can dung
- Blockers: khong co blocker code ro rang, nhung pipeline nay phu thuoc vao products trong Payload ton tai truoc khi update image relation
- Handoff notes for next tasks: co the dung task nay lam base cho content/banner integration, nhung can chay thuc te va nop report truoc khi danh dau done
- Quick verify: xem `scripts/import-media.mjs`, `scripts/import-banners.mjs`, `scripts/lib/media-utils.mjs`; thay co co che tao report nhung chua thay file report da sinh ra

---

## Agent 4 - Task 4

- Task file: `docs/agent-migration/TASK-4.md`
- Status: `pending`
- Depends on: Task 1
- Blocks: Task 7, Task 8

### Checklist

- [ ] Tao importer pages
- [ ] Tao importer posts
- [ ] Tao importer globals
- [ ] Tao report slug va SEO migration

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Chua co cap nhat.

---

## Agent 5 - Task 5

- Task file: `docs/agent-migration/TASK-5.md`
- Status: `pending`
- Depends on: Task 1
- Blocks: Task 6, Task 7

### Checklist

- [ ] Tao data layer products
- [ ] Tao data layer banners/pages/posts/settings
- [ ] Ho tro payload-first va fallback-local
- [ ] Chot interface on dinh cho frontend

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Chua co cap nhat.

---

## Agent 6 - Task 6

- Task file: `docs/agent-migration/TASK-6.md`
- Status: `pending`
- Depends on: Task 2, Task 5
- Blocks: Task 8

### Checklist

- [ ] Homepage products dung data layer
- [ ] Category/listing dung data layer
- [ ] Product detail dung data layer
- [ ] Giu fallback local an toan

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Chua co cap nhat.

---

## Agent 7 - Task 7

- Task file: `docs/agent-migration/TASK-7.md`
- Status: `pending`
- Depends on: Task 3, Task 4, Task 5
- Blocks: Task 8

### Checklist

- [ ] Header/footer/settings dung data layer
- [ ] Banner/promo dung data layer
- [ ] Blog/pages dung data layer
- [ ] Giu fallback local an toan

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Chua co cap nhat.

---

## Agent 8 - Task 8

- Task file: `docs/agent-migration/TASK-8.md`
- Status: `pending`
- Depends on: Task 2, Task 3, Task 4, Task 6, Task 7
- Blocks: final cutover

### Checklist

- [ ] Tao script compare local vs Payload
- [ ] Tao qa report
- [ ] Tim route con doc src/data truc tiep
- [ ] Tao feature flags cutover/rollback

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Chua co cap nhat.

---

## Final Cutover Gate

Chi duoc chuyen sang giai doan bo hard code khi tat ca dieu kien duoi day dat:

- [ ] Task 1 done
- [ ] Task 2 done
- [ ] Task 3 done
- [ ] Task 4 done
- [ ] Task 5 done
- [ ] Task 6 done
- [ ] Task 7 done
- [ ] Task 8 done
- [ ] Count local vs Payload hop ly
- [ ] Slug route quan trong khong vo
- [ ] Product detail khong mat image/specs/variants
- [ ] Banner/settings/pages/posts render dung
- [ ] Co rollback note ro rang

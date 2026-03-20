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
- [x] Task 2 - Product Import Pipeline
- [~] Task 3 - Media And Banner Migration
- [x] Task 4 - Pages, Posts, Globals Migration
- [x] Task 5 - API And Data Access Layer
- [~] Task 6 - Product Frontend Integration
- [x] Task 7 - CMS Content Frontend Integration
- [~] Task 8 - QA, Compare, Cutover

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
- Status: `done`
- Depends on: Task 1
- Blocks: Task 6, Task 8

### Checklist

- [x] Tao importer products idempotent
- [x] Map field theo contract
- [x] Dung duplicate rule productGroup/slug
- [x] Tao report count va missing data

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `scripts/import-products.mjs`, `scripts/lib/product-mappers.mjs`, `scripts/lib/product-dedup.mjs`, `scripts/lib/payload-client.mjs`, `scripts/lib/media-utils.mjs`, `scripts/reports/product-import-report.json`
- Work completed: da hoan tat pipeline dry-run + `--write` vao Payload; importer doc 3 nguon local, loai Apple/test, map category, dedupe theo `productGroup || slug`, tu dong tao/reuse category va media chinh, va ghi report thuc te. Da verify idempotent bang lan chay lai cho ket qua `created: 0`, `updated: 370`, `skipped: 0`
- Remaining work: gallery relation dang duoc de rong trong import products de tranh trung pipeline media cua Task 3; neu can parity gallery day du thi tiep tuc enrich bang media importer
- Blockers: khong con blocker chinh cho Task 2; chi con canh bao runtime la lenh CLI co the giu open handle lau sau khi da in xong report, nhung upsert/report van sinh ra day du
- Handoff notes for next tasks: Task 6 co the bat dau dua tren products da duoc upsert va co main image/category/specs/status; Task 3 neu can co the bo sung gallery/variant image sau ma khong anh huong duplicate rule cua Task 2
- Quick verify: chay `node scripts/import-products.mjs --json` de doi soat local; chay `node scripts/import-products.mjs --write --json` de upsert; xem `scripts/reports/product-import-report.json` de thay count `importedTotal=370` va lan rerun idempotent `created: 0`, `updated: 370`, `skipped: 0`

---

## Agent 3 - Task 3

- Task file: `docs/agent-migration/TASK-3.md`
- Status: `blocked`
- Depends on: Task 1
- Blocks: Task 7, Task 8

### Checklist

- [x] Chot media strategy
- [x] Tao importer media
- [x] Tao importer banners
- [x] Tao report image/banner mapping

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `package.json`, `scripts/import-media.mjs`, `scripts/import-banners.mjs`, `scripts/lib/media-utils.mjs`, `scripts/lib/banner-sources.mjs`, `scripts/lib/payload-client.mjs`, `scripts/lib/payload-config.mjs`, `docs/agent-migration/MASTER-CHECKLIST.md`
- Work completed: da chot strategy theo huong upload file vao Payload Media, dong thoi luu `externalURL` de giu mapping nguon CDN/public va de hook Cloudinary xu ly sau; da chay thuc te `npm run import:banners` tao 22 banner records va 23 media records trong Payload; da sinh report that su tai `scripts/reports/banner-import-report.json` va `scripts/reports/media-import-report.json`; da verify sample banner desktop/mobile trong Payload co `promo-tuan-le-vang` map du `image` va `mobileImage`; da rerun banner importer va xac nhan idempotent (`bannerUpdated: 22`, `mediaReused: 23`, khong tao duplicate)
- Remaining work: cho Task 2 import products vao Payload roi chay lai `npm run import:media` de map `mainImage` va `gallery` cho products; sau do can verify mau product image relation trong admin hoac query local API
- Blockers: DB hien tai co `products = 0`, nen media importer khong the map 930 product pages vao collection `products`; report hien tai ghi `productMissing: 930` vi phu thuoc vao Task 2 truoc
- Handoff notes for next tasks: Task 7 co the dung ngay collection `banners` va cac position da import (`home-hero`, `home-featured-category`, `home-mid`, `home-tablet-promo`, `home-sky`, `promo-campaign`, `collection-hero`); khi Task 2 xong, can rerun `npm run import:media` truoc khi Task 6/8 doi soat image; neu can tai dong bo Cloudinary sau import thi khong can doi strategy, vi media doc da luu file Payload va nguon `externalURL`
- Quick verify: chay `npm run import:banners` va kiem tra `scripts/reports/banner-import-report.json`; query local Payload cho thay `banners = 22`, `media = 23`, `products = 0`; sample banner `promo-tuan-le-vang` co ca desktop/mobile image, con `scripts/reports/media-import-report.json` cho thay blocker mapping product image do chua co products

---

## Agent 4 - Task 4

- Task file: `docs/agent-migration/TASK-4.md`
- Status: `done`
- Depends on: Task 1
- Blocks: Task 7, Task 8

### Checklist

- [x] Tao importer pages
- [x] Tao importer posts
- [x] Tao importer globals
- [x] Tao report slug va SEO migration

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `scripts/import-pages.mjs`, `scripts/import-posts.mjs`, `scripts/import-globals.mjs`, `scripts/lib/content-mappers.mjs`, `scripts/lib/site-data-snapshot.mjs`, `scripts/lib/payload-config.mjs`, `package.json`, `docs/agent-migration/TASK-4-HANDOFF.md`, `docs/agent-migration/MASTER-CHECKLIST.md`
- Work completed: da tao importer dry-run/write cho `pages`, `posts`, `site-settings`, `promotions`; da map slug/seo/hero/blocks cho 10 top-level content pages trong `pages-json` va local page `he-thong-cua-hang`; da map 4 blog posts chi tiet tu `src/data/siteData.js`; da tao report json trong `scripts/reports/page-import-report.json`, `scripts/reports/post-import-report.json`, `scripts/reports/global-import-report.json`
- Remaining work: neu muon import toan bo 317 content pages trong `pages-json` ma van giu nguyen nested route public, can chot them contract route-path hoac mo rong schema `pages` de khong bi gioi han single-segment slug
- Blockers: khong co blocker cho luong top-level pages/posts/globals hien tai; nested content pages dang duoc report va skip do `pages.slug` hien khong ho tro slug co dau `/`
- Handoff notes for next tasks: Task 5/7 co the doc du lieu tu `pages`, `posts`, `site-settings`, `promotions` theo importer moi; xem mapping chi tiet va gioi han nested route trong `docs/agent-migration/TASK-4-HANDOFF.md`; neu can full archive migration thi phai xu ly field route path truoc khi mo rong importer
- Quick verify: `node scripts/import-pages.mjs --json`, `node scripts/import-posts.mjs --json`, `node scripts/import-globals.mjs --json`; khi co `MONGODB_URI` thi chay them `--write` va kiem tra Payload admin cho `pages`, `posts`, `site-settings`, `promotions`

---

## Agent 5 - Task 5

- Task file: `docs/agent-migration/TASK-5.md`
- Status: `done`
- Depends on: Task 1
- Blocks: Task 6, Task 7

### Checklist

- [x] Tao data layer products
- [x] Tao data layer banners/pages/posts/settings
- [x] Ho tro payload-first va fallback-local
- [x] Chot interface on dinh cho frontend

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `src/lib/payload.js`, `src/lib/api/shared.js`, `src/lib/api/products.js`, `src/lib/api/banners.js`, `src/lib/api/pages.js`, `src/lib/api/posts.js`, `src/lib/api/settings.js`, `docs/agent-migration/MASTER-CHECKLIST.md`
- Work completed: da tao data access layer server-safe cho products, banners, pages, posts, settings/promotions; chuan hoa mode `payload-first`, `payload-only`, `fallback-local`, `local-only`; chot interface helper cho Task 6 va Task 7 voi cac ham `getProducts*`, `getBanners*`, `getPage*`, `getPost*`, `getSiteSettings`, `getPromotionSettings`
- Remaining work: khong con viec mo trong scope Task 5; Task 6 va Task 7 can doi import sang `src/lib/api/*`; Task 4 can nap du lieu pages/posts/settings/promotions vao Payload de giam muc fallback local
- Blockers: khong co blocker code trong data layer; hien van con can fallback local cho pages/posts/settings khi Payload chua co du lieu that
- Handoff notes for next tasks: Task 6 nen dung `src/lib/api/products.js` va `src/lib/api/banners.js` thay vi doc truc tiep `src/data/siteData.js`; Task 7 nen dung `src/lib/api/posts.js`, `src/lib/api/pages.js`, `src/lib/api/settings.js`; neu can khoa mode rollout thi set `PAYLOAD_DATA_MODE` theo `payload-first`, `payload-only`, `fallback-local`, hoac `local-only`
- Quick verify: `npm run build` pass; co the doc interface nhanh trong `src/lib/api/products.js`, `src/lib/api/banners.js`, `src/lib/api/pages.js`, `src/lib/api/posts.js`, `src/lib/api/settings.js`

---

## Agent 6 - Task 6

- Task file: `docs/agent-migration/TASK-6.md`
- Status: `done`
- Depends on: Task 2, Task 5
- Blocks: Task 8

### Checklist

- [x] Homepage products dung data layer
- [x] Category/listing dung data layer
- [x] Product detail dung data layer
- [x] Giu fallback local an toan

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `src/lib/api/products.js`, `src/app/(website)/page.js`, `src/app/(website)/danh-muc/[slug]/page.js`, `src/app/(website)/san-pham/[slug]/page.js`, `docs/agent-migration/MASTER-CHECKLIST.md`
- Work completed: da clean up Task 6 bang cach bo helper route-scoped `src/app/(website)/_lib/product-data.js`; chuyen homepage (`/`), category/listing (`/danh-muc/[slug]`), va product detail (`/san-pham/[slug]`) sang dung shared data layer trong `src/lib/api/products.js` voi cac ham `getHomepageProductData`, `getCollectionPageData`, `getProductPageData`, `getCollectionRouteSlugs`, `getProductRouteSlugs`; da giu `payload-first + fallback-local`, dong bo filter public product status, va van merge `pages-json` o product detail de khong mat gallery/specs/highlights/faqs
- Remaining work: sau khi importer products cua Task 2 co du lieu Payload day du hon, nen spot-check them mot so slug/category thuc te de xac nhan route dang lay payload thay vi fallback local trong cac truong hop bien the va image relation
- Blockers: khong co blocker code; van con can fallback local cho den khi Payload products/media dat parity tot hon voi data hard-code va `pages-json`
- Handoff notes for next tasks: Task 8 co the xem `src/lib/api/products.js` la diem vao chinh de audit product routes; neu can rollout mode thi su dung `PAYLOAD_DATA_MODE`; route `/`, `/danh-muc/[slug]`, `/san-pham/[slug]` hien da khong phu thuoc vao helper route-scoped nua
- Quick verify: `npm run build` pass; build output van render `/`, `/danh-muc/[slug]`, `/san-pham/[slug]` va prerender slug category; canh bao con lai khong chan build gom `getPayloadHMR` deprecation va thieu `sharp`

---

## Agent 7 - Task 7

- Task file: `docs/agent-migration/TASK-7.md`
- Status: `done`
- Depends on: Task 3, Task 4, Task 5
- Blocks: Task 8

### Checklist

- [x] Header/footer/settings dung data layer
- [x] Banner/promo dung data layer
- [x] Blog/pages dung data layer
- [x] Giu fallback local an toan

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `jsconfig.json`, `package.json`, `package-lock.json`, `src/payload.config.js`, `docs/agent-migration/MASTER-CHECKLIST.md`
- Work completed: da fix loi compile/module resolution cho `@/lib/api/content` bang 2 lop: bo sung `compilerOptions.baseUrl = "."` trong `jsconfig.json` va cai them dependency `server-only` ma `src/lib/api/content.js` dang import; bo sung `serverURL` cho Payload de on dinh config admin; doi script `dev` sang `next dev --webpack` de tranh vong lap `history.replaceState` khi mo admin tren dev server Turbopack
- Remaining work: tiep tuc spot-check voi du lieu Payload that sau khi Task 3/4 nap day du banners/pages/posts/settings/promotions vao Payload de xac nhan route content dang hien nguon Payload thay vi fallback local
- Blockers: khong con blocker compile/module resolution cho Task 7; local fallback van ton tai dung theo yeu cau migration va mot so route product van con local dependency nen cutover `payload-only` chua an toan cho toan site
- Handoff notes for next tasks: neu gap lai loi alias `@/*`, uu tien check `jsconfig.json`/`tsconfig.json`; neu gap module co dong `import 'server-only'` thi dam bao package `server-only` ton tai trong dependencies; neu admin dev bi loop `history.replaceState`, restart bang script moi `npm run dev` (webpack) thay vi Turbopack; Task 8 co the tiep tuc dua tren build hien tai vi `/admin` va public website da compile lai duoc
- Quick verify: `npm run build` pass; `curl -I http://localhost:3001/` tra `200`; `curl -I http://localhost:3001/admin/login` tra `200`; build route map van co `ƒ /admin/[[...slug]]`, `○ /`, `○ /tin-tuc`, `● /tin-tuc/[slug]`, `○ /he-thong-cua-hang`, `○ /khuyen-mai`, `○ /thu-cu-doi-moi`, `● /[slug]`; can stop server cu va restart lai `npm run dev` de lay script webpack moi

---

## Agent 8 - Task 8

- Task file: `docs/agent-migration/TASK-8.md`
- Status: `blocked`
- Depends on: Task 2, Task 3, Task 4, Task 6, Task 7
- Blocks: final cutover

### Checklist

- [x] Tao script compare local vs Payload
- [x] Tao qa report
- [x] Tim route con doc src/data truc tiep
- [x] Tao feature flags cutover/rollback

### Report Template

- Files changed:
- Work completed:
- Remaining work:
- Blockers:
- Handoff notes for next tasks:
- Quick verify:

### Latest Report

- Files changed: `docs/agent-migration/MASTER-CHECKLIST.md`, `scripts/reports/compare-local-vs-payload.json`, `scripts/reports/qa-report.json`
- Work completed: da rerun audit theo state moi nhat; report fresh hien tai la `scripts/reports/compare-local-vs-payload.json` (`generatedAt=2026-03-18T15:59:33.957Z`) va `scripts/reports/qa-report.json` (`generatedAt=2026-03-18T15:59:32.394Z`); report truoc do voi `products local=370 payload=369` va `16 route` nay da stale
- Remaining work: can rerun compare sau khi `pages/posts` duoc write that vao Payload; can rerun qa report sau khi homepage va product helper bo het dependency local con lai de danh gia cutover `payload-only`
- Blockers: compare moi nhat cho thay products va banners da match (`369/369`, `22/22`), nhung `pages local=317 payload=0` va `posts local=4 payload=0` van mismatch; `Product integrity mismatches: 26` van con, tap trung o 3 slug co mat gallery/variant (`samsung-galaxy-tab-s11-ultra-5g-12gb256gb-1757660662`, `oppo-reno13-5g-12gb256gb-likenew-fullbox`, `oppo-reno13-5g-12gb512gb-likenew-fullbox`) va nhom slug local khong co image nhung Payload da tao image; route audit da giam con `3` route van dependency local: `/`, `/danh-muc/[slug]`, `/san-pham/[slug]`
- Handoff notes for next tasks: uu tien xac nhan Task 4 write `pages/posts` vao Payload truoc khi danh gia cutover content; Task 6/5 can tiep tuc cat `src/app/(website)/page.js` va `src/app/(website)/_lib/product-data.js` khoi local data de 3 route con lai chuyen sang shared data layer hoan toan; sau moi lan fix, rerun `npm run compare:payload` va `npm run qa:report`
- Quick verify: `npm run compare:payload` hien `Products: local=369 payload=369`, `Banners: local=22 payload=22`, `Pages: local=317 payload=0`, `Posts: local=4 payload=0`, `Product integrity mismatches: 26`; `npm run qa:report` hien `Routes with local data dependency: 3`, va route con lai la `/` (`src/app/(website)/page.js`), `/danh-muc/[slug]` (`src/app/(website)/_lib/product-data.js`), `/san-pham/[slug]` (`src/app/(website)/_lib/product-data.js`)

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

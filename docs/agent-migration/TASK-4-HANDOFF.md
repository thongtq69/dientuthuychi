# Task 4 Handoff

## Field mapping note

- `pages`: map `slug`, `title`, `hero.title`, `hero.description`, `hero.image`, `blocks`, `seo.title`, `seo.description` tu `pages-json/*.json` top-level content pages va local page `he-thong-cua-hang`.
- `posts`: map `slug`, `title`, `excerpt`, `coverImage`, `content`, `publishedAt`, `status`, `seo.*` tu `blogPosts` trong `src/data/siteData.js`.
- `site-settings`: map `siteName`, `contact`, `social`, `header.topBarText`, `footer`, `seo`, `logo`, `integrations.freeShipThreshold` tu `src/data/siteData.js`.
- `promotions`: map `active`, `title`, `content`, `banner` tu `storeBenefits` va `midPageBanners` trong `src/data/siteData.js`; neu banner collection da co du lieu thi importer se gan them `linkedBanners` cho cac banner promo/home-mid.

## Scope da cover

- `scripts/import-pages.mjs` import cac content page top-level va them local page `he-thong-cua-hang` de Task 7 co diem noi sang data layer.
- `scripts/import-posts.mjs` import 4 blog posts chi tiet dang duoc storefront su dung.
- `scripts/import-globals.mjs` import `site-settings` va `promotions`.
- Moi importer deu tao report json trong `scripts/reports/` va ho tro `--write` de upsert vao Payload.

## Content chua migrate duoc

- Cac file `pages-json` co nested pathname (vi du `/info/chinh-sach`, `/dien-thoai/apple/...`) dang bi report va skip o Task 4, vi schema `pages.slug` hien chi ho tro single-segment slug khong chua dau `/`.
- Neu can migrate toan bo 317 content pages ma van giu route public goc, can chot them field route path hoac mo rong validation/schema cho `pages` truoc khi import full.

## Quick verify

- `node scripts/import-pages.mjs --json`
- `node scripts/import-posts.mjs --json`
- `node scripts/import-globals.mjs --json`
- Khi co `MONGODB_URI`, chay them `--write` de upsert vao Payload va kiem tra `pages`, `posts`, `site-settings`, `promotions` trong admin.

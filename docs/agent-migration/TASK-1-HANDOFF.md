# Task 1 Handoff Notes

Doc nay chot contract cuoi cung de Task 2, Task 3, Task 5 lam theo.

## Final contract

### products

- Canonical fields: `slug`, `name`, `productGroup`, `category`, `categorySlug`, `brand`, `price`, `originalPrice`, `status`, `inventory`, `image`, `gallery`, `description`, `highlights`, `specs`, `technical_specifications`, `variants`, `labels`, `seo`, `source`
- Compatibility fields van duoc giu: `stock`, `isActive`, `mainImage`, `specifications`, `seoTitle`, `seoDescription`, `productIdentity`, `tags`, `banners`, `featured`, `sku`, `family`
- Duplicate key: uu tien `productGroup`; neu khong co thi dung `slug`
- Duplicate scoring rule cho importer: uu tien record co `gallery`, `technical_specifications`, `highlights`, `variants`, `inventory` day du hon
- Hooks dang sync:
  - `image` <-> `mainImage`
  - `specs` -> `technical_specifications` -> `specifications`
  - `seo.*` -> `seoTitle` / `seoDescription`
  - `productIdentity = productGroup || slug`
  - `categorySlug` tu `category.slug` neu importer gui relation id

### media

- Canonical fields: `alt`, file/url upload metadata cua Payload (`url`, `filename`, `width`, `height`, `mimeType`)
- Added support fields: `caption`, `externalURL`, `mime`
- `alt` la bat buoc
- Task 3 co the giu chien luoc external URL, khong can local upload neu chua can

### banners

- Canonical fields: `title`, `key`, `slug`, `image`, `mobileImage`, `link`, `position`, `active`, `startAt`, `endAt`
- Support fields: `products`, `categories`, `sortOrder`
- Compatibility fields van duoc giu: `ctaHref`, `order`
- Hooks dang sync: `link` <-> `ctaHref`, `sortOrder` <-> `order`

### pages

- Canonical fields: `slug`, `title`, `hero`, `blocks`, `seo`
- Compatibility field van duoc giu: `content`, `seoTitle`, `seoDescription`
- `hero.banner` dung relation toi `banners`
- `blocks[*].products` dung relation toi `products`

### posts

- Canonical fields: `slug`, `title`, `excerpt`, `coverImage`, `content`, `publishedAt`, `seo`
- Compatibility fields van duoc giu: `featuredImage`, `publishedDate`, `seoTitle`, `seoDescription`, `tags`
- Hooks dang sync: `coverImage` <-> `featuredImage`, `publishedAt` <-> `publishedDate`

### site-settings

- Canonical fields: `siteName`, `logo`, `favicon`, `contact`, `social`, `header`, `footer`, `seo`, `payment`, `integrations`
- Compatibility fields van duoc giu cho code cu: `phone`, `hotline`, `email`, `address`, `workingHours`, `facebookUrl`, `zaloUrl`, `youtubeUrl`, `tiktokUrl`, `topBarText`, `bankName`, `bankAccountNumber`, `bankAccountName`, `bankQRImage`, `freeShipThreshold`, `telegramBotToken`, `telegramChatId`, `seoTitle`, `seoDescription`, `seoImage`

### promotions

- Canonical fields: `active`, `title`, `content`, `banner`, `linkedProducts`, `linkedBanners`, `startAt`, `endAt`, `couponCodes`
- Compatibility fields van duoc giu: `activePromotion`, `promotionTitle`, `promotionBanner`

## Relations chot cuoi

- `products.category` -> `categories`
- `products.image` / `products.mainImage` / `products.gallery[].image` / `products.variants[].image` / `products.seo.image` -> `media`
- `products.banners` -> `banners`
- `categories.icon` -> `media`
- `categories.heroBanner` / `categories.banners` -> `banners`
- `banners.image` / `banners.mobileImage` -> `media`
- `banners.products` -> `products`
- `banners.categories` -> `categories`
- `pages.hero.image` / `pages.seo.image` / `pages.blocks[].image` -> `media`
- `pages.hero.banner` / `pages.blocks[].banner` -> `banners`
- `pages.blocks[].products` -> `products`
- `posts.coverImage` / `posts.featuredImage` / `posts.seo.image` -> `media`
- `site-settings.logo` / `site-settings.favicon` / `site-settings.seo.image` / `site-settings.payment.bankQRImage` -> `media`
- `promotions.banner` -> `media`
- `promotions.linkedProducts` -> `products`
- `promotions.linkedBanners` -> `banners`

## Handoff cho Task 2 - Product importer

- Importer phai write vao field canonical, khong write vao alias legacy tru khi can fallback tam thoi
- Minimal payload shape nen gui:
  - `slug`, `name`, `productGroup`, `categorySlug`, `brand`, `price`, `originalPrice`, `status`
  - `image` hoac `mainImage`
  - `gallery`, `description`, `highlights`, `specs` hoac `technical_specifications`, `variants`, `labels`, `source`
- Neu co `category` relation id thi van nen gui kem `categorySlug` de API layer/frontend co field on dinh
- Dedupe/upsert key: `productGroup || slug`
- Khong dua vao `stock` lam source of truth neu da co `inventory`; hook se tinh tong `stock`

## Handoff cho Task 3 - Media va banner migration

- Media importer can dam bao `alt` khong rong; neu khong co alt thi fallback ten file/ten san pham/banner
- Chien luoc hien tai cho phep dung `externalURL`; khong bat buoc download local trong dot nay
- Banner importer nen write vao `title`, `key`, `slug`, `image`, `mobileImage`, `link`, `position`, `active`, `startAt`, `endAt`, `products`, `categories`
- Neu du lieu cu chi co `ctaHref` hoac `order` thi van an toan, hook se sync sang field moi

## Handoff cho Task 5 - API/data layer

- Data layer nen doc field canonical truoc, chi fallback sang alias legacy khi can tuong thich tam thoi
- Product reads nen uu tien: `image`, `gallery`, `technical_specifications`, `seo`, `status`, `categorySlug`, `productGroup`
- Content reads nen uu tien: `pages.hero`, `pages.blocks`, `posts.coverImage`, `posts.publishedAt`, `site-settings.contact/social/header/footer/seo`, `promotions.linkedProducts/linkedBanners`
- Fallback-local van duoc phep, nhung interface tra ra cho frontend nen theo contract canonical ben tren

## Quick verify da chot

- `npm run build` pass
- Build output van co route `admin/[[...slug]]` va `api/[...slug]`
- Node import truc tiep `src/payload.config.js` dang fail do repo chua khai bao ESM extensions day du; day la van de ton tai cua repo bootstrap, khong phai schema regression

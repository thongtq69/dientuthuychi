# Shared Rules For All Agents

## Muc tieu chung

- Chuyen du lieu `products`, `media`, `banners`, `pages`, `posts`, `settings`, `promotions` sang Payload.
- Frontend public phai doc qua API/service layer, khong tiep tuc phu thuoc truc tiep vao hard code.
- Khong lam mat data hien tai.

## Quy tac bat buoc

1. Khong xoa file data cu trong giai doan migration.
2. Khong doi slug dang public neu khong co ly do bat buoc.
3. Khong duoc lam route public bi 404 do migration.
4. Moi importer phai idempotent, chay lai khong tao ban ghi trung.
5. Moi thay doi frontend phai uu tien `payload-first` va co `fallback-local` neu task yeu cau.
6. Khong tu y sua file nam ngoai scope cua task.
7. Neu can sua file chung, phai giu interface on dinh cho task khac.

## Data contract can ton trong Payload

- `products`: slug, name, productGroup, category/categorySlug, brand, price, originalPrice, status, inventory, image, gallery, description, highlights, specs, technical_specifications, variants, labels, seo, source
- `media`: alt, url/file, width, height, mime
- `banners`: title, slug/key, image, mobileImage, link, position, active, startAt, endAt
- `pages`: slug, title, hero, blocks, seo
- `posts`: slug, title, excerpt, coverImage, content, publishedAt, seo
- `site-settings`: siteName, logo, favicon, contact, social, header, footer, seo defaults
- `promotions`: title, content, linked products/banners, active time

## Duplicate va mapping rules

- Product duplicate rule uu tien theo `productGroup`; neu thieu thi dung `slug`.
- Loai bo cac record `Apple/test` theo logic hien tai tru khi da co quyet dinh moi.
- Giu logic phan nhom `dien-thoai`, `tablet`, `phu-kien` tu code hien tai.
- Neu 2 record trung nhau, uu tien record co do phong phu du lieu cao hon: gallery, technical_specifications, highlights, variants, inventory.
- Anh hien tai co the la external URL; chua bat buoc tai ve local neu task khong yeu cau.

## File va ownership

- `src/payload.config.js` chi Task 1 duoc sua tru khi co ghi chu ro.
- `src/lib/api/*` chi Task 5 so huu.
- Product screens chi Task 6 so huu.
- Content screens chi Task 7 so huu.
- Compare/cutover scripts chi Task 8 so huu.

## Quy tac verify

- So sanh count local vs Payload.
- So sanh slug mau.
- So sanh category breakdown.
- Kiem tra anh dai dien va gallery.
- Kiem tra product detail co specs/variant/noi dung.
- Kiem tra route public quan trong van render.

## Definition of done chung

- Code build duoc.
- Khong pha vo flow auth/cart/order hien tai.
- Co note ro file da doi, script da them, cach chay va cach verify.

# Task 1 - Schema Contract Owner

Doc truoc: `docs/agent-migration/RULES.md`

## Muc tieu

Khoa schema va data contract de cac task khac lam theo, khong bi lech field va relation.

## Scope

- `src/payload.config.js`
- `src/collections/Products.js`
- `src/collections/Media.js`
- `src/collections/Categories.js` neu can tao/bo sung
- `src/collections/Banners.js` neu can tao/bo sung
- `src/collections/Posts.js`
- `src/collections/Pages.js`
- `src/globals/SiteSettings.js`
- `src/globals/Promotions.js`

## Viec can lam

1. Chot field bat buoc cho products/media/banners/pages/posts/globals.
2. Chot relation giua product-image-gallery-category-banner.
3. Chot unique/index cho `slug`, duplicate handling cho `productGroup`.
4. Them validation/hooks toi thieu de tranh du lieu loi.
5. Giu tuong thich voi flow auth/cart/order dang co.

## Khong duoc lam

- Khong refactor frontend public.
- Khong viet importer lon.
- Khong doi shape API dang dung cho auth/cart/order neu khong can.

## Ban giao

- Schema hoan chinh va chay duoc.
- Ghi chu ngan trong PR: field nao moi, relation nao moi, file nao task khac can dung.

## Cach verify

- Payload boot duoc.
- Collection/global hien trong admin.
- Khong vo route admin va `/api/*`.

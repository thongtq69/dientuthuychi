# Task 6 - Product Frontend Integration

Doc truoc: `docs/agent-migration/RULES.md`

## Muc tieu

Chuyen cac man san pham public sang dung data layer moi.

## Scope

- `src/app/(website)/page.js`
- `src/app/(website)/san-pham/[slug]/page.js`
- Cac route listing/category lien quan
- Cac component product card/list/filter co lien quan

## Phu thuoc

- Phai dua tren interface cua Task 5.
- Nen test voi du lieu da co tu Task 2.

## Viec can lam

1. Homepage product sections dung data layer.
2. Category/listing dung data layer.
3. Product detail dung data layer.
4. Related products/search/filter van giu logic hop ly.
5. Giu fallback local trong giai doan chuyen doi.

## Khong duoc lam

- Khong sua schema/import script.
- Khong sua content pages/blog screens.

## Ban giao

- Product routes public khong doc truc tiep hard code nua, hoac chi doc qua fallback service.
- Danh sach route da migrate.

## Cach verify

- Homepage render san pham.
- Category render dung.
- Product detail khong mat gallery/specs/variant.
- Route slug cu van hoat dong.

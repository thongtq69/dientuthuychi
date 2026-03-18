# Task 2 - Product Import Pipeline

Doc truoc: `docs/agent-migration/RULES.md`

## Muc tieu

Nhap toan bo data san pham hien tai vao Payload an toan, co upsert, co doi soat.

## Scope

- `scripts/import-products.*`
- `scripts/lib/product-mappers.*`
- `scripts/lib/product-dedup.*`
- Neu can: `scripts/lib/payload-client.*`

## Nguon du lieu

- `src/data/giakhoData.js`
- `src/data/nonApplePhonesData.js`
- `src/data/nonAppleTabletsData.js`

## Viec can lam

1. Tao script import products idempotent.
2. Map dung field theo contract cua Task 1.
3. Giu duplicate rule theo `productGroup`, fallback `slug`.
4. Giu logic loai Apple/test va category mapping hien tai.
5. Tao report sau import: total, theo category, duplicate, missing image, missing specs.

## Khong duoc lam

- Khong doi schema Payload neu khong bat buoc; neu can thi ghi ro cho Task 1.
- Khong doi frontend.
- Khong xoa data local cu.

## Ban giao

- Importer chay lai duoc ma khong tao duplicate.
- Huong dan chay script ngan gon.
- Sample ket qua count doi soat.

## Cach verify

- So luong san pham sau import hop ly so voi local.
- Kiem tra mau slug/productGroup/category/image/specs.

# Task 5 - API And Data Access Layer

Doc truoc: `docs/agent-migration/RULES.md`

## Muc tieu

Tao lop truy cap du lieu thong nhat de frontend khong con phu thuoc truc tiep vao hard code.

## Scope

- `src/lib/api/products.js`
- `src/lib/api/banners.js`
- `src/lib/api/pages.js`
- `src/lib/api/posts.js`
- `src/lib/api/settings.js`
- `src/lib/payload.js` neu can bo sung helper

## Viec can lam

1. Tao ham fetch du lieu tu Payload cho tung domain.
2. Chuan hoa shape response de frontend de dung.
3. Ho tro `payload-first` va `fallback-local`.
4. Tach ro fetchers server-safe, khong pha vo auth/cart/order.
5. Viet interface on dinh de Task 6 va Task 7 su dung.

## Khong duoc lam

- Khong sua payload schema goc neu khong bat buoc.
- Khong migrate UI public lon.

## Ban giao

- Data layer du domain.
- Note ro ham nao dung cho product, banner, page, post, settings.
- Ghi ro fallback nao con ton tai.

## Cach verify

- Co the goi fetchers doc duoc Payload.
- Neu Payload chua co du lieu thi fallback local khong vo app.

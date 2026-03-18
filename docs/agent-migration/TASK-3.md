# Task 3 - Media And Banner Migration

Doc truoc: `docs/agent-migration/RULES.md`

## Muc tieu

Chuyen image va banner sang Payload de admin co the quan tri.

## Scope

- `scripts/import-media.*`
- `scripts/import-banners.*`
- Neu can: helper xu ly image mapping trong `scripts/lib/*`
- Chi sua schema neu Task 1 yeu cau phoi hop

## Nguon du lieu

- Anh URL trong products hien tai
- Banner/home assets dang hard code trong `src/data/*` hoac component public
- Tai nguyen trong `public/` neu dang duoc dung lam banner/logo/placeholder

## Viec can lam

1. Chot cach luu media: external URL truoc hay upload vao Payload.
2. Migrate banner, hero, promo visuals vao Payload.
3. Chuan hoa `primaryImage`, `gallery`, `banner image`, `mobileImage`.
4. Tao report image missing, broken mapping, banner positions.

## Khong duoc lam

- Khong refactor product detail frontend.
- Khong doi service layer cua Task 5.

## Ban giao

- Script import media/banner.
- Mapping rule ro rang.
- Danh sach banner/key vi tri dang duoc support.

## Cach verify

- Banner record xuat hien trong admin.
- Product image relation/url khong mat.
- Co sample check desktop/mobile banner.

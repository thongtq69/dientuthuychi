# Hoàng Kiên Rebuild - Status

## Pass update (2026-03-11 · live homepage data extraction pass)

Completed in this pass:

### 1) Pulled live homepage source for literal labels/content
- Fetched the current live homepage HTML from `https://www.hoangkien.com/` into `live-homepage.html` for direct extraction.
- Used that live HTML to replace several still-approximate homepage strings with more literal current storefront labels.

### 2) Header/nav wording now matches live structure more closely
Applied live-derived visible top-level items/order:
- `Điện thoại`
- `Phụ kiện`
- `Linh kiện`
- `Tin tức`

Applied live-derived utility wording:
- `Chính sách bảo hành`
- `Chính sách mua lại`
- `Liên hệ`

### 3) Left category rail updated from live mega-menu labels
Replaced the left rail’s simpler synthetic list with labels derived from the live category menu / mega-menu:
- `Điện thoại`
- `iPhone 17 Series`
- `iPhone 16 Series`
- `iPhone 15 Series`
- `Phụ kiện`
- `Phụ Kiện VivuMax`
- `Linh Kiện`
- `Pin iPhone FEAGLET ( ĐẠI BÀNG )`
- `Màn hình`
- `Tin tức`

### 4) Hero/right promo references aligned closer to live assets/actions
- Continued using the real live banner assets already present in the rebuild.
- Updated right promo card labels toward the actual live destinations shown in homepage banners:
  - `Mua lại`
  - `Trade-in lên đời`
- Reduced extra invented phrasing in the hero slides and kept storefront-style wording short.

### 5) Featured categories updated with more literal live labels
Adjusted featured category naming toward the live homepage’s actual category shelf wording:
- `iPhone`
- `Phụ kiện Zin`
- `Phụ Kiện Vivumax`
- `Pin Feaglet ( Đại Bàng )`
- `Pin EU DL Chuẩn`

These continue using mirror/live-derived product imagery URLs instead of made-up assets.

### 6) Support/shortcut blocks updated toward live utilities
Refined the shortcut strip below the hero to closer live-visible utilities:
- `Hotline`
- `Hệ thống cửa hàng`
- `Tra cứu đơn hàng`
- `Giỏ hàng`

Also updated the lower support/trust block content from live footer hotline/support labels:
- `KHIẾU NẠI, GÓP Ý`
- `TƯ VẤN`
- `TÌM CHI NHÁNH`

### 7) Homepage shelf/category naming/order updated from live section titles
Adjusted shelf titles to closer live homepage section naming/order:
- `iPhone`
- `PHỤ KIỆN`
- `Pin Feaglet ( Đại Bàng )`
- `Pin EU`

Tabs were flattened to the live homepage’s simple cross-links style (`Điện thoại`, `Phụ kiện`, `Linh kiện`, `Tin tức`) instead of extra invented taxonomy copy.

### 8) Footer columns/content now use literal live-derived items
Replaced generic footer content with labels/entries extracted from the current live footer:
- `Chính sách`
- `MUA HÀNG`
- `Điều khoản dịch vụ`
- `Liên Hệ`

Applied literal/footer-derived link text such as:
- `Chính sách bảo hành 12 tháng 1 đổi 1`
- `Cam kết chất lượng`
- `Thu cũ - Đổi mới`
- `Mua lại`
- `Hướng dẫn mua hàng`
- `Quy trình mua hàng`
- `Phương thức thanh toán`
- `Phương thức vận chuyển`
- `Phương thức trả góp`

Also replaced placeholder store locations with live footer contact/store entries:
- `Cơ Sở 1: 284 Xã Đàn, Q. Đống Đa, Hà Nội: 083.888.3663`
- `Cơ Sở 2: 42 Trần Phú, Q. Hà Đông, Hà Nội: 086.888.3663`
- `Cơ Sở 3: 48 Hồng Tiến, Q. Long Biên, Hà Nội: 090.896.3993`
- `Cơ Sở 4: 403 Ngô Gia Tự - P.2, Q.10 Hồ Chí Minh: 0707.678.707`
- `Mua hàng online: 0813.600.999`

### 9) Real source coverage improved / invented copy reduced
- More homepage labels now come from the live page instead of inferred ecommerce wording.
- Store/contact/footer information is now materially closer to literal live content.
- Remaining custom phrasing was kept short and storefront-like where exact text was not practical to port directly.

## What still remains approximate

- The rebuild still does not reproduce the full live mega-menu hierarchy/flyout behavior; only the visible left-rail labels/order are now closer.
- Some destination hrefs still map to local rebuild routes rather than exact live paths, to avoid breaking the local app structure.
- Product shelves still use a reduced local product set, not exact live shelf membership/counts for every homepage module.
- The hero slide secondary text and some CTA destinations remain lightly normalized rather than exact raw live homepage copy.
- Footer links are literal in text, but most are still rendered as placeholder anchors in the rebuild footer component.
- Lower support/news/help modules remain simplified compared with the full live homepage.

## Verification

- Pending re-run after this pass

## Key files changed in this pass

- `src/app/page.js`
- `src/components/Header.jsx`
- `src/data/siteData.js`
- `STATUS.md`
- `live-homepage.html`

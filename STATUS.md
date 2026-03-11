# Hoàng Kiên Rebuild - Status

## Pass update (2026-03-11 · Wave fidelity pass 2)

Completed in this pass:

### 1) Header main row fidelity
- Replaced the simplified text-logo row with a much closer live-style header composition:
  - dark top banner strip using the live banner image
  - live logo image instead of the synthetic HK badge
  - blue `Danh mục` trigger block beside the logo
  - central search bar kept simple and storefront-like
  - hotline box isolated on the right with stronger red phone emphasis
- Reduced invented microcopy in the header and aligned the top utility wording toward live policy/contact language.

### 2) Nav row breadth / wording / order
- Tightened the main nav to the live store’s more literal top-level order:
  - `Điện thoại`
  - `Phụ kiện`
  - `Linh kiện`
  - `Tin tức`
- Shifted the top-right utility links away from generic ecommerce wording and closer to live store wording:
  - `Chính sách bảo hành`
  - `Chính sách lên đời`
  - `Chính sách mua lại`
  - `Liên hệ`

### 3) Hero / promo content and structure
- Reworked hero copy to be flatter and more literal:
  - `Hoàng Kiên iPhone, iPad and more.....`
  - short descriptive line based on the mirrored live store description
- Removed extra secondary CTA noise and reduced the hero to one primary storefront action.
- Kept the center banner + right promo stack structure, but made the content read more like a real store banner instead of custom brand prose.

### 4) Support / utility cards under hero
- Replaced more interpretive card labels with shorter, more literal store shortcuts:
  - `Hotline`
  - `Tra cứu đơn hàng`
  - `Hệ thống cửa hàng`
  - `Thu cũ đổi mới`
- Shortened the supporting values under each card so they read more like utility actions than marketing promises.

### 5) First product section wording / tabs / order
- Tightened the first product shelf to feel much closer to the live homepage taxonomy.
- Reworked section naming/tabs to more literal series-based wording:
  - `ĐIỆN THOẠI` with tabs `iPhone 17 Series`, `iPhone 16 Series`, `iPhone 15 Series`, `Xem tất cả`
- Also aligned adjacent shelves to live-style wording:
  - `PHỤ KIỆN` with `Phụ kiện Zin`, `Phụ kiện Vivumax`, `Sạc cáp`
  - `PIN FEAGLET ( ĐẠI BÀNG )` with more literal related tabs
- Changed shelf CTA text from generic `Xem tất cả` to `Xem toàn bộ sản phẩm` to better match the mirrored live wording.

### 6) Footer structure / content
- Replaced the previous generic footer grouping with more live-like columns:
  - `Chính sách`
  - `Hướng dẫn`
  - `Thông tin`
  - `Liên hệ`
- Added the real logo image in the footer and shifted footer copy toward literal store/policy wording.
- Updated the benefits strip wording to be closer to the mirrored live footer promises:
  - `Thanh toán khi nhận hàng`
  - `Cam kết uy tín hàng chính hãng`
  - `Giao hàng miễn phí 2h`
  - `Bảo hành lỗi 1 đổi 1`

### 7) Reduced approximate / invented homepage copy
- Replaced several broader invented category names with more literal homepage labels pulled from the mirror or simplified from it:
  - `Điện thoại`, `Phụ kiện`, `Linh kiện`
  - `Phụ kiện Zin`, `Phụ kiện Vivumax`, `Pin Feaglet`, `Màn hình`
- Replaced the previous generic address-style store blurb with a closer clone of the live site’s description line.
- Overall homepage copy is now flatter, more transactional, and less “written by us”.

## What was corrected most visibly

- Header now reads much closer to the live storefront shell instead of a custom rebuild brand bar.
- Homepage wording is less invented and more literally cloned from the live store’s visible taxonomy and messaging.
- Product shelf naming is materially closer to the live store’s actual structure.
- Footer no longer feels like a generic template footer; it now reads closer to the live store’s policy/help/contact layout.

## What still blocks 80+ fidelity

- The header/nav is closer visually, but still not a true mega-menu clone with icon-backed category entries and deeper flyout behavior.
- The homepage still uses simplified local data rather than the exact live category/product ordering and counts from every block.
- The left category rail and featured category icons are structurally closer, but still use approximate images / labels in places.
- Hero/banner crop, spacing, and exact typography still need side-by-side visual tuning against live/local screenshots.
- Footer contact details / store addresses are still placeholder-level rather than exact live business details.
- Some lower homepage support/help blocks remain simplified instead of being exact clones of live modules.

## Verification

- `npm run lint` ✅
- `npm run build` ✅

## Key files changed in this pass

- `src/app/page.js`
- `src/components/Footer.jsx`
- `src/components/Header.jsx`
- `src/components/HeroCarousel.jsx`
- `src/components/ProductCarouselSection.jsx`
- `src/components/SectionHeading.jsx`
- `src/data/siteData.js`
- `STATUS.md`

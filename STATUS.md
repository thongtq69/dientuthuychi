# Hoàng Kiên Rebuild - Status

## Pass update (2026-03-11 · Wave fidelity pass)

Completed in this pass:

### Wave 1 — first fold
- Reworked the header main row into a denser storefront layout:
  - blue utility strip
  - more literal logo/search/hotline row
  - compact action boxes for hotline, stores, order lookup
- Reworked the nav row so it reads more like a VN commerce header:
  - blue category trigger on the left
  - flatter horizontal nav labels without oversized dropdown presentation
- Reworked hero center treatment:
  - shorter banner-like slider instead of a dark editorial hero block
  - much shorter, transactional copy
  - tighter CTA cluster and stat chips
- Reworked right promo stack:
  - stacked compact promo banners with less decorative framing
- Reworked support/utility cards below hero:
  - reduced to simple commerce shortcuts rather than explanatory marketing cards

### Wave 2 — homepage fidelity
- Reworked left category rail treatment:
  - compact bordered list with simple chevrons and tighter line-height
- Reworked "Danh mục nổi bật":
  - moved to a denser 10-item icon grid so it feels closer to a real storefront category shelf
- Reworked first product section wording/tabs/order:
  - shorter titles and descriptions
  - more literal tab labels (iPhone / iPhone 99% / iPhone Pro Max, etc.)
- Reworked product card density/treatment in first sections:
  - smaller title block
  - red sale price styling
  - lighter borders and reduced padding
  - more products visible per row in carousels

### Wave 3 — supporting polish completed partially
- Footer moved closer to a simple commerce footer instead of a dark editorial block.
- Homepage-facing copy was shortened in major first-screen and first-commerce surfaces.
- Removed several over-designed / over-explained blocks and replaced them with flatter storefront wording.

## Major divergences corrected

- The homepage no longer opens like a branded landing page with oversized hero copy and luxury spacing.
- Header + nav now read more like a local phone-store ecommerce layout.
- The first fold now has the expected left categories / center banner / right promos composition with tighter density.
- Support shortcuts and first category shelf are now transactional rather than explanatory.
- Product shelves now read more like store inventory blocks, not showcase cards.
- Footer is less stylized and closer to a practical store footer.

## What still remains for a final live/local inspection pass

- Side-by-side visual inspection against live/local is still needed for exact spacing, font weight and banner crop fidelity.
- Some category/icon imagery is still approximate because mirrored assets/data were incomplete.
- Header/nav behavior is visually closer, but still not a true live mega-menu clone.
- Footer links/content structure is closer but still not exact to the live site.
- Additional homepage sections below the first commerce blocks could still be tightened if a later pass focuses purely on literal data extraction.

## Verification

- Run lint
- Run production build

## Key files changed in this pass

- `src/app/page.js`
- `src/components/Header.jsx`
- `src/components/HeroCarousel.jsx`
- `src/components/ProductCarouselSection.jsx`
- `src/components/ProductCard.jsx`
- `src/components/SectionHeading.jsx`
- `src/components/Footer.jsx`
- `src/data/siteData.js`
- `STATUS.md`

# Hoàng Kiên Rebuild Blueprint

## 1. What the mirror appears to be

The mirrored site strongly suggests a Sapo/Bizweb storefront rather than a custom-coded app:

- `bizweb.dktcdn.net` assets and theme references appear throughout the homepage.
- Page structure is mostly server-rendered HTML with jQuery-style behaviors and many Swiper instances.
- Routing is flat, slug-heavy, and HTML-export-friendly (`*.html`, category pages, blog pages, account/cart pages).
- The homepage is assembled from repeated, configurable blocks rather than a fully app-driven frontend.

### Detected source behavior

- Mega-menu desktop navigation with a simplified mobile menu.
- Search bar and commerce utility links in the header (hotline, store system, order lookup, cart, account).
- Multiple `Swiper` carousels for:
  - featured categories
  - product rows
  - testimonials / reviews
- Mid-page horizontal promo banners between product blocks.
- Editorial modules for news/blog and how-to/video content.
- Large footer with:
  - newsletter sign-up
  - policy badges
  - contact/store information
  - link columns

### Likely source stack

- Sapo / Bizweb theme engine
- jQuery + Swiper
- Bootstrap-like grid conventions (`container`, `row`, `col-*`, `d-lg-none`, etc.)
- Theme-managed snippets/partials

## 2. Mirror analysis summary

## Major page types detected

The mirror contains hundreds of exported HTML pages. Main page families include:

1. **Homepage**
   - `index.html`
   - dense storefront landing page with category rails, product rails, blog, video, footer

2. **Category / collection listing pages**
   - flat slugs such as `dien-thoai.html`, `phu-kien.html`, `linh-kien.html`
   - likely subcategory landing pages such as iPhone series, battery families, accessory families

3. **Product detail pages**
   - hundreds of slug pages like `iphone-17-pro-max-256gb-chinh-hang.html`
   - single product merchandising and purchase CTAs

4. **Blog/news pages**
   - `blogs/all.html` plus many article pages in root / blog-related paths
   - appears split into news, tutorials, and editorial content

5. **Informational / support pages**
   - warranty policy, store system, purchase support, order lookup

6. **Account / app utility pages**
   - `account/login.html`, `account/register.html`, cart/order-lookup related pages

## Global layout patterns

1. **Sticky utility-rich header**
   - logo / brand
   - large search
   - hotline + store system + order lookup + cart + account
   - desktop mega menu
   - mobile hamburger menu

2. **Homepage sequencing pattern**
   - hero/banner
   - featured category slider
   - promo banner
   - product carousel block
   - promo banner
   - another product carousel block
   - editorial modules
   - review/testimonial area
   - comprehensive footer

3. **Reusable commerce block pattern**
   - section title + optional inline category tabs
   - Swiper product rail
   - product card
   - “Xem toàn bộ sản phẩm” CTA

4. **Editorial block pattern**
   - prominent headline story
   - smaller stacked cards
   - video/tutorial grid

## Key responsive signals found in source

The homepage includes explicit Swiper breakpoints such as:

- category slider: 1 / 2 / 3 / 4 slides depending on width
- product rails: roughly 1.2–2 cards on mobile, 3 on tablet/small desktop, 5 on large desktop
- utility/header controls hide progressively on smaller breakpoints
- mobile nav triggered with a hamburger

### Likely original breakpoint strategy

Based on classes and Swiper configs, the original theme roughly targets:

- **< 640px**: single-column or 1–2 card rows, mobile nav
- **640–767px**: small tablet / large phone, 2-card rails
- **768–991px**: tablet, 2–3 cards
- **992–1199px**: desktop, 3 cards with more header utilities
- **>= 1200px**: full desktop, 4–5 cards and expanded nav/utility areas

## 3. Proposed target stack

## Recommended stack

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **Swiper**
- optional later:
  - **shadcn/ui** for admin-facing primitives if needed
  - **Sanity / Strapi / Supabase / Shopify-style data layer** depending on long-term catalog strategy

## Why this stack

- **Next.js** gives a maintainable React architecture with excellent routing, metadata, SSR/SSG, and image optimization.
- **Tailwind** is fast for recreating a visual storefront with lots of repeated spacing/layout patterns.
- **Swiper** maps closely to the original interaction model, reducing rebuild friction.
- This stack is modern, developer-friendly, and easy to extend page-by-page.

## Why not blindly preserve the old stack

The original theme is optimized for theme templating, not long-term frontend maintainability. Rebuilding as components unlocks:

- reusable sections
- better responsive consistency
- easier page evolution
- cleaner design token control
- easier future CMS/API integration

## 4. Page inventory for rebuild

## Phase 1 priority

1. Homepage
2. Category listing template
3. Product detail template
4. Blog listing template
5. Article template
6. Basic support/info page template

## Phase 2

7. Store system page
8. Order lookup page
9. Cart and account placeholder flows
10. Search results

## 5. Component inventory

## Global components

- AppShell / RootLayout
- Header
- Desktop mega menu
- Mobile drawer navigation
- Search box
- Utility badges / quick links
- Footer
- Footer policy strip
- Footer link columns

## Homepage components

- Hero carousel / promo banner
- Featured category rail
- Promo banner block
- Product carousel section
- Product card
- Section heading with CTA
- Editorial featured story block
- Editorial compact story list
- Video/tutorial card grid
- Review/testimonial slider placeholder

## Category/product system components

- Category hero
- Product grid
- Filter/sort bar
- Product gallery
- Product purchase panel
- Related products rail
- Breadcrumbs

## 6. Responsive strategy

## Desktop

- Wide container (~1280px max)
- Mega-menu visible
- Utility links visible in header
- Product rails show 4–5 items
- Editorial blocks use asymmetric multi-column layouts

## Tablet

- Collapse some header utilities
- Keep main nav but reduce complexity, or move toward compact nav
- Product rails show 2–3 items
- Blog/video sections collapse into balanced 2-column stacks

## Mobile

- Sticky compact header
- Hamburger drawer instead of exposed mega-menu
- Search simplified or stacked
- Product rails show 1.1–2 cards per view
- Footer collapses into stacked sections
- Prioritize tap targets, spacing, and readable cards over strict desktop fidelity

## Recommended Tailwind breakpoint intent

- `sm` 640px
- `md` 768px
- `lg` 1024px
- `xl` 1280px
- `2xl` 1536px if needed

These do not exactly match the source theme, but they align well with modern frontend defaults while still approximating the mirrored behavior.

## 7. What has been implemented in this first pass

Project scaffold created in `hoangkien-rebuild/` using Next.js + Tailwind.

Implemented:

- app shell / base layout
- responsive header
- desktop nav with hover dropdown scaffolding
- mobile navigation drawer behavior
- homepage hero carousel using Swiper
- featured category card row
- reusable section heading component
- reusable product card component
- reusable product carousel section component
- homepage sections seeded from mirrored content patterns:
  - hero/promotional slides
  - featured categories
  - three product sections
  - blog/news section
  - video/tutorial section
- responsive footer with policy badges + link columns
- setup/run instructions

## 8. Phased implementation plan

## Phase 0 — completed foundation

- analyze mirror
- choose target stack
- scaffold app
- implement homepage skeleton and core reusable components

## Phase 1 — homepage fidelity pass

- refine header to more closely match original utility layout
- convert promo banners into reusable data-driven banner components
- match spacing, radii, typography, and card density more closely
- add testimonial / reviews section

## Phase 2 — routing and templates

- create category listing template
- create product detail template
- create blog listing and article templates
- add breadcrumbs and shared metadata helpers

## Phase 3 — data extraction / migration

- parse mirrored HTML into structured JSON or markdown seed data
- normalize product/category/article content
- replace hardcoded seed arrays with generated content files or CMS/API

## Phase 4 — production hardening

- improve SEO metadata
- add analytics hooks
- optimize images and lazy loading strategy
- accessibility audit
- performance pass

## 9. Known risks and reconstruction gaps

Because this is a mirror-only reconstruction, several things are uncertain:

1. **Encoding issues**
   - some mirrored Vietnamese text appears mojibake/corrupted
   - content likely needs cleanup from source-of-truth data

2. **Business logic gaps**
   - add-to-cart, account, order lookup, and search behaviors may not be fully reconstructable from static HTML alone

3. **Data incompleteness**
   - mirror contains rendered output, not necessarily normalized catalog data, variant logic, or inventory feeds

4. **Missing interaction context**
   - some JS interactions may rely on platform APIs not represented in the static export

5. **Visual parity limits**
   - exact spacing, fonts, and theme internals may require iterative QA against the live site rather than mirror snapshots alone

## 10. Practical recommendation going forward

Best next move:

1. keep the current Next.js rebuild as the new frontend foundation
2. extract structured data from the mirror in batches
3. rebuild homepage fidelity first
4. then implement category and PDP templates
5. only after structure is stable, wire in real commerce/content data

---

## Setup / run

From `hoangkien-rebuild/`:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

For production build:

```bash
npm run build
npm run start
```

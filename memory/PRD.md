# MAGNAURA FOODS — PRD

## Project
Premium hospitality corporate site for MAGNAURA FOODS (parent brand of Mag'Momo, Momo's Adda, Mag'Rolls, Panchtatva Chai, Magnaura the food Village).

Stack: Vite + React 18 + Framer Motion + Node/Express + MongoDB. Backend is wrapped by a Python FastAPI proxy on port 8001 (`backend/server.py`) which spawns the Node/Express app and forwards `/api/*` requests to it, satisfying platform supervisor while keeping the existing Node.js code intact.

## Personas
- **Diners** browsing brand story, menu highlights and gallery, reserving a table.
- **Franchise partners** discovering brands, submitting franchise applications.
- **Corporate leads** contacting hospitality group for partnerships & press.

---

## Session (2026-01) — Phase 2 Website Enhancement
Scope: Enhance ONLY the seven sections listed by the client. All other layout, typography, colors, animations, routes and hierarchy preserved verbatim.

### Delivered (Phase 2)
1. **Hero Slider — Desktop split layout**
   - `hero-split`: text stays LEFT (max-width ~55%), food image stays RIGHT (`object-position: right center`) with a left-side emerald gradient overlay guaranteeing readability.
   - No overlap, existing hero copy, typography, buttons and animations untouched.
2. **Menu-card watermark — Hero slides 2‒5**
   - Uploaded green MAGNAURA menu card image (`/assets/menu/menu-card-bg.jpeg`) rendered as a subtle tilted stamp (blur 1px, opacity 0.55, `mix-blend`, drift animation) in the bottom-right — visible on-screen but non-obtrusive. Excluded from Slide 1.
3. **About — Premium co-founder cards**
   - New `founder-card-premium` class mirrors `brand-card` style: 560px min-height, full-bleed image, gradient overlay, gold role tag + serif name, smooth `translateY` + scale hover, gold border on hover.
4. **Home / Brands — Mag'Rolls fix**
   - Replaced pizza image with an authentic paneer kathi-roll photo (`/assets/brands/mag-rolls.jpg`, CC BY-SA 4.0, Wikimedia Commons — Shafana jasmine, Wiki Loves Food 2021).
5. **Menu Section — PDF-driven Chef Specials**
   - `menuItems` in `fallback.js` fully rebuilt from the MAGNAURA THE FOOD VILLAGE PDF: 23 Chef Special items, one highest-priced dish per category, names and prices verbatim (e.g. `PATTY KULCHA (2PCS)` Rs.169, `CHEF SPECIAL DOSA` Rs.229, `4 IN 1 PIZZA (ANY FLAVOR)` Rs.599, `TANDOORI PLATTER` Rs.599, `PANEER-E-ZAFRANI BIRYANI` Rs.369, etc.).
   - Filters simplified to only **All** and **Chef Special** (brand chips and other category chips removed).
   - `menu-card-luxury` cards show section label, exact name, description, Rs. price, and the menu-card image subtly blended into the body background.
6. **Reserve a Table button**
   - Fixed glass-morphism CTA under the navbar: gold gradient border, blur 18px, champagne shimmer sweep on hover, `Utensils` + `ArrowRight` icons, letter-spacing expansion on hover.
   - Scroll-aware — fades out after scrolling past 75% of the viewport so it never overlaps section headings (e.g. Contact H2).
7. **Gallery Page rebuild**
   - Real site navbar (identical behavior; logo returns to `/`, dropdowns/menu items link back to home anchors).
   - Cinematic full-width hero video (`/assets/hero/mag-hero.mp4`) with slow Ken-Burns zoom, warm cinematic filter, layered dark overlay + vignette for text readability.
   - "Download Hero Reel" CTA linking to `/downloads/MAGNAURA-HERO-VIDEO.mp4`.
   - Four premium masonry sections: **Restaurant Interior**, **Events**, **Fire Shows**, **Customer Moments**. 18 tiles total, mixed image/video, `loading=lazy`, hover scale + border glow.

### Video handling (Sections 1 & 8)
- No AI video-generation tool is available in-environment; recreated video files cannot be produced here. The uploaded reference `MAGHEROVIDEO1.mp4` is used directly as the hero and gallery hero video (no watermark manipulation), with CSS cinematic filters (`filter: brightness(0.62) saturate(1.14) contrast(1.14)`) and Ken-Burns motion for premium presentation.
- A downloadable copy is exposed at `/downloads/MAGNAURA-HERO-VIDEO.mp4` for the client to save into their project files.

### Files touched (this session)
- `frontend/src/App.jsx` — Hero split renderLayer, MenuShowcase simplified to All/Chef Special, ReserveTableButton with scroll-hide, `founder-card-premium` markup, imports (Utensils, useEffect).
- `frontend/src/pages/GalleryPage.jsx` — Full rebuild (site Navbar, Reserve button, cinematic hero video, four masonry sections, download CTA).
- `frontend/src/data/fallback.js` — Chef-Special menuItems from PDF + Mag'Rolls heroImage swap.
- `frontend/src/styles.css` — hero-split, hero-menu-card-bg + drift, reserve-table-btn + hide/show, founder-card-premium, menu-card-luxury, gallery-hero + zoom, gallery-section, gallery-masonry.
- `backend/server.py` — new FastAPI proxy that spawns the Node.js Express backend (existing `index.js` preserved).
- `backend/.env` — MONGO_URL, DB_NAME, EMERGENT_LLM_KEY placeholders required by platform.
- New assets: `public/assets/hero/mag-hero.mp4` (uploaded reference), `public/assets/menu/menu-card-bg.jpeg`, `public/assets/brands/mag-rolls.jpg`, `public/downloads/MAGNAURA-HERO-VIDEO.mp4`.

### Preserved (untouched)
Navbar structure and dropdowns, About body copy, Brands grid layout, Franchise band, Contact form, Footer, base color tokens, hero animations, routes, Admin pages, API endpoints and behavior.

---

## Backlog
- **(P1)** Seed the MongoDB `menuitems` collection with the same PDF Chef Specials via `/api/admin/menu` so the backend supplies the data (currently served from `fallback.js`).
- **(P1)** Recreate/replace the hero flambé video with a watermark-free, higher-resolution original (out-of-scope for in-env AI tooling — needs external videographer / Runway / Sora upload). Player wiring already targets `/assets/hero/mag-hero.mp4` so swap is a one-file drop-in.
- **(P2)** Split `App.jsx` into `components/` (Hero.jsx, MenuShowcase.jsx, Founders.jsx, ReserveTableButton.jsx) for maintainability.
- **(P2)** Extract a bespoke first-frame poster from `mag-hero.mp4` for zero-jump video first paint.
- **(P2)** Add WebP variants for Unsplash/Wikimedia stills served from the Brands & Gallery grids.
- **(P3)** Optional un-mute toggle on hero video, and IntersectionObserver-based reveal for masonry tiles below the fold.

---

## Test Report — Iteration 1 (Phase 2)
- Frontend success rate: **100%** (Playwright automated, desktop + mobile).
- Backend: skipped per scope (proxy verified via `/api/health` returning 200).
- Only cosmetic finding — Reserve a Table button overlapping Contact heading — fixed in same session via scroll-based hide (`is-hidden` class).

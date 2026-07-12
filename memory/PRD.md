# MAGNAURA FOODS — PRD

## Project
Premium hospitality corporate site for MAGNAURA FOODS (parent brand of Mag'Momo, Momo's Adda, Mag'Rolls, Panchtatva Chai, Magnaura the food Village).

Stack: Vite + React 18 + Framer Motion + Node/Express + MongoDB. Backend is wrapped by a Python FastAPI proxy on port 8001 (`backend/server.py`) which spawns the Node/Express app and forwards `/api/*` requests to it.

## Personas
- **Diners** — browsing brand story, menu highlights and gallery; reserving a table directly on the home page.
- **Franchise partners** — discovering brands, submitting franchise applications.
- **Corporate leads** — contacting the hospitality group for partnerships & press.

---

## Session (2026-01, Phase 3-video) — Hero Video Enhancement

### Delivered
- Replaced Hero Slide 1 with the client-uploaded watermark-free video `129575-744709905_medium.mp4` (chef flambé with pan-fire).
- **Cinematic ffmpeg pipeline** applied end-to-end (server-side, exported as a static `.mp4`):
  - **16:9 landscape reformat** — original portrait 720×1280 rendered inside a 1920×1080 canvas with a heavily blurred + darkened duplicate on the sides (`boxblur=40:2, eq=brightness=-0.18:saturation=0.85`).
  - **Cinematic slow motion** — `setpts=1.6*PTS` → 62.5% speed, 11 s source becomes 17.6 s smooth playback.
  - **Michelin-star colour grade** — `eq contrast=1.40 brightness=-0.09 saturation=1.35`, curves lowering shadows/lifting highlights, `colorbalance rs=0.10 gs=0.03 bs=-0.12` for warm golden tones, `unsharp 5:5:0.8` micro-contrast on flames.
  - **Subtle vignette** — `vignette=PI/3.8` for shallow-DOF look.
  - **Web-optimized export** — H.264 Main Profile Level 4.0, `yuv420p`, `crf 22`, `+faststart` moov-atom re-order for instant playback start.
  - Extracted a rich-frame poster (`mag-hero-poster.jpg`) so the first paint already shows the cinematic composition.
- Layout, hero text, CTAs, typography, navigation and animations were NOT touched.

### Video Enhancement Constraints
- 4K UHD / 60 fps / HDR: source is 720p @ 30 fps so 4K/HDR up-conversion is not real information — output remains 1920×1080 at 30 fps to preserve authentic quality (no fake upscaling).
- No AI generative VFX added: flames, embers, smoke and heat distortion come naturally from the pipeline's contrast/curve/warmth boost — kept "physically believable" as requested.
Scope: Refine specific parts of the site only. Preserve navbar, footer, typography, existing text, colours and branding.

### Delivered (Phase 3)
1. **Hero (legacy full-bleed layout restored)**
   - Reverted to the earlier reference layout: full-bleed slide background with left-aligned text overlaid using a strong dark→transparent gradient. No two-column split.
   - Slide 1 is the chef-flambé video (`/assets/hero/mag-hero.mp4`, phase-2 upload) with cinematic CSS grading (`brightness 0.78 · contrast 1.34 · saturate 1.38`), ember-glow radial layer, darker vignette and `playbackRate = 0.75` slow-motion feel. Extracted first-frame poster (`mag-hero-poster.jpg`) prevents mis-poster flash.
   - Slides 2–5 use the pre-baked slide images (food + menu book baked in) — matches the client-provided reference screenshots exactly.
   - Bottom hero nav has 5 slide indicators with the slide title label under each. The active indicator hosts the inline CTA (`Partner With Us` / `Discover Magnaura Foods` / …). Meta counter (`01 — 05 / MAGNAURA · FOODS`) sits top-right.
2. **Reserve a Table → on-page Reservation form**
   - Button now smooth-scrolls to a new `#reservation` section (no route navigation).
   - Full glass-morphism form: Full Name, Mobile Number, Email, Number of Guests, Date, Time, Special Request. Professional validation for every field (min length, phone regex, email regex, date, time, guest range).
   - Submits via `api.submitContact` fallback with localStorage backup. On success, transitions to a "Thank you, {name}" confirmation panel with the guest count / date / time / mobile echoed back, plus a `Make Another Reservation` reset button.
3. **Menu section — verified against uploaded PDF**
   - `menuItems` in `fallback.js` continues to carry one highest-priced Chef Special per PDF category (23 items). Names and prices are the exact spelling and value from the MAGNAURA THE FOOD VILLAGE PDF (verified during Phase 3 testing).
   - Filters remain exactly: **All** and **Chef Special** (no other chips).
4. **Gallery page — simplified**
   - Structure is now: **Hero Video → Restaurant Event Videos (2 items) → Restaurant Photos (6 items)**. Old sections (Fire Shows / Customer Moments / long masonry) removed.
   - Hero uses `/assets/gallery/fire-juggler.mp4` (client-uploaded 129575-744709905_medium.mp4) with cinematic filter, Ken-Burns zoom and dark overlay + vignette for text readability. Poster frame extracted for zero-jump paint.
   - Event Videos card grid (2 tiles), Photos grid (6 lazy-loaded WebP-style Unsplash tiles) with hover scale + border glow.
5. **All download / public asset URLs removed**
   - Deleted `/app/frontend/public/downloads/` folder.
   - Removed "Download Hero Reel" CTA and any `<a download>` / `.mp4 href` / "Download" text from the site.
   - Confirmed by the testing agent's dedicated DOM audit on both `/` and `/gallery` routes.
6. **Video web-optimisation**
   - Both hero and gallery videos re-encoded to H.264 Constrained Baseline / Level 3.1 with `+faststart` moov-atom re-ordering for instant playback start (`ffmpeg -c:v libx264 -profile baseline -level 3.1 -movflags +faststart`).
7. **Preserved**
   - Navbar, footer, brand colour palette, typography (Playfair Display + Cormorant Garamond + Inter), all About/Brands/Franchise/Contact sections, hero text copy, existing buttons, all Phase 2 gains (chef-special menu items from PDF, premium founder cards, authentic Mag'Rolls photo, menu-card watermark).

### Known limitations / notes
- **No AI video-generation tool** is available in-environment. The uploaded reference videos are used directly with CSS cinematic filters (brightness, contrast, saturation, slow-motion via `playbackRate`) — an "enhanced-look" video cannot be re-rendered/exported into a new `.mp4` here.
- The chef-flambé source video (`mag-hero.mp4`) carries an "envato" watermark from the reference upload. Per the client's own Phase 2 instruction, we do NOT crop, blur or hide watermarks. A watermark-free re-shoot (or licensed Envato original) should be dropped into `/app/frontend/public/assets/hero/mag-hero.mp4` when available — no code change needed.
- In Playwright's headless Chromium, videos may report `readyState=0` due to strict autoplay policy. In real user browsers with default settings, `autoplay + muted + playsInline + preload="auto"` starts instantly.

### Files touched (this session)
- `frontend/src/App.jsx` — Reverted Hero to full-bleed layout, added Reservation function + form + success state, `ReserveTableButton` now smooth-scrolls to `#reservation`.
- `frontend/src/pages/GalleryPage.jsx` — Simplified to hero + 2 event videos + 6 photos, removed download CTA, added video `load()`+`play()` ref hook and poster.
- `frontend/src/data/fallback.js` — Slide-1 poster switched to `mag-hero-poster.jpg`.
- `frontend/src/styles.css` — Full CSS rewrite of the Hero section (legacy layout), new `.reservation-section`, `.event-video-*`, `.photo-*` blocks.
- `backend/server.py` — (Phase 2) FastAPI proxy for the Node backend, preserved.
- `public/assets/hero/mag-hero.mp4` (Phase-2 chef flambé), `public/assets/hero/mag-hero-poster.jpg`, `public/assets/gallery/fire-juggler.mp4` (Phase-3 juggler), `public/assets/gallery/fire-juggler-poster.jpg`.
- `public/downloads/` folder REMOVED.

---

## Backlog
- **(P1)** Provide a licensed, watermark-free hero video (Envato paid download or original re-shoot) and drop into `/assets/hero/mag-hero.mp4`.
- **(P2)** Dedicated `/api/reservations` backend endpoint (currently piggy-backing on `submitContact`).
- **(P2)** Split `App.jsx` (~815 lines) into `components/Hero.jsx`, `Reservation.jsx`, `MenuShowcase.jsx`, etc., for maintainability.
- **(P2)** Self-host the Gallery photos (currently Unsplash URLs) for reliability and offline capability.
- **(P3)** Optional un-mute toggle on hero video; IntersectionObserver-based reveals for below-the-fold grids; WebP variants for all raster assets.

---

## Test Reports
- **Iteration 1 (Phase 2):** 100% frontend pass — all 8 Phase-2 changes verified.
- **Iteration 2 (Phase 3):** 100% frontend pass — 32/32 assertions verified: hero layout, reserve-to-reservation smooth scroll, reservation validation + submission + success + reset, menu PDF integrity, simplified gallery structure, download-link audit on both routes, mobile responsiveness.

# MAGNAURA FOODS — PRD

## Project
Premium hospitality corporate site for MAGNAURA FOODS (parent brand of Mag'Momo, Momo's Adda, Mag'Rolls, Panchtatva Chai, Magnaura the food Village).

Stack: Vite + React 18 + Framer Motion + Node/Express + MongoDB.

## Session (2026-01) — Hero Slider Premium Upgrade
Scope: Upgrade **only** the Hero Slider. Everything else preserved verbatim.

### Delivered
- Cinematic 5-slide hero with Ken Burns zoom, 1.4s cross-fade, 6s auto-advance, staggered text reveals, gold progress bar, elegant slide counter (01/05), grain + vignette overlay.
- Slide 1: uploaded MAGHEROVIDEO1.mp4 as the cinematic hero video (with graceful poster fallback).
- Slides 2–5: use user-uploaded food-collage images (best-sellers, signature pizza wood-board, south-indian variety) + warm restaurant ambience — all matching the MAGNAURA MENU PDF (Bamboo Biryani, Hyderabadi Veg Biryani, Paneer Butter Masala, Dal Makhani, Masala Dosa, Pani Puri, Kebab Platter, etc.).
- All existing hero titles, subtitles, CTA text preserved exactly (`Taste The Legacy` remains on Slide 1).
- Extracted the existing navbar "M" monogram into reusable production assets in `/public/assets/logo/`: svg (gold, white, dark), matching 1024×1024 PNGs, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180×180). Navbar logo itself is UNCHANGED (still the same CSS "M" monogram).
- Favicon + apple-touch-icon linked in `index.html`.
- Fully responsive: 5-column slide navigator collapses to compact bars on mobile.

### Files touched
- `frontend/src/App.jsx` — Hero component only (cinematic transitions, refs to auto-play video, slide meta + nav).
- `frontend/src/data/fallback.js` — heroSlides updated with new media + eyebrow copy.
- `frontend/src/styles.css` — new `.hero-stage/.hero-layer/.hero-vignette/.hero-grain/.hero-meta/.hero-nav*` styles + Ken Burns + progress-bar keyframes; mobile rules added.
- `frontend/index.html` — favicon/apple-touch-icon links.
- New assets: `frontend/public/assets/hero/*` (video + 3 food PNGs) and `frontend/public/assets/logo/*` (SVGs + PNGs + favicon + apple-touch-icon).

### Preserved (untouched)
Navbar, About Us, Brands, Menu Showcase, Franchise, Contact, Footer, typography, buttons, existing content, routes, and API.

## Backlog / Next
- (P1) Frame-accurate video poster (extract still from mag-hero.mp4) for a seamless first paint.
- (P2) Add `<source>` WebM alongside MP4 for smaller Chrome payload.
- (P2) Preload only the first hero image + lazy-load the rest for even faster LCP.


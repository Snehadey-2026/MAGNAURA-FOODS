# MAGNAURA FOODS — PRD

## Project
Premium hospitality corporate site for MAGNAURA FOODS (parent brand of Mag'Momo, Momo's Adda, Mag'Rolls, Panchtatva Chai, Magnaura the food Village).

Stack: Vite + React 18 + Framer Motion + Node/Express + MongoDB.

## Session (2026-01) — Hero Slider + Menu + Preview
Scope: Upgrade only the Hero Slider, remove Menu search, ensure preview URL works. Everything else preserved verbatim.

### Delivered
- **Preview URL now works** — added `start` script (`vite --host 0.0.0.0 --port 3000`) so supervisor's `yarn start` boots the frontend, and Vite is configured with `host: 0.0.0.0`, `port: 3000`, `strictPort`, `allowedHosts: true`.
- **Menu section**: search input + `Search` icon import + `search` state + search-based filter all removed. Only Brand + Category chips remain.
- **Hero Slider** — 5-slide cinematic experience with Ken Burns zoom (8s), 1.4s cross-fade, 6s auto-advance, staggered text reveals, gold progress bar, `01 / 05` counter, grain + vignette:
  - Slide 1 · VIDEO ONLY — uploaded `MAGHEROVIDEO1.mp4` with hardened autoplay (muted + playsInline + `.play()` retries on `loadeddata`/`canplay` + first-interaction fallback).
  - Slide 2 · NORTH INDIAN — Bamboo Veg Biryani (spilled from hollowed bamboo) + Paneer Butter Masala + Dal Makhani + Malai Kofta + Butter Naan + Jeera Rice.
  - Slide 3 · SOUTH INDIAN — Masala Dosa + Idli stack + Medu Vada + Sambar + trio of chutneys (coconut / tomato / podi).
  - Slide 4 · INDO-CHINESE — Hakka Noodles + Schezwan Fried Rice + Steamed Momos in bamboo basket + Honey Chilli Potato + Paneer Manchurian.
  - Slide 5 · DESSERTS & ICE CREAM — Gulab Jamun with Ice Cream + Gajar Ka Halwa + Moong Dal Halwa + Rabdi Jalebi + Triple Sundae.
- All 4 slide backgrounds freshly AI-generated via Gemini Nano Banana (`gemini-3.1-flash-image-preview`) — Michelin-star editorial food photography, warm cinematic lighting, dishes clustered left-of-center so hero text stays clean on the right.
- Original hero copy preserved exactly (`Taste The Legacy` etc.).
- Existing navbar "M" monogram untouched; production logo assets in `/public/assets/logo/` (SVG + PNG gold/white/dark, favicon.ico 16·32·48, apple-touch-icon 180×180). Favicon linked in `index.html`.

### Files touched
- `frontend/vite.config.js` — bind 0.0.0.0:3000, allowedHosts.
- `frontend/package.json` — added `start` and preview scripts.
- `frontend/src/App.jsx` — Hero component only + removed Menu search field / import / state / filter.
- `frontend/src/data/fallback.js` — heroSlides updated to 5-category spread.
- `frontend/src/styles.css` — cinematic hero styles + Ken Burns + progress-bar keyframes + mobile rules.
- `frontend/index.html` — favicon links.
- `backend/.env` — added `EMERGENT_LLM_KEY` for image generation.
- New assets: `frontend/public/assets/hero/mag-hero.mp4`, `slide2-north-indian.png`, `slide3-south-indian.png`, `slide4-chinese.png`, `slide5-desserts.png`, plus `/public/assets/logo/*` and root `favicon.ico` / `apple-touch-icon.png`.

### Preserved (untouched)
Navbar (same "M" monogram), About Us, Brands, Menu Showcase (grid + brand/category chips), Franchise, Contact, Footer, typography, buttons, routing, API.

## Backlog / Next
- (P1) Extract a specific still-frame from mag-hero.mp4 as the video poster (identical first-paint continuity).
- (P2) WebM alternate source for the hero video (smaller Chrome payload).
- (P3) Optional un-mute toggle on Slide 1 for ambient kitchen audio.


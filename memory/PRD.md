# MAGNAURA FOODS — PRD

## Project
Premium hospitality corporate site for MAGNAURA FOODS (parent brand of Mag'Momo, Momo's Adda, Mag'Rolls, Panchtatva Chai, Magnaura the food Village).

Stack: Vite + React 18 + Framer Motion + Node/Express + MongoDB.

## Session (2026-01) — Hero Slider Premium Upgrade
Scope: Upgrade **only** the Hero Slider. Everything else preserved verbatim.

### Delivered
- Cinematic 5-slide hero with Ken Burns zoom (8s), 1.4s cross-fade, 6s auto-advance, staggered text reveals, gold progress bar, elegant slide counter (01/05), grain + vignette overlay, MAGNAURA · FOODS meta tag.
- **Slide 1** — video only: uploaded `MAGHEROVIDEO1.mp4` with hardened autoplay (muted + defaultMuted + playsInline + `.play()` retry on `loadeddata`/`canplay` + fallback to first user interaction). Poster: dal-makhani ambience shot (differs from slide 2 to avoid duplicate first paint).
- **Slides 2–5** — freshly AI-generated Michelin-quality food photography (Gemini Nano Banana `gemini-3.1-flash-image-preview`), each dish faithfully matching the MAGNAURA menu PDF:
  - Slide 2 · PANEER BUTTER MASALA in hammered copper karahi with tandoori naan.
  - Slide 3 · HYDERABADI VEG BIRYANI in copper handi with boondi raita and steam.
  - Slide 4 · ASSORTED TANDOORI PLATTER (Paneer Malai Tikka + Achari Tikka + Hara Bhara + Galouti + Broccoli Tikka) with mint chutney.
  - Slide 5 · DAL MAKHANI lifestyle shot in a warm luxury restaurant setting (jharokha lattice, velvet chairs, candlelight).
- All original hero copy preserved exactly (`Taste The Legacy`, `A World of Flavors. One Vision.`, `Building the Future of Hospitality`, `Designed for Modern Hospitality`, `Experiences that Last`).
- Existing navbar "M" monogram **untouched**; extracted into production assets `/public/assets/logo/` (svg/png in gold/white/dark, favicon.ico 16·32·48, apple-touch-icon 180×180). Favicon linked in `index.html`.
- Fully responsive: navigator collapses to compact bars on mobile.

### Files touched
- `frontend/src/App.jsx` — Hero component only (cinematic transitions, layered stage, hardened autoplay).
- `frontend/src/data/fallback.js` — heroSlides updated with new media + eyebrow copy.
- `frontend/src/styles.css` — `.hero-stage/.hero-layer/.hero-vignette/.hero-grain/.hero-meta/.hero-nav*` styles + Ken Burns + progress-bar keyframes; mobile rules.
- `frontend/index.html` — favicon / apple-touch-icon links.
- `backend/.env` — added `EMERGENT_LLM_KEY` (used only for one-off image generation).
- New assets: `frontend/public/assets/hero/mag-hero.mp4`, `slide2-paneer-butter-masala.png`, `slide3-hyderabadi-biryani.png`, `slide4-tandoori-platter.png`, `slide5-dal-makhani.png`, plus `frontend/public/assets/logo/*` and root `favicon.ico` / `apple-touch-icon.png`.

### Preserved (untouched)
Navbar, About Us, Brands, Menu Showcase, Franchise, Contact, Footer, typography, buttons, existing content, routes, and API.

## Backlog / Next
- (P1) Extract a specific still-frame from mag-hero.mp4 as the video's poster for identical first-paint continuity.
- (P2) Encode a WebM alternate source for the hero video to lower Chrome payload.
- (P2) Preload only slide 2 image + lazy-load 3-5 for even faster LCP.
- (P3) Optional un-mute toggle on slide 1 to let guests enjoy the kitchen ambience audio.


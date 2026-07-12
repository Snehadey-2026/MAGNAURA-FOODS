import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Menu as MenuIcon,
  Utensils,
  X,
} from 'lucide-react';
import { usePublicData } from '../hooks/usePublicData';

/* ============================================================
   GALLERY PAGE — Phase 3 simplification
   Sections in order:
     1. Hero video (fire juggler, cinematic)
     2. Restaurant Event Videos (2–3 videos)
     3. Restaurant Photos (elegant grid)
   Nothing else.
   ============================================================ */

function GalleryNavbar({ brands }) {
  const [open, setOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const links = ['ABOUT US', 'BRANDS', 'MENU', 'GALLERY', 'FRANCHISE'];

  const goHomeAnchor = (link) =>
    `/#${link.toLowerCase().replace(' us', '').replace(' ', '-')}`;

  return (
    <header className="nav-shell" data-testid="gallery-nav-shell">
      <nav className="navbar">
        <Link to="/" className="logo-mark" aria-label="MAGNAURA FOODS home">
          <span className="logo-emblem">M</span>
          <span>
            <strong>MAGNAURA</strong>
            <small>FOODS</small>
          </span>
        </Link>
        <button
          className="icon-button mobile-only"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
          data-testid="gallery-mobile-menu-btn"
        >
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((link) =>
            link === 'BRANDS' ? (
              <div
                className="nav-dropdown"
                key={link}
                onMouseEnter={() => setBrandOpen(true)}
                onMouseLeave={() => setBrandOpen(false)}
              >
                <Link to="/#brands" onClick={() => setOpen(false)}>
                  {link} <ChevronDown size={14} />
                </Link>
                <AnimatePresence>
                  {brandOpen && (
                    <motion.div
                      className="dropdown-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {brands.map((brand) => (
                        <a
                          key={brand.name}
                          href={brand.website || '/#brands'}
                          target={brand.website ? '_blank' : undefined}
                          rel={brand.website ? 'noreferrer noopener' : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {brand.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : link === 'GALLERY' ? (
              <Link to="/gallery" key={link} onClick={() => setOpen(false)}>
                {link}
              </Link>
            ) : (
              <Link to={goHomeAnchor(link)} key={link} onClick={() => setOpen(false)}>
                {link}
              </Link>
            ),
          )}
          <Link className="nav-cta" to="/#contact" onClick={() => setOpen(false)}>
            CONTACT US
          </Link>
        </div>
      </nav>
    </header>
  );
}

function GalleryReserveButton() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY < window.innerHeight * 0.75);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div
      className={`reserve-table-shell ${visible ? 'is-visible' : 'is-hidden'}`}
      data-testid="reserve-table-shell"
    >
      <Link
        to="/#reservation"
        className="reserve-table-btn"
        data-testid="reserve-table-btn"
        aria-label="Reserve a Table"
        tabIndex={visible ? 0 : -1}
      >
        <span className="reserve-table-icon" aria-hidden="true">
          <Utensils size={16} />
        </span>
        <span className="reserve-table-label">Reserve a Table</span>
        <span className="reserve-table-arrow" aria-hidden="true">
          <ArrowRight size={16} />
        </span>
      </Link>
    </div>
  );
}

const eventVideos = [
  {
    title: 'Live Fire Juggling Performance',
    label: 'Signature Event',
    src: '/assets/gallery/fire-juggler.mp4',
  },
  {
    title: 'Chef\u2019s Flambé at the Pass',
    label: 'Kitchen Theatre',
    src: '/assets/hero/mag-hero.mp4',
  },
];

const restaurantPhotos = [
  {
    title: 'Emerald Dining Hall',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
    span: 'wide',
  },
  {
    title: 'Private Lounge',
    src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Chef\u2019s Counter',
    src: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Bar & Mixology',
    src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=85',
    span: 'tall',
  },
  {
    title: 'Family Seating Alcove',
    src: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Signature Plating',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85',
  },
];

function EventVideoCard({ video, index }) {
  return (
    <motion.article
      className="event-video-card"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`event-video-${video.title}`}
    >
      <video
        src={video.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="event-video-caption">
        <span>{video.label}</span>
        <h4>{video.title}</h4>
      </div>
    </motion.article>
  );
}

function PhotoTile({ photo, index }) {
  return (
    <motion.figure
      className={`photo-tile photo-tile-${photo.span || 'md'}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`photo-tile-${photo.title}`}
    >
      <img src={photo.src} alt={photo.title} loading="lazy" decoding="async" />
      <figcaption>{photo.title}</figcaption>
    </motion.figure>
  );
}

export default function GalleryPage() {
  const { brands } = usePublicData();

  return (
    <>
      <GalleryNavbar brands={brands} />
      <GalleryReserveButton />

      <main>
        <section className="gallery-hero" data-testid="gallery-hero">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/gallery/fire-juggler-poster.jpg"
            ref={(el) => {
              if (!el) return;
              el.muted = true;
              el.playbackRate = 0.85;
              el.load();
              const tryPlay = () => el.play().catch(() => {});
              tryPlay();
              el.addEventListener('loadeddata', tryPlay, { once: true });
              el.addEventListener('canplay', tryPlay, { once: true });
            }}
          >
            <source src="/assets/gallery/fire-juggler.mp4" type="video/mp4" />
          </video>
          <div className="gallery-hero-content">
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              MAGNAURA · Gallery
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Moments, made cinematic.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              A living portfolio of live performances, kitchen theatre and the guest moments
              that define the MAGNAURA hospitality experience.
            </motion.p>
          </div>
        </section>

        <section className="gallery-section" data-testid="gallery-section-events" id="event-videos">
          <div className="gallery-section-heading">
            <div>
              <span className="eyebrow">Restaurant Event Videos</span>
              <h2>Live theatre, every evening.</h2>
              <p style={{ maxWidth: '620px', marginTop: '10px' }}>
                Signature performances captured on the floor — the fire juggler, the chef&apos;s flambé,
                and the moments guests remember.
              </p>
            </div>
          </div>
          <div className="event-video-grid">
            {eventVideos.map((video, i) => (
              <EventVideoCard key={video.title} video={video} index={i} />
            ))}
          </div>
        </section>

        <section className="gallery-section" data-testid="gallery-section-photos" id="restaurant-photos">
          <div className="gallery-section-heading">
            <div>
              <span className="eyebrow">Restaurant Photos</span>
              <h2>Interiors, plating and ambience.</h2>
              <p style={{ maxWidth: '620px', marginTop: '10px' }}>
                Warm woods, emerald tones and champagne gold — every corner of MAGNAURA is
                designed for a private celebration.
              </p>
            </div>
          </div>
          <div className="photo-grid">
            {restaurantPhotos.map((photo, i) => (
              <PhotoTile key={photo.title} photo={photo} index={i} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

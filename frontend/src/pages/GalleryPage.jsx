import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Download,
  Menu as MenuIcon,
  Utensils,
  X,
} from 'lucide-react';
import { usePublicData } from '../hooks/usePublicData';

/* ============================================================
   GALLERY PAGE – Phase 2 rebuild
   - Uses the same Navbar behavior as the Home page
   - Full-width cinematic hero video (uploaded reference)
   - Sections: Restaurant Interior, Events, Fire Shows, Customer Moments
   - Masonry grid, lazy-loaded, premium hover animations
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

function ReserveTableButton() {
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
        to="/#contact"
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

const gallerySections = [
  {
    id: 'restaurant-interior',
    eyebrow: 'Ambience',
    title: 'Restaurant Interior',
    description:
      'Warm woods, emerald tones and champagne gold accents — every dining hall is designed to feel like a private celebration.',
    tiles: [
      {
        span: 'span-tall',
        type: 'image',
        label: 'Main Hall',
        title: 'Emerald Dining Hall',
        src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
      },
      {
        span: 'span-wide',
        type: 'image',
        label: 'Lounge',
        title: 'Private Lounge Setup',
        src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Detail',
        title: 'Chef\u2019s Counter',
        src: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Detail',
        title: 'Bar & Mixology',
        src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Alcove',
        title: 'Family Seating Alcove',
        src: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=900&q=85',
      },
    ],
  },
  {
    id: 'events',
    eyebrow: 'Occasions',
    title: 'Events',
    description:
      'Anniversaries, corporate soirees, family celebrations — where the space transforms for the moment.',
    tiles: [
      {
        span: 'span-wide',
        type: 'image',
        label: 'Celebration',
        title: 'Anniversary Evening',
        src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1400&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Corporate',
        title: 'Business Gathering',
        src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Buffet',
        title: 'Live Buffet Reveal',
        src: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=85',
      },
      {
        span: 'span-lg',
        type: 'image',
        label: 'Toast',
        title: 'A Night to Remember',
        src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1400&q=85',
      },
    ],
  },
  {
    id: 'fire-shows',
    eyebrow: 'Signature',
    title: 'Fire Shows',
    description:
      'Cinematic live-fire performances that turn dinner into a spectacle — sparks, chef\u2019s theatre and slow-motion flames.',
    tiles: [
      {
        span: 'span-tall',
        type: 'video',
        label: 'Signature Show',
        title: 'Chef\u2019s Flambé Performance',
        src: '/assets/hero/mag-hero.mp4',
      },
      {
        span: 'span-wide',
        type: 'image',
        label: 'Live Fire',
        title: 'Torchlit Table Service',
        src: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1400&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Sparks',
        title: 'Sparks & Steel',
        src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Flame',
        title: 'Slow-Motion Flame',
        src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=85',
      },
    ],
  },
  {
    id: 'customer-moments',
    eyebrow: 'Guests',
    title: 'Customer Moments',
    description:
      'The heart of MAGNAURA — laughter shared over plates, families gathered, memories built one meal at a time.',
    tiles: [
      {
        span: 'span-wide',
        type: 'image',
        label: 'Family',
        title: 'Family Dining Moment',
        src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Toast',
        title: 'A Warm Toast',
        src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=85',
      },
      {
        span: 'span-md',
        type: 'image',
        label: 'Guests',
        title: 'Return Guests',
        src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85',
      },
      {
        span: 'span-lg',
        type: 'image',
        label: 'Together',
        title: 'Around a Shared Plate',
        src: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1400&q=85',
      },
      {
        span: 'span-tall',
        type: 'image',
        label: 'Smile',
        title: 'A Memorable Smile',
        src: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=85',
      },
    ],
  },
];

function GalleryTile({ tile, index }) {
  const isVideo = tile.type === 'video';
  return (
    <motion.article
      className={`gallery-tile ${tile.span || 'span-md'}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`gallery-tile-${tile.title}`}
    >
      {isVideo ? (
        <video
          src={tile.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img src={tile.src} alt={tile.title} loading="lazy" decoding="async" />
      )}
      <div className="tile-caption">
        <span>{tile.label}</span>
        <h4>{tile.title}</h4>
      </div>
    </motion.article>
  );
}

export default function GalleryPage() {
  const { brands } = usePublicData();

  return (
    <>
      <GalleryNavbar brands={brands} />
      <ReserveTableButton />

      <main>
        <section className="gallery-hero" data-testid="gallery-hero">
          <video
            src="/assets/hero/mag-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/hero/slide2-north-indian.png"
          />
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
              A living portfolio of interiors, events, fire shows and the guest moments that
              define the MAGNAURA hospitality experience.
            </motion.p>
            <motion.a
              href="/downloads/MAGNAURA-HERO-VIDEO.mp4"
              download
              className="gold-button"
              style={{ marginTop: '28px' }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              data-testid="gallery-hero-download"
            >
              <Download size={16} /> Download Hero Reel
            </motion.a>
          </div>
        </section>

        {gallerySections.map((section) => (
          <section key={section.id} id={section.id} className="gallery-section" data-testid={`gallery-section-${section.id}`}>
            <div className="gallery-section-heading">
              <div>
                <span className="eyebrow">{section.eyebrow}</span>
                <h2>{section.title}</h2>
                <p style={{ maxWidth: '620px', marginTop: '10px' }}>{section.description}</p>
              </div>
            </div>
            <div className="gallery-masonry">
              {section.tiles.map((tile, index) => (
                <GalleryTile key={`${section.id}-${index}`} tile={tile} index={index} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}

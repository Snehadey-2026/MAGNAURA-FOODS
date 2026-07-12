import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Building2,
  ChevronDown,
  Gem,
  Globe2,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Utensils,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api } from './lib/api';
import { usePublicData } from './hooks/usePublicData';

const companyContact = {
  phone: '+91 79747 54130',
  address: 'Corporate Address, India',
  email: import.meta.env.VITE_COMPANY_EMAIL || 'magnaurafoods@gmail.com',
};

const sectionMotion = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export const isVideoUrl = (url) => typeof url === 'string' && /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(url);

const getMediaType = (item) => {
  if (item?.mediaType === 'video') return 'video';
  if (item?.mediaType === 'image') return 'image';
  return isVideoUrl(item?.mediaUrl) ? 'video' : 'image';
};

function LogoMark() {
  return (
    <a href="#home" className="logo-mark" aria-label="MAGNAURA FOODS home">
      <span className="logo-emblem">M</span>
      <span>
        <strong>MAGNAURA</strong>
        <small>FOODS</small>
      </span>
    </a>
  );
}

function Navbar({ brands }) {
  const [open, setOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const links = ['ABOUT US', 'BRANDS', 'MENU', 'GALLERY', 'FRANCHISE'];

  const getBrandHref = (brand) => brand.website || '#brands';

  return (
    <header className="nav-shell">
      <nav className="navbar">
        <LogoMark />
        <button className="icon-button mobile-only" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
          {open ? <X size={20} /> : <Menu size={20} />}
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
                <a href="#brands" onClick={() => setOpen(false)}>
                  {link} <ChevronDown size={14} />
                </a>
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
                          href={getBrandHref(brand)}
                          key={brand.name}
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
              <a href={`#${link.toLowerCase().replace(' us', '').replace(' ', '-')}`} key={link} onClick={() => setOpen(false)}>
                {link}
              </a>
            ),
          )}
          <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>
            CONTACT US
          </a>
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
  const scrollToReservation = (e) => {
    e.preventDefault();
    const el = document.getElementById('reservation');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div
      className={`reserve-table-shell ${visible ? 'is-visible' : 'is-hidden'}`}
      data-testid="reserve-table-shell"
    >
      <a
        href="#reservation"
        onClick={scrollToReservation}
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
      </a>
    </div>
  );
}

function Hero({ slides }) {
  const safeSlides = slides && slides.length ? slides : [];
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const total = safeSlides.length;

  useEffect(() => {
    if (total < 2) return undefined;
    const timer = setInterval(() => {
      setPrev(active);
      setActive((value) => (value + 1) % total);
    }, 6500);
    return () => clearInterval(timer);
  }, [total, active]);

  useEffect(() => {
    if (prev === null) return undefined;
    const t = setTimeout(() => setPrev(null), 1500);
    return () => clearTimeout(t);
  }, [prev]);

  if (!total) return <section className="hero" id="home" />;

  const activeSlide = safeSlides[active] || {};
  const prevSlide = prev !== null ? safeSlides[prev] : null;
  const activeCtaHref = activeSlide.title === 'Taste The Legacy' ? '#franchise' : '#brands';
  const goTo = (index) => {
    if (index === active) return;
    setPrev(active);
    setActive(index);
  };

  const renderLayer = (slide, key, isActive, slideIndex) => {
    if (!slide) return null;
    const type = getMediaType(slide);
    const isVideoSlide = slideIndex === 0;
    return (
      <div
        className={`hero-layer ${isActive ? 'is-active' : 'is-leaving'} ${
          isVideoSlide ? 'hero-layer-video' : 'hero-layer-image'
        }`}
        key={key}
        aria-hidden="true"
        data-testid={`hero-layer-${slideIndex}`}
      >
        {type === 'video' ? (
          <video
            src={slide.mediaUrl}
            poster={slide.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            ref={(el) => {
              if (!el) return;
              el.muted = true;
              // Cinematic slow-motion feel for the chef flambé
              el.playbackRate = 0.75;
              const attempt = () => {
                const p = el.play();
                if (p && typeof p.catch === 'function') {
                  p.catch(() => {
                    const retry = () => {
                      el.play().catch(() => {});
                      document.removeEventListener('click', retry);
                      document.removeEventListener('touchstart', retry);
                      document.removeEventListener('scroll', retry);
                    };
                    document.addEventListener('click', retry, { once: true });
                    document.addEventListener('touchstart', retry, { once: true });
                    document.addEventListener('scroll', retry, { once: true });
                  });
                }
              };
              attempt();
              el.addEventListener('loadeddata', attempt, { once: true });
              el.addEventListener('canplay', attempt, { once: true });
            }}
          />
        ) : (
          <img src={slide.mediaUrl} alt="" loading={isActive ? 'eager' : 'lazy'} />
        )}
      </div>
    );
  };

  const counter = String(active + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  return (
    <section className={`hero hero-legacy hero-slide-${active}`} id="home" data-testid="hero-section">
      <div className="hero-stage">
        {renderLayer(prevSlide, `prev-${prev}`, false, prev ?? 0)}
        {renderLayer(activeSlide, `active-${active}-${activeSlide.mediaUrl}`, true, active)}
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      <motion.div
        className="hero-content"
        key={`content-${active}`}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <span className="eyebrow">{activeSlide.eyebrow || 'Luxury Corporate Hospitality Group'}</span>
        <motion.h1
          key={`title-${active}`}
          initial={{ opacity: 0, y: 26, letterSpacing: '0.02em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0em' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          {activeSlide.title}
        </motion.h1>
        <motion.p
          key={`sub-${active}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
        >
          {activeSlide.subtitle}
        </motion.p>
      </motion.div>

      <div className="hero-meta" aria-hidden="true">
        <span className="hero-meta-counter">
          <strong>{counter}</strong>
          <span className="hero-meta-divider" />
          <em>{totalStr}</em>
        </span>
        <span className="hero-meta-brand">MAGNAURA · FOODS</span>
      </div>

      <div className="hero-nav" role="tablist" aria-label="Hero slides">
        {safeSlides.map((slide, index) => {
          const cleanTitle = (slide.title || '').replace(/\n/g, ' ');
          return (
            <button
              key={cleanTitle}
              className={`hero-nav-item ${index === active ? 'active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Show slide ${index + 1}: ${cleanTitle}`}
              data-testid={`hero-indicator-${index}`}
            >
              {index === active ? (
                <a
                  href={activeCtaHref}
                  className="gold-button hero-nav-cta"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="hero-cta"
                >
                  {activeSlide.cta} <ArrowRight size={16} />
                </a>
              ) : (
                <span className="hero-nav-index">{String(index + 1).padStart(2, '0')}</span>
              )}
              <span className="hero-nav-track">
                <span className="hero-nav-fill" key={`${index}-${active}`} />
              </span>
              <span className="hero-nav-label">{cleanTitle}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function About() {
  const stats = [
    ['Brands Owned', '05+'],
    ['Franchise Partners', '25+'],
    ['Cities Served', '2+'],
    ['Customer Reach', '1M+'],
  ];
  const founders = [
  {
    name: 'Monjoy Bose',
    position: 'CEO & Co-Founder',
    image: '/images/monjoy.jpeg',
  },
  {
    name: 'Piu Bhattacharya Jhamnani',
    position: 'COO & Co-Founder',
    image: '/images/piu.jpeg',
  },
  {
    name: 'Eshant Jhamnani',
    position: 'Director & Co-Founder',
    image: '/images/eshant.jpeg',
  },
];

  return (
    <motion.section className="section about-section" id="about" variants={sectionMotion} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="about-intro">
        <span className="eyebrow">About Magnaura Foods</span>
        <h2>A premium hospitality house built for enduring food brands.</h2>
        <p>
          MAGNAURA FOODS creates, scales, and operates elevated dining concepts with a disciplined focus on
          hospitality excellence, brand depth, operational consistency, and long-term franchise value.
        </p>
      </div>
      <div className="founder-row founder-row-premium" data-testid="founders-row">
        {founders.map((founder) => (
          <article className="founder-card founder-card-premium" key={founder.name} data-testid={`founder-card-${founder.name}`}>
            <img src={founder.image} alt={founder.name} loading="lazy" />
            <div className="founder-card-body">
              <span className="founder-role-tag">{founder.position}</span>
              <h3>{founder.name}</h3>
            </div>
          </article>
        ))}
      </div>
      <div className="about-story">
        <p>
          Magnaura Foods was built on the vision of bringing the world’s most loved flavours together under one trusted brand, we offer an exciting multi-cuisine dining experience that celebrates authenticity, quality, and innovation.

From the rich heritage of Indian cuisine to the elegance of Italian, the vibrant flavours of Mexican, the comfort of South Indian delicacies, and the finesse of Japanese cuisine, Magnaura Foods creates a destination where every guest can discover something they love. Our carefully curated menu, standardized recipes, and uncompromising quality ensure a consistently exceptional experience across every location.

More than a restaurant brand, Magnaura Foods is a complete food and hospitality ecosystem. Through our scalable franchise models, operational excellence, technology-driven systems, and end-to-end business support, we empower entrepreneurs to build successful and sustainable food businesses with confidence.

At Magnaura Foods, we believe that great food has the power to bring people together. Every meal we serve reflects our commitment to freshness, hygiene, authenticity, and outstanding customer service. Whether it’s a quick takeaway, a family dinner, a premium dining experience, or a large hospitality destination, our goal is to deliver memorable experiences that keep guests coming back.

Driven by innovation, guided by integrity, and inspired by culinary excellence, Magnaura Foods is on a mission to become the world’s most trusted Food Village—a place where diverse cuisines, warm hospitality, and successful partnerships come together under one roof.

Welcome to Magnaura Foods—where the world gathers around great food.
        </p>
        <div className="value-list">
          {['Vision-led brand building', 'Guest-first dining culture', 'Premium operating systems', 'Future-ready expansion'].map((item) => (
            <span key={item}>
              <ShieldCheck size={18} /> {item}
            </span>
          ))}
        </div>
      </div>
      <div className="stats-grid about-stats">
        {stats.map(([label, value]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function Brands({ brands }) {
  const getBrandHref = (brand) => brand.website || '#brands';

  return (
    <section className="section" id="brands">
      <motion.div className="section-heading" variants={sectionMotion} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <span className="eyebrow">Brand Portfolio</span>
        <h2>Distinct concepts. One hospitality standard.</h2>
      </motion.div>
      <div className="brand-grid">
        {brands.map((brand, index) => (
          <motion.article
            className="brand-card"
            key={brand.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 }}
          >
            <img src={brand.heroImage || brand.imageUrl} alt={brand.name} />
            <div>
              <span className="brand-logo">{brand.logoUrl ? <img src={brand.logoUrl} alt="" /> : brand.name.slice(0, 2)}</span>
              <h3>{brand.name}</h3>
              <p>{brand.description}</p>
              <a href={getBrandHref(brand)} target={brand.website ? '_blank' : undefined} rel={brand.website ? 'noreferrer noopener' : undefined}>
                Visit Brand <ArrowRight size={16} />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function MenuShowcase({ items }) {
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Chef Special'];
  const visibleMenu = useMemo(() => {
    if (category === 'All') return items;
    return items.filter((item) => item.category === category);
  }, [items, category]);

  return (
    <section className="section menu-section" id="menu" data-testid="menu-section">
      <div className="section-heading">
        <span className="eyebrow">Menu · MAGNAURA THE FOOD VILLAGE</span>
        <h2>Chef-curated signatures from every category.</h2>
        <p style={{ marginTop: '18px' }}>
          One highest-priced Chef&apos;s Special from every menu category — pulled directly from the MAGNAURA THE FOOD VILLAGE
          menu with authentic names and prices preserved.
        </p>
      </div>
      <div className="menu-controls menu-controls-simple">
        <div className="segmented" data-testid="menu-filter">
          {categories.map((item) => (
            <button
              className={category === item ? 'active' : ''}
              key={item}
              onClick={() => setCategory(item)}
              data-testid={`menu-filter-${item.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="menu-grid" data-testid="menu-grid">
        {visibleMenu.map((item) => (
          <article className="menu-card menu-card-luxury" key={item.name} data-testid={`menu-item-${item.name}`}>
            <div className="menu-card-media">
              <img src={item.imageUrl} alt={item.name} loading="lazy" />
              <div className="menu-card-plate-bg" aria-hidden="true">
                <img src="/assets/menu/menu-card-bg.jpeg" alt="" loading="lazy" />
              </div>
            </div>
            <div className="menu-card-body">
              <span>{item.section || item.category}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>Rs. {item.price}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Franchise({ brands }) {
  return (
    <section className="section franchise-band" id="franchise">
      <div>
        <span className="eyebrow">Franchise</span>
        <h2>Grow With Magnaura Foods</h2>
        <p>
          Partner with a hospitality platform designed around training, marketing support, operational guidance,
          brand recognition, and premium expansion opportunities.
        </p>
        <div className="benefit-grid">
          {[
            [Award, 'Training Support'],
            [Sparkles, 'Marketing Support'],
            [Gem, 'Brand Recognition'],
            [Globe2, 'Expansion Opportunities'],
            [Building2, 'Operational Guidance'],
            [Store, 'Site Launch Systems'],
          ].map(([Icon, label]) => (
            <span key={label}>
              <Icon size={18} /> {label}
            </span>
          ))}
        </div>
      </div>
      <LeadForm brands={brands} type="franchise" />
    </section>
  );
}

function LeadForm({ brands, type }) {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({});
  const isFranchise = type === 'franchise';

  async function submit(event) {
    event.preventDefault();
    setStatus('Sending...');
    try {
      if (isFranchise) await api.submitFranchise(form);
      else await api.submitContact(form);
      setForm({});
      setStatus('Submitted successfully.');
    } catch {
      const storageKey = isFranchise ? 'magnaura_franchise_applications' : 'magnaura_contact_messages';
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([{ ...form, createdAt: new Date().toISOString() }, ...existing]));
      setForm({});
      setStatus('Submitted locally. Start the backend to save it in MongoDB.');
    }
  }

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form className="lead-form" onSubmit={submit}>
      <h3>{isFranchise ? 'Apply For Franchise' : 'Contact The Corporate Office'}</h3>
      <div className="form-grid">
        <input required placeholder="Full Name" value={form.fullName || ''} onChange={(e) => setValue('fullName', e.target.value)} />
        {isFranchise && <input required placeholder="Mobile Number" value={form.mobile || ''} onChange={(e) => setValue('mobile', e.target.value)} />}
        <input required type="email" placeholder="Email Address" value={form.email || ''} onChange={(e) => setValue('email', e.target.value)} />
        {isFranchise && <input required placeholder="City" value={form.city || ''} onChange={(e) => setValue('city', e.target.value)} />}
        {isFranchise && <input required placeholder="State" value={form.state || ''} onChange={(e) => setValue('state', e.target.value)} />}
        {isFranchise && <input required placeholder="Investment Capacity" value={form.investmentCapacity || ''} onChange={(e) => setValue('investmentCapacity', e.target.value)} />}
        {isFranchise && (
          <select required value={form.preferredBrand || ''} onChange={(e) => setValue('preferredBrand', e.target.value)}>
            <option value="">Preferred Brand</option>
            {brands.map((brand) => (
              <option key={brand.name}>{brand.name}</option>
            ))}
          </select>
        )}
      </div>
      {!isFranchise && <input required placeholder="Subject" value={form.subject || ''} onChange={(e) => setValue('subject', e.target.value)} />}
      <textarea required placeholder="Message" value={form.message || ''} onChange={(e) => setValue('message', e.target.value)} />
      <button className="gold-button" type="submit">
        {isFranchise ? 'Apply Now' : 'Send Message'} <ArrowRight size={18} />
      </button>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}

function Contact({ brands }) {
  return (
    <section className="section contact-grid" id="contact">
      <div>
        <span className="eyebrow">Contact</span>
        <h2>Corporate hospitality, brand partnerships, and growth conversations.</h2>
        <div className="contact-list">
          <span>
            <MapPin size={20} /> {companyContact.address}
          </span>
          <span>
            <Phone size={20} /> {companyContact.phone}
          </span>
          <span>
            <Mail size={20} /> {companyContact.email}
          </span>
          <span>
            <Users size={20} /> Instagram · LinkedIn · Facebook
          </span>
        </div>
      </div>
      <LeadForm brands={brands} type="contact" />
    </section>
  );
}

function Footer({ brands }) {
  return (
    <footer className="footer">
      <LogoMark />
      <div>
        <a href="#about">Company</a>
        <a href="#brands">Brands</a>
        <a href="#franchise">Franchise</a>
        <a href="#contact">Contact</a>
      </div>
      <div>
        {brands.map((brand) => (
          <a href="#brands" key={brand.name}>
            {brand.name}
          </a>
        ))}
      </div>
      <p>© Magnaura Foods. Taste The Legacy.</p>
    </footer>
  );
}

function Reservation() {
  const [form, setForm] = useState({});
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const setValue = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.fullName || form.fullName.trim().length < 2) e.fullName = 'Please enter your full name';
    if (!/^\+?\d[\d\s-]{7,}$/.test(form.mobile || '')) e.mobile = 'Enter a valid mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || '')) e.email = 'Enter a valid email';
    if (!form.date) e.date = 'Choose a date';
    if (!form.time) e.time = 'Choose a time';
    const guests = Number(form.guests);
    if (!guests || guests < 1 || guests > 30) e.guests = 'Guests must be between 1 and 30';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus('Sending...');
    try {
      await api.submitContact({
        fullName: form.fullName,
        email: form.email,
        subject: `Table Reservation for ${form.date} at ${form.time} (${form.guests} guests)`,
        message: `Mobile: ${form.mobile}\nGuests: ${form.guests}\nSpecial Request: ${form.specialRequest || 'None'}`,
      });
    } catch {
      const key = 'magnaura_reservations';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([{ ...form, createdAt: new Date().toISOString() }, ...existing]));
    }
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <section className="section reservation-section" id="reservation" data-testid="reservation-section">
        <div className="reservation-card reservation-success" data-testid="reservation-success">
          <span className="eyebrow">Reservation Confirmed</span>
          <h2>Thank you, {form.fullName?.split(' ')[0] || 'Guest'}.</h2>
          <p>
            Your table request for <strong>{form.guests}</strong> on <strong>{form.date}</strong> at{' '}
            <strong>{form.time}</strong> has been received. Our hospitality team will confirm your reservation
            over a call at <strong>{form.mobile}</strong> shortly.
          </p>
          <button
            className="gold-button"
            type="button"
            onClick={() => {
              setForm({});
              setStatus('');
            }}
            data-testid="reservation-new-btn"
          >
            Make Another Reservation <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section reservation-section" id="reservation" data-testid="reservation-section">
      <div className="reservation-card" data-testid="reservation-card">
        <div className="reservation-header">
          <span className="eyebrow">Reserve a Table</span>
          <h2>Curated hospitality, reserved for you.</h2>
          <p>
            Share your preferred date, time and party size — our team will confirm your table personally.
          </p>
        </div>
        <form className="reservation-form" onSubmit={submit} data-testid="reservation-form" noValidate>
          <div className="reservation-grid">
            <label className={errors.fullName ? 'has-error' : ''}>
              <span>Full Name</span>
              <input
                type="text"
                placeholder="Your Full Name"
                value={form.fullName || ''}
                onChange={(e) => setValue('fullName', e.target.value)}
                data-testid="reservation-fullname"
              />
              {errors.fullName && <em>{errors.fullName}</em>}
            </label>
            <label className={errors.mobile ? 'has-error' : ''}>
              <span>Mobile Number</span>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.mobile || ''}
                onChange={(e) => setValue('mobile', e.target.value)}
                data-testid="reservation-mobile"
              />
              {errors.mobile && <em>{errors.mobile}</em>}
            </label>
            <label className={errors.email ? 'has-error' : ''}>
              <span>Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email || ''}
                onChange={(e) => setValue('email', e.target.value)}
                data-testid="reservation-email"
              />
              {errors.email && <em>{errors.email}</em>}
            </label>
            <label className={errors.guests ? 'has-error' : ''}>
              <span>Number of Guests</span>
              <input
                type="number"
                min="1"
                max="30"
                placeholder="2"
                value={form.guests || ''}
                onChange={(e) => setValue('guests', e.target.value)}
                data-testid="reservation-guests"
              />
              {errors.guests && <em>{errors.guests}</em>}
            </label>
            <label className={errors.date ? 'has-error' : ''}>
              <span>Date</span>
              <input
                type="date"
                value={form.date || ''}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setValue('date', e.target.value)}
                data-testid="reservation-date"
              />
              {errors.date && <em>{errors.date}</em>}
            </label>
            <label className={errors.time ? 'has-error' : ''}>
              <span>Time</span>
              <input
                type="time"
                value={form.time || ''}
                onChange={(e) => setValue('time', e.target.value)}
                data-testid="reservation-time"
              />
              {errors.time && <em>{errors.time}</em>}
            </label>
            <label className="reservation-full">
              <span>Special Request</span>
              <textarea
                placeholder="Anniversary celebration, dietary preferences, seating requests…"
                value={form.specialRequest || ''}
                onChange={(e) => setValue('specialRequest', e.target.value)}
                data-testid="reservation-request"
              />
            </label>
          </div>
          <button className="gold-button reservation-submit" type="submit" data-testid="reservation-submit">
            Confirm Reservation <ArrowRight size={18} />
          </button>
          {status && status !== 'success' && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const { heroSlides, brands, menuItems } = usePublicData();

  return (
    <>
      <Navbar brands={brands} />
      <ReserveTableButton />
      <main>
        <Hero slides={heroSlides} />
        <About />
        <Brands brands={brands} />
        <MenuShowcase items={menuItems} />
        <Reservation />
        <Franchise brands={brands} />
        <Contact brands={brands} />
      </main>
      <Footer brands={brands} />
    </>
  );
}

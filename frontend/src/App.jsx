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
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
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

function Hero({ slides }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[active] || {};
  const activeMediaType = getMediaType(activeSlide);
  const activeCtaHref = activeSlide.title === 'Taste The Legacy' ? '#franchise' : '#brands';

  return (
    <section className="hero" id="home">
      <AnimatePresence mode="wait">
        <motion.div
          className="hero-media"
          key={active}
          initial={{ opacity: 1, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {activeMediaType === 'video' ? (
            <video src={activeSlide.mediaUrl} autoPlay muted loop playsInline />
          ) : (
            <img src={activeSlide.mediaUrl} alt="" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="hero-overlay" />
      <motion.div
        className="hero-content"
        initial={{ opacity: 0.94, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <span className="eyebrow">Luxury Corporate Hospitality Group</span>
        <h1>{slides[active].title}</h1>
        <p>{slides[active].subtitle}</p>
        <a className="gold-button" href={activeCtaHref}>
          {slides[active].cta} <ArrowRight size={18} />
        </a>
      </motion.div>
      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            className={index === active ? 'active' : ''}
            onClick={() => setActive(index)}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
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
      <div className="founder-row">
        {founders.map((founder) => (
          <article className="founder-card" key={founder.name}>
            <img src={founder.image} alt={founder.name} loading="lazy" />
            <div>
              <h3>{founder.name}</h3>
              <p>{founder.position}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="about-story">
        <p>
          Magnaura Foods was built with a simple ambition: create hospitality brands that feel refined, reliable,
          and memorable every single day. The business brings together culinary thinking, disciplined operations,
          franchise readiness, and a deep respect for Indian dining culture. From momos and rolls to family dining
          and chai-led concepts, every brand is designed with its own identity while following one uncompromising
          standard of guest experience. The team focuses on food quality, premium presentation, staff training,
          supply consistency, and scalable systems so each outlet can grow with confidence. Magnaura is not chasing
          short-term noise; it is building a long-life hospitality platform where taste, service, ambience, and
          business discipline move together.
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

function MenuShowcase({ brands, items }) {
  const [brand, setBrand] = useState('All Brands');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const showcaseFillers = [
    {
      name: 'Smoked Butter Chicken Platter',
      brand: 'Magnaura the food Village',
      category: 'Dining',
      price: 749,
      description: 'Slow-finished chicken with silk gravy, charred breads, and jeweled garnish.',
      imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=900&q=85',
    },
    {
      name: 'Golden Chilli Cheese Momos',
      brand: "Mag'Momo",
      category: 'Fusion',
      price: 269,
      description: 'Crisp dumplings tossed with chilli glaze, cheese cream, and spring onion.',
      imageUrl: 'https://images.unsplash.com/photo-1600628422019-7c31b4e4b476?auto=format&fit=crop&w=900&q=85',
    },
  ];
  const showcaseItems = useMemo(() => {
    const existingNames = new Set(items.map((item) => item.name));
    return [...items, ...showcaseFillers.filter((item) => !existingNames.has(item.name))];
  }, [items]);
  const categories = useMemo(
    () => ['All', ...new Set(showcaseItems.filter((item) => brand === 'All Brands' || item.brand === brand).map((item) => item.category))],
    [brand, showcaseItems],
  );
  const visible = items.filter((item) => {
    const matchBrand = brand === 'All Brands' || item.brand === brand;
    const matchCategory = category === 'All' || item.category === category;
    const matchSearch = `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchCategory && matchSearch;
  });
  const visibleMenu = (visible.length ? visible : showcaseItems)
    .concat(showcaseItems.filter((item) => !visible.some((visibleItem) => visibleItem.name === item.name)))
    .slice(0, 8);

  useEffect(() => {
    if (brand !== 'All Brands' && !brands.find((item) => item.name === brand)) setBrand('All Brands');
  }, [brands, brand]);

  return (
    <section className="section menu-section" id="menu">
      <div className="section-heading">
        <span className="eyebrow">Menu Showcase</span>
        <h2>Curated signatures from every Magnaura brand.</h2>
      </div>
      <div className="menu-controls">
        <div className="segmented">
          <button className={brand === 'All Brands' ? 'active' : ''} onClick={() => setBrand('All Brands')}>
            All Brands
          </button>
          {brands.map((item) => (
            <button className={brand === item.name ? 'active' : ''} key={item.name} onClick={() => setBrand(item.name)}>
              {item.name}
            </button>
          ))}
        </div>
        <div className="segmented">
          {categories.map((item) => (
            <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu" />
        </label>
      </div>
      <div className="menu-grid">
        {visibleMenu.map((item) => (
          <article className="menu-card" key={item.name}>
            <img src={item.imageUrl} alt={item.name} loading="lazy" />
            <div>
              <span>{item.category}</span>
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

export default function App() {
  const { heroSlides, brands, menuItems } = usePublicData();

  return (
    <>
      <Navbar brands={brands} />
      <main>
        <Hero slides={heroSlides} />
        <About />
        <Brands brands={brands} />
        <MenuShowcase brands={brands} items={menuItems} />
        <Franchise brands={brands} />
        <Contact brands={brands} />
      </main>
      <Footer brands={brands} />
    </>
  );
}

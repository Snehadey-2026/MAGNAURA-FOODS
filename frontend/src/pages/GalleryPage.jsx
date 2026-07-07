import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePublicData } from '../hooks/usePublicData';
import { isVideoUrl } from '../App.jsx';

function GalleryGrid({ items }) {
  const sectionMotion = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const galleryItems = items.map((item, index) => {
    const mediaUrl = item.heroImage || item.imageUrl || item.mediaUrl;
    const mediaType = item.mediaType === 'video' || isVideoUrl(mediaUrl) ? 'video' : 'image';

    return {
      title: item.name,
      mediaUrl,
      mediaType,
      label: ['Dining', 'Signature', 'Experience', 'Craft', 'Hospitality'][index % 5],
      description: item.description || 'A curated Magnaura hospitality moment with premium design and immersive atmosphere.',
      href: item.website || '#brands',
    };
  });

  return (
    <div className="gallery-grid-page">
      {galleryItems.map((item, index) => (
        <motion.article
          className="gallery-card-page"
          key={item.title}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          {item.mediaType === 'video' ? (
            <video src={item.mediaUrl} controls muted loop playsInline />
          ) : (
            <img src={item.mediaUrl} alt={item.title} loading="lazy" />
          )}
          <div>
            <span>{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a className="gallery-link" href={item.href}>
              Explore
            </a>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const { brands, galleryUpcoming } = usePublicData();

  return (
    <>
      <header className="nav-shell" style={{ position: 'relative', marginBottom: '0' }}>
        <nav className="navbar">
          <Link to="/" className="logo-mark" aria-label="MAGNAURA FOODS home">
            <span className="logo-emblem">M</span>
            <span>
              <strong>MAGNAURA</strong>
              <small>FOODS</small>
            </span>
          </Link>
        </nav>
      </header>

      <main>
        <section style={{ width: 'min(1180px, calc(100% - 40px))', margin: '0 auto', padding: '104px 0' }}>
          <div className="section-heading">
            <span className="eyebrow">Gallery</span>
            <h2>Current and upcoming visual experiences.</h2>
            <p>
              Browse the latest imagery and video previews from our hospitality portfolio. Add new assets by updating the data source with image or video paths.
            </p>
          </div>

          <section style={{ marginTop: '68px' }}>
            <h3 style={{ margin: '0 0 32px', fontSize: '1.6rem', fontWeight: '300', color: 'var(--ivory)' }}>Current Gallery</h3>
            <GalleryGrid items={brands} />
          </section>

          <section style={{ marginTop: '96px' }}>
            <h3 style={{ margin: '0 0 32px', fontSize: '1.6rem', fontWeight: '300', color: 'var(--ivory)' }}>Upcoming Gallery</h3>
            <GalleryGrid items={galleryUpcoming} />
          </section>
        </section>
      </main>
    </>
  );
}

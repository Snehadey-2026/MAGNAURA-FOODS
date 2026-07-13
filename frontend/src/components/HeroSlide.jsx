import { motion } from 'framer-motion';
import MenuCard from './MenuCard';
import SmokeLayer from './SmokeLayer';
import './HeroSlider.css';

function HeroSlide({ slide, layout, isActive }) {
  const type = slide.mediaType === 'video' ? 'video' : 'image';
  const mediaProps = {
    src: slide.mediaUrl,
    alt: slide.title,
    loading: isActive ? 'eager' : 'lazy',
  };

  return (
    <motion.div
      className="hero-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!isActive}
    >
      <div className="hero-backdrop" />
      <div className="hero-gradient" />
      <MenuCard layout={layout.card || {}} />
      <div className="hero-foreground">
        {type === 'video' ? (
          <video
            className="hero-foreground__media"
            {...mediaProps}
            poster={slide.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <img className="hero-foreground__media" {...mediaProps} />
        )}
      </div>
      <SmokeLayer />
    </motion.div>
  );
}

export default HeroSlide;

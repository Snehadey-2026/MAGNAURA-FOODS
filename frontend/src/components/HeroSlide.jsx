import { motion } from 'framer-motion';
import './HeroSlider.css';

function HeroSlide({ slide, isActive }) {
  const type = slide.mediaType === 'video' ? 'video' : 'image';
  const mediaProps = {
    src: slide.mediaUrl,
    alt: slide.title,
    loading: isActive ? 'eager' : 'lazy',
  };

  return (
    <motion.div
      className={`hero-slide ${isActive ? 'is-active' : ''}`}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!isActive}
    >
      {type === 'video' ? (
        <video
          className="hero-slide-media"
          {...mediaProps}
          poster={slide.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : (
        <img className="hero-slide-media" {...mediaProps} />
      )}
      <div className="hero-slide-shade" />
    </motion.div>
  );
}

export default HeroSlide;

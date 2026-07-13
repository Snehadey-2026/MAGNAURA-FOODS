import { motion } from 'framer-motion';
import './HeroSlider.css';

function HeroContent({ slide }) {
  if (!slide) return null;

  return (
    <motion.div
      className="hero-content"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <span className="eyebrow">{slide.eyebrow}</span>
      <h1>{slide.title}</h1>
      <p>{slide.subtitle}</p>
    </motion.div>
  );
}

export default HeroContent;

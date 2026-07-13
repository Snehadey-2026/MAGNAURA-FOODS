import { motion } from 'framer-motion';
import './HeroSlider.css';

function SmokeLayer() {
  return (
    <motion.div
      className="hero-smoke"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    >
      <div className="hero-smoke__layer" />
    </motion.div>
  );
}

export default SmokeLayer;

import { motion } from 'framer-motion';
import './HeroSlider.css';

function MenuCard({ layout }) {
  return (
    <motion.div
      className="hero-menu-card"
      initial={{ opacity: 0, y: 18, rotate: layout.rotate || 0, scale: layout.scale || 1 }}
      animate={{ opacity: 1, y: 0, rotate: layout.rotate || 0, scale: layout.scale || 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        top: layout.top,
        right: layout.right,
        width: layout.width,
        transformOrigin: 'center',
      }}
    >
      <div className="hero-menu-card__inner" />
    </motion.div>
  );
}

export default MenuCard;

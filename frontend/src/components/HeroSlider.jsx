import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HeroContent from './HeroContent';
import HeroSlide from './HeroSlide';
import HeroTimeline from './HeroTimeline';
import './HeroSlider.css';

const slideLayouts = {
  1: {
    card: { rotate: -12, top: '10%', right: '5%', width: '36%', scale: 0.96 },
  },
  2: {
    card: { rotate: 10, top: '12%', right: '6%', width: '34%', scale: 0.94 },
  },
  3: {
    card: { rotate: -8, top: '11%', right: '4.5%', width: '35%', scale: 0.96 },
  },
  4: {
    card: { rotate: 14, top: '12%', right: '5.5%', width: '32%', scale: 0.92 },
  },
  5: {
    card: { rotate: -10, top: '11.5%', right: '5%', width: '34%', scale: 0.95 },
  },
};

function HeroSlider({ slides }) {
  const safeSlides = slides && slides.length ? slides : [];
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const total = safeSlides.length;

  useEffect(() => {
    if (total < 2) return undefined;
    const timer = window.setInterval(() => {
      setPrev(active);
      setActive((value) => (value + 1) % total);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [total, active]);

  useEffect(() => {
    if (prev === null) return undefined;
    const timeout = window.setTimeout(() => setPrev(null), 1400);
    return () => window.clearTimeout(timeout);
  }, [prev]);

  const goTo = (index) => {
    if (index === active) return;
    setPrev(active);
    setActive(index);
  };

  const activeSlide = safeSlides[active] || {};
  const prevSlide = prev !== null ? safeSlides[prev] : null;
  const activeLayout = slideLayouts[active + 1] || {};
  const activeCtaHref = activeSlide.title?.replace(/\n/g, ' ') === 'Taste The Legacy' ? '#franchise' : '#brands';

  return (
    <section className="hero hero-slider" id="home" data-testid="hero-section">
      <div className="hero-slider-stage">
        <AnimatePresence initial={false} mode="wait">
          {prevSlide && (
            <HeroSlide
              key={prevSlide.id || `slide-prev-${prev}`}
              slide={prevSlide}
              layout={slideLayouts[prev + 1] || {}}
              isActive={false}
            />
          )}
          {activeSlide && (
            <HeroSlide
              key={activeSlide.id || `slide-active-${active}`}
              slide={activeSlide}
              layout={activeLayout}
              isActive={true}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="hero-text-shell">
        <HeroContent slide={activeSlide} />
      </div>

      <HeroTimeline
        slides={safeSlides}
        active={active}
        onSelect={goTo}
        activeCtaHref={activeCtaHref}
      />
    </section>
  );
}

export default HeroSlider;

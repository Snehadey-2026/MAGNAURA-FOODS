import { useEffect, useState } from 'react';
import HeroContent from './HeroContent';
import HeroSlide from './HeroSlide';
import HeroTimeline from './HeroTimeline';
import './HeroSlider.css';

function HeroSlider({ slides }) {
  const safeSlides = slides && slides.length ? slides : [];
  const total = safeSlides.length;
  const getInitialSlide = () => {
    if (typeof window === 'undefined' || !total) return 0;
    const requested = Number(new URLSearchParams(window.location.search).get('slide'));
    return Number.isInteger(requested) && requested >= 1 && requested <= total ? requested - 1 : 0;
  };
  const [active, setActive] = useState(getInitialSlide);

  useEffect(() => {
    if (total < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % total);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [total]);

  const goTo = (index) => {
    if (index === active) return;
    setActive(index);
  };

  const activeSlide = safeSlides[active] || {};
  const activeCtaHref = activeSlide.title?.replace(/\n/g, ' ') === 'Taste The Legacy' ? '#franchise' : '#brands';

  return (
    <section className="hero hero-slider" id="home" data-testid="hero-section">
      <div className="hero-slider-stage">
        {safeSlides.map((slide, index) => (
            <HeroSlide
              key={slide.id || index}
              slide={slide}
              isActive={active === index}
            />
        ))}
      </div>

      <div className="hero-text-shell">
        <HeroContent slide={activeSlide} />
      </div>

      <div className="hero-meta" aria-hidden="true">
        <div className="hero-meta-counter">
          <strong>{String(active + 1).padStart(2, '0')}</strong>
          <span />
          <em>{String(total).padStart(2, '0')}</em>
        </div>
        <div className="hero-meta-brand">MAGNAURA · FOODS</div>
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

import './HeroSlider.css';

function HeroTimeline({ slides, active, onSelect, activeCtaHref }) {
  return (
    <div className="hero-timeline" role="tablist" aria-label="Hero slide navigation">
      {slides.map((slide, index) => {
        const title = (slide.title || '').replace(/\n/g, ' ');
        return (
          <div
            key={slide.id || index}
            className={`hero-timeline-item ${active === index ? 'hero-timeline-item--active' : ''}`}
          >
            <button
              type="button"
              className="hero-timeline-button"
              onClick={() => onSelect(index)}
              aria-current={active === index ? 'true' : undefined}
            >
              <span className="hero-timeline-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="hero-timeline-title">{title}</span>
            </button>

            {active === index && (
              <a href={activeCtaHref} className="hero-timeline-cta">
                {slide.cta}
              </a>
            )}

            <div className="hero-timeline-track" aria-hidden="true">
              <div className="hero-timeline-fill" style={{ width: active === index ? '100%' : '0%' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HeroTimeline;

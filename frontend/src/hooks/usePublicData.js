import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { brands, galleryUpcoming, heroSlides, menuItems } from '../data/fallback';

const withReferenceHeroArt = (slides) => {
  const source = slides?.length ? slides : [];
  return heroSlides.map((fallbackSlide, index) => {
    if (index === 0) return source[index] || fallbackSlide;
    return {
      ...(source[index] || {}),
      ...fallbackSlide,
    };
  });
};

export function usePublicData() {
  const [data, setData] = useState({
    heroSlides,
    brands,
    galleryUpcoming,
    menuItems,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([api.getHero(), api.getBrands(), api.getMenu()]).then((results) => {
      if (!mounted) return;
      setData({
        heroSlides: withReferenceHeroArt(
          results[0].status === 'fulfilled' && results[0].value.length ? results[0].value : heroSlides,
        ),
        brands: results[1].status === 'fulfilled' && results[1].value.length ? results[1].value : brands,
        galleryUpcoming,
        menuItems: results[2].status === 'fulfilled' && results[2].value.length ? results[2].value : menuItems,
        loading: false,
      });
    });
    return () => {
      mounted = false;
    };
  }, []);

  return data;
}

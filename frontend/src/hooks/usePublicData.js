import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { brands, galleryUpcoming, heroSlides, menuItems } from '../data/fallback';

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
        heroSlides: results[0].status === 'fulfilled' && results[0].value.length ? results[0].value : heroSlides,
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

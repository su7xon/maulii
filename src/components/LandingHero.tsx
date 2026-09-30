import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface LandingSlide {
  id: string;
  src: string;
  alt: string;
  productId?: string;
}

export const LANDING_SLIDES: LandingSlide[] = [
  {
    id: 's25fe',
    src: '/banners/banner-s25fe.png',
    alt: 'Galaxy S25 FE - Galaxy AI',
  },
  {
    id: 'vivov60',
    src: '/banners/banner-vivo-v60.png',
    alt: 'Vivo V60 Co-engineered with Zeiss - Sale starts now',
  },
  {
    id: 'oppof31',
    src: '/banners/banner-oppo-f31.png',
    alt: 'Oppo F31 Series 5G - Durable Champion',
  },
];

interface LandingHeroProps {
  slides?: LandingSlide[];
  onSlideClick?: (slide: LandingSlide) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  slides = LANDING_SLIDES,
  onSlideClick,
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setIndex((p) => (p - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next, paused, slides.length, index]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <div
      className="relative w-full overflow-hidden border-x border-b border-gray-100 bg-white group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        key={slide.id}
        onClick={() => onSlideClick?.(slide)}
        className="block w-full cursor-pointer card-entrance"
        aria-label={slide.alt}
      >
        <img
          src={slide.src}
          alt={slide.alt}
          className="w-full h-auto object-cover aspect-[16/10] sm:aspect-[16/5] bg-[#f4f6f9]"
          loading="eager"
        />
      </button>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white hidden sm:flex items-center justify-center backdrop-blur border border-white/20 shadow-xl transition-all hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white hidden sm:flex items-center justify-center backdrop-blur border border-white/20 shadow-xl transition-all hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 shadow ${
                  index === i ? 'w-7 bg-gray-900' : 'w-1.5 bg-gray-900/30 hover:bg-gray-900/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

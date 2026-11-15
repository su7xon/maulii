import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface LandingSlide {
  id: string;
  src: string;
  alt: string;
  mobileSrc?: string;
  productId?: string;
}

export const LANDING_SLIDES: LandingSlide[] = [
  {
    id: 'apple-series',
    src: '/banners/apple.jpeg',
    mobileSrc: '/banners/apple.jpeg',
    alt: 'Apple iPhone Series - New Launch',
  },
  {
    id: 'vivo-series',
    src: '/banners/vivo.jpeg',
    mobileSrc: '/banners/vivo.jpeg',
    alt: 'Vivo Series - Hot Deal',
  },
  {
    id: 'oppo-series',
    src: '/banners/oppo.jpeg',
    mobileSrc: '/banners/oppo.jpeg',
    alt: 'Oppo Series - Sleek Design',
  },
];

interface LandingHeroProps {
  slides?: LandingSlide[];
}

export const LandingHero: React.FC<LandingHeroProps> = ({ slides = LANDING_SLIDES }) => {
  const [index, setIndex] = useState(1); // Start at first *real* slide (index 1 in extended array)
  const [paused, setPaused] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false); // Disable CSS transition during clone reset
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    try {
      return window.matchMedia('(min-width: 640px)').matches;
    } catch {
      return false;
    }
  });

  // Extended slides for seamless infinite loop: [last, ...all, first]
  const extendedSlides = useMemo(() => {
    if (slides.length <= 1) return slides;
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  useEffect(() => {
    try {
      const mq = window.matchMedia('(min-width: 640px)');
      const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    } catch {
      return;
    }
  }, []);

  // When we land on a clone edge, instantly reset to the real equivalent without visual jump
  useEffect(() => {
    if (slides.length <= 1) return;
    if (index === 0) {
      // On clone of last slide -> jump to real last slide
      setSkipTransition(true);
      setTimeout(() => {
        setIndex(slides.length);
        setSkipTransition(false);
      }, 50);
    } else if (index === extendedSlides.length - 1) {
      // On clone of first slide -> jump to real first slide
      setSkipTransition(true);
      setTimeout(() => {
        setIndex(1);
        setSkipTransition(false);
      }, 50);
    }
  }, [index, slides.length, extendedSlides.length]);

  const next = useCallback(() => {
    setIndex((p) => p + 1);
  }, []);

  const prev = () => {
    setIndex((p) => p - 1);
  };

  // Swipe (touch + mouse drag): ungli se banners badlo
  const swipeX = useRef<number | null>(null);
  const swipeEnd = (clientX: number) => {
    if (swipeX.current === null) return;
    const dx = swipeX.current - clientX;
    swipeX.current = null;
    if (Math.abs(dx) < 40 || slides.length < 2) return;
    if (dx > 0) next();
    else prev();
  };

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next, paused, slides.length]);

  if (slides.length === 0) return null;
  const slide = extendedSlides[index];
  // Desktop pe laptop wali photo, mobile pe mobile wali (na ho to desktop wali fallback)
  const imgSrc = !isDesktop && slide.mobileSrc ? slide.mobileSrc : slide.src;

  return (
    <div
      className={`relative w-full overflow-hidden border-x border-b border-gray-100 bg-white group touch-pan-y select-none ${
        skipTransition ? 'transition-none' : ''
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { swipeX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { swipeEnd(e.changedTouches[0].clientX); }}
      onMouseDown={(e) => { swipeX.current = e.clientX; }}
      onMouseUp={(e) => { swipeEnd(e.clientX); }}
    >
      <div
        key={slide.id}
        className="block w-full cursor-default card-entrance"
        aria-label={slide.alt}
      >
        <img
          src={imgSrc}
          alt={slide.alt}
          className="w-full h-auto object-cover aspect-[16/10] sm:aspect-[16/5] bg-[#f4f6f9]"
          loading="eager"
        />
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white hidden sm:flex items-center justify-center backdrop-blur border border-white/20 shadow-xl transition-all hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white hidden sm:flex items-center justify-center backdrop-blur border border-white/20 shadow-xl transition-all hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
            {slides.map((s, i) => {
              // Map extended index back to real slide index for dots
              const realIndex = index === 0 ? slides.length - 1 : index === extendedSlides.length - 1 ? 0 : index - 1;
              const active = i === realIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    // Jump directly to this slide (offset by +1 for the leading clone)
                    setIndex(i + 1);
                  }}
                  aria-label={`Go to banner ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 shadow ${
                    active ? 'w-7 bg-gray-900' : 'w-1.5 bg-gray-900/30 hover:bg-gray-900/60'
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

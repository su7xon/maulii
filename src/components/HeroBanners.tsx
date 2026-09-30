import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { BANNERS } from '../data/mockData';
import { Banner } from '../types';

interface HeroBannersProps {
  banners?: Banner[];
}

export const HeroBanners: React.FC<HeroBannersProps> = ({ banners }) => {
  const list = banners && banners.length > 0 ? banners : BANNERS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
    setProgress(0);
  }, [list.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
    setProgress(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          nextSlide();
          return 0;
        }
        return p + 2;
      });
    }, 90);
    return () => clearInterval(interval);
  }, [nextSlide, currentIndex]);

  const banner = list[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)] border border-white/10 bg-gray-900">
      <div
        key={banner.id}
        className={`hero-mesh relative w-full min-h-[220px] sm:min-h-[280px] bg-gradient-to-r ${banner.bgGradient} flex items-center overflow-hidden p-5 sm:p-8 cursor-default`}
      >
        {/* Glow orbs */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-20 w-72 h-72 rounded-full bg-black/20 blur-3xl pointer-events-none" />

        {/* Left Content */}
        <div className="relative z-10 w-[58%] text-white pr-3 card-entrance">
          <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur text-[#ffe500] font-extrabold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full mb-2.5 uppercase tracking-[0.12em] border border-white/15 shadow-lg">
            <Sparkles className="w-3 h-3" />
            {banner.badge}
          </div>
          <h2 className="text-xl sm:text-3xl font-black leading-[1.05] tracking-tight drop-shadow-lg">
            {banner.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/85 font-medium mt-1.5 leading-relaxed line-clamp-2 max-w-md">
            {banner.subtitle}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="group inline-flex items-center gap-1.5 bg-[#ffe500] hover:bg-yellow-300 text-[#7a0000] font-black text-xs sm:text-sm px-4 py-2 rounded-full shadow-[0_8px_24px_-6px_rgb(255_229_0/0.6)] active:scale-95 transition-all">
              {banner.ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="hidden sm:inline text-[11px] text-white/60 font-semibold tracking-wide">
              {banner.tag}
            </span>
          </div>
        </div>

        {/* Right Featured Image */}
        <div className="relative z-10 w-[42%] h-full flex items-center justify-center">
          <div className="absolute w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-white/15 blur-2xl" />
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/25 bg-white/10 backdrop-blur rotate-2 hover:rotate-0 transition-transform duration-500 animate-float">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent py-1.5 text-center text-[10px] text-white font-bold tracking-wide">
              {banner.tag}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white hidden sm:flex items-center justify-center backdrop-blur border border-white/15 shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white hidden sm:flex items-center justify-center backdrop-blur border border-white/15 shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress + dots */}
      <div className="absolute bottom-3 inset-x-0 flex flex-col items-center gap-2 z-20 px-8">
        <div className="flex justify-center gap-1.5">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
                setProgress(0);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'w-7 bg-[#ffe500] shadow' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
        <div className="w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffe500] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Category, Product } from '../types';
import { ProductCard } from './ProductCard';
import { LandingHero, LandingSlide } from './LandingHero';
import { BrandDirectory } from './BrandDirectory';
import { CategoryNav } from './CategoryNav';
import { PhoneReviews } from './PhoneReviews';
import {
  NEW_LAUNCHES,
  BEST_SELLING_PHONES,
  MIDNIGHT_DISCOUNT_PHONES,
  NewLaunchItem,
} from '../data/mockData';

interface MobilesViewProps {
  cartProductIds: string[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onSelectBrand?: (brand: string) => void;
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
  onGoToDeals?: () => void;
  launches?: NewLaunchItem[];
  slides?: LandingSlide[];
  categories?: Category[];
  bestSellers?: Product[];
  midnightPhones?: Product[];
}

export const MobilesView: React.FC<MobilesViewProps> = ({
  cartProductIds,
  onAddToCart,
  onViewProduct,
  onSelectBrand,
  onSelectCategory,
  selectedCategory = 'mobiles',
  onGoToDeals,
  launches,
  slides,
  categories,
  bestSellers,
  midnightPhones,
}) => {
  const launchList = launches && launches.length > 0 ? launches : NEW_LAUNCHES;
  const bestList = bestSellers && bestSellers.length > 0 ? bestSellers : BEST_SELLING_PHONES;
  const midnightList = midnightPhones && midnightPhones.length > 0 ? midnightPhones : MIDNIGHT_DISCOUNT_PHONES;
  const bestSellingScrollRef = useRef<HTMLDivElement>(null);
  const midnightScrollRef = useRef<HTMLDivElement>(null);
  const launchesScrollRef = useRef<HTMLDivElement>(null);
  const [activeLaunch, setActiveLaunch] = useState(0);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-3 space-y-6">
      {/* Landing banners: S25 FE / Vivo V60 / Oppo F31 */}
      <LandingHero
        slides={slides}
      />

      {/* Category pills below landing banners (nothing pre-selected) */}
      <div className="-mx-3 sm:-mx-4 -mt-1">
        <CategoryNav
          categories={categories}
          selectedCategory=""
          onSelectCategory={(cat) => onSelectCategory?.(cat)}
        />
      </div>

      {/* Section: New Launches */}
      <section className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e42529]">Fresh drop</p>
            <h2 className="text-xl sm:text-[28px] font-black text-gray-900 tracking-tight leading-tight">
              New Launches
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="sm:hidden text-[10px] font-bold text-gray-400">
              Swipe →
            </span>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scrollCarousel(launchesScrollRef, 'left')}
                aria-label="Previous launches"
                className="w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel(launchesScrollRef, 'right')}
                aria-label="Next launches"
                className="w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={launchesScrollRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / (el.scrollWidth - el.clientWidth || 1) * (launchList.length - 1));
            setActiveLaunch(Math.max(0, Math.min(launchList.length - 1, idx)));
          }}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory sm:snap-none -mx-3 px-3 sm:mx-0 sm:px-0 pt-1 pb-1 scroll-smooth"
        >
          {launchList.map((launch) => (
            <div
              key={launch.id}
              onClick={() => {
                const matched = bestList.find(p => p.brand.toLowerCase() === launch.brand.toLowerCase()) || bestList[0];
                onViewProduct(matched);
              }}
              className={`min-w-[60%] sm:min-w-0 snap-start sm:snap-align-none shrink-0 sm:shrink rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between p-3 sm:p-5 relative cursor-pointer hover:shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25)] sm:hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ${launch.bgGradient}`}
            >
              {/* Header inside Launch Card */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {launch.brand}
                </span>
                <h3 className="text-[15px] sm:text-lg font-bold leading-tight mt-0.5 truncate">
                  {launch.title}
                </h3>
                <p className="text-[11px] font-medium opacity-70 mt-0.5 truncate">
                  {launch.subtitle}
                </p>
                {launch.badge && (
                  <span className="inline-block mt-1 bg-cyan-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    {launch.badge}
                  </span>
                )}
              </div>

              {/* Product Visual */}
              <div className="my-2 h-32 sm:h-40 flex items-center justify-center">
                <img
                  src={launch.image}
                  alt={launch.title}
                  className="h-full w-full object-contain rounded-lg transform active:scale-95 transition-transform"
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const matched = bestList.find(p => p.brand.toLowerCase() === launch.brand.toLowerCase()) || bestList[0];
                    onViewProduct(matched);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                    launch.btnType === 'notify'
                      ? 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {launch.btnText}
                </button>
                <span className="hidden sm:block text-[9px] text-gray-400">
                  *T&C Apply.
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Mobile dots */}
        <div className="flex sm:hidden items-center justify-center gap-1 pt-0.5">
          {launchList.map((l, i) => (
            <button
              key={l.id}
              aria-label={`Go to ${l.title}`}
                onClick={() => {
                  launchesScrollRef.current?.scrollTo({
                    left: (launchesScrollRef.current.scrollWidth / launchList.length) * i,
                  behavior: 'smooth',
                });
              }}
              className={`h-1 rounded-full transition-all ${
                i === activeLaunch ? 'w-4 bg-[#e42529]' : 'w-1 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Section: Best Selling Smartphones */}
      <section className="space-y-3 relative">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#e42529]">Loved by India</p>
            <h2 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight leading-tight">
              Best Selling Smartphones
            </h2>
          </div>
          <button 
            onClick={() => onSelectBrand?.('all')}
            className="text-xs sm:text-sm font-bold text-[#003380] hover:text-[#e42529] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scrollCarousel(bestSellingScrollRef, 'left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 hidden sm:flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 z-20 transition-all opacity-90 group-hover/carousel:opacity-100"
            aria-label="Previous best selling products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable Products List */}
          <div
            ref={bestSellingScrollRef}
            className="flex items-stretch gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {bestList.map((phone) => (
              <div key={phone.id} className="min-w-[160px] max-w-[185px] sm:min-w-[230px] sm:max-w-[260px] flex-1 shrink-0">
                <ProductCard
                  product={phone}
                  isInCart={cartProductIds.includes(phone.id)}
                  onAddToCart={onAddToCart}
                  onViewProduct={onViewProduct}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollCarousel(bestSellingScrollRef, 'right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 hidden sm:flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 z-20 transition-all opacity-90 group-hover/carousel:opacity-100"
            aria-label="Next best selling products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Section: Midnight Discounts */}
      <section className="space-y-3 relative pt-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-indigo-600">12AM — 6AM only</p>
            <h2 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight leading-tight">
              Midnight Discounts
            </h2>
          </div>
          <button 
            onClick={() => onSelectBrand?.('all')}
            className="text-xs sm:text-sm font-bold text-[#003380] hover:text-[#e42529] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scrollCarousel(midnightScrollRef, 'left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 hidden sm:flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 z-20 transition-all opacity-90 group-hover/carousel:opacity-100"
            aria-label="Previous midnight discount products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable Products List */}
          <div
            ref={midnightScrollRef}
            className="flex items-stretch gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {midnightList.map((phone) => (
              <div key={phone.id} className="min-w-[160px] max-w-[185px] sm:min-w-[230px] sm:max-w-[260px] flex-1 shrink-0">
                <ProductCard
                  product={phone}
                  isInCart={cartProductIds.includes(phone.id)}
                  onAddToCart={onAddToCart}
                  onViewProduct={onViewProduct}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollCarousel(midnightScrollRef, 'right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 hidden sm:flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 z-20 transition-all opacity-90 group-hover/carousel:opacity-100"
            aria-label="Next midnight discount products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Search by Brands / Categories / Deals */}
      <BrandDirectory
        onSelectBrand={onSelectBrand}
        onSelectCategory={onSelectCategory}
        onGoToDeals={onGoToDeals}
      />

      {/* Phone Reviews reels */}
      <PhoneReviews />

      {/* SEO block */}
      <section className="bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-3 mt-8 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          Buy Top Mobile Phones at Prices You’ll Love
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Need to upgrade your <strong className="text-gray-900">mobile phone</strong>? You’re in the right place. When visiting Mauli Mobile, the experience of exploring mobiles is easy, thrilling, and hassle-free. Whether it is the most basic <strong className="text-gray-900">mobile phone</strong> or a smartphone with all the features you need, we have choices that are reasonable across all budgets and lifestyles. Find the <strong className="text-gray-900">latest mobile phones</strong> of the leading brands, easily compare features and get great offers at the same time. When shopping at Mauli Mobile, you enjoy authorized manufacturer warranty, express 3-hour local store delivery, and certified post-purchase support.
        </p>
      </section>

    </div>
  );
};

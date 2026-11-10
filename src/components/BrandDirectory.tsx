import React from 'react';
import {
  Smartphone,
  Tablet,
  Tv,
  Laptop,
  Headphones,
  Tag,
  Monitor,
  CreditCard,
  Zap,
  PiggyBank,
} from 'lucide-react';
import type { ShopTile } from '../data/adminStore';
import { loadCategoryTiles, loadDealTiles } from '../data/adminStore';
import { useMemo } from 'react';

interface BrandDirectoryProps {
  onSelectBrand?: (brand: string) => void;
  onSelectCategory?: (category: string) => void;
  onGoToDeals?: () => void;
  categoryTiles?: ShopTile[];
  dealTiles?: ShopTile[];
}

const BRAND_LOGOS: { name: string; filter: string; logo?: string; el?: React.ReactNode }[] = [
  { name: 'Apple', filter: 'Apple', logo: '/brands/apple.svg' },
  { name: 'Samsung', filter: 'Samsung', logo: '/brands/samsung.svg' },
  { name: 'Mi', filter: 'Xiaomi', logo: '/brands/xiaomi.svg' },
  { name: 'Lenovo', filter: 'Lenovo', logo: '/brands/lenovo.svg' },
  {
    name: 'Oppo',
    filter: 'Oppo',
    el: <span className="text-[22px] font-bold text-[#2fa84f] tracking-[0.2em]">oppo</span>,
  },
  { name: 'HP', filter: 'HP', logo: '/brands/hp.svg' },
  { name: 'Vivo', filter: 'Vivo', logo: '/brands/vivo.svg' },
  { name: 'Google', filter: 'Google', logo: '/brands/google.svg' },
  {
    name: 'Nothing',
    filter: 'Nothing',
    el: <span className="text-lg font-black text-[#141414] tracking-[0.15em]">NOTHING</span>,
  },
  { name: 'Sony', filter: 'Sony', logo: '/brands/sony.svg' },
  { name: 'LG', filter: 'LG', logo: '/brands/lg.svg' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  mobiles: <Smartphone className="w-9 h-9" strokeWidth={1.2} />,
  audio: <Headphones className="w-9 h-9" strokeWidth={1.2} />,
  tablets: <Tablet className="w-9 h-9" strokeWidth={1.2} />,
  televisions: <Tv className="w-9 h-9" strokeWidth={1.2} />,
  laptops: <Laptop className="w-9 h-9" strokeWidth={1.2} />,
  cameras: <Monitor className="w-9 h-9" strokeWidth={1.2} />,
};

const DEAL_ICONS: React.ReactNode[] = [
  <Tag className="w-9 h-9" strokeWidth={1.2} />,
  <Zap className="w-9 h-9" strokeWidth={1.2} />,
  <Monitor className="w-9 h-9" strokeWidth={1.2} />,
  <Laptop className="w-9 h-9" strokeWidth={1.2} />,
  <PiggyBank className="w-9 h-9" strokeWidth={1.2} />,
  <CreditCard className="w-9 h-9" strokeWidth={1.2} />,
];

export const BrandDirectory: React.FC<BrandDirectoryProps> = ({
  onSelectBrand,
  onSelectCategory,
  onGoToDeals,
  categoryTiles,
  dealTiles,
}) => {
  // App hamesha props deta hai; fallback sirf standalone use ke liye, ek baar read.
  const cats = useMemo(() => categoryTiles ?? loadCategoryTiles(), [categoryTiles]);
  const deals = useMemo(() => dealTiles ?? loadDealTiles(), [dealTiles]);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
      {/* Search by Brands */}
      <div className="lg:col-span-5 bg-transparent p-0 sm:p-6 md:bg-white">
        <h3 className="text-lg sm:text-xl font-medium text-[#333] mb-3 sm:mb-4 pl-5 sm:pl-0 md:pl-0">Search by Brands</h3>
        <div className="md:hidden overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <style>{`@keyframes brand-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.brand-marquee { -ms-overflow-style: none; }
.brand-marquee::-webkit-scrollbar { display: none; }
.brand-marquee-track { animation: brand-marquee 22s linear infinite; }
.brand-marquee:hover .brand-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .brand-marquee-track { animation: none; } }`}</style>
          <div className="brand-marquee flex w-max">
            <div className="brand-marquee-track flex w-max">
              {[...BRAND_LOGOS, ...BRAND_LOGOS].map((b, i) => (
                <button
                  key={`${b.name}-${i}`}
                  onClick={() => onSelectBrand?.(b.filter)}
                  title={b.name}
                  aria-hidden={i >= BRAND_LOGOS.length}
                  tabIndex={i >= BRAND_LOGOS.length ? -1 : 0}
                  className="h-14 w-24 shrink-0 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="max-h-7 max-w-[68px] object-contain" loading="lazy" />
                  ) : (
                    b.el
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-4 gap-x-2 gap-y-3 content-start auto-rows-min">
          {BRAND_LOGOS.map((b) => (
            <button
              key={b.name}
              onClick={() => onSelectBrand?.(b.filter)}
              title={b.name}
              className="h-14 min-w-0 px-1 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {b.logo ? (
                <img src={b.logo} alt={b.name} className="max-h-8 max-w-[76px] object-contain" loading="lazy" />
              ) : (
                b.el
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search by Categories */}
      <div className="lg:col-span-3 bg-white p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-medium text-[#333] mb-4">Search by Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          {cats.map((c) => (
            <button
              key={c.label}
              onClick={() => onSelectCategory?.(c.target)}
              className={`bg-[#f6f7f9] hover:bg-gray-100 transition-colors py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-700 ${
                c.span ? 'col-span-2' : ''
              }`}
            >
              {CATEGORY_ICONS[c.target] || <Smartphone className="w-9 h-9" strokeWidth={1.2} />}
              <span className="text-sm font-bold text-gray-900 text-center leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search by Deals */}
      <div className="lg:col-span-4 bg-white p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-medium text-[#333] mb-4">Search by Deals</h3>
        <div className="grid grid-cols-2 gap-3">
          {deals.map((d, i) => (
            <button
              key={`${d.label}-${i}`}
              onClick={() => onGoToDeals?.()}
              className="bg-[#f6ddb6] hover:bg-[#f2d3a4] transition-colors py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer text-[#4a3f2a]"
            >
              {DEAL_ICONS[i % DEAL_ICONS.length]}
              <span className="text-sm font-bold text-gray-900 text-center leading-tight">{d.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

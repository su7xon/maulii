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

interface BrandDirectoryProps {
  onSelectBrand?: (brand: string) => void;
  onSelectCategory?: (category: string) => void;
  onGoToDeals?: () => void;
}

const BRAND_LOGOS: { name: string; filter: string; el: React.ReactNode }[] = [
  {
    name: 'Apple',
    filter: 'Apple',
    el: <span className="text-[26px] font-extrabold text-gray-500 tracking-tight">Apple</span>,
  },
  {
    name: 'Samsung',
    filter: 'Samsung',
    el: (
      <span className="bg-[#1428a0] text-white text-[11px] font-black italic px-3 py-1 rounded-[50%] tracking-wide">
        SAMSUNG
      </span>
    ),
  },
  {
    name: 'OnePlus',
    filter: 'OnePlus',
    el: (
      <span className="border-[3px] border-[#eb0028] text-[#eb0028] text-xl font-black px-1.5 leading-none">
        1+
      </span>
    ),
  },
  {
    name: 'Mi',
    filter: 'Xiaomi',
    el: (
      <span className="bg-[#ff6900] text-white text-xl font-black w-10 h-10 flex items-center justify-center rounded-[4px]">
        mi
      </span>
    ),
  },
  {
    name: 'Lenovo',
    filter: 'Lenovo',
    el: <span className="text-[22px] font-black text-[#e2231a] tracking-tight">Lenovo</span>,
  },
  {
    name: 'LG',
    filter: 'LG',
    el: (
      <span className="border-[3px] border-[#d6108a] text-[#d6108a] text-xl font-black w-10 h-10 flex items-center justify-center rounded-full">
        LG
      </span>
    ),
  },
  {
    name: 'HP',
    filter: 'HP',
    el: (
      <span className="border-[3px] border-[#0096d6] text-[#0096d6] text-xl font-black italic w-10 h-10 flex items-center justify-center rounded-full">
        hp
      </span>
    ),
  },
  {
    name: 'Vivo',
    filter: 'Vivo',
    el: <span className="text-[22px] font-bold text-[#415fff] tracking-wide">vivo</span>,
  },
  {
    name: 'Dell',
    filter: 'Dell',
    el: (
      <span className="border-[2.5px] border-[#007db8] text-[#007db8] text-sm font-black w-10 h-10 flex items-center justify-center rounded-full">
        DELL
      </span>
    ),
  },
  {
    name: 'Philips',
    filter: 'Philips',
    el: <span className="text-lg font-black text-[#0b5ed7] tracking-wide">PHILIPS</span>,
  },
  {
    name: 'Oppo',
    filter: 'Oppo',
    el: <span className="text-[22px] font-bold text-[#2fa84f] tracking-[0.2em]">oppo</span>,
  },
  {
    name: 'Nokia',
    filter: 'Nokia',
    el: <span className="text-lg font-black text-[#124191] tracking-widest">NOKIA</span>,
  },
];

const CATEGORY_TILES: { label: string; target: string; icon: React.ReactNode; span?: boolean }[] = [
  { label: 'Mobiles', target: 'mobiles', icon: <Smartphone className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'All accessories', target: 'audio', icon: <Headphones className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'Tablets', target: 'tablets', icon: <Tablet className="w-9 h-9" strokeWidth={1.2} /> },
  { label: "Tv's", target: 'televisions', icon: <Tv className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'Laptops', target: 'laptops', icon: <Laptop className="w-9 h-9" strokeWidth={1.2} />, span: true },
];

const DEAL_TILES: { label: string; icon: React.ReactNode }[] = [
  { label: 'Super Deals', icon: <Tag className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'Discounts', icon: <Zap className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'Brand Offers', icon: <Monitor className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'Instant Discounts', icon: <Laptop className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'Cashbacks', icon: <PiggyBank className="w-9 h-9" strokeWidth={1.2} /> },
  { label: 'Bank offers', icon: <CreditCard className="w-9 h-9" strokeWidth={1.2} /> },
];

export const BrandDirectory: React.FC<BrandDirectoryProps> = ({
  onSelectBrand,
  onSelectCategory,
  onGoToDeals,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
      {/* Search by Brands */}
      <div className="lg:col-span-5 bg-white p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-medium text-[#333] mb-4">Search by Brands</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-7">
          {BRAND_LOGOS.map((b) => (
            <button
              key={b.name}
              onClick={() => onSelectBrand?.(b.filter)}
              title={b.name}
              className="h-14 min-w-0 px-1 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {b.el}
            </button>
          ))}
        </div>
      </div>

      {/* Search by Categories */}
      <div className="lg:col-span-3 bg-white p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-medium text-[#333] mb-4">Search by Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORY_TILES.map((c) => (
            <button
              key={c.label}
              onClick={() => onSelectCategory?.(c.target)}
              className={`bg-[#f6f7f9] hover:bg-gray-100 transition-colors py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-700 ${
                c.span ? 'col-span-2' : ''
              }`}
            >
              {c.icon}
              <span className="text-sm font-bold text-gray-900 text-center leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search by Deals */}
      <div className="lg:col-span-4 bg-white p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-medium text-[#333] mb-4">Search by Deals</h3>
        <div className="grid grid-cols-2 gap-3">
          {DEAL_TILES.map((d) => (
            <button
              key={d.label}
              onClick={() => onGoToDeals?.()}
              className="bg-[#f6ddb6] hover:bg-[#f2d3a4] transition-colors py-5 px-2 flex flex-col items-center justify-center gap-2 cursor-pointer text-[#4a3f2a]"
            >
              {d.icon}
              <span className="text-sm font-bold text-gray-900 text-center leading-tight">{d.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

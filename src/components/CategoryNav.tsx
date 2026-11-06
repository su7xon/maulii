import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { Category } from '../types';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categories?: Category[];
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  const list = categories && categories.length > 0 ? categories : CATEGORIES;
  const loop = [...list, ...list];

  return (
    <div className="bg-transparent border-0 shadow-none py-2 relative overflow-x-auto sm:overflow-hidden no-scrollbar">
      <div className="max-w-[1400px] mx-auto px-0 relative">
        {/* Auto-moving strip on desktop; native swipe scroll on mobile */}
        <div className="flex w-max animate-marquee items-center gap-7 px-3">
          {loop.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={`${cat.id}-${idx}`}
                onClick={() => onSelectCategory(cat.id)}
                aria-hidden={idx >= list.length}
                tabIndex={idx >= list.length ? -1 : 0}
                className="flex items-center gap-2 shrink-0 transition-all active:scale-95 group focus:outline-none cursor-pointer bg-transparent border-0 p-0"
              >
                <div
                  className={`w-9 h-9 rounded-full overflow-hidden bg-white flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-[#e42529]'
                      : 'ring-1 ring-gray-200 group-hover:ring-gray-300'
                  }`}
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <span
                  className={`text-xs whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'text-[#e42529] font-extrabold'
                      : 'font-semibold text-gray-800 group-hover:text-[#e42529]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

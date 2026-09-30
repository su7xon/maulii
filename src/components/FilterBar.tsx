import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Zap } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  brands: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  brands,
  totalResults,
}) => {
  return (
    <div className="bg-white border-y border-gray-200 py-2 px-3 sticky top-[60px] sm:top-[82px] z-20 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        {/* Results count */}
        <span className="text-xs font-bold text-gray-700 shrink-0">
          {totalResults} Products
        </span>

        {/* Filters and Sorting controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {/* Express Delivery Toggle */}
          <button
            onClick={() =>
              onFilterChange({ ...filter, expressOnly: !filter.expressOnly })
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              filter.expressOnly
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>3-Hr Express</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filter.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="text-xs font-medium bg-gray-100 text-gray-800 py-1 pl-2.5 pr-6 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-[#e42529] cursor-pointer"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="relative shrink-0">
              <select
                value={filter.brand}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    brand: e.target.value,
                  })
                }
                className="text-xs font-medium bg-gray-100 text-gray-800 py-1 pl-2.5 pr-6 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-[#e42529] cursor-pointer"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

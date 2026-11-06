import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FilterState } from '../types';

interface SortDropdownProps {
  sortBy: FilterState['sortBy'];
  onChange: (v: FilterState['sortBy']) => void;
}

const OPTIONS: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'popularity', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'discount', label: 'Discount: High to Low' },
];

/** Amazon-style compact sort control: grey pill, "Sort by:" + dropdown. */
export const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, onChange }) => {
  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-gray-700">
      <span className="font-medium text-gray-500 hidden xs:inline sm:inline">Sort by:</span>
      <span className="relative inline-flex">
        <select
          value={sortBy}
          onChange={(e) => onChange(e.target.value as FilterState['sortBy'])}
          aria-label="Sort products"
          className="appearance-none bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-medium text-gray-800 shadow-sm focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] cursor-pointer max-w-[190px]"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
      </span>
    </label>
  );
};

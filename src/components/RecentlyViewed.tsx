import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface RecentlyViewedProps {
  products: Product[];
  cartProductIds: string[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onClear: () => void;
}

/** Amazon-style "Your recently viewed items" horizontal rail. */
export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  products,
  cartProductIds,
  onAddToCart,
  onViewProduct,
  onClear,
}) => {
  if (products.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-4">
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
            Your recently viewed items
          </h2>
          <button
            onClick={onClear}
            className="text-[11px] font-semibold text-gray-400 hover:text-[#e42529]"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-1">
          {products.map((p) => (
            <div key={p.id} className="w-[160px] sm:w-[190px] shrink-0 snap-start">
              <ProductCard
                product={p}
                isInCart={cartProductIds.includes(p.id)}
                onAddToCart={onAddToCart}
                onViewProduct={onViewProduct}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

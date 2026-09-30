import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { Category, Product } from '../types';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CategoriesViewProps {
  onSelectCategory: (categoryId: string) => void;
  products: Product[];
  onViewProduct: (product: Product) => void;
  categories?: Category[];
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  onSelectCategory,
  products,
  onViewProduct,
  categories,
}) => {
  const list = categories && categories.length > 0 ? categories : CATEGORIES;
  return (
    <div className="space-y-4 pb-12">
      {/* Category Header Hero */}
      <div className="bg-linear-to-r from-[#003380] to-[#001f4d] p-4 text-white rounded-b-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[#ffe500] text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore Department Stores</span>
        </div>
        <h2 className="text-lg font-black leading-tight">All Electronics Categories</h2>
        <p className="text-xs text-white/80 mt-0.5">
          Find genuine gadgets with brand warranty and trusted support.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="px-3">
        <div className="grid grid-cols-3 gap-2.5">
          {list.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="bg-white rounded-xl p-2.5 border border-gray-200 shadow-2xs hover:border-[#e42529] hover:shadow-xs transition-all flex flex-col items-center text-center group active:scale-95"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-gray-50 border border-gray-100 p-0.5">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-gray-800 leading-tight group-hover:text-[#e42529]">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {count > 0 ? `${count} items` : 'Explore'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Bestsellers Section */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Popular in Store
          </h3>
          <span className="text-[11px] text-[#e42529] font-semibold">
            Handpicked Deals
          </span>
        </div>

        <div className="space-y-2">
          {products.slice(0, 4).map((prod) => (
            <div
              key={prod.id}
              onClick={() => onViewProduct(prod)}
              className="bg-white rounded-xl p-2.5 border border-gray-200 flex items-center justify-between cursor-pointer hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[200px]">
                    {prod.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-black text-[#e42529]">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {prod.discountPercentage}% Off
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

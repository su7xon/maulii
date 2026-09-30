import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInCart,
  onAddToCart,
  onViewProduct,
}) => {
  const calculatedBestPrice = product.bestPrice || Math.round(product.price * 0.92);

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewProduct(product)}
      className="card-entrance bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-12px_rgb(0_0_0/0.25)] hover:border-red-100 cursor-pointer relative group h-full shadow-[0_1px_2px_rgb(0_0_0/0.05),0_4px_16px_-4px_rgb(0_0_0/0.08)]"
    >
      {/* Discount Badge */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow">
          {product.discountPercentage}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="pt-1 pb-1 sm:pt-2 sm:pb-2">
        <div className="relative w-full aspect-square bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden rounded-xl border border-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Graphic specs sticker removed per requirement */}

        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col pt-1.5 sm:pt-2">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {product.rating.toFixed(1)} <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              ({product.ratingCount.toLocaleString('en-IN')})
            </span>
            {product.expressDelivery && (
              <span className="ml-auto text-[9px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-100 uppercase tracking-wide">
                Express
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[12px] sm:text-[13px] font-semibold text-gray-900 line-clamp-2 min-h-[32px] sm:min-h-[36px] leading-snug group-hover:text-[#e42529] transition-colors mb-1 sm:mb-1.5">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[15px] sm:text-[17px] font-extrabold text-gray-900 tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-gray-400 line-through font-medium">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Best price strip */}
        <div className="mt-1.5 pt-1.5 sm:mt-2.5 sm:pt-2 border-t border-dashed border-gray-100 flex items-center gap-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-[#d91e63] bg-pink-50 border border-pink-100 rounded-md px-1.5 py-0.5">
            Best Price
          </span>
          <span className="text-[12px] sm:text-[13px] font-extrabold text-gray-900">
            ₹{calculatedBestPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Add to cart removed per requirement */}
      </div>
    </div>
  );
};

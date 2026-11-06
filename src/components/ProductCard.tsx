import React from 'react';
import { Star, Heart, Check, Plus } from 'lucide-react';
import { Product } from '../types';
import { onImgError } from '../lib/imgFallback';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  variantCount?: number;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInCart,
  onAddToCart,
  onViewProduct,
  variantCount,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  // Sirf asli bestPrice dikhao — pehle 8% fake discount banaya ja raha tha
  // jo checkout kabhi nahi de sakta.
  const calculatedBestPrice = product.bestPrice;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewProduct(product)}
      className="card-entrance bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-12px_rgb(0_0_0/0.25)] hover:border-red-100 cursor-pointer relative group h-full shadow-[0_1px_2px_rgb(0_0_0/0.05),0_4px_16px_-4px_rgb(0_0_0/0.08)]"
    >
      {!product.inStock && (
        <div className="absolute top-3 left-3 bg-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
          Out of stock
        </div>
      )}
      {/* Discount Badge */}
      {product.inStock && product.discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow">
          {product.discountPercentage}% OFF
        </div>
      )}

      {/* Wishlist Heart Button */}
      {onToggleWishlist && (
        <button
          id={`wishlist-btn-${product.id}`}
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-sm border ${
            isWishlisted
              ? 'bg-red-50/95 border-red-200 text-[#e42529] scale-105'
              : 'bg-white/90 border-gray-200/80 text-gray-400 hover:text-[#e42529] hover:bg-white hover:scale-110'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-300 ${
              isWishlisted ? 'fill-[#e42529] animate-heart-pop' : ''
            }`}
          />
        </button>
      )}

      {/* Product Image */}
      <div className="pt-1 pb-1 sm:pt-2 sm:pb-2">
        <div className="relative w-full aspect-square bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden rounded-xl border border-gray-50">
          <img
            src={product.image}
            alt={product.name}
            onError={onImgError}
            className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
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
          {variantCount !== undefined && variantCount > 1 && (
            <p className="text-[10px] font-bold text-[#003380] bg-blue-50 border border-blue-100 rounded-md px-1.5 py-0.5 w-fit mb-1">
              {variantCount} options • From ₹{product.price.toLocaleString('en-IN')}
            </p>
          )}

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

        {/* Best price + Add to cart */}
        <div className="mt-2.5 pt-2.5 border-t border-dashed border-gray-200">
          {typeof calculatedBestPrice === 'number' && calculatedBestPrice > 0 && calculatedBestPrice < product.price && (
            <div className="flex items-baseline justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-semibold text-gray-400 tracking-wide">
                Best Price
              </span>
              <span className="text-[13px] sm:text-[14px] font-extrabold text-[#0a7d4f] tracking-tight">
                ₹{calculatedBestPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`w-full min-h-11 text-[11px] sm:text-xs font-bold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1 active:scale-[0.98] ${
              isInCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-[#e42529] text-white hover:bg-[#c81f23] shadow-[0_2px_8px_-2px_rgb(228_37_41/0.5)]'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3 h-3" /> In Cart
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

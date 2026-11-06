import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { onImgError } from '../lib/imgFallback';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onViewProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-[#e42529] flex items-center justify-center">
              <Heart className="w-4 h-4 fill-[#e42529]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">Your Wishlist</h2>
              <p className="text-xs text-gray-500 font-medium">{wishlistProducts.length} items saved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-300 flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-gray-800">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Tap the heart button on any phone to save it here for later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-bold bg-[#e42529] hover:bg-[#c21418] text-white px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Browse Phones
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-xs hover:border-red-100 transition-all"
              >
                <div
                  onClick={() => {
                    onViewProduct(product);
                    onClose();
                  }}
                  className="w-16 h-16 rounded-lg bg-gray-50 p-1 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border border-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={onImgError}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      onViewProduct(product);
                      onClose();
                    }}
                    className="text-xs font-bold text-gray-900 truncate cursor-pointer hover:text-[#e42529]"
                  >
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-extrabold text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                      }}
                      className="text-[11px] font-extrabold bg-[#e42529] hover:bg-[#c21418] text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                    >
                      <ShoppingBag className="w-3 h-3" /> Move to Cart
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="text-[11px] font-bold text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/70">
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => onAddToCart(p));
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md"
            >
              Add All to Cart <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

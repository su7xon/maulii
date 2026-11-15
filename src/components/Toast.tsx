import React from 'react';
import { Check, ShoppingBag, X, ArrowRight, Heart, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { onImgError } from '../lib/imgFallback';

interface ToastProps {
  message: string;
  type?: 'cart' | 'info';
  product?: Product;
  onClose: () => void;
  onViewCart?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  product, 
  onClose, 
  onViewCart 
}) => {
  // If it's a Cart Notification: Clean, Minimal, Flipkart/Apple style Floating Card
  if (type === 'cart') {
    return (
      <div 
        className="fixed bottom-20 md:bottom-8 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-4 fade-in duration-200"
        role="status"
        aria-live="polite"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/90 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.18)] p-3 flex items-center justify-between gap-3">
          {/* Left: Product Thumbnail & Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {product?.image ? (
              <div className="w-11 h-11 bg-[#f8f9fa] rounded-xl p-1 flex items-center justify-center shrink-0 border border-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={onImgError}
                  className="w-full h-full object-contain"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-900">Added to Cart</span>
                {product?.price && (
                  <span className="text-[11px] font-extrabold text-[#2874f0]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                {product?.name || message}
              </p>
            </div>
          </div>

          {/* Right: View Cart Button & Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onViewCart && (
              <button
                onClick={() => {
                  onViewCart();
                  onClose();
                }}
                className="bg-[#2874f0] hover:bg-[#1259c7] active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>View Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Info / Alert Toast: Minimal sleek floating pill
  return (
    <div 
      className="fixed bottom-20 md:bottom-8 inset-x-4 max-w-sm mx-auto z-50 animate-in slide-in-from-bottom-4 fade-in duration-200"
      role="status"
      aria-live="polite"
    >
      <div className="bg-gray-900/95 backdrop-blur-md text-white rounded-2xl px-4 py-2.5 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {message.toLowerCase().includes('wishlist') ? (
            <div className="w-6 h-6 rounded-full bg-red-500/20 text-[#ff4d4f] flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 fill-[#ff4d4f]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-medium text-gray-100 truncate">{message}</span>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

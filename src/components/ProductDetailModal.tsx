import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Tag, 
  Check, 
  Share2, 
  Gift, 
  Info
} from 'lucide-react';
import { Product } from '../types';
import { BANK_OFFERS } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, withWarranty?: boolean) => void;
  onBuyNow: (product: Product, withWarranty?: boolean) => void;
  currentPincode: string;
  currentCity: string;
  onOpenPincodeModal: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  currentPincode,
  currentCity,
  onOpenPincodeModal,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [includeResqWarranty, setIncludeResqWarranty] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const allImages = [product.image, ...(product.additionalImages || [])];
  const savings = product.mrp - product.price;
  const warrantyPrice = product.price > 50000 ? 2499 : 1299;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center">
      {/* Container / Sheet */}
      <div className="w-full max-w-lg bg-white h-[92vh] sm:h-[88vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Sticky Modal Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              In Stock
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-6 right-0 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                  Link copied!
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main Product Image Gallery */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center relative">
            <div className="relative w-full h-60 flex items-center justify-center">
              <img
                src={allImages[activeImageIndex]}
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300"
              />
              <span className="absolute top-2 left-2 bg-[#e42529] text-white text-[10px] font-black px-2 py-0.5 rounded">
                {product.discountPercentage}% OFF
              </span>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-lg border-2 p-1 bg-white transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#e42529] shadow-xs scale-105'
                        : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Ratings */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-gray-500">
                ({product.ratingCount.toLocaleString()} ratings & reviews)
              </span>
            </div>

            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Savings */}
          <div className="bg-red-50/50 p-3 rounded-xl border border-red-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#1a1a1a]">
                ₹{product.price.toLocaleString('en-IN')}.00
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}.00
              </span>
              <span className="text-xs font-bold text-[#008542]">
                {product.discountPercentage}% OFF
              </span>
            </div>

            {/* Best Price Ribbon */}
            <div className="mt-2.5 pt-2 border-t border-red-200/60 flex items-center gap-2 flex-wrap">
              <div className="border border-pink-500 rounded px-1.5 py-0.5 bg-pink-50 flex items-center shrink-0">
                <span className="text-[#d91e63] font-black text-[9px] uppercase tracking-tighter leading-none">
                  BEST PRICE
                </span>
              </div>
              <span className="text-sm font-extrabold text-gray-900">
                ₹{(product.bestPrice || Math.round(product.price * 0.92)).toLocaleString('en-IN')}.00
              </span>
              <span className="text-xs text-gray-500 font-normal">
                with all applicable <span className="text-[#003380] font-bold underline decoration-dotted">Offers</span>
              </span>
            </div>

            <p className="text-[11px] text-gray-500 mt-2">
              Inclusive of all taxes • No Cost EMI starts at ₹{product.emiStartsAt.toLocaleString('en-IN')}/mo
            </p>

            {/* Mauli Points */}
            <div className="mt-2 pt-2 border-t border-red-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-700">
                <Gift className="w-3.5 h-3.5 text-[#003380]" />
                Mauli One Loyalty Points
              </span>
              <span className="font-bold text-[#003380]">+{product.reliancePoints} Points</span>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <Truck className="w-4 h-4 text-[#e42529]" />
                <span>Delivery Options</span>
              </div>
              <button
                onClick={onOpenPincodeModal}
                className="text-xs font-bold text-[#e42529] hover:underline"
              >
                Change ({currentPincode})
              </button>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Standard Shipping to {currentCity}:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Zap className="w-3.5 h-3.5 fill-emerald-700" />
                <span>Express Delivery by Tomorrow 2:00 PM</span>
              </div>
              <div className="text-[11px] text-gray-500">
                Order in next 3 hours 15 mins to get same-day dispatch
              </div>
            </div>
          </div>

          {/* Bank Offers Carousel */}
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-2">
              <Tag className="w-4 h-4 text-[#e42529]" />
              <span>Available Mauli Offers</span>
            </div>

            <div className="space-y-2">
              {BANK_OFFERS.slice(0, 2).map((bo) => (
                <div
                  key={bo.code}
                  className="p-2 rounded-lg border border-dashed border-gray-300 bg-[#fafafa] flex items-start justify-between gap-2"
                >
                  <div className="text-xs">
                    <span className="font-bold text-gray-800">{bo.bank}: </span>
                    <span className="text-gray-600">{bo.offer}</span>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Use code <span className="font-mono font-bold text-gray-700">{bo.code}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#e42529] bg-red-50 px-2 py-0.5 rounded shrink-0">
                    Apply at Cart
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mauli Protection Addon */}
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeResqWarranty}
                onChange={(e) => setIncludeResqWarranty(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#003380] rounded border-gray-300 focus:ring-[#003380]"
              />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#003380]" />
                    Extended Protection Plan
                  </span>
                  <span className="font-bold text-[#003380]">
                    +₹{warrantyPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  1 Year Additional Extended Warranty + Free Doorstep Pickup & Repair by certified technicians.
                </p>
              </div>
            </label>
          </div>

          {/* Key Features */}
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <h3 className="text-xs font-bold text-gray-800 mb-2">Key Features</h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e42529] mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <h3 className="text-xs font-bold text-gray-800 mb-2">Specifications</h3>
            <div className="divide-y divide-gray-100 text-xs">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="py-1.5 flex justify-between gap-4">
                  <span className="text-gray-500 w-1/3">{key}</span>
                  <span className="text-gray-800 font-medium w-2/3 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Return & Warranty Assurance */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-gray-600 mb-1" />
              <span className="font-semibold text-gray-800">7 Days Return</span>
              <span className="text-[10px] text-gray-500">Replacement Guarantee</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-semibold text-gray-800">Brand Warranty</span>
              <span className="text-[10px] text-gray-500">100% Genuine Mauli</span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="bg-white border-t border-gray-200 p-3 flex gap-2 z-10 shrink-0 shadow-lg">
          <button
            onClick={() => {
              onAddToCart(product, includeResqWarranty);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded-lg border-2 border-[#e42529] text-[#e42529] hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={() => {
              onBuyNow(product, includeResqWarranty);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded-lg bg-[#e42529] hover:bg-[#c21418] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  User,
  X,
  ChevronRight,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { Product } from '../types';
import { onImgError } from '../lib/imgFallback';

interface HeaderProps {
  cartCount: number;
  currentPincode: string;
  currentCity: string;
  onOpenPincodeModal: () => void;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
  onNavigateTab: (tab: 'home' | 'categories' | 'deals' | 'cart' | 'profile') => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  currentPincode,
  currentCity,
  onOpenPincodeModal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  allProducts,
  onNavigateTab,
  wishlistCount = 0,
  onOpenWishlist,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [badgeBounced, setBadgeBounced] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartCount > 0) {
      setBadgeBounced(true);
      const timer = setTimeout(() => setBadgeBounced(false), 700);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const searchResults =
    searchQuery.trim() === ''
      ? []
      : allProducts
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.subCategory &&
                p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .slice(0, 6);

  const popularSearches = [
    'iPhone 16',
    'Galaxy S24 Ultra',
    'Pixel 9',
    'Oppo Reno 13',
    'Redmi Note 13',
    'Nothing Phone',
    'HP Laptops',
    'Lenovo Laptops',
    'Smart TVs',
    'Air Conditioners',
  ];

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
  };

  return (
    <>
      {/* Backdrop overlay when search is active */}
      {isSearchFocused && (
        <div
          onClick={() => setIsSearchFocused(false)}
          className="fixed inset-0 bg-black/40 z-30 transition-opacity"
        />
      )}

      <header className="sticky top-0 z-40 text-white shadow-[0_8px_30px_-10px_rgb(61_10_14/0.7)] border-b border-[#d4af37]/40 bg-gradient-to-r from-[#3d0a0e] via-[#6b141a] to-[#3d0a0e] backdrop-blur-md">
        {/* Main Single-Row Header */}
        <div className="max-w-[1400px] mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-1.5 sm:gap-4">
            {/* Mauli Mobile Logo */}
            <div
              onClick={() => onNavigateTab('home')}
              className="flex items-center cursor-pointer select-none shrink-0 gap-1.5 sm:gap-2"
            >
              <img
                src="/mauli-logo.png"
                alt="Mauli Mobile logo"
                className="object-contain w-8 h-8 sm:w-11 sm:h-11"
              />
              <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold text-sm sm:text-lg tracking-tight">
                  Mauli{' '}
                  <span className="bg-gradient-to-r from-[#ffe9a8] to-[#d4af37] bg-clip-text text-transparent">
                    Mobile
                  </span>
                </span>
              </div>
            </div>

            {/* Search Bar (In Top Header Bar) */}
            <div
              ref={searchContainerRef}
              className="flex-1 min-w-0 max-w-2xl relative mx-1 sm:mx-2"
            >
              <form
                onSubmit={handleSubmit}
                className={`relative flex items-center bg-white rounded-full overflow-hidden pl-3 sm:pl-4 pr-1.5 sm:pr-2 py-1 sm:py-1.5 transition-all duration-300 border-2 ${
                  isSearchFocused
                    ? 'border-[#ffe500] shadow-[0_0_20px_rgba(255,229,0,0.5)]'
                    : 'border-transparent shadow-inner'
                }`}
              >
                <Search
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 mr-1.5 sm:mr-2 shrink-0 transition-colors ${
                    isSearchFocused ? 'text-[#e42529]' : 'text-gray-400'
                  }`}
                />
                <input
                  id="header-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search phones, brands, deals..."
                  className="w-full text-xs sm:text-sm text-gray-900 focus:outline-none placeholder-gray-400 bg-transparent font-medium"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-1 ml-1 transition-colors cursor-pointer shrink-0"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="hidden sm:inline-flex bg-gray-900 hover:bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full ml-1.5 shrink-0 cursor-pointer"
                  >
                    Search
                  </button>
                )}
              </form>

              {/* Normal, Spacious Autocomplete Dropdown (Full width on mobile so it is NEVER squished or 'patla sa') */}
              {isSearchFocused && (
                <div className="fixed sm:absolute left-2.5 right-2.5 sm:left-0 sm:right-0 top-[52px] sm:top-full mt-1 sm:mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-200/90 overflow-hidden z-50 text-gray-800 animate-in fade-in slide-in-from-top-1 duration-150">
                  {searchQuery.trim() !== '' ? (
                    <div>
                      <div className="px-3.5 py-2 bg-gray-50/90 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        <span>Matching Products ({searchResults.length})</span>
                        {searchResults.length > 0 && (
                          <span className="text-[10px] text-gray-400 font-normal lowercase">tap to view</span>
                        )}
                      </div>
                      {searchResults.length > 0 ? (
                        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                          {searchResults.map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => {
                                onSelectProduct(prod);
                                setIsSearchFocused(false);
                              }}
                              className="p-3 flex items-center gap-3 hover:bg-red-50/60 active:bg-red-100/40 cursor-pointer transition-colors"
                            >
                              <img
                                src={prod.image}
                                alt={prod.name}
                                onError={onImgError}
                                className="w-11 h-11 object-contain rounded-lg bg-white p-1 border border-gray-200/70 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                  {prod.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs sm:text-sm font-bold text-[#e42529]">
                                    ₹{prod.price.toLocaleString('en-IN')}
                                  </span>
                                  {prod.mrp > prod.price && (
                                    <span className="text-[11px] text-gray-400 line-through">
                                      ₹{prod.mrp.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                  {prod.discountPercentage > 0 && (
                                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                      {prod.discountPercentage}% OFF
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs sm:text-sm text-gray-500">
                          <p className="font-semibold text-gray-700">No electronics matching "{searchQuery}"</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try checking for typos or search for a brand like Samsung, Apple, or HP.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 sm:p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2.5">
                        <span className="text-[#e42529] text-sm">🔥</span>
                        <span>Trending Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              onSearchChange(item);
                              setIsSearchFocused(false);
                            }}
                            className="bg-gray-100 hover:bg-red-50 hover:text-[#e42529] hover:border-red-200 border border-transparent text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                          >
                            <Search className="w-3 h-3 text-gray-400" />
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Action Icons (Wishlist + Cart + Profile + Location) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Wishlist Button */}
              {onOpenWishlist && (
                <button
                  onClick={onOpenWishlist}
                  className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white hover:text-red-300 hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Wishlist"
                  title={`Wishlist (${wishlistCount})`}
                >
                  <Heart
                    className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${
                      wishlistCount > 0 ? 'fill-red-400 text-red-400' : ''
                    }`}
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-white text-[#e42529] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart Button (desktop + quick click) */}
              <button
                onClick={onOpenCart}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full hidden sm:flex items-center justify-center text-white hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Shopping Cart"
                title={`Cart (${cartCount})`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 bg-[#ffe500] text-[#990000] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow transition-transform ${
                      badgeBounced ? 'animate-cart-bounce scale-110' : ''
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile / Account (desktop only — mobile uses bottom bar) */}
              <button
                onClick={() => onNavigateTab('profile')}
                className="w-9 h-9 rounded-full hidden md:flex items-center justify-center text-white hover:text-[#ffe500] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Your account"
                title="Your account"
              >
                <User className="w-5 h-5 shrink-0" />
              </button>

              {/* Pick your location */}
              <button
                onClick={onOpenPincodeModal}
                className="flex items-center gap-1 text-white hover:text-[#ffe500] transition-colors text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer"
                title="Delivery location"
              >
                <MapPin className="w-4 h-4 text-[#ffe500] shrink-0" />
                <span className="hidden lg:inline whitespace-nowrap">
                  {currentCity ? `${currentCity} ${currentPincode}` : 'Pick location'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  User,
  X,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Product } from '../types';

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
}

export const Header: React.FC<HeaderProps> = ({
  currentPincode,
  currentCity,
  onOpenPincodeModal,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  allProducts,
  onNavigateTab,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim() === '' ? [] : allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  const popularSearches = [
    'OnePlus Nord CE6 Lite',
    'iPhone 16',
    'Galaxy S24 Ultra',
    'Pixel 10',
    'Oppo Reno 13',
    'Redmi 15C',
    'Smart TVs',
    'Air Conditioners'
  ];

  // Close search auto-suggest when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 text-white shadow-[0_8px_30px_-10px_rgb(61_10_14/0.7)] border-b border-[#d4af37]/40 bg-gradient-to-r from-[#3d0a0e] via-[#6b141a] to-[#3d0a0e] backdrop-blur-md">
      {/* Main Red Navigation Bar */}
      <div className="max-w-[1400px] mx-auto px-2.5 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          
          {/* Mauli Mobile Logo */}
          <div 
            onClick={() => onNavigateTab('home')}
            className="flex items-center cursor-pointer select-none shrink-0 gap-2"
          >
            <img
              src="/mauli-logo.png"
              alt="Mauli Mobile logo"
              className="object-contain w-10 h-10 sm:w-[58px] sm:h-[58px]"
            />
            <div className="flex flex-col leading-none">
              <span className="text-white font-extrabold text-base sm:text-xl tracking-tight">
                Mauli <span className="bg-gradient-to-r from-[#ffe9a8] to-[#d4af37] bg-clip-text text-transparent">Mobile</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <div className={`relative flex items-center bg-white rounded-full overflow-hidden pl-4 pr-2 py-1 sm:py-1.5 transition-all duration-300 border-2 ${isSearchFocused ? 'border-[#d4af37] shadow-[0_0_24px_-6px_rgb(212_175_55/0.7)]' : 'border-transparent shadow-inner'}`}>
              <Search className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0 transition-colors ${isSearchFocused ? 'text-[#e42529]' : 'text-gray-400'}`} />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search phones"
                className="w-full text-base sm:text-sm text-gray-900 focus:outline-none placeholder-gray-400 bg-transparent font-semibold"
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-1 ml-1 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full ml-2 shrink-0">
                  Search
                </span>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 text-gray-800">
                {searchQuery.trim() !== '' ? (
                  <div>
                    <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                        {searchResults.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              onSelectProduct(prod);
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 flex items-center gap-3 hover:bg-red-50 cursor-pointer transition-colors"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 object-contain rounded bg-white p-1 border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {prod.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-[#e42529]">
                                  ₹{prod.price.toLocaleString('en-IN')}.00
                                </span>
                                <span className="text-[10px] text-gray-400 line-through">
                                  ₹{prod.mrp.toLocaleString('en-IN')}.00
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500">
                        No electronics matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                      <Clock className="w-3.5 h-3.5 text-[#e42529]" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            onSearchChange(item);
                            setIsSearchFocused(false);
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons (Profile + Pick location) */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Profile / Account (desktop only — mobile uses bottom bar) */}
            <button
              onClick={() => onNavigateTab('profile')}
              className="w-9 h-9 rounded-full hidden md:flex items-center justify-center text-white hover:text-[#ffe500] hover:bg-white/10 transition-colors"
              aria-label="Your account"
              title="Your account"
            >
              <User className="w-5 h-5 shrink-0" />
            </button>
            {/* Pick your location */}
            <button
              onClick={onOpenPincodeModal}
              className="flex items-center gap-1 text-white hover:text-[#ffe500] transition-colors text-xs font-semibold"
            >
              <MapPin className="w-4 h-4 text-[#ffe500] shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">
                {currentCity ? `${currentCity} ${currentPincode}` : 'Pick your location'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

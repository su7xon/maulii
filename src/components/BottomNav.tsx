import React from 'react';
import { Home, Grid, Flame, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'categories' | 'deals' | 'cart' | 'profile';
  onSelectTab: (tab: 'home' | 'categories' | 'deals' | 'cart' | 'profile') => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] px-2 shadow-lg select-none">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {/* Home */}
        <button
          id="nav-tab-home"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center py-1 rounded-lg transition-colors ${
            activeTab === 'home' ? 'text-[#e42529]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        {/* Categories */}
        <button
          id="nav-tab-categories"
          onClick={() => onSelectTab('categories')}
          className={`flex flex-col items-center py-1 rounded-lg transition-colors ${
            activeTab === 'categories' ? 'text-[#e42529]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Categories</span>
        </button>

        {/* Deals */}
        <button
          id="nav-tab-deals"
          onClick={() => onSelectTab('deals')}
          className={`flex flex-col items-center py-1 rounded-lg transition-colors relative ${
            activeTab === 'deals' ? 'text-[#e42529]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <div className="relative">
            <Flame className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-[#ffe500] text-[#990000] text-[8px] font-extrabold px-1 rounded-full leading-none py-0.5">
              HOT
            </span>
          </div>
          <span className="text-[10px] font-bold mt-0.5">Deals</span>
        </button>

        {/* Cart */}
        <button
          id="nav-tab-cart"
          onClick={() => onSelectTab('cart')}
          className={`flex flex-col items-center py-1 rounded-lg transition-colors relative ${
            activeTab === 'cart' ? 'text-[#e42529]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#e42529] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Cart</span>
        </button>

        {/* Account */}
        <button
          id="nav-tab-profile"
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center py-1 rounded-lg transition-colors ${
            activeTab === 'profile' ? 'text-[#e42529]' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Account</span>
        </button>
      </div>
    </nav>
  );
};

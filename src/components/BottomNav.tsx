import React, { useEffect, useState } from 'react';
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
  const [badgeBounced, setBadgeBounced] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setBadgeBounced(true);
      const timer = setTimeout(() => setBadgeBounced(false), 700);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const tabs: {
    id: 'home' | 'categories' | 'deals' | 'cart' | 'profile';
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: React.ReactNode;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    {
      id: 'deals',
      label: 'Deals',
      icon: Flame,
      badge: (
        <span className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-400 to-red-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full leading-none shadow-xs animate-pulse">
          HOT
        </span>
      ),
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      badge:
        cartCount > 0 ? (
          <span
            className={`absolute -top-1.5 -right-2.5 bg-[#e42529] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs transition-transform ${
              badgeBounced ? 'animate-cart-bounce scale-110' : ''
            }`}
          >
            {cartCount}
          </span>
        ) : null,
    },
    { id: 'profile', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none select-none">
      <div className="pointer-events-auto max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_-6px_rgba(20,20,20,0.18)] rounded-2xl px-2 py-1.5 grid grid-cols-5 gap-1 transition-all duration-300">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center py-1.5 px-1 rounded-xl transition-all duration-300 active:scale-95 group ${
                isActive
                  ? 'bg-red-50/90 text-[#e42529] font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
              }`}
            >
              {/* Active glow dot */}
              {isActive && (
                <span className="absolute -top-0.5 w-1 h-1 rounded-full bg-[#e42529] shadow-[0_0_8px_#e42529]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                {tab.badge}
              </div>

              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-all ${
                  isActive ? 'font-extrabold text-[#e42529]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

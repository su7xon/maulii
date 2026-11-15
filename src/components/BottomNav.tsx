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
    id: 'home' | 'categories' | 'deals' | 'profile' | 'cart';
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
        <span className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full leading-none">
          HOT
        </span>
      ),
    },
    { id: 'profile', label: 'Account', icon: User },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      badge:
        cartCount > 0 ? (
          <span
            className={`absolute -top-1.5 -right-2.5 bg-[#e42529] text-white text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs transition-transform ${
              badgeBounced ? 'scale-115' : ''
            }`}
          >
            {cartCount}
          </span>
        ) : null,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 select-none py-1.5 px-2 flex justify-around items-center shadow-xs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-0.5 relative group active:scale-95 transition-transform"
          >
            <div className="relative">
              <div
                className={`flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#e8f0fe] text-[#2874f0] px-4 py-1 rounded-full'
                    : 'text-gray-600 px-2 py-1'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              {tab.badge}
            </div>

            <span
              className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                isActive ? 'font-bold text-[#2874f0]' : 'font-medium text-gray-600'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

import React from 'react';

const QUICK_LINKS = ['About Us', 'Terms of Use', 'Privacy Policy', 'Return Policy', 'Contact Us'];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-white pt-6 pb-6 border-t-4 border-[#c9a24b]">
      <div className="max-w-[1400px] mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src="/mauli-logo.png" alt="Mauli Mobile" className="w-9 h-9 rounded-full object-cover ring-1 ring-[#c9a24b]/60" />
          <span className="font-bold text-white">Mauli</span>
          <span className="text-[#d4af37] font-bold">Mobile</span>
        </div>
        <p className="text-[11px] sm:text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
          Latest mobiles & electronics at best price — 100% genuine, full trust. Visit us at MG Road, Mumbai.
        </p>
        <p className="text-[11px] sm:text-xs text-gray-300 mt-2 font-semibold">
          1800 889 1055 <span className="text-gray-600 mx-1">•</span> maulimobile@gmail.com
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-[11px] text-gray-400">
          {QUICK_LINKS.map((l) => (
            <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
          ))}
        </nav>
        <p className="text-[11px] text-gray-500 mt-3 pt-3 border-t border-white/10">
          © 2026 Mauli Mobile. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

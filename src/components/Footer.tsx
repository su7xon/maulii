import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-white pt-6 pb-6 sm:pt-12 sm:pb-8 border-t-4 border-[#c9a24b]">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* Copyright and Legal Notice */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <div className="flex items-center gap-2">
            <img src="/mauli-logo.png" alt="Mauli Mobile" className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c9a24b]/60" />
            <span className="font-bold text-white text-sm">Mauli</span>
            <span className="text-[#d4af37] font-bold text-sm">Mobile</span>
            <span className="text-gray-600">|</span>
            <span>माऊली मोबाईल शॉपी</span>
          </div>
          <p>© 2026 Mauli Mobile. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

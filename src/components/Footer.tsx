import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

const QUICK_LINKS = ['About Us', 'Terms of Use', 'Privacy Policy', 'Return Policy', 'Contact Us'];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-white pt-5 pb-5 sm:pt-8 sm:pb-6 border-t-4 border-[#c9a24b]">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* Compact contact + quick links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-white/10 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-gray-300">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#ffe500]" />
              <span className="font-bold text-white">1800 889 1055</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#ffe500]" />
              <span>maulimobile@gmail.com</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>9:30 AM – 7:30 PM (All 7 days)</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-gray-400">
            {QUICK_LINKS.map((l) => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </nav>
        </div>

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

import React from 'react';
import { Phone, Mail, Clock, MapPin, BadgeCheck, Truck, ShieldCheck } from 'lucide-react';

const QUICK_LINKS = ['About Us', 'Terms of Use', 'Privacy Policy', 'Return Policy', 'Contact Us'];

const TRUST = [
  { icon: BadgeCheck, title: 'Best Price', sub: 'Guaranteed' },
  { icon: ShieldCheck, title: '100% Genuine', sub: 'Full trust' },
  { icon: Truck, title: '3-Hr Express', sub: 'Local delivery' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-white pt-5 pb-5 sm:pt-8 sm:pb-6 border-t-4 border-[#c9a24b]">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* Store info: location, range, trust */}
        <div className="py-4 sm:py-5 border-b border-white/10">
          <p className="text-sm sm:text-[15px] font-extrabold text-white leading-snug">
            Mauli Mobile — <span className="text-[#d4af37]">माऊली मोबाईल शॉपी</span>
          </p>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1 leading-relaxed max-w-2xl">
            Latest smartphones, tablets, TVs, laptops & audio — sab top brands, sabse best price pe.
            100% genuine products, manufacturer warranty aur full trust ke saath.
          </p>
          <p className="flex items-start gap-1.5 text-[11px] sm:text-xs text-gray-300 mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#ffe500] shrink-0 mt-0.5" />
            <span>Visit store: Shop No. 5, MG Road, Mumbai, Maharashtra 400001 • Open all 7 days, 9:30 AM – 9 PM</span>
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 max-w-lg">
            {TRUST.map((t) => (
              <div key={t.title} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2.5 py-2">
                <t.icon className="w-4 h-4 text-[#ffe500] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-white leading-tight truncate">{t.title}</p>
                  <p className="text-[10px] text-gray-400 leading-tight truncate">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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

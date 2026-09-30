import React from 'react';
import { 
  Phone, 
  Mail, 
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-white pt-12 pb-8 border-t-4 border-[#c9a24b]">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Navigation Links Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 border-b border-white/10 text-xs">
          <div>
            <h5 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Product Categories</h5>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Smartphones & 5G Mobiles</li>
              <li className="hover:text-white cursor-pointer transition-colors">Tablets & iPads</li>
              <li className="hover:text-white cursor-pointer transition-colors">Smart TVs & Home Theatres</li>
              <li className="hover:text-white cursor-pointer transition-colors">Laptops & Gaming Computers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Air Conditioners & Inverters</li>
              <li className="hover:text-white cursor-pointer transition-colors">Smartwatches & Fitness Bands</li>
              <li className="hover:text-white cursor-pointer transition-colors">Refrigerators & Kitchen Appliances</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Site Info</h5>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">About Mauli Mobile</li>
              <li className="hover:text-white cursor-pointer transition-colors">Service & Support</li>
              <li className="hover:text-white cursor-pointer transition-colors">Store Locator</li>
              <li className="hover:text-white cursor-pointer transition-colors">Corporate Enquiries</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers at Mauli</li>
              <li className="hover:text-white cursor-pointer transition-colors">Buying Guides</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Policies & Help</h5>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Use</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Cancellation & Return Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">E-Waste Management</li>
              <li className="hover:text-white cursor-pointer transition-colors">Security & Phishing Warnings</li>
              <li className="hover:text-white cursor-pointer transition-colors">Frequently Asked Questions</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Customer Support</h5>
            <p className="text-gray-400 mb-2">Have a question or need assistance with your purchase?</p>
            <div className="space-y-2 text-gray-300 font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ffe500]" />
                <span className="font-bold text-white text-sm">1800 889 1055</span>
              </p>
              <p className="text-[11px] text-gray-400">9:30 AM to 7:30 PM (All 7 Days)</p>
              <p className="flex items-center gap-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-[#ffe500]" />
                <span>maulimobile@gmail.com</span>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[11px] text-gray-400 block mb-1">Download Mobile App</span>
              <div className="flex gap-2">
                <span className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer">
                  Google Play
                </span>
                <span className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer">
                  App Store
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Legal Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
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

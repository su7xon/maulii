import React from 'react';
import { Zap, ShieldCheck, Wrench, CreditCard } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <div className="bg-white border-y border-gray-200 py-2.5 px-3">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-red-50 text-[#e42529] flex items-center justify-center mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-800 leading-tight">
            Express 3-Hr
          </span>
          <span className="text-[9px] text-gray-500">Delivery</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#003380] flex items-center justify-center mb-1">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-800 leading-tight">
            100% Genuine
          </span>
          <span className="text-[9px] text-gray-500">Brand Warranty</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-800 leading-tight">
            Mauli Assured
          </span>
          <span className="text-[9px] text-gray-500">Free Demo</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-800 leading-tight">
            No Cost EMI
          </span>
          <span className="text-[9px] text-gray-500">Zero Down</span>
        </div>
      </div>
    </div>
  );
};

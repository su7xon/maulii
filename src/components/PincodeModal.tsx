import React, { useState } from 'react';
import { X, MapPin, Search, Check, Building2, Zap } from 'lucide-react';
import { CITIES } from '../data/mockData';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPincode: string;
  currentCity: string;
  onSelectLocation: (city: string, pincode: string) => void;
}

export const PincodeModal: React.FC<PincodeModalProps> = ({
  isOpen,
  onClose,
  currentPincode,
  onSelectLocation,
}) => {
  if (!isOpen) return null;

  const [inputPincode, setInputPincode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(inputPincode)) {
      // Find matching city or default
      const matchedCity = CITIES.find((c) => c.pincode === inputPincode);
      const cityName = matchedCity ? matchedCity.name : 'Your Location';
      onSelectLocation(cityName, inputPincode);
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-[#e42529] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#ffe500]" />
            <div>
              <h3 className="text-sm font-bold">Select Delivery Location</h3>
              <p className="text-[11px] text-white/80">
                Check delivery speed & local store availability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[72vh] overflow-y-auto pretty-scroll">
          {/* Pincode Input Form */}
          <form onSubmit={handleApplyPincode} className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Enter 6-digit Pincode
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={inputPincode}
                  onChange={(e) => {
                    setInputPincode(e.target.value.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                  placeholder="e.g. 400001, 110001"
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg text-base sm:text-xs font-semibold focus:outline-none focus:border-[#e42529] focus:ring-1 focus:ring-[#e42529]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#e42529] hover:bg-[#c21418] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-600 font-medium">{errorMsg}</p>
            )}
          </form>

          {/* Express Advantage */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2 text-emerald-800 text-xs">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Select city to enable <strong>Express 3-Hour delivery</strong> on eligible items!</span>
          </div>

          {/* Popular Cities */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Popular Delivery Hubs</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {CITIES.map((city) => {
                const isCurrent = currentPincode === city.pincode;
                return (
                  <button
                    key={city.pincode}
                    type="button"
                    onClick={() => {
                      onSelectLocation(city.name, city.pincode);
                      onClose();
                    }}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-[#e42529] bg-red-50/60 font-bold text-[#e42529]'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{city.name}</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        PIN: {city.pincode}
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-[#e42529]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center text-[11px] text-gray-500 border-t border-gray-100">
          Delivering to 19,000+ pincodes across India
        </div>
      </div>
    </div>
  );
};

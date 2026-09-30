import React, { useState } from 'react';
import { Flame, Sparkles, Tag, Zap, Percent, Clock } from 'lucide-react';
import { Product, BankOffer } from '../types';
import { DealsCountdown } from './DealsCountdown';
import { ProductCard } from './ProductCard';
import { BANK_OFFERS } from '../data/mockData';

interface DealsViewProps {
  products: Product[];
  cartProductIds: string[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  offers?: BankOffer[];
}

export const DealsView: React.FC<DealsViewProps> = ({
  products,
  cartProductIds,
  onAddToCart,
  onViewProduct,
  offers,
}) => {
  const offerList = offers && offers.length > 0 ? offers : BANK_OFFERS;
  const [dealFilter, setDealFilter] = useState<'all' | 'above40' | 'express'>('all');

  const filteredDeals = products.filter((p) => {
    if (dealFilter === 'above40') return p.discountPercentage >= 30;
    if (dealFilter === 'express') return p.expressDelivery;
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Live Deal of the Day Banner */}
      <DealsCountdown />

      {/* Sale Header */}
      <div className="bg-linear-to-r from-[#e42529] via-[#c21418] to-[#80070a] p-4 text-white rounded-b-xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[#ffe500] text-xs font-bold uppercase tracking-wider mb-1">
          <Flame className="w-4 h-4 fill-[#ffe500]" />
          <span>Mega Electronics Carnival</span>
        </div>
        <h2 className="text-xl font-black leading-tight">Lightning Deals & Bank Offers</h2>
        <p className="text-xs text-white/90 mt-0.5">
          Exclusive online discounts with No-Cost EMI and instant bank cashbacks.
        </p>
      </div>

      {/* Bank Partner Offers Section */}
      <div className="px-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-2">
          <Tag className="w-3.5 h-3.5 text-[#e42529]" />
          <span>Active Bank Discounts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {offerList.map((offer) => (
            <div
              key={offer.code}
              className="bg-white p-3 rounded-xl border border-dashed border-red-200 shadow-2xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-gray-900 block">{offer.bank}</span>
                <span className="text-[11px] text-gray-600 block mt-0.5">{offer.offer}</span>
                <span className="text-[10px] text-gray-400">Min. order ₹{offer.minAmount.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#e42529] bg-red-50 px-2 py-1 rounded border border-red-200 shrink-0">
                {offer.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 flex gap-2">
        <button
          onClick={() => setDealFilter('all')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            dealFilter === 'all'
              ? 'bg-[#e42529] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Hot Deals ({products.length})
        </button>
        <button
          onClick={() => setDealFilter('above40')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            dealFilter === 'above40'
              ? 'bg-[#e42529] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          30%+ Discounts
        </button>
        <button
          onClick={() => setDealFilter('express')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            dealFilter === 'express'
              ? 'bg-[#e42529] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          ⚡ 3-Hr Express
        </button>
      </div>

      {/* Deals Products Grid */}
      <div className="px-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3.5">
          {filteredDeals.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              isInCart={cartProductIds.includes(prod.id)}
              onAddToCart={onAddToCart}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

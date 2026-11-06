import React, { useState } from 'react';
import { Flame, Tag, Zap, Percent, BadgeCheck, Copy, Check } from 'lucide-react';
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

const COUPON_STYLES = [
  'from-[#e42529] via-[#c21418] to-[#7a0d10]',
  'from-[#141414] via-[#2a0a0c] to-[#7a0d10]',
  'from-[#7a0d10] via-[#b8860b] to-[#141414]',
];

function offLabel(code: string): string {
  if (code === 'MAULI1000') return '₹1000 OFF';
  if (code === 'MAULI500') return '₹500 OFF';
  if (code === 'MAULIFIRST') return '5% OFF';
  return 'EXTRA OFF';
}

const CouponCard: React.FC<{ offer: BankOffer; index: number }> = ({ offer, index }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = offer.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${COUPON_STYLES[index % COUPON_STYLES.length]} text-white p-3.5 shadow-[0_12px_30px_-10px_rgb(228_37_41/0.55)]`}>
      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffe500]" />
      <div className="flex items-start justify-between gap-2 pl-2">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.14em] bg-[#ffe500] text-[#7a0000] px-2 py-0.5 rounded-full">
            <Percent className="w-2.5 h-2.5" /> {offLabel(offer.code)}
          </span>
          <p className="text-[13px] font-extrabold leading-snug mt-1.5">{offer.offer}</p>
          <p className="text-[10px] text-white/70 font-medium mt-1">
            {offer.minAmount > 0 ? `Min. order ₹${offer.minAmount.toLocaleString('en-IN')}` : 'No minimum order'} • {offer.bank}
          </p>
        </div>
        <Zap className="w-5 h-5 text-[#ffe500] shrink-0 mt-0.5" />
      </div>
      <button
        onClick={copy}
        className="mt-2.5 ml-2 w-full flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 border border-dashed border-white/40 rounded-xl px-3 py-2 transition active:scale-[0.99]"
      >
        <span className="font-mono font-black tracking-[0.18em] text-sm">{offer.code}</span>
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white text-gray-900 px-2.5 py-1 rounded-lg">
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </span>
      </button>
    </div>
  );
};

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

      {/* Mauli Coupons Section */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-sm font-black text-gray-900">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#e42529] to-[#7a0d10] flex items-center justify-center">
              <Tag className="w-3.5 h-3.5 text-white" />
            </span>
            <span>Mauli Coupons <span className="text-[#e42529]">• {offerList.length} active</span></span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Cart me code lagao</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {offerList.map((offer, i) => (
            <CouponCard key={offer.code} offer={offer} index={i} />
          ))}
        </div>
        <p className="text-[10px] text-gray-400 font-medium mt-1.5 flex items-center gap-1">
          <BadgeCheck className="w-3 h-3 text-emerald-600" />
          Coupons Mauli Mobile checkout pe valid — ek order me ek coupon.
        </p>
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

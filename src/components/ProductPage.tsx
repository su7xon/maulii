import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Share2,
  Gift,
  ChevronRight,
  ChevronLeft,
  Check,
  Banknote,
  Wrench,
  Plus,
} from 'lucide-react';
import { Product, BankOffer } from '../types';
import { ProductCard } from './ProductCard';
import { BANK_OFFERS } from '../data/mockData';

interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, withWarranty?: boolean) => void;
  onBuyNow: (product: Product, withWarranty?: boolean) => void;
  onViewProduct: (product: Product) => void;
  onBack: () => void;
  onHome: () => void;
  currentPincode: string;
  currentCity: string;
  onOpenPincodeModal: () => void;
  offers?: BankOffer[];
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  allProducts,
  onAddToCart,
  onBuyNow,
  onViewProduct,
  onBack,
  onHome,
  currentPincode,
  currentCity,
  onOpenPincodeModal,
  offers,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [includeWarranty, setIncludeWarranty] = useState(false);
  const [copied, setCopied] = useState(false);
  const railRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Reset gallery when switching products via suggestions
  React.useEffect(() => {
    setActiveImage(0);
    setIncludeWarranty(false);
  }, [product.id]);

  const allImages = [product.image, ...(product.additionalImages || [])];
  const bestPrice = product.bestPrice || Math.round(product.price * 0.92);
  const savings = product.mrp - product.price;
  const warrantyPrice = product.price > 50000 ? 2499 : 1299;

  // Recommendation rails
  const suggestions = useMemo(() => {
    const others = allProducts.filter((p) => p.id !== product.id);
    const sameCat = others.filter((p) => p.category === product.category);
    const sameBrand = others.filter(
      (p) => p.category !== product.category && p.brand === product.brand
    );
    const rest = others.filter(
      (p) => p.category !== product.category && p.brand !== product.brand
    );
    return [...sameCat, ...sameBrand, ...rest].slice(0, 10);
  }, [allProducts, product]);

  const moreFromBrand = useMemo(
    () => allProducts.filter((p) => p.id !== product.id && p.brand === product.brand).slice(0, 10),
    [allProducts, product]
  );

  const similarPrice = useMemo(() => {
    const lo = product.price * 0.7;
    const hi = product.price * 1.3;
    return allProducts
      .filter((p) => p.id !== product.id && p.price >= lo && p.price <= hi)
      .slice(0, 10);
  }, [allProducts, product]);

  const topRated = useMemo(
    () =>
      allProducts
        .filter((p) => p.id !== product.id)
        .sort((a, b) => b.rating * Math.log(b.ratingCount + 1) - a.rating * Math.log(a.ratingCount + 1))
        .slice(0, 10),
    [allProducts, product]
  );

  const rails = useMemo(
    () => [
      { title: 'You may also like', kicker: 'Handpicked for you', items: suggestions },
      { title: `More from ${product.brand}`, kicker: 'Same brand', items: moreFromBrand },
      { title: 'Similar price phones', kicker: 'Same budget', items: similarPrice },
      { title: 'Top rated by buyers', kicker: 'Loved across India', items: topRated },
    ],
    [suggestions, moreFromBrand, similarPrice, topRated, product.brand]
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollRail = (key: string, dir: 'left' | 'right') => {
    railRefs.current.get(key)?.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-3 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-[#e42529] font-bold text-gray-700">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        <button onClick={onHome} className="hover:text-[#e42529] font-medium">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        <span className="hover:text-[#e42529] font-medium capitalize cursor-pointer">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </nav>

      {/* Main 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Gallery */}
        <div className="lg:sticky lg:top-32 self-start space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 relative shadow-sm">
            <div className="relative w-full max-w-[400px] mx-auto aspect-square flex items-center justify-center bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden">
              <img
                key={product.id + activeImage}
                src={allImages[activeImage]}
                alt={product.name}
                className="card-entrance w-full h-full object-contain p-4"
              />
              <span className="absolute top-3 left-3 bg-[#e42529] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow">
                {product.discountPercentage}% OFF
              </span>
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 relative"
                  aria-label="Share"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 rounded-xl border-2 p-1 bg-white transition-all ${activeImage === i ? 'border-[#e42529] shadow scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex gap-3">
            <button
              onClick={() => onAddToCart(product, includeWarranty)}
              className="flex-1 py-3.5 rounded-xl border-2 border-[#e42529] text-[#e42529] hover:bg-red-50 font-extrabold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <ShoppingCart className="w-5 h-5" /> ADD TO CART
            </button>
            <button
              onClick={() => onBuyNow(product, includeWarranty)}
              className="flex-1 py-3.5 rounded-xl bg-[#e42529] hover:bg-[#c21418] text-white font-extrabold flex items-center justify-center gap-2 shadow-[0_10px_30px_-8px_rgb(228_37_41/0.5)] active:scale-[0.98] transition-all"
            >
              <Zap className="w-5 h-5" /> BUY NOW
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#e42529] mb-1">{product.brand}</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                {product.rating.toFixed(1)} <Star className="w-3 h-3 fill-white" />
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {product.ratingCount.toLocaleString('en-IN')} ratings & reviews
              </span>
              {product.inStock && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">In Stock</span>
              )}
            </div>
          </div>

          {/* Price box */}
          <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-black text-gray-900 tracking-tight">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="text-sm font-bold text-emerald-600">{product.discountPercentage}% off</span>
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1">You save ₹{savings.toLocaleString('en-IN')} on this order</p>
            <div className="mt-3 pt-3 border-t border-red-200/60 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#d91e63] bg-pink-50 border border-pink-200 rounded-md px-1.5 py-0.5">Best Price</span>
              <span className="text-base font-extrabold">₹{bestPrice.toLocaleString('en-IN')}</span>
              <span className="text-xs text-gray-500">with all applicable offers</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Inclusive of all taxes • No Cost EMI from ₹{product.emiStartsAt.toLocaleString('en-IN')}/mo
            </p>
            <div className="mt-2 pt-2 border-t border-red-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                <Gift className="w-3.5 h-3.5 text-[#003380]" /> Mauli One Loyalty Points
              </span>
              <span className="font-bold text-[#003380]">+{product.reliancePoints} Points</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-sm font-bold"><Truck className="w-4 h-4 text-[#e42529]" /> Delivery to {currentCity} {currentPincode}</span>
              <button onClick={onOpenPincodeModal} className="text-xs font-bold text-[#e42529] hover:underline">Change</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-gray-600">Standard delivery</span><span className="font-bold text-emerald-600">FREE</span></div>
              {product.expressDelivery && (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Zap className="w-3.5 h-3.5" /> 3-Hour Express Delivery available
                </div>
              )}
              <div className="text-[11px] text-gray-500">Order in next 3 hrs for same-day dispatch</div>
            </div>
          </div>

          {/* Service promises (Flipkart style trust row) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center text-center gap-1.5">
              <span className="w-12 h-12 rounded-2xl bg-[#eef3fb] flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#2874f0]" strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-semibold text-gray-700 leading-tight">7-day<br />brand support <ChevronRight className="w-3 h-3 text-gray-400 inline -mt-0.5" /></span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <span className="w-12 h-12 rounded-2xl bg-[#eef3fb] flex items-center justify-center">
                <Banknote className="w-6 h-6 text-[#2874f0]" strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-semibold text-gray-700 leading-tight">Cash on<br />Delivery <ChevronRight className="w-3 h-3 text-gray-400 inline -mt-0.5" /></span>
            </div>
            <a
              href="https://wa.me/918237305111?text=Hi!%20I%20need%20support."
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center gap-1.5 active:scale-95 transition-transform"
            >
              <span className="w-12 h-12 rounded-2xl bg-[#eef3fb] flex items-center justify-center">
                <span className="text-[14px] font-black text-[#2874f0] tracking-tighter">24×7</span>
              </span>
              <span className="text-[11px] font-semibold text-gray-700 leading-tight">Customer<br />support <ChevronRight className="w-3 h-3 text-gray-400 inline -mt-0.5" /></span>
            </a>
          </div>

          {/* Bank offers */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-sm font-bold mb-2.5"><Tag className="w-4 h-4 text-[#e42529]" /> Available offers</p>
            <div className="space-y-2">
              {(offers && offers.length > 0 ? offers : BANK_OFFERS).slice(0, 3).map((bo) => (
                <div key={bo.code} className="p-2.5 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 text-xs">
                  <span className="font-bold">{bo.bank}: </span>
                  <span className="text-gray-600">{bo.offer}</span>
                  <div className="text-[10px] text-gray-400 mt-0.5">Code: <span className="font-mono font-bold text-gray-700">{bo.code}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty add-on */}
          <label className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 rounded-2xl p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={includeWarranty}
              onChange={(e) => setIncludeWarranty(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#003380]"
            />
            <div className="text-xs flex-1">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#003380]" /> Extended Protection</span>
                <span className="text-[#003380]">+₹{warrantyPrice.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-0.5">1 Year extra warranty + free doorstep pickup & repair.</p>
            </div>
          </label>

          {/* About + specs */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-extrabold mb-2">About this item</h3>
            <ul className="space-y-1.5 text-[13px] text-gray-600">
              {product.features.map((f, i) => (
                <li key={i} className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e42529] mt-1.5 shrink-0" />{f}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-extrabold mb-1">Specifications</h3>
            <div className="divide-y divide-gray-100 text-[13px]">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="py-2 flex justify-between gap-4">
                  <span className="text-gray-500 w-1/3">{k}</span>
                  <span className="font-semibold w-2/3 text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center shadow-sm">
              <RotateCcw className="w-4 h-4 text-gray-600 mb-1" />
              <span className="font-bold">7 Days Return</span>
              <span className="text-[10px] text-gray-500">Replacement Guarantee</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-bold">Brand Warranty</span>
              <span className="text-[10px] text-gray-500">100% Genuine Mauli</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation rails */}
      <div className="space-y-7">
        {rails.map(
          (rail) =>
            rail.items.length > 0 && (
              <section key={rail.title} className="relative">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#e42529]">{rail.kicker}</p>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">{rail.title}</h2>
                  </div>
                  <div className="hidden sm:flex gap-2">
                    <button
                      onClick={() => scrollRail(rail.title, 'left')}
                      aria-label={`Previous ${rail.title}`}
                      className="w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => scrollRail(rail.title, 'right')}
                      aria-label={`Next ${rail.title}`}
                      className="w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div
                  ref={(el) => {
                    if (el) railRefs.current.set(rail.title, el);
                    else railRefs.current.delete(rail.title);
                  }}
                  className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2"
                >
                  {rail.items.map((s) => (
                    <div key={s.id} className="min-w-[200px] sm:min-w-[225px] max-w-[240px] snap-start">
                      <ProductCard
                        product={s}
                        isInCart={false}
                        onAddToCart={onAddToCart}
                        onViewProduct={onViewProduct}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )
        )}
      </div>

      {/* Mobile sticky CTA — Flipkart style: cart icon + EMI pill + Buy now pill */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-10px_rgb(0_0_0/0.2)]">
        <div className="flex gap-2 items-stretch">
          <button
            onClick={() => onAddToCart(product, includeWarranty)}
            aria-label="Add to cart"
            className="w-12 shrink-0 rounded-2xl border-[1.5px] border-gray-300 bg-white text-gray-800 flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="relative">
              <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />
              <Plus className="w-3 h-3 absolute -top-1.5 -right-1.5 bg-white rounded-full" strokeWidth={2.5} />
            </span>
          </button>
          <button
            onClick={() => onBuyNow(product, includeWarranty)}
            className="flex-1 rounded-2xl border-[1.5px] border-gray-300 bg-white py-1.5 active:scale-[0.98] transition-transform"
          >
            <span className="block text-sm font-extrabold text-gray-900 leading-tight">Buy with EMI</span>
            <span className="block text-[11px] font-medium text-gray-600 mt-px">
              From ₹{product.emiStartsAt.toLocaleString('en-IN')}/m
            </span>
          </button>
          <button
            onClick={() => onBuyNow(product, includeWarranty)}
            className="flex-[1.15] rounded-2xl bg-[#e42529] hover:bg-[#c21418] py-1.5 active:scale-[0.98] transition-all shadow-[0_10px_24px_-8px_rgb(228_37_41/0.6)]"
          >
            <span className="block text-sm font-extrabold text-white leading-tight">Buy now</span>
            <span className="block text-[11px] font-bold text-white/90 mt-px">
              at ₹{product.price.toLocaleString('en-IN')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

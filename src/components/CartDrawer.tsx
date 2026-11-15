import React, { useState } from 'react';
import { onImgError } from '../lib/imgFallback';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  ShoppingBag,
  Banknote,
  MapPin,
  CreditCard,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CartItem } from '../types';
import { COUPONS, calcCouponDiscount, validateCoupon, calcCashDiscount } from '../lib/coupons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onToggleWarranty: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (paymentMethod: 'upi' | 'card' | 'cod') => void;
  currentCity: string;
  currentPincode: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onToggleWarranty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  currentCity,
  currentPincode,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'cod'>('upi');

  if (!isOpen) return null;

  // Price calculations
  const totalMrp = cartItems.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const totalSellingPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const productDiscount = Math.max(0, totalMrp - totalSellingPrice);

  // Warranty additions
  const warrantyTotal = cartItems.reduce((acc, item) => {
    if (item.selectedWarranty) {
      const wPrice = item.product.price > 50000 ? 2499 : 1299;
      return acc + wPrice * item.quantity;
    }
    return acc;
  }, 0);

  // Coupon discount logic
  const couponDiscount = calcCouponDiscount(appliedCoupon, totalSellingPrice);
  const cashDiscount = calcCashDiscount(cartItems, selectedPayment, totalSellingPrice);

  const finalPayable = Math.max(0, totalSellingPrice + warrantyTotal - couponDiscount - cashDiscount);
  const totalSavings = productDiscount + couponDiscount + cashDiscount;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    const err = validateCoupon(code, totalSellingPrice);
    if (err) {
      setCouponError(err);
    } else {
      setAppliedCoupon(code);
      setCouponError('');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#f5f7fa] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Flipkart / Amazon Style Clean White Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#e42529] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-gray-900 leading-tight">
                  {orderPlaced ? 'Order Confirmation' : 'My Cart'}
                </h2>
                {!orderPlaced && cartItems.length > 0 && (
                  <span className="text-[11px] font-bold text-[#2874f0] bg-blue-50 px-2 py-0.2 rounded-full border border-blue-100">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                <MapPin className="w-3 h-3 text-[#2874f0] shrink-0" />
                <span className="truncate">Deliver to: <strong className="text-gray-800 font-semibold">{currentCity} - {currentPincode}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success State */}
        {orderPlaced ? (
          <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-emerald-200">
              Order Confirmed
            </span>
            <h2 className="text-xl font-black text-gray-900 mb-1">Thank you for your purchase!</h2>
            <p className="text-xs text-gray-600 max-w-xs mb-4">
              Your order <strong className="text-gray-900 font-mono">#MM-{Math.floor(100000 + Math.random() * 900000)}</strong> has been booked successfully and will be delivered via Express Courier.
            </p>

            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Estimated Delivery:</span>
                <span className="font-bold text-gray-900">Tomorrow by 2:00 PM</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Address:</span>
                <span className="font-bold text-gray-900">{currentCity} ({currentPincode})</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Mode:</span>
                <span className="font-bold text-gray-900 uppercase">{selectedPayment}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
                <span>Total Paid:</span>
                <span className="font-black text-[#e42529] text-sm">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClearCart();
                setOrderPlaced(false);
                onClose();
              }}
              className="w-full bg-[#e42529] hover:bg-[#c21418] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center mb-3">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Your Cart is Empty</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1 mb-6">
              Explore best offers on latest smartphones, gadgets, accessories and electronics.
            </p>
            <button
              onClick={onClose}
              className="bg-[#2874f0] hover:bg-[#1259c7] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Normal Cart List View */
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Free Delivery Callout Banner */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2.5 text-xs text-emerald-900 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="text-[11px] sm:text-xs">
                Yay! <strong>FREE Express Delivery</strong> unlocked for your order to {currentCity}!
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5">
              {cartItems.map(({ product, quantity, selectedWarranty }) => {
                const wPrice = product.price > 50000 ? 2499 : 1299;
                const itemSavings = Math.max(0, (product.mrp - product.price) * quantity);
                const discountPercent = product.mrp > product.price 
                  ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex gap-3">
                      {/* Product Thumbnail */}
                      <div className="w-18 h-18 sm:w-20 sm:h-20 bg-[#f8f9fa] rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={onImgError}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] font-black text-[#2874f0] uppercase tracking-wider block">
                            {product.brand}
                          </span>
                          {/* Remove Button */}
                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="text-gray-400 hover:text-red-600 p-1 -mt-1 -mr-1 rounded-md transition-colors"
                            aria-label="Remove item"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                          {product.name}
                        </h4>

                        {/* Price & Savings */}
                        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-extrabold text-gray-900">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{(product.mrp * quantity).toLocaleString('en-IN')}
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {discountPercent}% off
                            </span>
                          )}
                        </div>

                        {itemSavings > 0 && (
                          <p className="text-[10px] font-medium text-emerald-700 mt-0.5">
                            You save ₹{itemSavings.toLocaleString('en-IN')} on this item
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper & Warranty Option */}
                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                      {/* Extended Warranty Addon */}
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-gray-700 select-none">
                        <input
                          type="checkbox"
                          checked={!!selectedWarranty}
                          onChange={() => onToggleWarranty(product.id)}
                          className="w-3.5 h-3.5 text-[#2874f0] rounded focus:ring-0 cursor-pointer"
                        />
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="text-gray-700 font-medium">
                          1-Yr Warranty (+₹{wPrice.toLocaleString('en-IN')})
                        </span>
                      </label>

                      {/* Quantity Stepper (Flipkart style) */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupons Section (Flipkart Clean Card) */}
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Tag className="w-4 h-4 text-[#2874f0]" />
                <span>Apply Store Coupon / Promo Code</span>
              </div>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Coupon <strong>'{appliedCoupon}'</strong> applied (-₹{couponDiscount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-red-600 font-bold hover:underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code (e.g. MAULI1000)"
                      className="flex-1 uppercase text-xs font-semibold py-2 px-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2874f0] bg-white placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="bg-[#2874f0] hover:bg-[#1259c7] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
                  )}

                  {/* Suggested Coupon Chips */}
                  <div className="pt-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                      Available Offers (Tap to apply):
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {COUPONS.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          className="text-[10px] bg-blue-50/80 text-[#2874f0] font-bold px-2.5 py-1 rounded-lg border border-blue-200/70 hover:bg-blue-100 transition-colors flex items-center gap-1 active:scale-95"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-[#2874f0]" />
                          <span>{c.code}</span>
                          <span className="text-gray-500 font-normal">({c.short})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method with Authentic Brand Logos (UPI, COD, Cards) */}
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Choose Payment Mode</span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">100% Safe &amp; Secure</span>
              </div>

              <div className="space-y-2">
                {/* 1. UPI Payment Option with Authentic Logos */}
                <label 
                  className={`block p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedPayment === 'upi' 
                      ? 'border-[#2874f0] bg-blue-50/30 shadow-2xs' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="cart_payment"
                      checked={selectedPayment === 'upi'}
                      onChange={() => setSelectedPayment('upi')}
                      className="accent-[#2874f0] w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          UPI (Google Pay, PhonePe, Paytm, QR)
                        </span>
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-tight">
                          ⚡ FASTEST
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Pay instantly via any UPI App. Zero transaction fee.
                      </p>

                      {/* Authentic Brand Logos Strip */}
                      <div className="flex items-center gap-2 mt-2 pt-1 border-t border-gray-100 flex-wrap">
                        {/* GPay Pill */}
                        <div className="bg-white border border-gray-200 rounded-md px-1.5 py-0.5 flex items-center gap-1 shadow-2xs">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.39 7.33 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.61 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span className="text-[10px] font-bold text-gray-700">GPay</span>
                        </div>

                        {/* PhonePe Pill */}
                        <div className="bg-[#5f259f] text-white rounded-md px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                          <span className="text-[10px] font-black">पे</span>
                          <span className="text-[10px] font-bold">PhonePe</span>
                        </div>

                        {/* Paytm Pill */}
                        <div className="bg-[#002e6e] text-white rounded-md px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                          <span className="text-[10px] font-black tracking-tight text-[#00b9f5]">Pay</span>
                          <span className="text-[10px] font-black tracking-tight text-white">tm</span>
                        </div>

                        {/* Official UPI Logo Badge */}
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md px-1.5 py-0.5 flex items-center gap-1">
                          <span className="text-[10px] font-black italic tracking-wider text-[#097939]">UPI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* 2. Cash on Delivery (COD) Option */}
                <label 
                  className={`block p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedPayment === 'cod' 
                      ? 'border-amber-500 bg-amber-50/40 shadow-2xs' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="cart_payment"
                      checked={selectedPayment === 'cod'}
                      onChange={() => setSelectedPayment('cod')}
                      className="accent-amber-600 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[9px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          CASH DISCOUNT
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Pay cash or UPI at your doorstep upon delivery.
                      </p>

                      <div className="mt-2 pt-1 border-t border-amber-200/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Flat ₹1,000 cash discount on this order!</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                          -₹1,000
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* 3. Cards & Netbanking Option */}
                <label 
                  className={`block p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedPayment === 'card' 
                      ? 'border-[#2874f0] bg-blue-50/30 shadow-2xs' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="cart_payment"
                      checked={selectedPayment === 'card'}
                      onChange={() => setSelectedPayment('card')}
                      className="accent-[#2874f0] w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          Credit / Debit Card &amp; Net Banking
                        </span>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          EMI AVAILABLE
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        All major banks &amp; cards accepted with 3D Secure OTP.
                      </p>

                      {/* Card Logos */}
                      <div className="flex items-center gap-2 mt-2 pt-1 border-t border-gray-100">
                        {/* Visa */}
                        <div className="bg-white border border-gray-200 rounded px-1.5 py-0.5 flex items-center">
                          <span className="text-[#1a1f71] text-xs font-black italic tracking-tighter">VISA</span>
                        </div>
                        {/* Mastercard */}
                        <div className="bg-white border border-gray-200 rounded px-1.5 py-0.5 flex items-center">
                          <div className="flex items-center -space-x-1">
                            <span className="w-3 h-3 rounded-full bg-[#eb001b]" />
                            <span className="w-3 h-3 rounded-full bg-[#f79e1b]" />
                          </div>
                        </div>
                        {/* RuPay */}
                        <div className="bg-white border border-gray-200 rounded px-1.5 py-0.5 flex items-center">
                          <span className="text-[#0f4c9c] text-[10px] font-black italic">RuPay</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bill Summary (Flipkart / Amazon Style Price Details) */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs space-y-2.5">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-xs sm:text-sm uppercase tracking-wider text-gray-500">
                Price Details ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </h3>

              <div className="flex justify-between text-xs text-gray-600">
                <span>Total MRP</span>
                <span className="font-medium text-gray-900">₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>

              {productDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-medium">
                  <span>Discount on MRP</span>
                  <span className="font-bold">- ₹{productDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {warrantyTotal > 0 && (
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Protection Warranty</span>
                  <span className="font-medium text-gray-900">+ ₹{warrantyTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span className="font-bold">- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {cashDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-medium">
                  <span>Cash on Delivery Discount</span>
                  <span className="font-bold">- ₹{cashDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-600">
                <span>Delivery Charges</span>
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-gray-400">₹40</span>
                  <span className="font-bold text-emerald-600 uppercase">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-gray-900 font-extrabold text-sm sm:text-base pt-2.5 border-t border-dashed border-gray-200">
                <span>Total Amount</span>
                <span className="text-gray-900 text-lg">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 text-center text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!</span>
                </div>
              )}
            </div>

            {/* Trust Badges Footer */}
            <div className="py-2 flex items-center justify-around text-center text-[10px] text-gray-500 border-t border-gray-200/60">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Express Courier</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#2874f0]" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Bottom Sticky Checkout Bar (Flipkart Style) */}
        {!orderPlaced && cartItems.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sticky bottom-0 z-20">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Payable
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-black text-gray-900">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
                {totalSavings > 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 hidden sm:inline">
                    (Saved ₹{totalSavings.toLocaleString('en-IN')})
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onCheckout(selectedPayment)}
              className="bg-[#e42529] hover:bg-[#c81f23] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(228,37,41,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              <span>Checkout Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

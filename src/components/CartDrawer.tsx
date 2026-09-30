import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onToggleWarranty: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
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
  const [selectedPayment] = useState('upi');

  if (!isOpen) return null;

  // Price calculations
  const totalMrp = cartItems.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const totalSellingPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const productDiscount = totalMrp - totalSellingPrice;

  // Warranty additions
  const warrantyTotal = cartItems.reduce((acc, item) => {
    if (item.selectedWarranty) {
      const wPrice = item.product.price > 50000 ? 2499 : 1299;
      return acc + wPrice * item.quantity;
    }
    return acc;
  }, 0);

  // Coupon discount logic
  let couponDiscount = 0;
  if (appliedCoupon === 'DIGITAL1000' && totalSellingPrice >= 10000) {
    couponDiscount = 1000;
  } else if (appliedCoupon === 'RELIANCE500') {
    couponDiscount = 500;
  } else if (appliedCoupon === 'FIRSTBUY') {
    couponDiscount = Math.round(totalSellingPrice * 0.05);
  }

  const finalPayable = Math.max(0, totalSellingPrice + warrantyTotal - couponDiscount);
  const totalSavings = productDiscount + couponDiscount;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (code === 'DIGITAL1000') {
      if (totalSellingPrice < 10000) {
        setCouponError('DIGITAL1000 requires minimum order of ₹10,000');
      } else {
        setAppliedCoupon('DIGITAL1000');
        setCouponError('');
      }
    } else if (code === 'RELIANCE500') {
      setAppliedCoupon('RELIANCE500');
      setCouponError('');
    } else if (code === 'FIRSTBUY') {
      setAppliedCoupon('FIRSTBUY');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try DIGITAL1000 or RELIANCE500');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#f4f4f6] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Cart Top Header */}
        <div className="bg-[#e42529] p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ffe500]" />
            <div>
              <h2 className="text-sm font-bold">
                {orderPlaced ? 'Order Confirmation' : `My Cart (${cartItems.length} items)`}
              </h2>
              <p className="text-[11px] text-white/80">
                Delivering to {currentCity} - {currentPincode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success State */}
        {orderPlaced ? (
          <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              Order Confirmed
            </span>
            <h2 className="text-xl font-black text-gray-900 mb-1">Thank you for your purchase!</h2>
            <p className="text-xs text-gray-600 max-w-xs mb-4">
              Your order <strong className="text-gray-900">#RD-{Math.floor(100000 + Math.random() * 900000)}</strong> has been booked successfully and will be delivered via Express Courier.
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
              className="w-full bg-[#e42529] hover:bg-[#c21418] text-white py-2.5 rounded-lg text-xs font-bold shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 text-[#e42529] flex items-center justify-center mb-3">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Your Cart is Empty</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1 mb-6">
              Explore best offers on latest smartphones, smart TVs, laptops and appliances.
            </p>
            <button
              onClick={onClose}
              className="bg-[#e42529] text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow-sm hover:bg-[#c21418] transition-colors"
            >
              Explore Deals
            </button>
          </div>
        ) : (
          /* Normal Cart List View */
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Free Delivery Callout */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-800">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Yay! <strong>Free Express Delivery</strong> unlocked for this order to {currentCity}!
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5">
              {cartItems.map(({ product, quantity, selectedWarranty }) => {
                const wPrice = product.price > 50000 ? 2499 : 1299;
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl p-3 border border-gray-200 shadow-2xs space-y-2.5"
                  >
                    <div className="flex gap-3">
                      {/* Product Thumbnail */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1 shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {product.name}
                        </h4>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-black text-gray-900">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{(product.mrp * quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-gray-400 hover:text-red-600 p-1 self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Selector & resQ warranty toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      {/* resQ warranty pill */}
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-gray-700">
                        <input
                          type="checkbox"
                          checked={!!selectedWarranty}
                          onChange={() => onToggleWarranty(product.id)}
                          className="w-3.5 h-3.5 text-[#003380] rounded"
                        />
                        <span className="text-gray-600">
                          Extended Warranty (+₹{wPrice.toLocaleString('en-IN')})
                        </span>
                      </label>

                      {/* Qty Button Group */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-200 text-gray-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-200 text-gray-700 transition-colors"
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

            {/* Coupons Section */}
            <div className="bg-white rounded-xl p-3 border border-gray-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <Tag className="w-4 h-4 text-[#e42529]" />
                <span>Apply Coupon / Promo Code</span>
              </div>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon '{appliedCoupon}' Applied (-₹{couponDiscount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter DIGITAL1000 or RELIANCE500"
                      className="flex-1 uppercase text-base sm:text-xs font-semibold py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e42529]"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="bg-[#e42529] hover:bg-[#c21418] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                  )}

                  {/* Suggested Coupon Chips */}
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => handleApplyCoupon('DIGITAL1000')}
                      className="text-[10px] bg-red-50 text-[#e42529] font-bold px-2 py-0.5 rounded border border-red-200 hover:bg-red-100"
                    >
                      DIGITAL1000 (₹1000 Off)
                    </button>
                    <button
                      onClick={() => handleApplyCoupon('RELIANCE500')}
                      className="text-[10px] bg-red-50 text-[#e42529] font-bold px-2 py-0.5 rounded border border-red-200 hover:bg-red-100"
                    >
                      RELIANCE500 (₹500 Off)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-xs space-y-2">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                Price Details
              </h3>

              <div className="flex justify-between text-gray-600">
                <span>Total MRP ({cartItems.length} items):</span>
                <span>₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount on MRP:</span>
                <span>- ₹{productDiscount.toLocaleString('en-IN')}</span>
              </div>

              {warrantyTotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Mauli Protection Warranty:</span>
                  <span>+ ₹{warrantyTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Savings ({appliedCoupon}):</span>
                  <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Standard Delivery Fee:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>

              <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-gray-100">
                <span>Total Amount:</span>
                <span className="text-[#e42529]">₹{finalPayable.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-emerald-50 rounded-lg p-2 text-center text-emerald-800 text-[11px] font-bold">
                You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout Button (Only in Normal View) */}
        {!orderPlaced && cartItems.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[11px] text-gray-500 block">Total Payable</span>
              <span className="text-base font-black text-gray-900">
                ₹{finalPayable.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="bg-[#e42529] hover:bg-[#c21418] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
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

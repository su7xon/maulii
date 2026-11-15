import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Loader2,
  Home,
  Briefcase,
  Plus,
  Pencil,
  Lock,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Gift,
  Check,
} from 'lucide-react';
import { CartItem } from '../types';
import { loadOrders, saveOrders, type Order } from '../data/adminStore';
import { pushOrder } from '../lib/orderStore';
import {
  isRazorpayConfigured,
  createRazorpayOrder,
  openRazorpayCheckout,
  verifyRazorpayPayment,
} from '../lib/payment';
import { COUPONS, calcCouponDiscount, validateCoupon, calcCashDiscount } from '../lib/coupons';
import {
  type Address,
  type AddressErrors,
  STATES,
  loadAddresses,
  saveAddresses,
  upsertAddress,
  deleteAddress,
  defaultAddress,
  emptyAddress,
  validateAddress,
  lookupPincode,
} from '../lib/addressBook';
import { onImgError } from '../lib/imgFallback';

interface CheckoutViewProps {
  cartItems: CartItem[];
  defaultCity: string;
  defaultPincode: string;
  onBack: () => void;
  onOrderDone: () => void;
  onClearCart: () => void;
  initialPaymentMethod?: 'upi' | 'card' | 'cod';
}

const PAY_LABELS: Record<string, string> = { upi: 'UPI', card: 'Card', cod: 'Cash on Delivery' };

const inputCls =
  'w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] bg-white placeholder:text-gray-400 transition-colors';
const errCls = 'text-[11px] text-red-600 font-semibold mt-1';

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  defaultCity,
  defaultPincode,
  onBack,
  onOrderDone,
  onClearCart,
  initialPaymentMethod,
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [addresses, setAddresses] = useState<Address[]>(loadAddresses);
  const [selectedId, setSelectedId] = useState<string>(() => defaultAddress(loadAddresses())?.id || '');
  const [form, setForm] = useState<Address>(() => {
    const d = defaultAddress(loadAddresses());
    return d ? { ...d } : { ...emptyAddress(), city: defaultCity || '', pincode: defaultPincode || '' };
  });
  const [editing, setEditing] = useState<boolean>(() => loadAddresses().length === 0);
  const [pinLoading, setPinLoading] = useState(false);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'cod'>(initialPaymentMethod || 'upi');
  const [payError, setPayError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId] = useState(() => `MM-${Math.floor(100000 + Math.random() * 900000)}`);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showPriceSheet, setShowPriceSheet] = useState(false);

  // Totals & Calculations
  const mrpTotal = cartItems.reduce((a, i) => a + i.product.mrp * i.quantity, 0);
  const subtotal = cartItems.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const warrantyTotal = cartItems.reduce((a, i) => {
    if (!i.selectedWarranty) return a;
    return a + (i.product.price > 50000 ? 2499 : 1299) * i.quantity;
  }, 0);
  const couponDiscount = calcCouponDiscount(appliedCoupon, subtotal);
  const cashDiscount = calcCashDiscount(cartItems, payMethod, subtotal);
  const total = Math.max(0, subtotal + warrantyTotal - couponDiscount - cashDiscount);
  const totalSavings = mrpTotal - subtotal + couponDiscount + cashDiscount;
  const eta = new Date(Date.now() + 4 * 864e5).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
  });

  const selected = addresses.find((a) => a.id === selectedId) || defaultAddress(addresses);

  const setField = (k: keyof Address, v: string | boolean) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const onPincodeBlur = async (value: string) => {
    if (!/^[1-9][0-9]{5}$/.test(value)) return;
    setPinLoading(true);
    const found = await lookupPincode(value);
    setPinLoading(false);
    if (found) {
      setForm((p) => ({ ...p, city: found.city, state: found.state }));
      setErrors((p) => ({ ...p, city: '', state: '' }));
    }
  };

  const startNewAddress = () => {
    setForm({ ...emptyAddress(), city: defaultCity || '', pincode: defaultPincode || '' });
    setErrors({});
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editAddress = (a: Address) => {
    setForm({ ...a });
    setErrors({});
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeAddress = (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    const next = deleteAddress(addresses, id);
    setAddresses(next);
    saveAddresses(next);
    if (selectedId === id) setSelectedId(defaultAddress(next)?.id || '');
  };

  const deliverHere = () => {
    const e = validateAddress(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    const clean: Address = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      pincode: form.pincode.trim(),
      addressLine: form.addressLine.trim(),
      landmark: form.landmark.trim(),
      city: form.city.trim(),
    };
    const next = upsertAddress(addresses, { ...clean, isDefault: addresses.length === 0 || clean.isDefault });
    setAddresses(next);
    saveAddresses(next);
    setSelectedId(clean.id);
    setEditing(false);
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = () => {
    setPlacing(true);
    setPayError('');

    const buildOrder = (paymentLabel: string): Order | null => {
      try {
        return {
          id: orderId,
          date: new Date().toISOString(),
          items: cartItems.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            quantity,
            image: product.image,
          })),
          total,
          mrpTotal,
          payment: paymentLabel,
          status: 'Placed' as const,
          name: selected?.name || form.name,
          phone: selected?.phone || form.phone,
          city: selected?.city || form.city,
          pincode: selected?.pincode || form.pincode,
          address: [selected?.addressLine, selected?.landmark].filter(Boolean).join(', ') || form.addressLine,
        };
      } catch {
        return null;
      }
    };

    const complete = (paymentLabel: string) => {
      const order = buildOrder(paymentLabel);
      if (order) {
        saveOrders([order, ...loadOrders()]);
        void pushOrder(order);
      }
      setPlacing(false);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (payMethod === 'cod') {
      setTimeout(() => complete(PAY_LABELS.cod), 600);
      return;
    }

    if (!isRazorpayConfigured) {
      setPlacing(false);
      setPayError('Online payment currently in demo mode. Choose Cash on Delivery or configure Razorpay keys.');
      return;
    }

    void (async () => {
      try {
        const rzpOrderId = await createRazorpayOrder(total * 100, orderId);
        const resp = await openRazorpayCheckout({
          orderId: rzpOrderId,
          amountInPaise: total * 100,
          name: selected?.name || form.name,
          phone: selected?.phone || form.phone,
          description: `${orderId} • ${cartItems.length} item(s)`,
        });
        const verified = await verifyRazorpayPayment(resp);
        if (!verified) {
          setPlacing(false);
          setPayError('Payment verification pending. Please share Payment ID with support: ' + resp.razorpay_payment_id);
          return;
        }
        complete(`${PAY_LABELS[payMethod] || payMethod} (${resp.razorpay_payment_id})`);
      } catch (err) {
        setPlacing(false);
        setPayError((err as Error).message || 'Payment failed. Please try again.');
      }
    })();
  };

  const finish = () => {
    onClearCart();
    onOrderDone();
  };

  const applyCoupon = (raw?: string) => {
    const code = (raw ?? couponCode).trim().toUpperCase();
    const err = validateCoupon(code, subtotal);
    if (err) {
      setCouponError(err);
    } else {
      setAppliedCoupon(code);
      setCouponCode('');
      setCouponError('');
    }
  };

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Truck className="w-8 h-8" />
        </div>
        <p className="text-lg font-bold text-gray-900">Your cart is empty</p>
        <p className="text-sm text-gray-500 mt-1 mb-6">Explore our latest smartphones and electronics.</p>
        <button onClick={onBack} className="bg-[#2874f0] hover:bg-[#1259c7] text-white text-sm font-bold py-3 px-8 rounded-lg shadow-sm transition">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-28 lg:pb-12 text-[#212121]">
      {/* Flipkart-Style Clean Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-[1180px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={step === 'payment' ? () => setStep('address') : onBack}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
                Mauli <span className="text-[#2874f0]">Checkout</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">100% Secure &amp; Verified</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1180px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {step === 'success' ? (
          /* ---------- SUCCESS VIEW ---------- */
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-10 text-center shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Order Confirmed
            </span>
            <h2 className="text-2xl font-bold mt-3 text-gray-900">Thank you for your order!</h2>
            <p className="text-sm text-gray-600 mt-1">
              Order <strong className="text-gray-900 font-mono">{orderId}</strong> placed successfully.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-3 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Expected Delivery</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  {eta}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4 pt-2 border-t border-gray-200">
                <span className="text-gray-500 font-medium shrink-0">Deliver To</span>
                <span className="font-semibold text-right text-gray-800 leading-snug">
                  {selected?.name || form.name} (+91 {selected?.phone || form.phone})<br />
                  <span className="text-gray-600 text-[11px]">
                    {[selected?.addressLine || form.addressLine, selected?.landmark || form.landmark].filter(Boolean).join(', ')}, {selected?.city || form.city} - {selected?.pincode || form.pincode}
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-500 font-medium">Payment Mode</span>
                <span className="font-bold text-gray-800">{PAY_LABELS[payMethod]}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-500 font-medium">Total Paid / Payable</span>
                <span className="font-extrabold text-[#2874f0] text-base">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={finish}
              className="mt-6 w-full bg-[#2874f0] hover:bg-[#1259c7] text-white py-3.5 rounded-lg text-sm font-bold shadow-sm transition active:scale-[0.99]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* ---------- ACCORDION / STEPPED CHECKOUT ---------- */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6 items-start">
            
            {/* LEFT COLUMN: Accordion Steps */}
            <div className="space-y-3.5">
              
              {/* STEP 1: DELIVERY ADDRESS */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                <div className={`px-4 sm:px-6 py-3.5 flex items-center justify-between ${
                  step === 'payment' ? 'bg-gray-50/70 border-b border-gray-200' : 'bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-xs text-xs font-bold flex items-center justify-center ${
                      step === 'payment' ? 'bg-[#2874f0] text-white' : 'bg-[#2874f0] text-white'
                    }`}>
                      1
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wide">
                      Delivery Address
                    </h2>
                    {step === 'payment' && (
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    )}
                  </div>

                  {step === 'payment' && (
                    <button
                      onClick={() => setStep('address')}
                      className="text-xs font-bold text-[#2874f0] hover:bg-blue-50 px-3 py-1.5 rounded border border-[#2874f0] transition uppercase tracking-wider"
                    >
                      Change
                    </button>
                  )}
                </div>

                {/* Collapsed view when on payment step */}
                {step === 'payment' && selected && (
                  <div className="px-4 sm:px-6 py-3.5 text-xs text-gray-700 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{selected.name}</span>
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded uppercase">
                          {selected.type}
                        </span>
                        <span className="font-semibold text-gray-700">+91 {selected.phone}</span>
                      </div>
                      <p className="text-gray-600 mt-1 leading-relaxed">
                        {selected.addressLine}{selected.landmark ? `, ${selected.landmark}` : ''}, {selected.city}, {selected.state} - <strong className="text-gray-800">{selected.pincode}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Expanded view when on address step */}
                {step === 'address' && (
                  <div className="p-4 sm:p-6 border-t border-gray-100">
                    {addresses.length > 0 && !editing ? (
                      <div className="space-y-3">
                        {addresses.map((a) => {
                          const active = a.id === (selected?.id || '');
                          return (
                            <div
                              key={a.id}
                              onClick={() => setSelectedId(a.id)}
                              className={`border rounded-lg p-3.5 sm:p-4 text-xs cursor-pointer transition-all ${
                                active
                                  ? 'border-[#2874f0] bg-blue-50/20 shadow-xs'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  checked={active}
                                  onChange={() => setSelectedId(a.id)}
                                  className="accent-[#2874f0] w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                                  aria-label={`Use ${a.name} address`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm text-gray-900">{a.name}</span>
                                    <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded uppercase">
                                      {a.type}
                                    </span>
                                    <span className="text-gray-700 font-semibold">+91 {a.phone}</span>
                                    {a.isDefault && (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                        DEFAULT
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-700 mt-1.5 leading-relaxed text-xs">
                                    {a.addressLine}{a.landmark ? `, ${a.landmark}` : ''}, {a.city}, {a.state} - <strong>{a.pincode}</strong>
                                  </p>

                                  {active && (
                                    <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setStep('payment');
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="bg-[#fb641b] hover:bg-[#f05a13] text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-[0.98]"
                                      >
                                        Deliver Here
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          editAddress(a);
                                        }}
                                        className="text-xs font-bold text-[#2874f0] hover:underline flex items-center gap-1"
                                      >
                                        <Pencil className="w-3 h-3" /> Edit
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeAddress(a.id);
                                        }}
                                        className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 ml-auto"
                                      >
                                        <Trash2 className="w-3 h-3" /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <button
                          onClick={startNewAddress}
                          className="w-full py-3 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-[#2874f0] hover:border-[#2874f0] hover:bg-blue-50/30 flex items-center justify-center gap-2 transition"
                        >
                          <Plus className="w-4 h-4" /> Add a new address
                        </button>
                      </div>
                    ) : (
                      /* Address Form */
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {form.id ? 'Edit Address' : 'Add New Address'}
                          </h3>
                          {addresses.length > 0 && (
                            <button
                              onClick={() => setEditing(false)}
                              className="text-xs font-bold text-gray-500 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              value={form.name}
                              onChange={(e) => setField('name', e.target.value)}
                              placeholder="Full Name *"
                              autoComplete="name"
                              className={`${inputCls} ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className={errCls}>{errors.name}</p>}
                          </div>
                          <div>
                            <input
                              value={form.phone}
                              onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                              placeholder="10-digit Mobile Number *"
                              inputMode="numeric"
                              autoComplete="tel"
                              className={`${inputCls} ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && <p className={errCls}>{errors.phone}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="relative">
                              <input
                                value={form.pincode}
                                onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                onBlur={(e) => void onPincodeBlur(e.target.value)}
                                placeholder="6-digit Pincode *"
                                inputMode="numeric"
                                autoComplete="postal-code"
                                className={`${inputCls} ${errors.pincode ? 'border-red-500' : ''}`}
                              />
                              {pinLoading && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium">
                                  Looking up...
                                </span>
                              )}
                            </div>
                            {errors.pincode && <p className={errCls}>{errors.pincode}</p>}
                          </div>
                          <div>
                            <input
                              value={form.city}
                              onChange={(e) => setField('city', e.target.value)}
                              placeholder="City / District *"
                              autoComplete="address-level2"
                              className={`${inputCls} ${errors.city ? 'border-red-500' : ''}`}
                            />
                            {errors.city && <p className={errCls}>{errors.city}</p>}
                          </div>
                        </div>

                        <div>
                          <textarea
                            value={form.addressLine}
                            onChange={(e) => setField('addressLine', e.target.value)}
                            placeholder="Flat, House no., Building, Street, Area *"
                            rows={2}
                            autoComplete="street-address"
                            className={`${inputCls} resize-none ${errors.addressLine ? 'border-red-500' : ''}`}
                          />
                          {errors.addressLine && <p className={errCls}>{errors.addressLine}</p>}
                        </div>

                        <input
                          value={form.landmark}
                          onChange={(e) => setField('landmark', e.target.value)}
                          placeholder="Landmark (Optional) — e.g. Near Station / SBI ATM"
                          className={inputCls}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <select
                            value={form.state}
                            onChange={(e) => setField('state', e.target.value)}
                            className={inputCls}
                            aria-label="State"
                          >
                            {STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          <div className="flex gap-2">
                            {(['Home', 'Work', 'Other'] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setField('type', t)}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                                  form.type === t
                                    ? 'border-[#2874f0] bg-blue-50/60 text-[#2874f0]'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {t === 'Home' ? <Home className="w-3.5 h-3.5" /> : t === 'Work' ? <Briefcase className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={(e) => setField('isDefault', e.target.checked)}
                            className="w-4 h-4 accent-[#2874f0] rounded"
                          />
                          Make this my default delivery address
                        </label>

                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={deliverHere}
                            className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#f05a13] text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-[0.99]"
                          >
                            Save &amp; Deliver Here
                          </button>
                          {addresses.length > 0 && (
                            <button
                              onClick={() => setEditing(false)}
                              className="w-full sm:w-auto px-5 py-3 rounded text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 2: ORDER SUMMARY */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-4 sm:px-6 py-3.5 bg-gray-50/70 border-b border-gray-200 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-xs bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wide">
                    Order Summary ({cartItems.length} {cartItems.length > 1 ? 'Items' : 'Item'})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map(({ product, quantity, selectedWarranty }) => (
                    <div key={product.id} className="p-4 sm:p-5 flex gap-4 items-start">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg p-1.5 shrink-0 border border-gray-100 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={onImgError}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Brand: <span className="font-medium text-gray-800">{product.brand}</span> • Qty: {quantity}
                        </p>
                        {selectedWarranty && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                            + Extended Warranty
                          </span>
                        )}
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-base font-bold text-gray-900">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(product.mrp * quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            {product.discountPercentage}% OFF
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-700 mt-2 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-emerald-600" />
                          Delivery by {eta} | <span className="text-emerald-700 font-bold">FREE</span>
                          <span className="text-gray-400 line-through text-[11px]">₹40</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 3: PAYMENT METHOD */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                <div className={`px-4 sm:px-6 py-3.5 flex items-center gap-3 ${
                  step === 'payment' ? 'bg-white' : 'bg-gray-50/70 border-b border-gray-200'
                }`}>
                  <span className={`w-6 h-6 rounded-xs text-xs font-bold flex items-center justify-center ${
                    step === 'payment' ? 'bg-[#2874f0] text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    3
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wide">
                    Payment Options
                  </h2>
                </div>

                {step === 'payment' && (
                  <div className="p-4 sm:p-6 border-t border-gray-100 space-y-4">
                    {/* UPI Option */}
                    <label className={`block p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      payMethod === 'upi' ? 'border-[#2874f0] bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={payMethod === 'upi'}
                          onChange={() => { setPayMethod('upi'); setPayError(''); }}
                          className="accent-[#2874f0] w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">UPI (Instant &amp; Zero Fee)</span>
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              FASTEST
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-white border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded text-gray-700">GPay</span>
                            <span className="bg-[#5f259f] text-white text-[10px] font-bold px-2 py-0.5 rounded">PhonePe</span>
                            <span className="bg-[#002e6e] text-white text-[10px] font-bold px-2 py-0.5 rounded">Paytm</span>
                            <span className="text-[#4d7c0f] text-[11px] font-black italic">UPI</span>
                          </div>
                          {payMethod === 'upi' && (
                            <p className="text-[11px] text-gray-500 mt-2.5 pt-2 border-t border-gray-100">
                              Clicking "Pay" opens the secure Razorpay payment drawer for instant verification.
                            </p>
                          )}
                        </div>
                      </div>
                    </label>

                    {/* Card Option */}
                    <label className={`block p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      payMethod === 'card' ? 'border-[#2874f0] bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={payMethod === 'card'}
                          onChange={() => { setPayMethod('card'); setPayError(''); }}
                          className="accent-[#2874f0] w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">Credit / Debit Card</span>
                            <span className="text-[10px] font-semibold text-gray-500">EMI Eligible</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Visa, Mastercard, RuPay, Maestro</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[#1a1f71] text-xs font-black italic">VISA</span>
                            <span className="flex items-center -space-x-1.5">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#eb001b]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#f79e1b]" />
                            </span>
                            <span className="text-[#0f4c9c] text-[10px] font-black italic">RuPay</span>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* COD Option */}
                    <label className={`block p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      payMethod === 'cod' ? 'border-[#2874f0] bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment_choice"
                          checked={payMethod === 'cod'}
                          onChange={() => { setPayMethod('cod'); setPayError(''); }}
                          className="accent-[#2874f0] w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">Cash on Delivery (COD)</span>
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                              ZERO FEE
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Pay via Cash or QR code when your phone arrives</p>
                        </div>
                      </div>
                    </label>

                    {payError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700">
                        {payError}
                      </div>
                    )}

                    {/* Coupon Box */}
                    <div className="pt-2">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-4 h-4 text-[#2874f0]" />
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                            Have a Promo Code / Gift Card?
                          </span>
                        </div>

                        {appliedCoupon ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 flex items-center justify-between text-xs">
                            <span className="text-emerald-800 font-bold">
                              ✓ Code '{appliedCoupon}' applied (−₹{couponDiscount.toLocaleString('en-IN')})
                            </span>
                            <button
                              onClick={() => { setAppliedCoupon(null); setCouponError(''); }}
                              className="text-xs text-red-600 font-bold hover:underline ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                value={couponCode}
                                onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                                placeholder="ENTER CODE (e.g. MAULI1000)"
                                className="flex-1 uppercase text-xs font-bold py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] bg-white"
                              />
                              <button
                                onClick={() => applyCoupon()}
                                className="bg-[#2874f0] hover:bg-[#1259c7] text-white px-4 py-2 rounded text-xs font-bold uppercase transition"
                              >
                                Apply
                              </button>
                            </div>
                            {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                            <div className="flex gap-1.5 flex-wrap pt-1">
                              {COUPONS.map((c) => (
                                <button
                                  key={c.code}
                                  onClick={() => applyCoupon(c.code)}
                                  className="text-[10px] bg-white text-[#2874f0] font-bold px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-50 transition"
                                >
                                  {c.short}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Flipkart Style Price Details Sidebar */}
            <aside className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden lg:sticky lg:top-20">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Price Details
                </h2>
              </div>

              <div className="p-5 text-sm space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Price ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>₹{mrpTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>− ₹{(mrpTotal - subtotal).toLocaleString('en-IN')}</span>
                </div>

                {warrantyTotal > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Extended Warranty</span>
                    <span>+ ₹{warrantyTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>− ₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {cashDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Prepaid Discount</span>
                    <span>− ₹{cashDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span>
                    <span className="line-through text-gray-400 mr-1.5 text-xs">₹40</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </span>
                </div>

                <div className="flex justify-between items-baseline font-bold text-base pt-3 border-t border-dashed border-gray-200 text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-[#2874f0] text-lg font-extrabold">₹{total.toLocaleString('en-IN')}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-100 rounded-md py-2 px-3 text-center">
                    You will save ₹{totalSavings.toLocaleString('en-IN')} on this order
                  </div>
                )}
              </div>

              {/* Free Gift Strip */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-xs text-amber-900">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium text-[11px] leading-tight">
                    <strong>Free Tempered Glass + Protective Case</strong> included with your delivery!
                  </span>
                </div>

                {/* Desktop Place Order CTA */}
                <div className="hidden lg:block mt-4">
                  {step === 'address' ? (
                    <button
                      onClick={() => {
                        if (!selected) {
                          alert('Please choose or enter a delivery address');
                          return;
                        }
                        setStep('payment');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full bg-[#fb641b] hover:bg-[#f05a13] text-white py-3.5 rounded text-sm font-bold uppercase tracking-wider shadow-sm transition active:scale-[0.99]"
                    >
                      Continue to Payment
                    </button>
                  ) : (
                    <button
                      onClick={placeOrder}
                      disabled={placing}
                      className="w-full bg-[#fb641b] hover:bg-[#f05a13] disabled:opacity-60 text-white py-3.5 rounded text-sm font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99]"
                    >
                      {placing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                        </>
                      ) : payMethod === 'cod' ? (
                        `Confirm Order • ₹${total.toLocaleString('en-IN')}`
                      ) : (
                        `Pay ₹${total.toLocaleString('en-IN')}`
                      )}
                    </button>
                  )}

                  <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-500" /> Safe and Secure Payments. 100% Authentic Products.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Bar (Classic Flipkart Mobile Bar) */}
      {step !== 'success' && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base font-extrabold text-gray-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => setShowPriceSheet(!showPriceSheet)}
                className="text-[11px] font-bold text-[#2874f0] flex items-center"
              >
                {showPriceSheet ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] font-bold text-emerald-600">
              {totalSavings > 0 ? `Save ₹${totalSavings.toLocaleString('en-IN')}` : 'FREE Delivery'}
            </p>
          </div>

          <div>
            {step === 'address' ? (
              <button
                onClick={() => {
                  if (!selected) {
                    alert('Please select or add an address');
                    return;
                  }
                  setStep('payment');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#fb641b] hover:bg-[#f05a13] text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-[0.98]"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={placeOrder}
                disabled={placing}
                className="bg-[#fb641b] hover:bg-[#f05a13] disabled:opacity-60 text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition active:scale-[0.98]"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Wait…
                  </>
                ) : (
                  payMethod === 'cod' ? 'Place Order' : 'Pay Now'
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Price Bottom Sheet Modal */}
      {showPriceSheet && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowPriceSheet(false)}>
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="font-bold text-sm text-gray-900">Price Details</span>
              <button onClick={() => setShowPriceSheet(false)} className="text-gray-400 font-bold text-xs">Close</button>
            </div>
            <div className="text-xs space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{mrpTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>− ₹{(mrpTotal - subtotal).toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon</span>
                  <span>− ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-extrabold text-sm text-gray-900">
                <span>Final Price</span>
                <span className="text-[#2874f0]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

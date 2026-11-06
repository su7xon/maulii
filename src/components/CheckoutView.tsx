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
import { COUPONS, calcCouponDiscount, validateCoupon } from '../lib/coupons';
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
}

const PAY_LABELS: Record<string, string> = { upi: 'UPI', card: 'Card', cod: 'Cash on Delivery' };

const inputCls =
  'w-full text-base sm:text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#e42529] focus:ring-1 focus:ring-[#e42529] bg-white placeholder-gray-400';
const errCls = 'text-[11px] text-red-600 font-medium mt-1';

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  defaultCity,
  defaultPincode,
  onBack,
  onOrderDone,
  onClearCart,
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
  const [payMethod, setPayMethod] = useState('upi');
  const [payError, setPayError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId] = useState(() => `MM-${Math.floor(100000 + Math.random() * 900000)}`);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  // Totals
  const mrpTotal = cartItems.reduce((a, i) => a + i.product.mrp * i.quantity, 0);
  const subtotal = cartItems.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const warrantyTotal = cartItems.reduce((a, i) => {
    if (!i.selectedWarranty) return a;
    return a + (i.product.price > 50000 ? 2499 : 1299) * i.quantity;
  }, 0);
  const couponDiscount = calcCouponDiscount(appliedCoupon, subtotal);
  const total = Math.max(0, subtotal + warrantyTotal - couponDiscount);
  const savings = mrpTotal - subtotal;
  const eta = new Date(Date.now() + 5 * 864e5).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
  });

  const selected = addresses.find((a) => a.id === selectedId) || defaultAddress(addresses);

  const set = (k: keyof Address, v: string | boolean) => {
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
    window.scrollTo({ top: 0 });
  };

  const editAddress = (a: Address) => {
    setForm({ ...a });
    setErrors({});
    setEditing(true);
    window.scrollTo({ top: 0 });
  };

  const removeAddress = (id: string) => {
    if (!window.confirm('Ye address hata dena hai?')) return;
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
    window.scrollTo({ top: 0 });
  };

  const validatePayment = () => {
    // UPI/card details Razorpay ke hosted popup me jaate hain — yahan koi card
    // number/CVV nahi lete (PCI compliance hamare paas nahi).
    setPayError('');
    return true;
  };

  const placeOrder = () => {
    if (!validatePayment()) return;
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
      window.scrollTo({ top: 0 });
    };

    // COD — koi gateway nahi.
    if (payMethod === 'cod') {
      setTimeout(() => complete(PAY_LABELS.cod), 600);
      return;
    }

    // UPI / Card — Razorpay hosted checkout (card details hamare form me nahi lete).
    if (!isRazorpayConfigured) {
      setPlacing(false);
      setPayError('Online payment abhi configure nahi hua. Admin se Razorpay keys add karwao, ya Cash on Delivery chuno.');
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
          description: `${orderId} - ${cartItems.length} item(s)`,
        });
        const verified = await verifyRazorpayPayment(resp);
        if (!verified) {
          setPlacing(false);
          setPayError('Payment verify nahi ho paya. Paisa kata ho to support ko payment ID bhejo: ' + resp.razorpay_payment_id);
          return;
        }
        complete(`${PAY_LABELS[payMethod] || payMethod} (${resp.razorpay_payment_id})`);
      } catch (err) {
        setPlacing(false);
        setPayError((err as Error).message || 'Payment fail ho gaya.');
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
      <div className="max-w-[1100px] mx-auto px-3 py-10 text-center">
        <p className="text-base font-bold text-gray-800">Your cart is empty</p>
        <p className="text-xs text-gray-500 mt-1 mb-5">Add something before checkout.</p>
        <button onClick={onBack} className="bg-[#e42529] text-white text-xs font-bold py-2.5 px-6 rounded-lg">
          Continue Shopping
        </button>
      </div>
    );
  }

  const steps = ['Address', 'Payment', 'Done'];
  const stepIdx = step === 'address' ? 0 : step === 'payment' ? 1 : 2;

  return (
    <div className="max-w-[1100px] mx-auto px-3 sm:px-4 py-3 sm:py-5 pb-24 lg:pb-10">
      {/* Header + stepper */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={step === 'payment' ? () => setStep('address') : onBack}
          className="w-9 h-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50 shrink-0"
          aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-black tracking-tight">Checkout</h1>
        <span className="ml-auto text-[11px] font-bold text-gray-500 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" /> 100% Secure
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 mb-4 bg-white rounded-xl border border-gray-100 px-3 sm:px-5 py-3 shadow-sm">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                i < stepIdx ? 'bg-emerald-600 text-white' : i === stepIdx ? 'bg-[#e42529] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < stepIdx ? '✓' : i + 1}
              </span>
              <span className={`text-[11px] sm:text-xs font-bold ${i <= stepIdx ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 rounded mx-1 ${i < stepIdx ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 'success' ? (
        /* ---------- SUCCESS ---------- */
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed
          </span>
          <h2 className="text-xl font-black mt-2">Thank you for shopping!</h2>
          <p className="text-xs text-gray-600 mt-1">
            Order <strong className="text-gray-900">{orderId}</strong> booked successfully.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2.5 mt-5">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Delivery by</span>
              <span className="font-bold text-right">{eta}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500 shrink-0">Deliver to</span>
              <span className="font-bold text-right">
                {selected?.name || form.name}<br />
                {[selected?.addressLine || form.addressLine, selected?.landmark || form.landmark].filter(Boolean).join(', ')}, {selected?.city || form.city} - {selected?.pincode || form.pincode}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Payment</span>
              <span className="font-bold">{PAY_LABELS[payMethod]}</span>
            </div>
            <div className="flex justify-between gap-3 pt-2 border-t border-gray-200">
              <span className="text-gray-500">Amount {payMethod === 'cod' ? 'payable' : 'paid'}</span>
              <span className="font-black text-[#e42529] text-sm">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={finish} className="mt-6 w-full bg-[#e42529] hover:bg-[#c21418] text-white py-3 rounded-xl text-sm font-bold shadow">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">
          {/* LEFT */}
          <div className="space-y-4 min-w-0">
            {step === 'address' ? (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e42529] text-white text-[11px] font-black flex items-center justify-center">1</span>
                  <h2 className="text-sm font-extrabold">Delivery Address</h2>
                </div>
                <div className="p-4">
                  {addresses.length > 0 && !editing ? (
                    <div className="space-y-2.5">
                      {addresses.map((a) => {
                        const active = a.id === (selected?.id || '');
                        return (
                          <div key={a.id}
                            onClick={() => setSelectedId(a.id)}
                            className={`border rounded-xl p-3 text-xs cursor-pointer transition ${active ? 'border-[#e42529] bg-red-50/40' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="flex items-start gap-2">
                              <input type="radio" checked={active} onChange={() => setSelectedId(a.id)}
                                className="accent-[#e42529] w-4 h-4 mt-0.5 shrink-0" aria-label={`Use ${a.name} address`} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm">{a.name}</span>
                                  <span className="text-[9px] font-bold bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded uppercase">{a.type}</span>
                                  {a.isDefault && <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">DEFAULT</span>}
                                </div>
                                <p className="text-gray-700 mt-1 leading-relaxed">
                                  {a.addressLine}{a.landmark ? `, ${a.landmark}` : ''}, {a.city}, {a.state} - <strong>{a.pincode}</strong>
                                </p>
                                <p className="text-gray-600 mt-0.5">Phone: <strong>+91 {a.phone}</strong></p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2 pl-6">
                              <button onClick={(e) => { e.stopPropagation(); editAddress(a); }} className="text-[11px] font-bold text-[#003380] hover:underline flex items-center gap-1">
                                <Pencil className="w-3 h-3" /> Edit
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); removeAddress(a.id); }} className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <button onClick={() => { setStep('payment'); window.scrollTo({ top: 0 }); }}
                        disabled={!selected}
                        className="w-full bg-[#e42529] hover:bg-[#c21418] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold shadow active:scale-[0.98]">
                        Deliver to this address
                      </button>
                      <button onClick={startNewAddress}
                        className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-sm font-bold text-gray-700 hover:border-[#e42529] hover:text-[#e42529] flex items-center justify-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add a new address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name *"
                            autoComplete="name" className={`${inputCls} ${errors.name ? 'border-red-500' : ''}`} />
                          {errors.name && <p className={errCls}>{errors.name}</p>}
                        </div>
                        <div>
                          <input value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="10-digit mobile number *" inputMode="numeric" autoComplete="tel"
                            className={`${inputCls} ${errors.phone ? 'border-red-500' : ''}`} />
                          {errors.phone && <p className={errCls}>{errors.phone}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="relative">
                            <input value={form.pincode}
                              onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                              onBlur={(e) => void onPincodeBlur(e.target.value)}
                              placeholder="Pincode *" inputMode="numeric" autoComplete="postal-code"
                              className={`${inputCls} ${errors.pincode ? 'border-red-500' : ''}`} />
                            {pinLoading && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">check...</span>}
                          </div>
                          {errors.pincode && <p className={errCls}>{errors.pincode}</p>}
                        </div>
                        <div>
                          <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="City / Town *"
                            autoComplete="address-level2" className={`${inputCls} ${errors.city ? 'border-red-500' : ''}`} />
                          {errors.city && <p className={errCls}>{errors.city}</p>}
                        </div>
                      </div>
                      <div>
                        <textarea value={form.addressLine} onChange={(e) => set('addressLine', e.target.value)}
                          placeholder="Flat / House no, Building, Street, Area *" rows={2}
                          autoComplete="street-address"
                          className={`${inputCls} resize-none ${errors.addressLine ? 'border-red-500' : ''}`} />
                        {errors.addressLine && <p className={errCls}>{errors.addressLine}</p>}
                      </div>
                      <input value={form.landmark} onChange={(e) => set('landmark', e.target.value)}
                        placeholder="Landmark (optional) — e.g. near SBI ATM" className={inputCls} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls} aria-label="State">
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="flex gap-2">
                          {(['Home', 'Work', 'Other'] as const).map((t) => (
                            <button key={t} type="button" onClick={() => set('type', t)}
                              className={`flex-1 py-2.5 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 transition-colors ${
                                form.type === t ? 'border-[#e42529] bg-red-50/50 text-[#e42529]' : 'border-gray-300 text-gray-600'
                              }`}>
                              {t === 'Home' ? <Home className="w-3.5 h-3.5" /> : t === 'Work' ? <Briefcase className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />} {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={form.isDefault} onChange={(e) => set('isDefault', e.target.checked)} className="w-4 h-4 accent-[#e42529]" />
                        Default address banao (agli baar auto-select hoga)
                      </label>
                      <button onClick={deliverHere}
                        className="w-full bg-[#e42529] hover:bg-[#c21418] text-white py-3 rounded-xl text-sm font-bold shadow active:scale-[0.99]">
                        Save & Deliver Here
                      </button>
                      {addresses.length > 0 && (
                        <button onClick={() => setEditing(false)} className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 py-1">
                          Cancel — saved address chuno
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            ) : (
              /* ---------- PAYMENT STEP ---------- */
              <>
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#e42529]" />
                    <h2 className="text-sm font-extrabold">Deliver to</h2>
                    <button onClick={() => setStep('address')} className="ml-auto text-[11px] font-bold text-[#e42529] hover:underline">
                      Change
                    </button>
                  </div>
                  <p className="px-4 py-3 text-xs text-gray-700">
                    <strong>{selected?.name}</strong> • +91 {selected?.phone} • {selected?.addressLine}, {selected?.city}, {selected?.state} - <strong>{selected?.pincode}</strong>
                  </p>
                </section>

                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#e42529] text-white text-[11px] font-black flex items-center justify-center">2</span>
                    <h2 className="text-sm font-extrabold">Payment Method</h2>
                  </div>
                  <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-2.5">
                    {/* UPI */}
                    <label className={`block p-2.5 sm:p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${payMethod === 'upi' ? 'border-[#e42529] bg-red-50/40' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="radio" checked={payMethod === 'upi'} onChange={() => { setPayMethod('upi'); setPayError(''); }} className="accent-[#e42529] w-4 h-4" />
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                        <div>
                          <span className="text-[13px] sm:text-sm font-bold block">UPI</span>
                          <span className="text-[10px] sm:text-[11px] text-gray-500">GPay, PhonePe, Paytm • Instant</span>
                          <span className="flex items-center gap-1.5 mt-1.5">
                            <span className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md px-1.5 py-0.5 leading-none" title="Google Pay">
                              <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" aria-hidden="true">
                                <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z" />
                                <path fill="#FBBC05" d="M5.27 14.18A7.2 7.2 0 0 1 4.89 12c0-.76.13-1.5.36-2.18v-3.1H1.29a12 12 0 0 0 0 10.56l3.98-3.1z" />
                                <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.72l3.98 3.1c.95-2.85 3.6-5.05 6.73-5.05z" />
                              </svg>
                              <span className="text-[9px] font-medium text-gray-500">Pay</span>
                            </span>
                            <span className="w-[18px] h-[18px] rounded-full bg-[#5f259f] text-white text-[8px] font-black flex items-center justify-center leading-none shrink-0" title="PhonePe">Pe</span>
                            <span className="text-[9px] font-black leading-none"><span className="text-[#002e6e]">pay</span><span className="text-[#00b9f1]">tm</span></span>
                            <span className="text-[#4d7c0f] text-[10px] font-black italic leading-none">UPI</span>
                          </span>
                        </div>
                      </div>
                      {payMethod === 'upi' && (
                        <p className="text-[10px] sm:text-[11px] text-gray-500 mt-2 leading-relaxed">
                          Agla step pe Razorpay ka secure page khulega — UPI ID / GPay / PhonePe wahan chuno.
                        </p>
                      )}
                    </label>
                    {/* Card */}
                    <label className={`block p-2.5 sm:p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${payMethod === 'card' ? 'border-[#e42529] bg-red-50/40' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="radio" checked={payMethod === 'card'} onChange={() => { setPayMethod('card'); setPayError(''); }} className="accent-[#e42529] w-4 h-4" />
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#003380]" />
                        <div>
                          <span className="text-[13px] sm:text-sm font-bold block">Credit / Debit Card</span>
                          <span className="text-[10px] sm:text-[11px] text-gray-500">Visa, Mastercard, RuPay • No-Cost EMI available</span>
                          <span className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[#1a1f71] text-[11px] font-black italic leading-none">VISA</span>
                            <span className="flex items-center leading-none" title="Mastercard">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#eb001b]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] -ml-1.5 mix-blend-multiply" />
                            </span>
                            <span className="text-[#0f4c9c] text-[10px] font-black italic leading-none">RuPay</span>
                          </span>
                        </div>
                      </div>
                      {payMethod === 'card' && (
                        <p className="text-[10px] sm:text-[11px] text-gray-500 mt-2 leading-relaxed">
                          Card / CVV Razorpay ke secure page pe daalna hai — hum store nahi karte.
                        </p>
                      )}
                    </label>
                    {/* COD */}
                    <label className={`block p-2.5 sm:p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${payMethod === 'cod' ? 'border-[#e42529] bg-red-50/40' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="radio" checked={payMethod === 'cod'} onChange={() => { setPayMethod('cod'); setPayError(''); }} className="accent-[#e42529] w-4 h-4" />
                        <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        <div>
                          <span className="text-[13px] sm:text-sm font-bold block">Cash on Delivery</span>
                          <span className="text-[10px] sm:text-[11px] text-gray-500">Pay cash / UPI at doorstep</span>
                          <span className="flex items-center gap-1.5 mt-1.5">
                            <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 leading-none">
                              <Banknote className="w-3 h-3 text-emerald-700" />
                              <span className="text-[9px] font-black text-emerald-700">CASH</span>
                            </span>
                            <span className="text-[#4d7c0f] text-[10px] font-black italic leading-none">UPI</span>
                          </span>
                        </div>
                      </div>
                    </label>
                    {payError && <p className="text-xs text-red-600 font-semibold">{payError}</p>}
                  </div>
                </section>

                {/* Coupon */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-3.5 sm:p-4">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-gray-800 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#e42529] text-xs font-black">%</span>
                      Apply Coupon / Promo Code
                    </div>
                    {appliedCoupon ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <span className="text-emerald-800 font-bold">✓ '{appliedCoupon}' applied (−₹{couponDiscount.toLocaleString('en-IN')})</span>
                        <button onClick={() => { setAppliedCoupon(null); setCouponError(''); }}
                          className="text-[11px] text-red-600 font-bold hover:underline shrink-0 ml-2">Remove</button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                            placeholder="ENTER MAULI1000, MAULI500 OR MAULIFIRST"
                            className="flex-1 uppercase text-xs font-semibold py-2.5 px-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#e42529] min-w-0" />
                          <button onClick={() => applyCoupon()}
                            className="bg-[#e42529] hover:bg-[#c21418] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0 active:scale-95">
                            Apply
                          </button>
                        </div>
                        {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                        <div className="flex gap-1.5 flex-wrap">
                          {COUPONS.map((c) => (
                            <button key={c.code} onClick={() => applyCoupon(c.code)}
                              className="text-[10px] bg-red-50 text-[#e42529] font-bold px-2 py-1 rounded border border-red-200 hover:bg-red-100">
                              {c.short}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Items */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h2 className="text-sm font-extrabold">Order Summary ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map(({ product, quantity, selectedWarranty }) => (
                      <div key={product.id} className="p-3.5 flex gap-3">
                        <img src={product.image} alt={product.name} onError={onImgError} className="w-14 h-14 object-contain bg-gray-50 rounded-lg p-1 shrink-0 border border-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold line-clamp-1">{product.name}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Qty: {quantity}{selectedWarranty ? ' • + Extended Warranty' : ''}</p>
                          <p className="text-sm font-black mt-1">₹{(product.price * quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* RIGHT: price summary */}
          <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:sticky lg:top-24">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#e42529]" />
              <h2 className="text-sm font-extrabold">Price Details</h2>
            </div>
            <div className="p-4 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Price ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>₹{mrpTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount</span>
                <span>− ₹{savings.toLocaleString('en-IN')}</span>
              </div>
              {warrantyTotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Extended Warranty</span>
                  <span>+ ₹{warrantyTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>− ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-2.5 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span className="text-[#e42529]">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-emerald-700 font-bold text-center bg-emerald-50 rounded-lg py-1.5">
                You save ₹{savings.toLocaleString('en-IN')} 🎉
              </p>
            </div>
            {step === 'payment' && (
              <div className="p-4 pt-0">
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-2.5 text-[11px] font-bold text-amber-800">
                  <span className="text-sm">🎁</span>
                  <span>Cover + Mobile Safety Guard FREE from us on this order!</span>
                </div>
                <button onClick={placeOrder} disabled={placing}
                  className="w-full bg-[#e42529] hover:bg-[#c21418] disabled:opacity-70 text-white py-3 rounded-xl text-sm font-bold shadow flex items-center justify-center gap-2 active:scale-[0.99]">
                  {placing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : payMethod === 'cod' ? `Place Order • ₹${total.toLocaleString('en-IN')}` : `Pay ₹${total.toLocaleString('en-IN')}`}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Safe & secure payments • Easy 7-day returns
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Add-new-address shortcut on payment step (mobile) */}
      {step === 'payment' && (
        <button onClick={() => setStep('address')}
          className="lg:hidden mt-4 w-full py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 flex items-center justify-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Deliver to a different address
        </button>
      )}
    </div>
  );
};

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
} from 'lucide-react';
import { CartItem } from '../types';
import { loadOrders, saveOrders } from '../data/adminStore';

interface CheckoutViewProps {
  cartItems: CartItem[];
  defaultCity: string;
  defaultPincode: string;
  onBack: () => void;
  onOrderDone: () => void;
  onClearCart: () => void;
}

interface Address {
  name: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  type: 'Home' | 'Work';
}

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const PAY_LABELS: Record<string, string> = { upi: 'UPI', card: 'Card', cod: 'Cash on Delivery' };

function loadSavedAddress(): Address | null {
  try {
    const raw = localStorage.getItem('mm_address');
    return raw ? (JSON.parse(raw) as Address) : null;
  } catch {
    return null;
  }
}

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
  const [saved, setSaved] = useState<Address | null>(loadSavedAddress);
  const [editing, setEditing] = useState(!loadSavedAddress());
  const [form, setForm] = useState<Address>({
    name: saved?.name || '',
    phone: saved?.phone || '',
    pincode: saved?.pincode || defaultPincode,
    address: saved?.address || '',
    city: saved?.city || defaultCity,
    state: saved?.state || 'Maharashtra',
    type: saved?.type || 'Home',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payMethod, setPayMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [payError, setPayError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId] = useState(() => `MM-${Math.floor(100000 + Math.random() * 900000)}`);

  // Totals
  const mrpTotal = cartItems.reduce((a, i) => a + i.product.mrp * i.quantity, 0);
  const subtotal = cartItems.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const warrantyTotal = cartItems.reduce((a, i) => {
    if (!i.selectedWarranty) return a;
    return a + (i.product.price > 50000 ? 2499 : 1299) * i.quantity;
  }, 0);
  const total = subtotal + warrantyTotal;
  const savings = mrpTotal - subtotal;
  const eta = new Date(Date.now() + 5 * 864e5).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
  });

  const set = (k: keyof Address, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validateAddress = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = 'Enter full name';
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter valid 10-digit mobile number';
    if (!/^[1-9][0-9]{5}$/.test(form.pincode.trim())) e.pincode = 'Enter valid 6-digit pincode';
    if (form.address.trim().length < 10) e.address = 'Enter complete address (min 10 characters)';
    if (form.city.trim().length < 2) e.city = 'Enter city';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const deliverHere = () => {
    if (!validateAddress()) return;
    const clean: Address = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      pincode: form.pincode.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
    };
    try {
      localStorage.setItem('mm_address', JSON.stringify(clean));
    } catch { /* noop */ }
    setSaved(clean);
    setEditing(false);
    setStep('payment');
    window.scrollTo({ top: 0 });
  };

  const formatCardNum = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const validatePayment = () => {
    if (payMethod === 'upi') {
      if (!/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim())) {
        setPayError('Enter valid UPI ID (e.g. name@okhdfc)');
        return false;
      }
    } else if (payMethod === 'card') {
      if (cardNum.replace(/\s/g, '').length !== 16) {
        setPayError('Enter valid 16-digit card number');
        return false;
      }
      if (cardName.trim().length < 3) {
        setPayError('Enter name on card');
        return false;
      }
      const m = cardExp.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!m || 2000 + +m[2] < new Date().getFullYear() ||
        (2000 + +m[2] === new Date().getFullYear() && +m[1] < new Date().getMonth() + 1)) {
        setPayError('Enter valid future expiry (MM/YY)');
        return false;
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        setPayError('Enter valid CVV');
        return false;
      }
    }
    setPayError('');
    return true;
  };

  const placeOrder = () => {
    if (!validatePayment()) return;
    setPlacing(true);
    setTimeout(() => {
      try {
        const order = {
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
          payment: PAY_LABELS[payMethod] || payMethod,
          status: 'Placed' as const,
          name: saved?.name || form.name,
          phone: saved?.phone || form.phone,
          city: saved?.city || form.city,
          pincode: saved?.pincode || form.pincode,
          address: saved?.address || form.address,
        };
        saveOrders([order, ...loadOrders()]);
      } catch { /* noop */ }
      setPlacing(false);
      setStep('success');
      window.scrollTo({ top: 0 });
    }, 1600);
  };

  const finish = () => {
    onClearCart();
    onOrderDone();
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
              <span className="text-gray-500 shrink-0">Address</span>
              <span className="font-bold text-right">{saved?.name}, {saved?.address}, {saved?.city} - {saved?.pincode}</span>
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
                  {saved && !editing ? (
                    <div>
                      <div className="border border-[#e42529] bg-red-50/40 rounded-xl p-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm">{saved.name}</span>
                          <span className="text-[10px] font-black bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{saved.type.toUpperCase()}</span>
                        </div>
                        <p className="text-gray-700 mt-1">{saved.address}, {saved.city}, {saved.state} - <strong>{saved.pincode}</strong></p>
                        <p className="text-gray-700 mt-0.5">Phone: <strong>+91 {saved.phone}</strong></p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => { setStep('payment'); window.scrollTo({ top: 0 }); }}
                          className="flex-1 bg-[#e42529] hover:bg-[#c21418] text-white py-3 rounded-xl text-sm font-bold shadow active:scale-[0.98]">
                          Deliver Here
                        </button>
                        <button onClick={() => { setForm(saved); setEditing(true); }}
                          className="px-4 py-3 rounded-xl border border-gray-300 text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name *"
                            className={`${inputCls} ${errors.name ? 'border-red-500' : ''}`} />
                          {errors.name && <p className={errCls}>{errors.name}</p>}
                        </div>
                        <div>
                          <input value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="10-digit mobile number *" inputMode="numeric" className={`${inputCls} ${errors.phone ? 'border-red-500' : ''}`} />
                          {errors.phone && <p className={errCls}>{errors.phone}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input value={form.pincode} onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Pincode *" inputMode="numeric" className={`${inputCls} ${errors.pincode ? 'border-red-500' : ''}`} />
                          {errors.pincode && <p className={errCls}>{errors.pincode}</p>}
                        </div>
                        <div>
                          <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="City *"
                            className={`${inputCls} ${errors.city ? 'border-red-500' : ''}`} />
                          {errors.city && <p className={errCls}>{errors.city}</p>}
                        </div>
                      </div>
                      <div>
                        <textarea value={form.address} onChange={(e) => set('address', e.target.value)}
                          placeholder="Address (House no, Building, Street, Area) *" rows={2}
                          className={`${inputCls} resize-none ${errors.address ? 'border-red-500' : ''}`} />
                        {errors.address && <p className={errCls}>{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls}>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="flex gap-2">
                          {(['Home', 'Work'] as const).map((t) => (
                            <button key={t} type="button" onClick={() => set('type', t)}
                              className={`flex-1 py-2.5 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                                form.type === t ? 'border-[#e42529] bg-red-50/50 text-[#e42529]' : 'border-gray-300 text-gray-600'
                              }`}>
                              {t === 'Home' ? <Home className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />} {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={deliverHere}
                        className="w-full bg-[#e42529] hover:bg-[#c21418] text-white py-3 rounded-xl text-sm font-bold shadow active:scale-[0.99]">
                        Deliver Here
                      </button>
                      {saved && (
                        <button onClick={() => setEditing(false)} className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 py-1">
                          Cancel — use saved address
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
                    <strong>{saved?.name}</strong> • +91 {saved?.phone} • {saved?.address}, {saved?.city}, {saved?.state} - <strong>{saved?.pincode}</strong>
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
                        <input value={upiId} onChange={(e) => { setUpiId(e.target.value); setPayError(''); }}
                          placeholder="yourname@okhdfc" className={`${inputCls} mt-2 sm:mt-3`} />
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
                        <div className="space-y-2 mt-2 sm:space-y-2.5 sm:mt-3" onClick={(e) => e.preventDefault()}>
                          <input value={cardNum} onChange={(e) => { setCardNum(formatCardNum(e.target.value)); setPayError(''); }}
                            placeholder="Card number" inputMode="numeric" className={inputCls} />
                          <input value={cardName} onChange={(e) => { setCardName(e.target.value); setPayError(''); }}
                            placeholder="Name on card" className={inputCls} />
                          <div className="grid grid-cols-2 gap-2.5">
                            <input value={cardExp} onChange={(e) => { setCardExp(formatExpiry(e.target.value)); setPayError(''); }}
                              placeholder="MM/YY" inputMode="numeric" className={inputCls} />
                            <input value={cardCvv} onChange={(e) => { setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setPayError(''); }}
                              placeholder="CVV" type="password" inputMode="numeric" className={inputCls} />
                          </div>
                        </div>
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

                {/* Items */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h2 className="text-sm font-extrabold">Order Summary ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map(({ product, quantity, selectedWarranty }) => (
                      <div key={product.id} className="p-3.5 flex gap-3">
                        <img src={product.image} alt={product.name} className="w-14 h-14 object-contain bg-gray-50 rounded-lg p-1 shrink-0 border border-gray-100" />
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

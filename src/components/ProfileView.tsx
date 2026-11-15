import React, { useState, useRef, useEffect } from 'react';
import {
  User, Pencil, MapPin, ShoppingBag, Package,
  Plus, X, Check, Trash2, ChevronRight,
  RotateCcw, LogOut, Headphones, Heart,
  CreditCard, Calendar, RefreshCw, Bell,
  ShieldCheck, ArrowLeft, ArrowUpRight, Smartphone,
  Tag,
} from 'lucide-react';
import { Order } from '../data/adminStore';
import { Category, Product } from '../types';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { onImgError } from '../lib/imgFallback';
import {
  onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut as firebaseSignOut, type User as FirebaseUser,
} from 'firebase/auth';

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  type: 'Home' | 'Work';
  isDefault: boolean;
}

interface Profile {
  name: string;
  phone: string;
  email: string;
  picture?: string;
  provider?: string;
  uid?: string;
}

interface ProfileViewProps {
  orders: Order[];
  onShopNow: () => void;
  onBuyAgain: (order: Order) => void;
  onUseAddress: (addr: SavedAddress) => void;
  onNotify?: (msg: string) => void;
  onOpenWishlist?: () => void;
  onSelectCategory?: (cat: string) => void;
  categories?: Category[];
  recentProducts?: Product[];
  onViewProduct?: (product: Product) => void;
}

const STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const inputCls =
  'w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] bg-white placeholder:text-gray-400 transition-colors';
const errCls = 'text-[11px] text-red-600 font-semibold mt-1';

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem('mm_profile');
    if (raw) return JSON.parse(raw) as Profile;
  } catch { /* noop */ }
  return { name: '', phone: '', email: '' };
}

function loadAddresses(): SavedAddress[] {
  try {
    const raw = localStorage.getItem('mm_addresses');
    if (raw) {
      const list = JSON.parse(raw) as SavedAddress[];
      if (Array.isArray(list) && list.length > 0) return list;
    }
    const single = localStorage.getItem('mm_address');
    if (single) {
      const a = JSON.parse(single);
      return [{ ...a, id: `addr-${Date.now()}`, isDefault: true }];
    }
  } catch { /* noop */ }
  return [];
}

const STATUS_CLS: Record<string, string> = {
  Placed: 'bg-amber-50 text-amber-800 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-800 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const EMPTY_ADDR: SavedAddress = {
  id: '', name: '', phone: '', pincode: '', address: '', city: '', state: 'Maharashtra', type: 'Home', isDefault: false,
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  onShopNow,
  onBuyAgain,
  onUseAddress,
  onNotify,
  onOpenWishlist,
  onSelectCategory,
  categories = [],
  recentProducts = [],
  onViewProduct,
}) => {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [addresses, setAddresses] = useState<SavedAddress[]>(loadAddresses);
  const [viewMode, setViewMode] = useState<'main' | 'orders' | 'addresses'>('main');
  const [editingProfile, setEditingProfile] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [draftErr, setDraftErr] = useState<Record<string, string>>({});
  const [addrModal, setAddrModal] = useState<SavedAddress | null>(null);
  const [addrErr, setAddrErr] = useState<Record<string, string>>({});
  const [googleBusy, setGoogleBusy] = useState(false);

  const notifyRef = useRef(onNotify);
  notifyRef.current = onNotify;

  const applyFirebaseUser = (u: FirebaseUser, greet: boolean) => {
    const clean: Profile = {
      name: u.displayName || '',
      phone: u.phoneNumber || '',
      email: u.email || '',
      picture: u.photoURL || '',
      provider: 'google',
      uid: u.uid,
    };
    setProfile((prev) => {
      const merged = { ...clean, phone: clean.phone || prev.phone };
      try { localStorage.setItem('mm_profile', JSON.stringify(merged)); } catch { /* noop */ }
      return merged;
    });
    if (greet) notifyRef.current?.('Signed in with Google');
  };

  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then((res) => { if (res?.user) applyFirebaseUser(res.user, true); })
      .catch(() => { /* noop */ });
    const off = onAuthStateChanged(auth, (u) => {
      if (u) applyFirebaseUser(u, false);
    });
    return () => off();
  }, []);

  const doGoogleSignIn = async () => {
    if (!auth) {
      notifyRef.current?.('Configure Firebase keys in .env to activate Google login');
      return;
    }
    setGoogleBusy(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      applyFirebaseUser(res.user, true);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      if (code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch {
          notifyRef.current?.('Sign-in redirect failed');
        }
      } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        notifyRef.current?.('Sign-in failed');
      }
    } finally {
      setGoogleBusy(false);
    }
  };

  const persistAddrs = (list: SavedAddress[]) => {
    setAddresses(list);
    try { localStorage.setItem('mm_addresses', JSON.stringify(list)); } catch { /* noop */ }
  };

  const saveProfile = () => {
    const e: Record<string, string> = {};
    if (draft.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(draft.phone.trim())) e.phone = 'Please enter valid 10-digit mobile number';
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) e.email = 'Please enter valid email';
    setDraftErr(e);
    if (Object.keys(e).length > 0) return;
    const clean = { name: draft.name.trim(), phone: draft.phone.trim(), email: draft.email.trim() };
    setProfile(clean);
    try { localStorage.setItem('mm_profile', JSON.stringify(clean)); } catch { /* noop */ }
    setEditingProfile(false);
    notifyRef.current?.('Profile updated');
  };

  const signOut = async () => {
    try { if (auth) await firebaseSignOut(auth); } catch { /* noop */ }
    const blank = { name: '', phone: '', email: '' };
    setProfile(blank);
    setDraft(blank);
    try { localStorage.removeItem('mm_profile'); } catch { /* noop */ }
    notifyRef.current?.('Signed out');
  };

  const validateAddr = (a: SavedAddress) => {
    const e: Record<string, string> = {};
    if (a.name.trim().length < 2) e.name = 'Full name required';
    if (!/^[6-9]\d{9}$/.test(a.phone.trim())) e.phone = '10-digit mobile number required';
    if (!/^[1-9][0-9]{5}$/.test(a.pincode.trim())) e.pincode = '6-digit pincode required';
    if (a.address.trim().length < 8) e.address = 'Please enter street / house address';
    if (a.city.trim().length < 2) e.city = 'City required';
    setAddrErr(e);
    return Object.keys(e).length === 0;
  };

  const saveAddress = () => {
    if (!addrModal) return;
    if (!validateAddr(addrModal)) return;
    const clean: SavedAddress = {
      ...addrModal,
      name: addrModal.name.trim(),
      phone: addrModal.phone.trim(),
      pincode: addrModal.pincode.trim(),
      address: addrModal.address.trim(),
      city: addrModal.city.trim(),
    };
    let list: SavedAddress[];
    if (!clean.id) {
      clean.id = `addr-${Date.now()}`;
      clean.isDefault = addresses.length === 0 ? true : clean.isDefault;
      list = [...addresses, clean];
    } else {
      list = addresses.map((x) => (x.id === clean.id ? clean : x));
    }
    if (clean.isDefault) list = list.map((x) => ({ ...x, isDefault: x.id === clean.id }));
    persistAddrs(list);
    setAddrModal(null);
    notifyRef.current?.('Address saved');
  };

  // Uses real user name if logged in, otherwise 'Guest'
  const displayName = profile.name && profile.name.trim() ? profile.name.trim().split(' ')[0] : 'Guest';
  const superCoinCount = orders.length > 0 ? orders.length * 50 : 0;

  /* ---------------- SUBVIEW: MY ORDERS ---------------- */
  if (viewMode === 'orders') {
    return (
      <div className="min-h-screen bg-white pb-24 text-[#212121]">
        <div className="max-w-[640px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <button
              onClick={() => setViewMode('main')}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700"
              aria-label="Back to Account"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">My Orders</h1>
            <span className="ml-auto text-xs text-gray-400 font-semibold">{orders.length} total</span>
          </div>

          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 mt-1 mb-5">Explore our wide selection of smartphones and gadgets.</p>
              <button
                onClick={onShopNow}
                className="bg-[#2874f0] hover:bg-[#1259c7] text-white text-xs font-bold px-6 py-3 rounded-lg shadow-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-900">Order #{o.id}</span>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_CLS[o.status] || STATUS_CLS.Placed}`}>
                      ● {o.status}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {o.items.map((it) => (
                      <div key={it.id} className="py-2 flex items-center gap-3">
                        <img
                          src={it.image}
                          alt={it.name}
                          onError={onImgError}
                          className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{it.name}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Qty: {it.quantity} • ₹{it.price.toLocaleString('en-IN')} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm font-extrabold text-gray-900">
                      Total: ₹{o.total.toLocaleString('en-IN')}
                    </span>
                    {o.status !== 'Cancelled' && (
                      <button
                        onClick={() => onBuyAgain(o)}
                        className="flex items-center gap-1.5 bg-[#2874f0] hover:bg-[#1259c7] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Buy Again
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- SUBVIEW: SAVED ADDRESSES ---------------- */
  if (viewMode === 'addresses') {
    return (
      <div className="min-h-screen bg-white pb-24 text-[#212121]">
        <div className="max-w-[640px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <button
              onClick={() => setViewMode('main')}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700"
              aria-label="Back to Account"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">My Addresses</h1>
            <button
              onClick={() => { setAddrModal({ ...EMPTY_ADDR }); setAddrErr({}); }}
              className="ml-auto text-xs font-bold text-[#2874f0] flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-xs">
              No saved addresses. Tap "+ Add New" to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{a.name}</span>
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded uppercase">
                        {a.type}
                      </span>
                    </div>
                    {a.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {a.address}, {a.city}, {a.state} - <strong>{a.pincode}</strong>
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Phone: +91 {a.phone}</p>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onUseAddress(a)}
                      className="flex-1 bg-[#2874f0] hover:bg-[#1259c7] text-white text-xs font-bold py-2 rounded-lg"
                    >
                      Deliver to This Address
                    </button>
                    {!a.isDefault && (
                      <button
                        onClick={() => persistAddrs(addresses.map((x) => ({ ...x, isDefault: x.id === a.id })))}
                        className="text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => { setAddrModal({ ...a }); setAddrErr({}); }}
                      className="p-2 text-gray-500 border border-gray-200 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const list = addresses.filter((x) => x.id !== a.id);
                        persistAddrs(a.isDefault && list.length > 0 ? list.map((x, i) => ({ ...x, isDefault: i === 0 })) : list);
                      }}
                      className="p-2 text-red-500 border border-gray-200 rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- MAIN VIEW: FLIPKART STYLE PROFILE ---------------- */
  return (
    <div className="min-h-screen bg-white pb-24 text-[#212121]">
      <div className="max-w-[540px] mx-auto px-4 py-3 sm:py-5 space-y-4">
        
        {/* Top Header: "Hey, [Real Name / Guest]" + Help Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Hey, {displayName}
            </h1>
            {!profile.name ? (
              <button
                onClick={doGoogleSignIn}
                disabled={googleBusy}
                className="text-[11px] font-bold text-[#2874f0] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full transition active:scale-95"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => { setDraft(profile); setDraftErr({}); setEditingProfile(true); }}
                className="p-1 rounded-full text-gray-400 hover:text-[#2874f0] transition"
                title="Edit Profile"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <a
            href="https://wa.me/918237305111?text=Hi%20Mauli%20Mobile!%20I%20need%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-300 bg-white shadow-2xs text-xs font-bold text-gray-800 hover:bg-gray-50 transition active:scale-95"
          >
            <Headphones className="w-3.5 h-3.5 text-gray-700" />
            <span>Help</span>
          </a>
        </div>

        {/* Mauli Coins Balance Banner (Flipkart SuperCoin style) */}
        <div className="bg-[#f0f5ff] border border-blue-100 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-gray-900">Your Mauli Coins balance</span>
            <div className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-full px-2.5 py-1 shadow-2xs">
              <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                ⚡
              </span>
              <span className="text-xs font-black text-gray-900">{superCoinCount}</span>
            </div>
          </div>

          <div
            onClick={() => {
              if (onOpenWishlist) onOpenWishlist();
            }}
            className="mt-2.5 pt-2.5 border-t border-blue-200/50 flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer hover:text-[#2874f0]"
          >
            <span className="flex items-center gap-1">
              Extra Coins &amp; Free Accessories with <span className="text-[#2874f0] font-bold flex items-center gap-0.5">✦ Mauli VIP Club</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Primary Action Buttons: Orders & Wishlist (50/50 Grid) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Orders */}
          <button
            onClick={() => setViewMode('orders')}
            className="bg-white rounded-xl border border-gray-200 py-3.5 px-4 shadow-2xs flex items-center justify-center gap-2.5 hover:border-[#2874f0] active:scale-[0.98] transition cursor-pointer group"
          >
            <div className="relative">
              <svg className="w-6 h-6 text-[#2874f0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
              {orders.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#2874f0] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {orders.length}
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-gray-800 group-hover:text-[#2874f0] transition-colors">Orders</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => {
              if (onOpenWishlist) onOpenWishlist();
              else notifyRef.current?.('Wishlist opened');
            }}
            className="bg-white rounded-xl border border-gray-200 py-3.5 px-4 shadow-2xs flex items-center justify-center gap-2.5 hover:border-[#2874f0] active:scale-[0.98] transition cursor-pointer group"
          >
            <svg className="w-6 h-6 text-[#2874f0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span className="text-sm font-bold text-gray-800 group-hover:text-[#2874f0] transition-colors">Wishlist</span>
          </button>
        </div>

        {/* Section 1: Finance Options (Mauli Mobile Store & Bank Offers) */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mt-2 mb-2">Finance Options</h2>
          <div className="bg-white divide-y divide-gray-100">
            {/* Offer 1: Bajaj & No Cost EMI */}
            <div
              onClick={() => notifyRef.current?.('Bajaj Finserv & Home Credit EMI available at checkout!')}
              className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-[#eef4fe] text-[#2874f0] flex items-center justify-center shrink-0 border border-blue-100">
                <Calendar className="w-5 h-5 text-[#2874f0]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">Bajaj Finserv &amp; Home Credit EMI</h4>
                <p className="text-[11px] text-gray-500">Zero Down Payment • 3 to 24 Months No-Cost EMI</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Offer 2: Bank Cards */}
            <div
              onClick={() => notifyRef.current?.('Bank cashback auto-applies on checkout!')}
              className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-[#eef4fe] text-[#2874f0] flex items-center justify-center shrink-0 border border-blue-100">
                <CreditCard className="w-5 h-5 text-[#2874f0]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">HDFC, ICICI, SBI &amp; Axis Bank Cards</h4>
                <p className="text-[11px] text-gray-500">Up to ₹5,000 Instant Discount on Credit Cards</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Offer 3: Phone Exchange */}
            <div
              onClick={() => notifyRef.current?.('Visit store at MG Road Mumbai for old phone evaluation!')}
              className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-[#eef4fe] text-[#2874f0] flex items-center justify-center shrink-0 border border-blue-100">
                <RefreshCw className="w-5 h-5 text-[#2874f0]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">Old Phone Exchange Bonus</h4>
                <p className="text-[11px] text-gray-500">Get up to ₹15,000 Extra Value on your used smartphone</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Offer 4: Brand Warranty */}
            <div
              onClick={() => notifyRef.current?.('All products are 100% brand warranty sealed')}
              className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">Mauli Assured 1-Year Brand Warranty</h4>
                <p className="text-[11px] text-gray-500">100% Brand Sealed • Free Screen Protector &amp; Case</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Section 2: Recently Viewed Mobiles (Real Phones from Catalog) */}
        {recentProducts && recentProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mt-2 mb-2.5">
              <h2 className="text-base font-bold text-gray-900">Recently Viewed Mobiles</h2>
              <span className="text-[11px] font-bold text-[#2874f0]">{recentProducts.length} phones</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {recentProducts.slice(0, 10).map((p) => {
                const discount = p.discountPercentage || (p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0);
                return (
                  <div
                    key={p.id}
                    onClick={() => onViewProduct?.(p)}
                    className="w-32 sm:w-36 shrink-0 cursor-pointer group bg-white border border-gray-200 rounded-2xl p-2.5 hover:border-[#2874f0] hover:shadow-xs transition-all"
                  >
                    <div className="w-full aspect-square rounded-xl bg-[#f5f7fa] p-2 flex items-center justify-center overflow-hidden mb-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={onImgError}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#2874f0] block">
                      {p.brand}
                    </span>
                    <p className="text-xs font-bold text-gray-900 truncate leading-snug">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xs font-extrabold text-gray-900">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.mrp > p.price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{p.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                        {discount}% off
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Coupons & Offers (Flipkart style banner) */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mt-2 mb-2">Coupons &amp; Offers</h2>
          <div
            onClick={() => notifyRef.current?.('Coupon MAULI1000 active! Save ₹1,000 on your mobile order')}
            className="border border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/60 rounded-2xl p-3.5 cursor-pointer hover:border-[#2874f0] transition shadow-2xs flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-full bg-[#2874f0] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-gray-900">Explore and grab the best deals</span>
                <span className="text-[9px] font-black uppercase bg-[#2874f0] text-white px-1.5 py-0.2 rounded">
                  NEW
                </span>
              </div>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Use code <span className="font-mono font-bold text-[#2874f0]">MAULI1000</span> for flat ₹1,000 OFF on 5G Mobiles
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          </div>
        </div>

        {/* Section 3: Account Settings */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mt-3 mb-2">Account Settings</h2>
          <div className="bg-white divide-y divide-gray-100">
            {/* Saved Addresses */}
            <div
              onClick={() => setViewMode('addresses')}
              className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">Saved Addresses</h4>
                <p className="text-[11px] text-gray-500">{addresses.length} delivery addresses saved</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Profile Information */}
            <div
              onClick={() => { setDraft(profile); setDraftErr({}); setEditingProfile(true); }}
              className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">Profile Settings</h4>
                <p className="text-[11px] text-gray-500">
                  {profile.phone ? `+91 ${profile.phone}` : 'Name, phone number, email'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            {/* Notifications */}
            <div
              onClick={() => notifyRef.current?.('WhatsApp order alerts are active')}
              className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">Notification Preferences</h4>
                <p className="text-[11px] text-gray-500">WhatsApp &amp; SMS delivery tracking enabled</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Section 4: Google Auth Banner (if not signed in) or Sign Out */}
        <div className="pt-2">
          {!profile.name ? (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 text-center space-y-2.5">
              <p className="text-xs font-bold text-gray-800">Sign in to save orders &amp; addresses</p>
              <button
                onClick={doGoogleSignIn}
                disabled={googleBusy}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2.5 text-xs font-bold text-gray-800 shadow-2xs hover:bg-gray-50 transition"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                  <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.18A7.2 7.2 0 0 1 4.89 12c0-.76.13-1.5.36-2.18v-3.1H1.29a12 12 0 0 0 0 10.56l3.98-3.1z" />
                  <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.72l3.98 3.1c.95-2.85 3.6-5.05 6.73-5.05z" />
                </svg>
                {googleBusy ? 'Connecting…' : 'Sign in with Google'}
              </button>
            </div>
          ) : (
            <button
              onClick={signOut}
              className="w-full py-3 rounded-lg border border-gray-200 text-xs font-bold text-red-600 hover:bg-red-50/50 flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-gray-400 pt-1 pb-4">
          Mauli Mobile • MG Road, Mumbai • 100% Genuine Electronics
        </p>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setEditingProfile(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Personal Information</h3>
              <button onClick={() => setEditingProfile(false)} aria-label="Close">
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name *</label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Ramesh"
                  className={`${inputCls} ${draftErr.name ? 'border-red-500' : ''}`}
                />
                {draftErr.name && <p className={errCls}>{draftErr.name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Mobile Number *</label>
                <input
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  className={`${inputCls} ${draftErr.phone ? 'border-red-500' : ''}`}
                />
                {draftErr.phone && <p className={errCls}>{draftErr.phone}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address (Optional)</label>
                <input
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="name@example.com"
                  inputMode="email"
                  className={`${inputCls} ${draftErr.email ? 'border-red-500' : ''}`}
                />
                {draftErr.email && <p className={errCls}>{draftErr.email}</p>}
              </div>

              <button
                onClick={saveProfile}
                className="w-full bg-[#2874f0] hover:bg-[#1259c7] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Check className="w-4 h-4" /> Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {addrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setAddrModal(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[92vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">{addrModal.id ? 'Edit Address' : 'Add Delivery Address'}</h3>
              <button onClick={() => setAddrModal(null)} aria-label="Close">
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    value={addrModal.name}
                    onChange={(e) => setAddrModal({ ...addrModal, name: e.target.value })}
                    placeholder="Full Name *"
                    className={`${inputCls} ${addrErr.name ? 'border-red-500' : ''}`}
                  />
                  {addrErr.name && <p className={errCls}>{addrErr.name}</p>}
                </div>
                <div>
                  <input
                    value={addrModal.phone}
                    onChange={(e) => setAddrModal({ ...addrModal, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit Mobile *"
                    inputMode="numeric"
                    className={`${inputCls} ${addrErr.phone ? 'border-red-500' : ''}`}
                  />
                  {addrErr.phone && <p className={errCls}>{addrErr.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    value={addrModal.pincode}
                    onChange={(e) => setAddrModal({ ...addrModal, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="Pincode *"
                    inputMode="numeric"
                    className={`${inputCls} ${addrErr.pincode ? 'border-red-500' : ''}`}
                  />
                  {addrErr.pincode && <p className={errCls}>{addrErr.pincode}</p>}
                </div>
                <div>
                  <input
                    value={addrModal.city}
                    onChange={(e) => setAddrModal({ ...addrModal, city: e.target.value })}
                    placeholder="City / District *"
                    className={`${inputCls} ${addrErr.city ? 'border-red-500' : ''}`}
                  />
                  {addrErr.city && <p className={errCls}>{addrErr.city}</p>}
                </div>
              </div>

              <div>
                <textarea
                  value={addrModal.address}
                  onChange={(e) => setAddrModal({ ...addrModal, address: e.target.value })}
                  placeholder="House no., Building, Street, Area *"
                  rows={2}
                  className={`${inputCls} resize-none ${addrErr.address ? 'border-red-500' : ''}`}
                />
                {addrErr.address && <p className={errCls}>{addrErr.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={addrModal.state}
                  onChange={(e) => setAddrModal({ ...addrModal, state: e.target.value })}
                  className={inputCls}
                  aria-label="State"
                >
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="flex gap-2">
                  {(['Home', 'Work'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddrModal({ ...addrModal, type: t })}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                        addrModal.type === t
                          ? 'border-[#2874f0] bg-blue-50 text-[#2874f0]'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addrModal.isDefault}
                  onChange={(e) => setAddrModal({ ...addrModal, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-[#2874f0] rounded"
                />
                Set as default delivery address
              </label>

              <button
                onClick={saveAddress}
                className="w-full bg-[#2874f0] hover:bg-[#1259c7] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Check className="w-4 h-4" /> Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

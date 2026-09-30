import React, { useState, useRef, useEffect } from 'react';
import {
  User, Pencil, MapPin, ShoppingBag, Package,
  Plus, X, Check, Trash2, ChevronRight,
  RotateCcw, LogOut,
} from 'lucide-react';
import { Order } from '../data/adminStore';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
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
}

const STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const inputCls = 'w-full text-base sm:text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#e42529] focus:ring-1 focus:ring-[#e42529] bg-white placeholder-gray-400';
const errCls = 'text-[11px] text-red-600 font-medium mt-1';
const sectionTitle = 'text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1';

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
    // Seed from checkout address if present
    const single = localStorage.getItem('mm_address');
    if (single) {
      const a = JSON.parse(single);
      return [{ ...a, id: `addr-${Date.now()}`, isDefault: true }];
    }
  } catch { /* noop */ }
  return [];
}

const STATUS_CLS: Record<string, string> = {
  Placed: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const EMPTY_ADDR: SavedAddress = {
  id: '', name: '', phone: '', pincode: '', address: '', city: '', state: 'Maharashtra', type: 'Home', isDefault: false,
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders, onShopNow, onBuyAgain, onUseAddress, onNotify,
}) => {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [addresses, setAddresses] = useState<SavedAddress[]>(loadAddresses);
  const [editingProfile, setEditingProfile] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [draftErr, setDraftErr] = useState<Record<string, string>>({});
  const [addrModal, setAddrModal] = useState<SavedAddress | null>(null);
  const [addrErr, setAddrErr] = useState<Record<string, string>>({});

  const ordersRef = useRef<HTMLDivElement>(null);
  const addrRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef(onNotify);
  notifyRef.current = onNotify;
  const [googleBusy, setGoogleBusy] = useState(false);
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Firebase Google session: redirect result + stay signed in across visits
  const applyFirebaseUser = (u: FirebaseUser, greet: boolean) => {
    const clean: Profile = {
      name: u.displayName || '', phone: u.phoneNumber || '', email: u.email || '',
      picture: u.photoURL || '', provider: 'google', uid: u.uid,
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
      notifyRef.current?.('Add Firebase keys in .env to enable Google sign-in');
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
          notifyRef.current?.('Google sign-in failed');
        }
      } else if (code === 'auth/unauthorized-domain') {
        notifyRef.current?.('This domain is not authorized in Firebase console');
      } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        notifyRef.current?.('Google sign-in failed');
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
    if (draft.name.trim().length < 3) e.name = 'Enter full name';
    if (!/^[6-9]\d{9}$/.test(draft.phone.trim())) e.phone = 'Enter valid 10-digit mobile number';
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) e.email = 'Enter valid email';
    setDraftErr(e);
    if (Object.keys(e).length > 0) return;
    const clean = { name: draft.name.trim(), phone: draft.phone.trim(), email: draft.email.trim() };
    setProfile(clean);
    try { localStorage.setItem('mm_profile', JSON.stringify(clean)); } catch { /* noop */ }
    setEditingProfile(false);
  };

  const signOut = async () => {
    try { if (auth) await firebaseSignOut(auth); } catch { /* noop */ }
    const blank = { name: '', phone: '', email: '' };
    setProfile(blank);
    setDraft(blank);
    try { localStorage.removeItem('mm_profile'); } catch { /* noop */ }
  };

  const validateAddr = (a: SavedAddress) => {
    const e: Record<string, string> = {};
    if (a.name.trim().length < 3) e.name = 'Enter full name';
    if (!/^[6-9]\d{9}$/.test(a.phone.trim())) e.phone = 'Enter valid 10-digit mobile number';
    if (!/^[1-9][0-9]{5}$/.test(a.pincode.trim())) e.pincode = 'Enter valid 6-digit pincode';
    if (a.address.trim().length < 10) e.address = 'Enter complete address (min 10 characters)';
    if (a.city.trim().length < 2) e.city = 'Enter city';
    setAddrErr(e);
    return Object.keys(e).length === 0;
  };

  const saveAddress = () => {
    if (!addrModal) return;
    if (!validateAddr(addrModal)) return;
    const clean: SavedAddress = {
      ...addrModal,
      name: addrModal.name.trim(), phone: addrModal.phone.trim(),
      pincode: addrModal.pincode.trim(), address: addrModal.address.trim(), city: addrModal.city.trim(),
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
  };

  const initial = profile.name.trim() ? profile.name.trim()[0].toUpperCase() : null;

  const tiles = [
    {
      icon: <Package className="w-5 h-5 text-gray-700" />,
      title: 'Your Orders',
      sub: orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''} placed` : 'Track, buy again',
      onClick: () => scrollTo(ordersRef),
    },
    {
      icon: <MapPin className="w-5 h-5 text-gray-700" />,
      title: 'Your Addresses',
      sub: addresses.length > 0 ? `${addresses.length} saved` : 'Add delivery address',
      onClick: () => scrollTo(addrRef),
    },
    {
      icon: <User className="w-5 h-5 text-gray-700" />,
      title: 'Your Details',
      sub: profile.name || 'Add name, phone',
      onClick: () => scrollTo(detailsRef),
    },
  ];

  return (
    <div className="max-w-[720px] mx-auto px-3 sm:px-4 py-4 space-y-5 pb-12">
      {/* Greeting */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-lg font-extrabold text-[#e42529] shrink-0 overflow-hidden">
          {profile.picture ? (
            <img src={profile.picture} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            initial || <User className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-extrabold text-gray-900 truncate">
            Hello{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs text-gray-500 truncate">
            {profile.phone ? `+91 ${profile.phone}` : 'Welcome to Mauli Mobile'}
            {profile.email ? ` • ${profile.email}` : ''}
          </p>
        </div>
      </div>

      {/* Google sign-in (guest only) */}
      {!profile.name && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-sm font-extrabold text-gray-900">Sign in for faster checkout</p>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">Orders and details sync with your Google account</p>
          <button
            onClick={doGoogleSignIn}
            disabled={googleBusy}
            className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-300 rounded-xl py-3 text-sm font-bold tracking-widest text-gray-800 hover:bg-gray-50 disabled:opacity-60 active:scale-[0.99] transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0" aria-hidden="true">
              <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.18A7.2 7.2 0 0 1 4.89 12c0-.76.13-1.5.36-2.18v-3.1H1.29a12 12 0 0 0 0 10.56l3.98-3.1z" />
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.72l3.98 3.1c.95-2.85 3.6-5.05 6.73-5.05z" />
            </svg>
            {googleBusy ? 'CONNECTING…' : 'GOOGLE'}
          </button>
          {(!auth || !isFirebaseConfigured) && (
            <p className="text-[11px] text-gray-400 mt-2">
              Add <span className="font-mono font-bold">VITE_FIREBASE_*</span> keys in .env to activate login
            </p>
          )}
        </div>
      )}

      {/* Menu tiles */}
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t) => (
          <button
            key={t.title}
            onClick={t.onClick}
            className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 text-left hover:border-gray-300 active:scale-[0.98] transition-all"
          >
            <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              {t.icon}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-gray-900 truncate">{t.title}</span>
              <span className="block text-[10px] text-gray-500 truncate">{t.sub}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          </button>
        ))}
      </div>

      {/* Details */}
      <div ref={detailsRef} className="scroll-mt-[70px] sm:scroll-mt-[90px] space-y-2">
        <h2 className={sectionTitle}>Account Details</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">Name</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{profile.name || '—'}</p>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-[11px] text-gray-400">Mobile</p>
            <p className="text-sm font-semibold text-gray-900">{profile.phone ? `+91 ${profile.phone}` : '—'}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[11px] text-gray-400">Email</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{profile.email || '—'}</p>
          </div>
          <button
            onClick={() => { setDraft(profile); setDraftErr({}); setEditingProfile(true); }}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-bold text-[#e42529] hover:bg-red-50/50 rounded-b-xl"
          >
            <Pencil className="w-4 h-4" /> {profile.name ? 'Edit Details' : 'Add Details'}
          </button>
        </div>
      </div>

      {/* Orders */}
      <div ref={ordersRef} className="scroll-mt-[70px] sm:scroll-mt-[90px] space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className={sectionTitle}>Order History</h2>
          {orders.length > 0 && <span className="text-[11px] font-bold text-gray-400">{orders.length} total</span>}
        </div>
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-800">No orders yet</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">Your past orders will appear here.</p>
            <button onClick={onShopNow} className="bg-[#e42529] hover:bg-[#c21418] text-white text-xs font-bold px-6 py-2.5 rounded-lg">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-gray-900">{o.id}</span>
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CLS[o.status] || STATUS_CLS.Placed}`}>
                    {o.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {o.payment}
                </p>
                <div className="flex gap-2 mt-2.5 overflow-x-auto no-scrollbar">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex items-center gap-2 shrink-0">
                      <img src={it.image} alt={it.name} className="w-10 h-10 object-contain bg-gray-50 rounded-lg border border-gray-100" />
                      <div className="text-[11px]">
                        <p className="font-semibold text-gray-800 max-w-[140px] truncate">{it.name}</p>
                        <p className="text-gray-400">Qty {it.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                  <span className="text-[13px] font-extrabold text-gray-900">₹{o.total.toLocaleString('en-IN')}</span>
                  {o.status !== 'Cancelled' && (
                    <button
                      onClick={() => onBuyAgain(o)}
                      className="flex items-center gap-1.5 bg-[#e42529] hover:bg-[#c21418] text-white text-xs font-bold px-3.5 py-2 rounded-lg"
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

      {/* Addresses */}
      <div ref={addrRef} className="scroll-mt-[70px] sm:scroll-mt-[90px] space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className={sectionTitle}>Saved Addresses</h2>
          <button
            onClick={() => { setAddrModal({ ...EMPTY_ADDR }); setAddrErr({}); }}
            className="flex items-center gap-1 text-xs font-bold text-[#e42529]"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
        {addresses.length === 0 ? (
          <p className="bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-500 text-center">
            No saved addresses. Add one for faster checkout.
          </p>
        ) : (
          <div className="space-y-2">
            {addresses.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-gray-900">{a.name}</span>
                  <span className="text-[10px] font-bold text-gray-500">{a.type}</span>
                  {a.isDefault && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-px rounded">
                      DEFAULT
                    </span>
                  )}
                  <button
                    onClick={() => {
                      const list = addresses.filter((x) => x.id !== a.id);
                      persistAddrs(a.isDefault && list.length > 0 ? list.map((x, i) => ({ ...x, isDefault: i === 0 })) : list);
                    }}
                    className="ml-auto p-1.5 text-gray-300 hover:text-red-600"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {a.address}, {a.city}, {a.state} — <strong className="text-gray-800">{a.pincode}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">+91 {a.phone}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => onUseAddress(a)}
                    className="flex-1 bg-[#e42529] hover:bg-[#c21418] text-white text-xs font-bold py-2 rounded-lg"
                  >
                    Deliver Here
                  </button>
                  {!a.isDefault && (
                    <button
                      onClick={() => persistAddrs(addresses.map((x) => ({ ...x, isDefault: x.id === a.id })))}
                      className="text-xs font-bold text-gray-600 border border-gray-300 px-3 py-2 rounded-lg"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => { setAddrModal({ ...a }); setAddrErr({}); }}
                    className="p-2 text-gray-500 border border-gray-300 rounded-lg"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50/50"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
      <p className="text-center text-[10px] text-gray-400">Mauli Mobile • v1.0</p>

      {/* Edit profile sheet */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setEditingProfile(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-gray-900">Your Details</h3>
              <button onClick={() => setEditingProfile(false)} aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Full name *" className={`${inputCls} ${draftErr.name ? 'border-red-500' : ''}`} />
                {draftErr.name && <p className={errCls}>{draftErr.name}</p>}
              </div>
              <div>
                <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile number *" inputMode="numeric" className={`${inputCls} ${draftErr.phone ? 'border-red-500' : ''}`} />
                {draftErr.phone && <p className={errCls}>{draftErr.phone}</p>}
              </div>
              <div>
                <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email (optional)" inputMode="email" className={`${inputCls} ${draftErr.email ? 'border-red-500' : ''}`} />
                {draftErr.email && <p className={errCls}>{draftErr.email}</p>}
              </div>
              <button onClick={saveProfile} className="w-full bg-[#e42529] hover:bg-[#c21418] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address sheet */}
      {addrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setAddrModal(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-gray-900">{addrModal.id ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setAddrModal(null)} aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input value={addrModal.name} onChange={(e) => setAddrModal({ ...addrModal, name: e.target.value })} placeholder="Full name *" className={`${inputCls} ${addrErr.name ? 'border-red-500' : ''}`} />
                  {addrErr.name && <p className={errCls}>{addrErr.name}</p>}
                </div>
                <div>
                  <input value={addrModal.phone} onChange={(e) => setAddrModal({ ...addrModal, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile *" inputMode="numeric" className={`${inputCls} ${addrErr.phone ? 'border-red-500' : ''}`} />
                  {addrErr.phone && <p className={errCls}>{addrErr.phone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input value={addrModal.pincode} onChange={(e) => setAddrModal({ ...addrModal, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} placeholder="Pincode *" inputMode="numeric" className={`${inputCls} ${addrErr.pincode ? 'border-red-500' : ''}`} />
                  {addrErr.pincode && <p className={errCls}>{addrErr.pincode}</p>}
                </div>
                <div>
                  <input value={addrModal.city} onChange={(e) => setAddrModal({ ...addrModal, city: e.target.value })} placeholder="City *" className={`${inputCls} ${addrErr.city ? 'border-red-500' : ''}`} />
                  {addrErr.city && <p className={errCls}>{addrErr.city}</p>}
                </div>
              </div>
              <div>
                <textarea value={addrModal.address} onChange={(e) => setAddrModal({ ...addrModal, address: e.target.value })} placeholder="Address (House no, Building, Street, Area) *" rows={2} className={`${inputCls} resize-none ${addrErr.address ? 'border-red-500' : ''}`} />
                {addrErr.address && <p className={errCls}>{addrErr.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={addrModal.state} onChange={(e) => setAddrModal({ ...addrModal, state: e.target.value })} className={inputCls}>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex gap-2">
                  {(['Home', 'Work'] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setAddrModal({ ...addrModal, type: t })}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-colors ${addrModal.type === t ? 'border-[#e42529] bg-red-50/50 text-[#e42529]' : 'border-gray-300 text-gray-600'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <input type="checkbox" checked={addrModal.isDefault} onChange={(e) => setAddrModal({ ...addrModal, isDefault: e.target.checked })} className="w-4 h-4 accent-[#e42529]" />
                Set as default address
              </label>
              <button onClick={saveAddress} className="w-full bg-[#e42529] hover:bg-[#c21418] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Grid3X3, Image as ImageIcon,
  Tag, X, Plus, RotateCcw, Trash2, Pencil, ArrowLeft, Check,
  Lock, LogOut, Eye, EyeOff, ShieldCheck, IndianRupee, TrendingUp,
  Boxes, BadgeCheck,
} from 'lucide-react';
import { Product, Category, Banner, BankOffer } from '../types';
import { NewLaunchItem } from '../data/mockData';
import { LandingSlide } from './LandingHero';
import { Order } from '../data/adminStore';

type Tab = 'dashboard' | 'orders' | 'products' | 'categories' | 'banners' | 'offers';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  offers: BankOffer[];
  launches: NewLaunchItem[];
  slides: LandingSlide[];
  orders: Order[];
  onSaveProducts: (v: Product[]) => void;
  onSaveCategories: (v: Category[]) => void;
  onSaveBanners: (v: Banner[]) => void;
  onSaveOffers: (v: BankOffer[]) => void;
  onSaveLaunches: (v: NewLaunchItem[]) => void;
  onSaveSlides: (v: LandingSlide[]) => void;
  onSaveOrders: (v: Order[]) => void;
  onResetAll: () => void;
  onClose: () => void;
}

// Demo-grade gate (client-side only). Real auth needs a backend session.
const ADMIN_PASSWORD = 'mobile123';
const AUTH_KEY = 'mm_admin_auth';

function isAuthed(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

const inputCls = 'w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#e42529] focus:ring-2 focus:ring-[#e42529]/15 bg-gray-50 focus:bg-white transition placeholder:text-gray-400';
const labelCls = 'text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.08em] mb-1.5 block';
const btnRed = 'bg-gradient-to-b from-[#f03236] to-[#c21418] hover:brightness-110 active:scale-[0.98] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-[0_6px_16px_-6px_rgb(228_37_41/0.6)] transition';
const btnGhost = 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition active:scale-[0.98]';
const cardCls = 'bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_-8px_rgb(0_0_0/0.12)] p-4 sm:p-5';

const STATUS_PILL: Record<Order['status'], string> = {
  Placed: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [shake, setShake] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch { /* noop */ }
      onSuccess();
    } else {
      setErr('Galat password. Dobara try karo.');
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* glow decor */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-[#e42529]/25 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[380px] h-[280px] bg-[#d4af37]/15 blur-[110px] rounded-full pointer-events-none" />

      <div className={`relative w-full max-w-sm ${shake ? 'animate-[shake_0.35s_ease]' : ''}`}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}`}</style>
        <div className="bg-[#17171c] border border-white/10 rounded-3xl p-7 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e42529] to-[#7a0d10] flex items-center justify-center shadow-lg mx-auto">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-white text-lg font-black text-center mt-4">Mauli Mobile Admin</h1>
          <p className="text-white/50 text-xs text-center mt-1">Store manage karne ke liye login karo</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.1em] block mb-1.5">Password</span>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={show ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setErr(''); }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#e42529] focus:ring-2 focus:ring-[#e42529]/25 transition"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80" aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>
            {err && <p className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{err}</p>}
            <button type="submit" className="w-full bg-gradient-to-b from-[#f03236] to-[#c21418] hover:brightness-110 active:scale-[0.99] text-white text-sm font-extrabold py-3 rounded-xl shadow-[0_10px_28px_-8px_rgb(228_37_41/0.7)] transition">
              Login to Dashboard
            </button>
          </form>
          <p className="text-white/25 text-[10px] text-center mt-4">Demo protection only — real security ke liye backend auth chahiye</p>
        </div>
      </div>
    </div>
  );
}

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const { products, categories, banners, offers, launches, slides, orders } = props;
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [q, setQ] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  const revenue = useMemo(() => orders.reduce((a, o) => a + o.total, 0), [orders]);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)
    );
  }, [products, q]);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const logout = () => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch { /* noop */ }
    setAuthed(false);
    props.onClose();
  };

  const tabs: { id: Tab; label: string; count?: number; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', count: orders.length, icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'products', label: 'Products', count: products.length, icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'banners', label: 'Banners', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'offers', label: 'Offers', icon: <Tag className="w-4 h-4" /> },
  ];

  const stats = [
    { l: 'Total Revenue', v: `₹${revenue.toLocaleString('en-IN')}`, sub: `${orders.length} orders`, icon: <IndianRupee className="w-5 h-5" />, bg: 'bg-emerald-50 text-emerald-600' },
    { l: 'Orders', v: String(orders.length), sub: 'lifetime', icon: <ShoppingCart className="w-5 h-5" />, bg: 'bg-blue-50 text-blue-600' },
    { l: 'Avg Order Value', v: `₹${aov.toLocaleString('en-IN')}`, sub: 'per order', icon: <TrendingUp className="w-5 h-5" />, bg: 'bg-violet-50 text-violet-600' },
    { l: 'Live Products', v: String(products.length), sub: `${categories.length} categories`, icon: <Boxes className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-600' },
  ];

  const saveProductForm = () => {
    if (!editingProduct) return;
    const p = { ...editingProduct, price: Number(editingProduct.price) || 0, mrp: Number(editingProduct.mrp) || 0 };
    if (isNewProduct) props.onSaveProducts([p, ...products]);
    else props.onSaveProducts(products.map((x) => (x.id === p.id ? p : x)));
    setEditingProduct(null);
    setIsNewProduct(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f7]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#20060a] via-[#141414] to-[#20060a] text-white border-b border-[#d4af37]/30">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <button onClick={props.onClose} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition active:scale-95" aria-label="Back to store" title="Back to store">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e42529] to-[#7a0d10] hidden sm:flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black tracking-tight truncate">Mauli Mobile <span className="text-[#d4af37]">• Admin</span></h1>
              <p className="text-[10px] text-white/50 font-medium hidden sm:block">Dashboard • Orders • Products • Banners • Offers</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={props.onResetAll} title="Reset everything to defaults" className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={logout} title="Logout" className="flex items-center gap-1.5 text-[11px] font-bold bg-[#e42529] hover:brightness-110 px-3 py-2 rounded-xl transition active:scale-95">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-3 sm:px-5 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 items-start">
        {/* Sidebar */}
        <nav className="md:sticky md:top-[68px] bg-[#141414] rounded-2xl p-2 flex md:flex-col gap-1 overflow-x-auto border border-black shadow-[0_10px_30px_-14px_rgb(0_0_0/0.5)]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-[0.98] ${tab === t.id ? 'bg-gradient-to-b from-[#f03236] to-[#c21418] text-white shadow-[0_6px_16px_-6px_rgb(228_37_41/0.6)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              {t.icon}
              <span>{t.label}</span>
              {typeof t.count === 'number' && (
                <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="min-w-0 space-y-4">
          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.l} className={cardCls + ' hover:shadow-[0_8px_24px_-10px_rgb(0_0_0/0.18)] transition'}>
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                    </div>
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-3">{s.l}</p>
                    <p className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">{s.v}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-[#e42529]" /> Recent Orders
                  </h3>
                  {orders.length > 0 && (
                    <button onClick={() => setTab('orders')} className="text-[11px] font-extrabold text-[#e42529] hover:underline">View all →</button>
                  )}
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-8 h-8 text-gray-200 mx-auto" />
                    <p className="text-xs text-gray-500 mt-2 font-medium">No orders yet. Checkout se order aayega to yahi dikhega.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center gap-3 py-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold truncate">{o.id} <span className="text-gray-400 font-medium">• {o.name} ({o.city})</span></p>
                          <span className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${STATUS_PILL[o.status]}`}>{o.status}</span>
                        </div>
                        <span className="text-sm font-black text-[#e42529] shrink-0">₹{o.total.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div className={cardCls}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-4">All Orders ({orders.length})</h3>
              {orders.length === 0 && <p className="text-xs text-gray-500">No orders found.</p>}
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-3.5 hover:border-gray-200 transition">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black">{o.id}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${STATUS_PILL[o.status]}`}>{o.status}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{new Date(o.date).toLocaleString('en-IN')}</span>
                      <select
                        value={o.status}
                        onChange={(e) => props.onSaveOrders(orders.map((x) => x.id === o.id ? { ...x, status: e.target.value as Order['status'] } : x))}
                        className="ml-auto text-xs font-bold border border-gray-200 bg-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#e42529]"
                        aria-label="Order status"
                      >
                        {['Placed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => props.onSaveOrders(orders.filter((x) => x.id !== o.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition" aria-label="Delete order">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
                      {o.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-2 shrink-0 bg-white border border-gray-100 rounded-xl p-1.5 pr-3">
                          <img src={it.image} alt={it.name} className="w-9 h-9 object-contain bg-gray-50 rounded-lg border border-gray-100" />
                          <div className="text-[10px]">
                            <p className="font-bold max-w-[160px] truncate">{it.name}</p>
                            <p className="text-gray-500">Qty {it.quantity} • ₹{(it.price * it.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2 font-medium">{o.name} • +91 {o.phone} • {o.address}, {o.city} - {o.pincode} • {o.payment}</p>
                    <p className="text-sm font-black mt-1">Total: <span className="text-[#e42529]">₹{o.total.toLocaleString('en-IN')}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <div className={cardCls}>
              <div className="flex gap-2 mb-4">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Search product, brand, id..." className={inputCls} />
                <button
                  onClick={() => {
                    setIsNewProduct(true);
                    setEditingProduct({ id: `prod-${Date.now()}`, name: '', brand: '', category: 'mobiles', price: 0, mrp: 0, discountPercentage: 0, rating: 4, ratingCount: 0, image: '', features: [], expressDelivery: true, inStock: true, emiStartsAt: 0, reliancePoints: 0, specs: {} });
                  }}
                  className={btnRed + ' flex items-center gap-1.5 shrink-0'}
                >
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
                </button>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-0.5">
                {filtered.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-2.5 hover:border-gray-200 hover:shadow-[0_6px_18px_-10px_rgb(0_0_0/0.2)] transition bg-white">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-gray-50 rounded-xl border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold truncate">{p.name || '(no name)'}</p>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{p.brand} • {p.category} • <span className="text-[#e42529] font-extrabold">₹{p.price.toLocaleString('en-IN')}</span></p>
                    </div>
                    <button onClick={() => { setIsNewProduct(false); setEditingProduct({ ...p }); }} className="p-2.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition" aria-label="Edit product">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => props.onSaveProducts(products.filter((x) => x.id !== p.id))} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" aria-label="Delete product">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && <p className="text-xs text-gray-400 text-center py-6">Kuch nahi mila. Search badlo ya naya product add karo.</p>}
              </div>

              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setEditingProduct(null)}>
                  <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black">{isNewProduct ? '✨ New Product' : '✏️ Edit Product'}</h3>
                      <button onClick={() => setEditingProduct(null)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Close"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-3.5">
                      <div><span className={labelCls}>Name</span><input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className={inputCls} placeholder="iPhone 16 128GB..." /></div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div><span className={labelCls}>Brand</span><input value={editingProduct.brand} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} className={inputCls} placeholder="Apple" /></div>
                        <div><span className={labelCls}>Category id</span><input value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className={inputCls} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div><span className={labelCls}>Price ₹</span><input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className={inputCls} /></div>
                        <div><span className={labelCls}>MRP ₹</span><input type="number" value={editingProduct.mrp} onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })} className={inputCls} /></div>
                      </div>
                      <div>
                        <span className={labelCls}>Image URL</span>
                        <input value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className={inputCls} placeholder="https://..." />
                        {editingProduct.image && <img src={editingProduct.image} alt="preview" className="mt-2 w-24 h-24 object-contain bg-gray-50 border border-gray-200 rounded-2xl" />}
                      </div>
                      <div className="flex gap-5 text-xs font-bold bg-gray-50 rounded-xl px-3 py-2.5">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingProduct.inStock} onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} className="w-4 h-4 accent-[#e42529]" /> In stock</label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingProduct.expressDelivery} onChange={(e) => setEditingProduct({ ...editingProduct, expressDelivery: e.target.checked })} className="w-4 h-4 accent-[#e42529]" /> Express</label>
                      </div>
                      <button onClick={saveProductForm} className={btnRed + ' w-full flex items-center justify-center gap-1.5 !py-3.5 !text-sm'}><Check className="w-4 h-4" /> Save Product</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES */}
          {tab === 'categories' && (
            <div className={cardCls}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-1">Categories</h3>
              <p className="text-[11px] text-gray-400 font-medium mb-4">Name + image edit karo — home strip aur categories page pe dikhega.</p>
              <div className="space-y-2.5">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3 hover:border-gray-200 transition">
                    <img src={c.imageUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shrink-0" />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input value={c.name} onChange={(e) => props.onSaveCategories(categories.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))} className={inputCls} aria-label="Category name" />
                      <input value={c.imageUrl} onChange={(e) => props.onSaveCategories(categories.map((x) => x.id === c.id ? { ...x, imageUrl: e.target.value } : x))} className={inputCls} aria-label="Category image URL" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANNERS */}
          {tab === 'banners' && (
            <div className="space-y-4">
              <div className={cardCls}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-4">Landing Hero Slides <span className="text-gray-400 font-medium normal-case">(top carousel)</span></h3>
                <div className="space-y-2.5">
                  {slides.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3 hover:border-gray-200 transition">
                      <img src={s.src} alt={s.alt} className="w-24 h-14 object-cover rounded-xl border border-gray-200 shrink-0 bg-gray-50" />
                      <div className="flex-1 grid grid-cols-1 gap-2">
                        <input value={s.alt} onChange={(e) => props.onSaveSlides(slides.map((x) => x.id === s.id ? { ...x, alt: e.target.value } : x))} className={inputCls} aria-label="Slide text" />
                        <input value={s.src} onChange={(e) => props.onSaveSlides(slides.map((x) => x.id === s.id ? { ...x, src: e.target.value } : x))} className={inputCls} aria-label="Slide image URL" />
                      </div>
                      <button onClick={() => props.onSaveSlides(slides.filter((x) => x.id !== s.id))} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" aria-label="Delete slide"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button
                    onClick={() => props.onSaveSlides([...slides, { id: `slide-${Date.now()}`, src: '', alt: 'New banner' }])}
                    className={btnGhost + ' flex items-center gap-1.5'}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add slide
                  </button>
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-4">Hero Offer Banners</h3>
                <div className="space-y-3">
                  {banners.map((b) => (
                    <div key={b.id} className="border border-gray-100 rounded-2xl p-3.5 space-y-2.5 hover:border-gray-200 transition">
                      <div className="flex items-center gap-3">
                        <img src={b.image} alt={b.title} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0 bg-gray-50" />
                        <input value={b.title} onChange={(e) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, title: e.target.value } : x))} className={inputCls} aria-label="Banner title" />
                        <button onClick={() => props.onSaveBanners(banners.filter((x) => x.id !== b.id))} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0" aria-label="Delete banner"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <input value={b.subtitle} onChange={(e) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, subtitle: e.target.value } : x))} className={inputCls} aria-label="Banner subtitle" />
                      <div className="grid grid-cols-2 gap-2.5">
                        <input value={b.badge} onChange={(e) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, badge: e.target.value } : x))} className={inputCls} aria-label="Banner badge" />
                        <input value={b.image} onChange={(e) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, image: e.target.value } : x))} className={inputCls} aria-label="Banner image URL" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-4">New Launch Cards</h3>
                <div className="space-y-2.5">
                  {launches.map((l) => (
                    <div key={l.id} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3 hover:border-gray-200 transition">
                      <img src={l.image} alt={l.title} className="w-12 h-12 object-contain bg-gray-50 rounded-xl border border-gray-100 shrink-0" />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input value={l.brand} onChange={(e) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, brand: e.target.value } : x))} className={inputCls} aria-label="Launch brand" />
                        <input value={l.title} onChange={(e) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, title: e.target.value } : x))} className={inputCls} aria-label="Launch title" />
                        <input value={l.image} onChange={(e) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, image: e.target.value } : x))} className={inputCls} aria-label="Launch image URL" />
                      </div>
                      <button onClick={() => props.onSaveLaunches(launches.filter((x) => x.id !== l.id))} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0" aria-label="Delete launch"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OFFERS */}
          {tab === 'offers' && (
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider">Bank Offers ({offers.length})</h3>
                <button
                  onClick={() => props.onSaveOffers([...offers, { bank: 'New Bank', offer: 'Offer text', code: `CODE${Date.now() % 10000}`, minAmount: 10000 }])}
                  className={btnRed + ' flex items-center gap-1.5'}
                >
                  <Plus className="w-3.5 h-3.5" /> Add offer
                </button>
              </div>
              <div className="space-y-3">
                {offers.map((o) => (
                  <div key={o.code} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div><span className={labelCls}>Bank</span><input value={o.bank} onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, bank: e.target.value } : x))} className={inputCls} /></div>
                    <div><span className={labelCls}>Code</span><input value={o.code} onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, code: e.target.value } : x))} className={inputCls} /></div>
                    <div className="sm:col-span-2"><span className={labelCls}>Offer text</span><input value={o.offer} onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, offer: e.target.value } : x))} className={inputCls} /></div>
                    <div>
                      <span className={labelCls}>Min amount ₹</span>
                      <input type="number" value={o.minAmount} onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, minAmount: Number(e.target.value) } : x))} className={inputCls} />
                    </div>
                    <div className="flex items-end">
                      <button onClick={() => props.onSaveOffers(offers.filter((x) => x.code !== o.code))} className={btnGhost + ' !text-red-600 !border-red-200 hover:!bg-red-50 flex items-center gap-1.5'}><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

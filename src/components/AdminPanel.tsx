import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Grid3X3, Image as ImageIcon,
  Tag, X, Plus, RotateCcw, Trash2, Pencil, ArrowLeft, Check,
  Lock, LogOut, Eye, EyeOff, ShieldCheck,
} from 'lucide-react';
import { Product, Category, Banner, BankOffer } from '../types';
import { NewLaunchItem } from '../data/mockData';
import { LandingSlide } from './LandingHero';
import { Order, saveOrders, ShopTile } from '../data/adminStore';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../lib/orderStore';
import { onImgError } from '../lib/imgFallback';
import { ImageUpload } from './ImageUpload';

type Tab = 'dashboard' | 'orders' | 'products' | 'categories' | 'banners' | 'offers';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  offers: BankOffer[];
  launches: NewLaunchItem[];
  slides: LandingSlide[];
  orders: Order[];
  categoryTiles: ShopTile[];
  dealTiles: ShopTile[];
  onSaveCategoryTiles: (v: ShopTile[]) => void;
  onSaveDealTiles: (v: ShopTile[]) => void;
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
const ADMIN_PASSWORD = 'mauli123';
const AUTH_KEY = 'mm_admin_auth';

function isAuthed(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

const inputCls = 'w-full text-[16px] sm:text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#e42529] bg-white transition placeholder:text-gray-400';
const labelCls = 'text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block';
const btnRed = 'bg-[#e42529] hover:bg-[#c81f23] active:scale-[0.98] text-white text-xs font-bold px-3.5 py-2.5 rounded-lg transition disabled:opacity-50';
const btnGhost = 'border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3 py-2.5 rounded-lg transition active:scale-[0.98]';
const cardCls = 'bg-white rounded-xl border border-gray-200 p-3.5 sm:p-4';

const STATUS_PILL: Record<Order['status'], string> = {
  Placed: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

// Brute-force sasta karne ke liye: galat attempt pe thoda lockout.
const MAX_ATTEMPTS = 5;
const LOCK_MS = 60_000;

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const lockedUntil = useRef(0);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (Date.now() < lockedUntil.current) {
      setErr('Bahut zyada galat attempts. 1 minute baad try karo.');
      return;
    }
    if (pw === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch { /* noop */ }
      onSuccess();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        lockedUntil.current = Date.now() + LOCK_MS;
        setAttempts(0);
        setErr('Bahut zyada galat attempts. 1 minute baad try karo.');
      } else {
        setErr('Galat password. Dobara try karo.');
      }
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className={`w-full max-w-sm ${shake ? 'animate-[shake_0.35s_ease]' : ''}`}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}`}</style>
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-[#e42529] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-gray-900 text-base font-bold mt-3">Mauli Mobile Admin</h1>
          <p className="text-gray-500 text-xs mt-1">Store manage karne ke liye login karo</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Password</span>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={show ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setErr(''); }}
                  placeholder="Password"
                  autoFocus
                  className="w-full text-[16px] bg-white border border-gray-300 rounded-lg pl-9 pr-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#e42529] transition"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>
            {err && <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
            <button type="submit" className="w-full bg-[#e42529] hover:bg-[#c81f23] active:scale-[0.99] text-white text-sm font-bold py-3 rounded-lg transition">
              Login
            </button>
          </form>
        <p className="text-gray-400 text-[10px] text-center mt-4">{MAX_ATTEMPTS} galat attempts pe 1 minute lock</p>
      </div>
    </div>
  );
}

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const { products, categories, banners, offers, launches, slides, orders, categoryTiles, dealTiles } = props;
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

  // Login ke baad cloud se saare orders (har device se aaye) kheench lo.
  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    fetchOrders().then((cloud) => {
      if (cancelled || !cloud) return;
      const localIds = new Set(orders.map((o) => o.id));
      const merged = [...orders, ...cloud.filter((o) => !localIds.has(o.id))]
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      saveOrders(merged);
      props.onSaveOrders(merged);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

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
    { id: 'offers', label: 'Offers & Deals', icon: <Tag className="w-4 h-4" /> },
  ];

  const stats = [
    { l: 'Revenue', v: `₹${revenue.toLocaleString('en-IN')}`, sub: `${orders.length} orders` },
    { l: 'Orders', v: String(orders.length), sub: 'lifetime' },
    { l: 'Avg order', v: `₹${aov.toLocaleString('en-IN')}`, sub: 'per order' },
    { l: 'Products', v: String(products.length), sub: `${categories.length} categories` },
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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center gap-2.5">
          <button onClick={props.onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition" aria-label="Back to store" title="Back to store">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-bold text-gray-900 truncate">
            Admin <span className="text-gray-400 font-normal">• Mauli Mobile</span>
          </h1>
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={props.onResetAll} title="Reset everything to defaults" className="hidden sm:flex w-8 h-8 rounded-lg hover:bg-gray-100 items-center justify-center text-gray-500 transition">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 hover:text-[#e42529] border border-gray-200 px-2.5 py-1.5 rounded-lg transition">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-3 sm:px-4 py-4 grid grid-cols-1 md:grid-cols-[190px_1fr] gap-4 items-start">
        {/* Sidebar (desktop) */}
        <nav className="hidden md:flex md:flex-col gap-0.5 md:sticky md:top-[64px]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition ${tab === t.id ? 'bg-[#e42529] text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {t.icon}
              <span>{t.label}</span>
              {typeof t.count === 'number' && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="min-w-0 space-y-3">
          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {stats.map((s) => (
                  <div key={s.l} className={cardCls}>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{s.l}</p>
                    <p className="text-lg sm:text-xl font-bold tracking-tight mt-1 break-words">{s.v}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    Recent Orders
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
              <h3 className="text-xs font-bold text-gray-900 mb-3">All Orders ({orders.length})</h3>
              {orders.length === 0 && <p className="text-xs text-gray-500">No orders found.</p>}
              <div className="space-y-2.5">
                {orders.map((o) => (
                  <div key={o.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold">{o.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${STATUS_PILL[o.status]}`}>{o.status}</span>
                      <span className="text-sm font-bold ml-auto">₹{o.total.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(o.date).toLocaleString('en-IN')}</p>
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                      {o.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-2 shrink-0 border border-gray-100 rounded-lg p-1.5 pr-2.5">
                          <img src={it.image} alt={it.name} onError={onImgError} className="w-8 h-8 object-contain bg-gray-50 rounded" />
                          <div className="text-[10px]">
                            <p className="font-semibold max-w-[130px] truncate">{it.name}</p>
                            <p className="text-gray-500">×{it.quantity} • ₹{(it.price * it.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{o.name} • +91 {o.phone} • {o.address}, {o.city} - {o.pincode} • {o.payment}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <select
                        value={o.status}
                        onChange={(e) => {
                          const next = e.target.value as Order['status'];
                          props.onSaveOrders(orders.map((x) => x.id === o.id ? { ...x, status: next } : x));
                          if (o.docId) void updateOrderStatus(o.docId, next);
                        }}
                        className="text-[16px] sm:text-xs font-medium border border-gray-200 bg-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#e42529] flex-1"
                        aria-label="Order status"
                      >
                        {['Placed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        onClick={() => {
                          if (!window.confirm(`Order ${o.id} delete karna hai? Ye sab devices se hat jayega.`)) return;
                          props.onSaveOrders(orders.filter((x) => x.id !== o.id));
                          if (o.docId) void deleteOrder(o.docId);
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition shrink-0"
                        aria-label="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <div className={cardCls}>
              <div className="flex gap-2 mb-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product, brand, id..." className={inputCls} />
                <button
                  onClick={() => {
                    setIsNewProduct(true);
                    setEditingProduct({ id: `prod-${Date.now()}`, name: '', brand: '', category: 'mobiles', price: 0, mrp: 0, discountPercentage: 0, rating: 4, ratingCount: 0, image: '', features: [], expressDelivery: true, inStock: true, emiStartsAt: 0, reliancePoints: 0, specs: {} });
                  }}
                  className={btnRed + ' flex items-center gap-1 shrink-0'}
                >
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
                </button>
              </div>
              <div className="space-y-1.5 max-h-[65vh] overflow-y-auto">
                {filtered.map((p) => (
                  <div key={p.id} className="flex items-center gap-2.5 border border-gray-200 rounded-lg p-2 bg-white">
                    <img src={p.image} alt={p.name} onError={onImgError} className="w-10 h-10 object-contain bg-gray-50 rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{p.name || '(no name)'}</p>
                      <p className="text-[11px] text-gray-500 truncate">{p.brand} • ₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => { setIsNewProduct(false); setEditingProduct({ ...p }); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition shrink-0" aria-label="Edit product">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => props.onSaveProducts(products.filter((x) => x.id !== p.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0" aria-label="Delete product">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && <p className="text-xs text-gray-400 text-center py-6">Kuch nahi mila. Search badlo ya naya product add karo.</p>}
              </div>

              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setEditingProduct(null)}>
                  <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-4 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold">{isNewProduct ? 'New Product' : 'Edit Product'}</h3>
                      <button onClick={() => setEditingProduct(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500" aria-label="Close"><X className="w-4 h-4" /></button>
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
                        <ImageUpload
                          label="Product photo"
                          folder="products"
                          value={editingProduct.image}
                          onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                        />
                      </div>
                      <div className="flex gap-4 text-xs font-medium bg-gray-50 rounded-lg px-3 py-2.5">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingProduct.inStock} onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} className="w-4 h-4 accent-[#e42529]" /> In stock</label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingProduct.expressDelivery} onChange={(e) => setEditingProduct({ ...editingProduct, expressDelivery: e.target.checked })} className="w-4 h-4 accent-[#e42529]" /> Express</label>
                      </div>
                      <button onClick={saveProductForm} className={btnRed + ' w-full flex items-center justify-center gap-1.5 !py-3 !text-sm'}><Check className="w-4 h-4" /> Save Product</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES */}
          {tab === 'categories' && (
            <div className="space-y-3">
              <div className={cardCls}>
                <h3 className="text-xs font-bold text-gray-900 mb-1">Categories</h3>
                <p className="text-[11px] text-gray-500 mb-3">Name + image edit karo — home strip aur categories page pe dikhega.</p>
                <div className="space-y-2">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center gap-2.5 border border-gray-200 rounded-lg p-2.5">
                      <img src={c.imageUrl} alt={c.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 grid grid-cols-1 gap-1.5 min-w-0">
                        <input value={c.name} onChange={(e) => props.onSaveCategories(categories.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))} className={inputCls} aria-label="Category name" />
                        <ImageUpload label="Category photo" folder="categories" value={c.imageUrl} onChange={(url) => props.onSaveCategories(categories.map((x) => x.id === c.id ? { ...x, imageUrl: url } : x))} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-xs font-bold text-gray-900 mb-1">Search by Categories tiles</h3>
                <p className="text-[11px] text-gray-500 mb-3">Home page ke category tiles. "Target" = category id (mobiles, tablets, laptops, televisions, audio) — jispe click karne pe products khulenge.</p>
                <div className="space-y-2">
                  {categoryTiles.map((t, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-2.5 space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1 min-w-0"><span className={labelCls}>Label</span>
                          <input value={t.label} onChange={(e) => props.onSaveCategoryTiles(categoryTiles.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className={inputCls} aria-label="Tile label" />
                        </div>
                        <button onClick={() => props.onSaveCategoryTiles(categoryTiles.filter((_, j) => j !== i))} className="self-end p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0" aria-label="Delete tile">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div><span className={labelCls}>Target category id</span>
                        <input value={t.target} onChange={(e) => props.onSaveCategoryTiles(categoryTiles.map((x, j) => j === i ? { ...x, target: e.target.value } : x))} className={inputCls} aria-label="Target category id" />
                      </div>
                      <label className="flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={!!t.span} onChange={(e) => props.onSaveCategoryTiles(categoryTiles.map((x, j) => j === i ? { ...x, span: e.target.checked } : x))} className="w-4 h-4 accent-[#e42529]" />
                        Full width (2 columns)
                      </label>
                    </div>
                  ))}
                  <button onClick={() => props.onSaveCategoryTiles([...categoryTiles, { label: 'New Category', target: 'mobiles' }])} className={btnGhost + ' flex items-center gap-1.5'}>
                    <Plus className="w-3.5 h-3.5" /> Add category tile
                  </button>
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-xs font-bold text-gray-900 mb-1">Search by Deals tiles</h3>
                <p className="text-[11px] text-gray-500 mb-3">Home page ke deals tiles. Har tile Deals page kholta hai.</p>
                <div className="space-y-2">
                  {dealTiles.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={t.label} onChange={(e) => props.onSaveDealTiles(dealTiles.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className={inputCls} aria-label="Deal tile label" />
                      <button onClick={() => props.onSaveDealTiles(dealTiles.filter((_, j) => j !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0" aria-label="Delete deal tile">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => props.onSaveDealTiles([...dealTiles, { label: 'New Deal', target: 'deals' }])} className={btnGhost + ' flex items-center gap-1.5'}>
                    <Plus className="w-3.5 h-3.5" /> Add deal tile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BANNERS */}
          {tab === 'banners' && (
            <div className="space-y-4">
              <div className={cardCls}>
                <h3 className="text-xs font-bold text-gray-900 mb-3">Landing Hero Slides <span className="text-gray-400 font-normal">(top carousel)</span></h3>
                <div className="space-y-2">
                  {slides.map((s) => (
                    <div key={s.id} className="flex items-start gap-2.5 border border-gray-200 rounded-lg p-2.5">
                      <img src={s.src} alt={s.alt} className="w-20 h-12 object-cover rounded shrink-0 bg-gray-50" />
                      <div className="flex-1 grid grid-cols-1 gap-1.5 min-w-0">
                        <input value={s.alt} onChange={(e) => props.onSaveSlides(slides.map((x) => x.id === s.id ? { ...x, alt: e.target.value } : x))} className={inputCls} aria-label="Slide text" />
                        <ImageUpload label="Laptop photo (16:5)" folder="banners" value={s.src} onChange={(url) => props.onSaveSlides(slides.map((x) => x.id === s.id ? { ...x, src: url } : x))} />
                        <ImageUpload label="Mobile photo (16:10, na ho to laptop wali lagegi)" folder="banners-mobile" value={s.mobileSrc || ''} onChange={(url) => props.onSaveSlides(slides.map((x) => x.id === s.id ? { ...x, mobileSrc: url } : x))} />
                      </div>
                      <button onClick={() => props.onSaveSlides(slides.filter((x) => x.id !== s.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0" aria-label="Delete slide"><Trash2 className="w-4 h-4" /></button>
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
                <h3 className="text-xs font-bold text-gray-900 mb-3">Hero Offer Banners</h3>
                <div className="space-y-2">
                  {banners.map((b) => (
                    <div key={b.id} className="border border-gray-200 rounded-lg p-2.5 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <img src={b.image} alt={b.title} className="w-12 h-12 object-cover rounded shrink-0 bg-gray-50" />
                        <input value={b.title} onChange={(e) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, title: e.target.value } : x))} className={inputCls} aria-label="Banner title" />
                        <button onClick={() => props.onSaveBanners(banners.filter((x) => x.id !== b.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0" aria-label="Delete banner"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <input value={b.subtitle} onChange={(e) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, subtitle: e.target.value } : x))} className={inputCls} aria-label="Banner subtitle" />
                      <div className="grid grid-cols-1 gap-2.5">
                        <div><span className={labelCls}>Badge</span><input value={b.badge} onChange={(e) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, badge: e.target.value } : x))} className={inputCls} aria-label="Banner badge" /></div>
                        <ImageUpload label="Banner photo" folder="banners" value={b.image} onChange={(url) => props.onSaveBanners(banners.map((x) => x.id === b.id ? { ...x, image: url } : x))} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="text-xs font-bold text-gray-900 mb-3">New Launch Cards</h3>
                <div className="space-y-2">
                  {launches.map((l) => (
                    <div key={l.id} className="flex items-start gap-2.5 border border-gray-200 rounded-lg p-2.5">
                      <img src={l.image} alt={l.title} className="w-10 h-10 object-contain bg-gray-50 rounded shrink-0" />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 min-w-0">
                        <input value={l.brand} onChange={(e) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, brand: e.target.value } : x))} className={inputCls} aria-label="Launch brand" />
                        <input value={l.title} onChange={(e) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, title: e.target.value } : x))} className={inputCls} aria-label="Launch title" />
                        <div className="sm:col-span-2">
                          <ImageUpload label="Launch photo" folder="launches" value={l.image} onChange={(url) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, image: url } : x))} />
                        </div>
                      </div>
                      <button onClick={() => props.onSaveLaunches(launches.filter((x) => x.id !== l.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0" aria-label="Delete launch"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OFFERS */}
          {tab === 'offers' && (
            <div className={cardCls}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-xs font-bold text-gray-900">Bank Offers ({offers.length})</h3>
                <button
                  onClick={() => props.onSaveOffers([...offers, { bank: 'New Bank', offer: 'Offer text', code: `CODE${Date.now() % 10000}`, minAmount: 10000 }])}
                  className={btnRed + ' flex items-center gap-1.5'}
                >
                  <Plus className="w-3.5 h-3.5" /> Add offer
                </button>
              </div>
              <div className="space-y-3">
                {offers.map((o) => (
                  <div key={o.code} className="border border-gray-200 rounded-lg p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
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

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition ${tab === t.id ? 'text-[#e42529]' : 'text-gray-400'}`}
          >
            {t.icon}
            <span className="text-[9px] font-semibold">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

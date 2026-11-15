import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Grid3X3, Image as ImageIcon,
  Tag, X, Plus, RotateCcw, Trash2, Pencil, ArrowLeft, Check,
  Lock, LogOut, Eye, EyeOff, ShieldCheck, Search, Filter, ExternalLink,
  TrendingUp, DollarSign, Users, CheckCircle2, Clock, AlertCircle, RefreshCw
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

const ADMIN_PASSWORD = 'mauli123';
const AUTH_KEY = 'mm_admin_auth';

function isAuthed(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

const inputCls =
  'w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] bg-white transition-colors placeholder:text-gray-400';
const labelCls = 'text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block';
const btnPrimary =
  'bg-[#2874f0] hover:bg-[#1259c7] active:scale-[0.98] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer';
const btnGhost =
  'border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-lg transition-colors active:scale-[0.98] cursor-pointer';
const cardCls = 'bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs';

const STATUS_PILL: Record<Order['status'], string> = {
  Placed: 'bg-amber-50 text-amber-800 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-800 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

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
      setErr('Too many attempts. Please try again after 1 minute.');
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
        setErr('Too many attempts. Account locked for 1 minute.');
      } else {
        setErr('Incorrect password. Please try again.');
      }
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className={`w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm ${shake ? 'animate-[shake_0.35s_ease]' : ''}`}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}`}</style>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#2874f0] text-white flex items-center justify-center mx-auto shadow-xs mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-gray-900 text-lg font-bold">Mauli Mobile Admin</h1>
          <p className="text-gray-500 text-xs mt-1">Sign in with master credentials to manage the store</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(''); }}
                placeholder="Enter password"
                autoFocus
                className="w-full text-sm bg-white border border-gray-300 rounded-lg pl-9 pr-10 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {err && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              {err}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#2874f0] hover:bg-[#1259c7] active:scale-[0.99] text-white text-sm font-bold py-3 rounded-lg transition-colors shadow-xs"
          >
            Access Admin Console
          </button>
        </form>
      </div>
    </div>
  );
}

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const { products, categories, banners, offers, launches, slides, orders, categoryTiles, dealTiles } = props;
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [q, setQ] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<'All' | Order['status']>('All');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const revenue = useMemo(() => orders.reduce((a, o) => a + o.total, 0), [orders]);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;

  const filteredProducts = useMemo(() => {
    let list = products;
    if (productCatFilter !== 'all') {
      list = list.filter((p) => p.category === productCatFilter);
    }
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)
      );
    }
    return list;
  }, [products, q, productCatFilter]);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (orderFilter !== 'All') {
      list = list.filter((o) => o.status === orderFilter);
    }
    const s = orderQuery.trim().toLowerCase();
    if (s) {
      list = list.filter((o) =>
        o.id.toLowerCase().includes(s) ||
        o.name.toLowerCase().includes(s) ||
        o.phone.toLowerCase().includes(s) ||
        o.city.toLowerCase().includes(s)
      );
    }
    return list;
  }, [orders, orderQuery, orderFilter]);

  const syncOrders = () => {
    setIsSyncing(true);
    fetchOrders().then((cloud) => {
      setIsSyncing(false);
      if (!cloud) return;
      const localIds = new Set(orders.map((o) => o.id));
      const merged = [...orders, ...cloud.filter((o) => !localIds.has(o.id))]
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      saveOrders(merged);
      props.onSaveOrders(merged);
    }).catch(() => setIsSyncing(false));
  };

  useEffect(() => {
    if (!authed) return;
    syncOrders();
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
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', count: orders.length, icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'products', label: 'Products', count: products.length, icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'banners', label: 'Banners & Hero', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'offers', label: 'Bank Offers', icon: <Tag className="w-4 h-4" /> },
  ];

  const stats = [
    { l: 'Total Revenue', v: `₹${revenue.toLocaleString('en-IN')}`, sub: `${orders.length} orders recorded`, icon: <DollarSign className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' },
    { l: 'Total Orders', v: String(orders.length), sub: 'Across all channels', icon: <ShoppingCart className="w-4 h-4 text-[#2874f0]" />, bg: 'bg-blue-50' },
    { l: 'Avg Order Value', v: `₹${aov.toLocaleString('en-IN')}`, sub: 'Per checkout', icon: <TrendingUp className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50' },
    { l: 'Live Catalog', v: String(products.length), sub: `${categories.length} active categories`, icon: <Package className="w-4 h-4 text-purple-600" />, bg: 'bg-purple-50' },
  ];

  const saveProductForm = () => {
    if (!editingProduct) return;
    const priceNum = Number(editingProduct.price) || 0;
    const mrpNum = Number(editingProduct.mrp) || priceNum;
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
    const p: Product = {
      ...editingProduct,
      price: priceNum,
      mrp: mrpNum,
      discountPercentage: discount,
    };
    if (isNewProduct) props.onSaveProducts([p, ...products]);
    else props.onSaveProducts(products.map((x) => (x.id === p.id ? p : x)));
    setEditingProduct(null);
    setIsNewProduct(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-24 md:pb-12 text-[#212121]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={props.onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
              title="Return to Customer Store"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-gray-900">
                Mauli <span className="text-[#2874f0]">Admin Hub</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ● Live Sync
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={syncOrders}
              disabled={isSyncing}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
              title="Sync latest orders from Cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#2874f0]' : ''}`} />
              <span>{isSyncing ? 'Syncing…' : 'Sync Orders'}</span>
            </button>

            <button
              onClick={props.onClose}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#2874f0] border border-blue-200 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Store
            </button>

            <button
              onClick={props.onResetAll}
              title="Reset everything to factory defaults"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-[210px_1fr] gap-4 sm:gap-6 items-start">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col gap-1 sticky top-20 bg-white rounded-xl border border-gray-200 p-2 shadow-xs">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
                  active
                    ? 'bg-[#2874f0] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {t.icon}
                <span className="flex-1">{t.label}</span>
                {typeof t.count === 'number' && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main className="min-w-0 space-y-4">
          
          {/* TAB 1: DASHBOARD / OVERVIEW */}
          {tab === 'dashboard' && (
            <div className="space-y-4">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.l} className={cardCls}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.l}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg}`}>
                        {s.icon}
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{s.v}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Quick Shortcuts:</span>
                  <button
                    onClick={() => {
                      setTab('products');
                      setIsNewProduct(true);
                      setEditingProduct({
                        id: `prod-${Date.now()}`,
                        name: '',
                        brand: '',
                        category: 'mobiles',
                        price: 0,
                        mrp: 0,
                        discountPercentage: 0,
                        rating: 4.5,
                        ratingCount: 10,
                        image: '',
                        features: [],
                        expressDelivery: true,
                        inStock: true,
                        emiStartsAt: 0,
                        reliancePoints: 0,
                        specs: {},
                      });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#2874f0] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Product
                  </button>

                  <button
                    onClick={() => setTab('banners')}
                    className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Update Banners
                  </button>
                </div>

                <button
                  onClick={() => setTab('orders')}
                  className="text-xs font-bold text-[#2874f0] hover:underline flex items-center gap-1"
                >
                  Manage All Orders →
                </button>
              </div>

              {/* Recent Orders List */}
              <div className={cardCls}>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#2874f0]" />
                    Recent Customer Orders
                  </h3>
                  <span className="text-xs text-gray-400 font-semibold">{orders.length} total</span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    No orders placed yet. Orders from checkout will appear here in real-time.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-gray-900">#{o.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_PILL[o.status]}`}>
                              {o.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {o.name} • {o.city} • {o.items.length} item(s) • {new Date(o.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-extrabold text-gray-900">
                            ₹{o.total.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => setTab('orders')}
                            className="text-xs font-bold text-[#2874f0] hover:underline"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {tab === 'orders' && (
            <div className={cardCls + ' space-y-4'}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Order Management</h2>
                  <p className="text-xs text-gray-500">Track and update customer fulfillment status</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="Search ID, customer, city..."
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>
                </div>
              </div>

              {/* Order Status Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {(['All', 'Placed', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition shrink-0 ${
                      orderFilter === st
                        ? 'bg-[#2874f0] text-white border-[#2874f0]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {st} {st === 'All' ? `(${orders.length})` : `(${orders.filter((x) => x.status === st).length})`}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    No orders matching your criteria.
                  </div>
                ) : (
                  filteredOrders.map((o) => (
                    <div key={o.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-sm font-bold text-gray-900">#{o.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_PILL[o.status]}`}>
                            {o.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-[#2874f0]">₹{o.total.toLocaleString('en-IN')}</span>
                          <span className="text-[11px] text-gray-400 block">{new Date(o.date).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                        <div>
                          <span className="text-gray-400 font-semibold block text-[10px] uppercase">Customer</span>
                          <span className="font-bold text-gray-900">{o.name}</span>
                          <span className="text-gray-600 block">Phone: +91 {o.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block text-[10px] uppercase">Shipping Address</span>
                          <span className="text-gray-700">{o.address}, {o.city} - {o.pincode}</span>
                          <span className="text-gray-500 block text-[11px] font-medium mt-0.5">Mode: {o.payment}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                        {o.items.map((it) => (
                          <div key={it.id} className="flex items-center gap-2 shrink-0 border border-gray-100 rounded-lg p-2 bg-gray-50">
                            <img src={it.image} alt={it.name} onError={onImgError} className="w-9 h-9 object-contain bg-white rounded border border-gray-100 p-0.5" />
                            <div className="text-[11px]">
                              <p className="font-bold text-gray-900 max-w-[150px] truncate">{it.name}</p>
                              <p className="text-gray-500">Qty: {it.quantity} • ₹{(it.price * it.quantity).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status Selector & Actions */}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <span className="text-xs font-bold text-gray-600 shrink-0">Update Status:</span>
                          <select
                            value={o.status}
                            onChange={(e) => {
                              const next = e.target.value as Order['status'];
                              props.onSaveOrders(orders.map((x) => x.id === o.id ? { ...x, status: next } : x));
                              if (o.docId) void updateOrderStatus(o.docId, next);
                            }}
                            className="text-xs font-bold border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2874f0] w-full"
                          >
                            {(['Placed', 'Shipped', 'Delivered', 'Cancelled'] as const).map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => {
                            if (!window.confirm(`Delete order #${o.id}? This cannot be undone.`)) return;
                            props.onSaveOrders(orders.filter((x) => x.id !== o.id));
                            if (o.docId) void deleteOrder(o.docId);
                          }}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS CATALOG */}
          {tab === 'products' && (
            <div className={cardCls + ' space-y-4'}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Products Catalog ({products.length})</h2>
                  <p className="text-xs text-gray-500">Add, edit pricing, specs or delete catalog items</p>
                </div>

                <button
                  onClick={() => {
                    setIsNewProduct(true);
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: '',
                      brand: '',
                      category: 'mobiles',
                      price: 0,
                      mrp: 0,
                      discountPercentage: 0,
                      rating: 4.5,
                      ratingCount: 15,
                      image: '',
                      features: [],
                      expressDelivery: true,
                      inStock: true,
                      emiStartsAt: 0,
                      reliancePoints: 0,
                      specs: {},
                    });
                  }}
                  className={btnPrimary + ' flex items-center gap-1.5 self-start sm:self-auto'}
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by product name, brand, or id..."
                    className={inputCls + ' !pl-9'}
                  />
                </div>

                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="text-xs font-bold border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-[#2874f0]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Product Grid / List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[68vh] overflow-y-auto pr-1">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-xl p-3 bg-white hover:border-gray-300 transition-all flex gap-3 items-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={onImgError}
                      className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{p.brand}</span>
                        {p.inStock ? (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">In Stock</span>
                        ) : (
                          <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">Out of Stock</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">{p.name || '(Unnamed product)'}</h4>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-sm font-extrabold text-gray-900">₹{p.price.toLocaleString('en-IN')}</span>
                        {p.mrp > p.price && (
                          <span className="text-[11px] text-gray-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => { setIsNewProduct(false); setEditingProduct({ ...p }); }}
                        className="p-1.5 text-gray-500 hover:text-[#2874f0] hover:bg-blue-50 rounded transition"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (!window.confirm(`Delete ${p.name}?`)) return;
                          props.onSaveProducts(products.filter((x) => x.id !== p.id));
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Edit / Add Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setEditingProduct(null)}>
                  <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 max-h-[92vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900">
                        {isNewProduct ? 'Add New Product' : 'Edit Product Details'}
                      </h3>
                      <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className={labelCls}>Product Title *</label>
                        <input
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          placeholder="e.g. Samsung Galaxy S25 Ultra 5G"
                          className={inputCls}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Brand</label>
                          <input
                            value={editingProduct.brand}
                            onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            placeholder="e.g. Samsung"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Category</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className={inputCls}
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Selling Price (₹) *</label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>MRP (₹)</label>
                          <input
                            type="number"
                            value={editingProduct.mrp}
                            onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <ImageUpload
                          label="Product Photo"
                          folder="products"
                          value={editingProduct.image}
                          onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                        />
                      </div>

                      <div className="flex gap-4 p-3 bg-gray-50 rounded-lg text-xs font-semibold text-gray-700">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.inStock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                            className="w-4 h-4 accent-[#2874f0]"
                          />
                          In Stock
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.expressDelivery}
                            onChange={(e) => setEditingProduct({ ...editingProduct, expressDelivery: e.target.checked })}
                            className="w-4 h-4 accent-[#2874f0]"
                          />
                          Express 3-Hour Delivery
                        </label>
                      </div>

                      <button
                        onClick={saveProductForm}
                        className={btnPrimary + ' w-full py-3 text-sm flex items-center justify-center gap-2'}
                      >
                        <Check className="w-4 h-4" /> Save Product
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CATEGORIES & TILES */}
          {tab === 'categories' && (
            <div className="space-y-4">
              <div className={cardCls}>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Store Categories</h3>
                <p className="text-xs text-gray-500 mb-4">Edit category names and visual badges across the storefront</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((c) => (
                    <div key={c.id} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-white">
                      <img src={c.imageUrl} alt={c.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100" />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <input
                          value={c.name}
                          onChange={(e) => props.onSaveCategories(categories.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))}
                          className={inputCls}
                          aria-label="Category name"
                        />
                        <ImageUpload
                          label="Change Photo"
                          folder="categories"
                          value={c.imageUrl}
                          onChange={(url) => props.onSaveCategories(categories.map((x) => x.id === c.id ? { ...x, imageUrl: url } : x))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Tiles */}
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Home Category Tiles</h3>
                    <p className="text-xs text-gray-500">Interactive quick category links on homepage</p>
                  </div>
                  <button
                    onClick={() => props.onSaveCategoryTiles([...categoryTiles, { label: 'New Category', target: 'mobiles' }])}
                    className={btnGhost + ' flex items-center gap-1.5'}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Tile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryTiles.map((t, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">Tile #{i + 1}</span>
                        <button
                          onClick={() => props.onSaveCategoryTiles(categoryTiles.filter((_, j) => j !== i))}
                          className="text-gray-400 hover:text-red-600 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        value={t.label}
                        onChange={(e) => props.onSaveCategoryTiles(categoryTiles.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                        placeholder="Tile Label"
                        className={inputCls}
                      />
                      <input
                        value={t.target}
                        onChange={(e) => props.onSaveCategoryTiles(categoryTiles.map((x, j) => j === i ? { ...x, target: e.target.value } : x))}
                        placeholder="Target category id (e.g. mobiles)"
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BANNERS & SLIDES */}
          {tab === 'banners' && (
            <div className="space-y-4">
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Top Carousel Slides</h3>
                    <p className="text-xs text-gray-500">Hero banner images on homepage</p>
                  </div>
                  <button
                    onClick={() => props.onSaveSlides([...slides, { id: `slide-${Date.now()}`, src: '', mobileSrc: '', alt: 'New banner' }])}
                    className={btnGhost + ' flex items-center gap-1.5'}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slide
                  </button>
                </div>

                <div className="space-y-3">
                  {slides.map((s) => (
                    <div key={s.id} className="border border-gray-200 rounded-xl p-3.5 bg-white flex flex-col sm:flex-row gap-3 items-start">
                      <img src={s.src} alt={s.alt} className="w-full sm:w-40 h-24 object-cover rounded-lg bg-gray-50 shrink-0 border border-gray-100" />
                      <div className="flex-1 w-full space-y-2">
                        <input
                          value={s.alt}
                          onChange={(e) => props.onSaveSlides(slides.map((x) => x.id === s.id ? { ...x, alt: e.target.value } : x))}
                          placeholder="Banner Headline"
                          className={inputCls}
                        />
                        <ImageUpload
                          label="Desktop Banner (16:5)"
                          folder="banners"
                          value={s.src}
                          onChange={(url) => props.onSaveSlides(slides.map((x) => x.id === s.id ? { ...x, src: url, mobileSrc: url } : x))}
                        />
                      </div>
                      <button
                        onClick={() => props.onSaveSlides(slides.filter((x) => x.id !== s.id))}
                        className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 self-end sm:self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Launch Cards */}
              <div className={cardCls}>
                <h3 className="text-sm font-bold text-gray-900 mb-1">New Launch Cards</h3>
                <p className="text-xs text-gray-500 mb-3">Showcased flagship phone launch teasers</p>
                <div className="space-y-3">
                  {launches.map((l) => (
                    <div key={l.id} className="border border-gray-200 rounded-xl p-3 bg-white flex flex-col sm:flex-row gap-3 items-start">
                      <img src={l.image} alt={l.title} className="w-14 h-14 object-contain bg-gray-50 rounded-lg p-1 shrink-0" />
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          value={l.brand}
                          onChange={(e) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, brand: e.target.value } : x))}
                          className={inputCls}
                          placeholder="Brand"
                        />
                        <input
                          value={l.title}
                          onChange={(e) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, title: e.target.value } : x))}
                          className={inputCls}
                          placeholder="Title"
                        />
                        <div className="sm:col-span-2">
                          <ImageUpload
                            label="Launch Product Image"
                            folder="launches"
                            value={l.image}
                            onChange={(url) => props.onSaveLaunches(launches.map((x) => x.id === l.id ? { ...x, image: url } : x))}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => props.onSaveLaunches(launches.filter((x) => x.id !== l.id))}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BANK OFFERS */}
          {tab === 'offers' && (
            <div className={cardCls + ' space-y-4'}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Bank Offers &amp; Instant Cashbacks</h3>
                  <p className="text-xs text-gray-500">Displayed on PDP and checkout pages</p>
                </div>
                <button
                  onClick={() => props.onSaveOffers([...offers, { bank: 'HDFC Bank', offer: 'Flat ₹1,500 off on Credit Cards', code: `BANK${Date.now() % 1000}`, minAmount: 15000 }])}
                  className={btnPrimary + ' flex items-center gap-1.5'}
                >
                  <Plus className="w-4 h-4" /> Add Offer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offers.map((o) => (
                  <div key={o.code} className="border border-gray-200 rounded-xl p-3.5 bg-white space-y-2 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-900">{o.bank}</span>
                      <button
                        onClick={() => props.onSaveOffers(offers.filter((x) => x.code !== o.code))}
                        className="text-gray-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      value={o.bank}
                      onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, bank: e.target.value } : x))}
                      placeholder="Bank Name"
                      className={inputCls}
                    />
                    <input
                      value={o.offer}
                      onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, offer: e.target.value } : x))}
                      placeholder="Offer Description"
                      className={inputCls}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={o.code}
                        onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, code: e.target.value } : x))}
                        placeholder="Code"
                        className={inputCls}
                      />
                      <input
                        type="number"
                        value={o.minAmount}
                        onChange={(e) => props.onSaveOffers(offers.map((x) => x.code === o.code ? { ...x, minAmount: Number(e.target.value) } : x))}
                        placeholder="Min Order ₹"
                        className={inputCls}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation for Admin */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex justify-around py-1.5 shadow-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center justify-center p-1.5 text-[10px] font-bold transition ${
              tab === t.id ? 'text-[#2874f0]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.icon}
            <span className="mt-0.5">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

import { Product, Category, Banner, BankOffer } from '../types';
import { CATEGORIES, PRODUCTS, BANNERS, BANK_OFFERS, NewLaunchItem, NEW_LAUNCHES } from './mockData';
import { LANDING_SLIDES, LandingSlide } from '../components/LandingHero';

const K = {
  categories: 'mm_admin_categories',
  products: 'mm_admin_products',
  banners: 'mm_admin_banners',
  offers: 'mm_admin_offers',
  launches: 'mm_admin_launches',
  slides: 'mm_admin_slides',
  categoryTiles: 'mm_admin_category_tiles',
  dealTiles: 'mm_admin_deal_tiles',
  orders: 'mm_orders',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed as T) ?? fallback;
  } catch {
    return fallback;
  }
}

/** Khali/adhuri entries (bina photo wali) hatao — carousel kabhi tootega nahi. */
function valid<T>(list: T[] | null | undefined, hasImage: (x: T) => boolean): T[] {
  if (!Array.isArray(list)) return [];
  return list.filter((x) => x && hasImage(x));
}

export const sanitizeSlides = (v: unknown): LandingSlide[] => {
  const clean = valid(v as LandingSlide[], (s) => Boolean(s?.src));
  return clean.length > 0 ? clean : LANDING_SLIDES;
};

export const sanitizeBanners = (v: unknown): Banner[] => {
  const clean = valid(v as Banner[], (b) => Boolean(b?.image));
  return clean.length > 0 ? clean : BANNERS;
};

export const sanitizeLaunches = (v: unknown): NewLaunchItem[] => {
  const clean = valid(v as NewLaunchItem[], (l) => Boolean(l?.image));
  return clean.length > 0 ? clean : NEW_LAUNCHES;
};

export const sanitizeCategories = (v: unknown): Category[] => {
  const clean = valid(v as Category[], (c) => Boolean(c?.imageUrl));
  return clean.length > 0 ? clean : CATEGORIES;
};

function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch { /* noop */ }
}

// ---- Image URL repairs ----
// Oct 2026 catalog shipped some dead gsmarena slugs; saved localStorage / cloud
// copies may still carry them. Map old URL -> working URL on every load, so
// returning visitors don't keep seeing broken product photos.
const DEAD_IMAGE_FIX: Record<string, string> = {
  'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-air.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-air.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6-pro-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6-pro.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8-ultra-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8-ultra-r1.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip8-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip8.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold7-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold7.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip7-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip7.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-fe-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-fe.jpg',
  // These two slugs were shared across product families in old data —
  // id prefix below decides the best replacement.
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg',
  'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-5g.jpg': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-sm-s931.jpg',
};

// Per-model image repairs for saved localStorage / cloud copies (id prefix gated,
// because the shared family URLs are still correct for other products).
const M = 'https://fdn2.gsmarena.com/vv/bigpic/';
const ID_IMAGE_FIX: { prefix: string; dead: string; url: string }[] = [
  { prefix: 'sam-s26ultra', dead: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-5g.jpg', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra.jpg' },
  { prefix: 'sam-s26plus', dead: M + 'samsung-galaxy-s26.jpg', url: M + 'samsung-galaxy-s26-plus.jpg' },
  { prefix: 'sam-s26', dead: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-5g.jpg', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26.jpg' },
  { prefix: 'sam-s25edge', dead: M + 'samsung-galaxy-s25-sm-s931.jpg', url: M + 'samsung-galaxy-s25-edge.jpg' },
  { prefix: 'sam-a06', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a06-5g.jpg' },
  { prefix: 'sam-a07', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a07.jpg' },
  { prefix: 'sam-a08', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a08.jpg' },
  { prefix: 'sam-a17', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a17.jpg' },
  { prefix: 'sam-a26', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a26.jpg' },
  { prefix: 'sam-a27', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a27.jpg' },
  { prefix: 'sam-a37', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a37.jpg' },
  { prefix: 'sam-a57', dead: M + 'samsung-galaxy-a16-5g.jpg', url: M + 'samsung-galaxy-a57.jpg' },
  { prefix: 'sam-f06', dead: M + 'samsung-galaxy-f16-5g.jpg', url: M + 'samsung-galaxy-f06-5g.jpg' },
  { prefix: 'sam-f07', dead: M + 'samsung-galaxy-f16-5g.jpg', url: M + 'samsung-galaxy-f07.jpg' },
  { prefix: 'sam-f17', dead: M + 'samsung-galaxy-f16-5g.jpg', url: M + 'samsung-galaxy-f17-5g.jpg' },
  { prefix: 'sam-f36', dead: M + 'samsung-galaxy-f16-5g.jpg', url: M + 'samsung-galaxy-f36.jpg' },
  { prefix: 'sam-f56', dead: M + 'samsung-galaxy-f16-5g.jpg', url: M + 'samsung-galaxy-f56-5g.jpg' },
  { prefix: 'oppo-a6c', dead: M + 'oppo-a6x.jpg', url: M + 'oppo-a6c.jpg' },
  { prefix: 'oppo-f33pro', dead: M + 'oppo-reno13-cn.jpg', url: M + 'oppo-f33-pro.jpg' },
  { prefix: 'oppo-f33', dead: M + 'oppo-reno13-cn.jpg', url: M + 'oppo-f33.jpg' },
  { prefix: 'oppo-f35pro', dead: M + 'oppo-reno13-cn.jpg', url: M + 'oppo-f35-pro.jpg' },
  { prefix: 'oppo-reno15pro-', dead: M + 'oppo-reno13-cn.jpg', url: M + 'oppo-reno15-pro.jpg' },
  { prefix: 'oppo-reno15-', dead: M + 'oppo-reno13-cn.jpg', url: M + 'oppo-reno15.jpg' },
  { prefix: 'oppo-reno16-', dead: M + 'oppo-reno13-cn.jpg', url: M + 'oppo-reno16.jpg' },
  { prefix: 'oppo-findx9pro', dead: M + 'oppo-find-x8-pro.jpg', url: M + 'oppo-find-x9-pro.jpg' },
  { prefix: 'oppo-findx9s', dead: M + 'oppo-find-x8-pro.jpg', url: M + 'oppo-find-x9s.jpg' },
  { prefix: 'oppo-findx9-', dead: M + 'oppo-find-x8-pro.jpg', url: M + 'oppo-find-x9.jpg' },
  { prefix: 'oppo-findx10promax', dead: M + 'oppo-find-x8-pro.jpg', url: M + 'oppo-find-x10-pro-max.jpg' },
  { prefix: 'oppo-findx10-', dead: M + 'oppo-find-x8-pro.jpg', url: M + 'oppo-find-x10.jpg' },
  { prefix: 'oppo-pad5', dead: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80', url: M + 'oppo-pad5.jpg' },
  { prefix: 'iphone-17e', dead: M + 'apple-iphone-16e.jpg', url: M + 'apple-iphone-17e.jpg' },
  { prefix: 'vivo-y21', dead: M + 'vivo-y05.jpg', url: M + 'vivo-y21s.jpg' },
  { prefix: 'vivo-y11', dead: M + 'vivo-y05.jpg', url: M + 'vivo-y11.jpg' },
  { prefix: 'pixel-10-frost', dead: M + 'google-pixel-10-pro-.jpg', url: M + 'google-pixel-10-.jpg' },
  { prefix: 'pixel-10-indigo', dead: M + 'google-pixel-10-pro-.jpg', url: M + 'google-pixel-10-.jpg' },
  { prefix: 'pixel-10-obsidian', dead: M + 'google-pixel-10-pro-.jpg', url: M + 'google-pixel-10-.jpg' },
];

/** Rewrite a dead catalog image URL. Custom admin uploads pass through untouched. */
export function fixImageUrl(url: string | undefined, productId = ''): string {
  const u = url || '';
  for (const f of ID_IMAGE_FIX) {
    if (u === f.dead && productId.startsWith(f.prefix)) return f.url;
  }
  return DEAD_IMAGE_FIX[u] || u;
}

export const fixProductImages = (list: Product[]): Product[] =>
  list.map((p) => (p?.image ? { ...p, image: fixImageUrl(p.image, p.id) } : p));

export const loadCategories = (): Category[] => sanitizeCategories(read(K.categories, null));
export const saveCategories = (v: Category[]) => write(K.categories, v);

export const loadProducts = (): Product[] => {
  const v = read<Product[] | null>(K.products, null);
  if (!v || v.length === 0) return PRODUCTS;
  // Merge: stored wins, but new default IDs (Oct2026 catalog) auto-added
  try {
    const seen = new Set(v.map((p) => p.id));
    const missing = PRODUCTS.filter((p) => !seen.has(p.id));
    return fixProductImages(missing.length > 0 ? [...missing, ...v] : v);
  } catch {
    return fixProductImages(v);
  }
};
export const saveProducts = (v: Product[]) => write(K.products, v);

export const loadBanners = (): Banner[] => sanitizeBanners(read(K.banners, null));
export const saveBanners = (v: Banner[]) => write(K.banners, v);

export const loadOffers = (): BankOffer[] => read(K.offers, BANK_OFFERS);
export const saveOffers = (v: BankOffer[]) => write(K.offers, v);

export const loadLaunches = (): NewLaunchItem[] => sanitizeLaunches(read(K.launches, null));
export const saveLaunches = (v: NewLaunchItem[]) => write(K.launches, v);

export const loadSlides = (): LandingSlide[] => sanitizeSlides(read(K.slides, null));
export const saveSlides = (v: LandingSlide[]) => write(K.slides, v);

export interface OrderItem { id: string; name: string; brand: string; price: number; quantity: number; image: string; }
export interface ShopTile { label: string; target: string; span?: boolean; }

export const DEFAULT_CATEGORY_TILES: ShopTile[] = [
  { label: 'Mobiles', target: 'mobiles' },
  { label: 'Tablets', target: 'tablets' },
  { label: "Tv's", target: 'televisions' },
  { label: 'Laptops', target: 'laptops' },
  { label: 'ACs', target: 'airconditioners' },
  { label: 'All Products', target: 'all', span: true },
];

export const DEFAULT_DEAL_TILES: ShopTile[] = [
  { label: 'Super Deals', target: 'deals' },
  { label: 'Discounts', target: 'deals' },
  { label: 'Brand Offers', target: 'deals' },
  { label: 'Instant Discounts', target: 'deals' },
  { label: 'Cashbacks', target: 'deals' },
  { label: 'Bank offers', target: 'deals' },
];

export const loadCategoryTiles = (): ShopTile[] => {
  const v = read<ShopTile[] | null>(K.categoryTiles, null);
  return Array.isArray(v) && v.length > 0 ? v : DEFAULT_CATEGORY_TILES;
};
export const saveCategoryTiles = (v: ShopTile[]) => write(K.categoryTiles, v);

export const loadDealTiles = (): ShopTile[] => {
  const v = read<ShopTile[] | null>(K.dealTiles, null);
  return Array.isArray(v) && v.length > 0 ? v : DEFAULT_DEAL_TILES;
};
export const saveDealTiles = (v: ShopTile[]) => write(K.dealTiles, v);

export interface Order {
  id: string;
  /** Firestore document id — cloud status update/delete ke liye. Local orders me nahi hota. */
  docId?: string;
  date: string;
  items: OrderItem[];
  total: number;
  mrpTotal: number;
  payment: string;
  status: 'Placed' | 'Shipped' | 'Delivered' | 'Cancelled';
  name: string;
  phone: string;
  city: string;
  pincode: string;
  address: string;
}

export const loadOrders = (): Order[] => {
  const list = read<Order[]>(K.orders, []);
  return list.map((o) => ({
    ...o,
    items: (o.items || []).map((it) =>
      DEAD_IMAGE_FIX[it.image] ? { ...it, image: fixImageUrl(it.image, it.id) } : it
    ),
  }));
};
export const saveOrders = (v: Order[]) => write(K.orders, v);

export const resetAllAdmin = () => {
  [K.categories, K.products, K.banners, K.offers, K.launches, K.slides, K.categoryTiles, K.dealTiles].forEach((k) => {
    try { localStorage.removeItem(k); } catch { /* noop */ }
  });
};

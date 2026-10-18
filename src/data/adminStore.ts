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

const ID_IMAGE_FIX: { prefix: string; dead: string; url: string }[] = [
  { prefix: 'sam-s26ultra', dead: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-5g.jpg', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra.jpg' },
  { prefix: 'sam-s26', dead: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-5g.jpg', url: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26.jpg' },
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
  list.map((p) => (p?.image && DEAD_IMAGE_FIX[p.image] ? { ...p, image: fixImageUrl(p.image, p.id) } : p));

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
export interface Order {
  id: string;
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
  [K.categories, K.products, K.banners, K.offers, K.launches, K.slides].forEach((k) => {
    try { localStorage.removeItem(k); } catch { /* noop */ }
  });
};

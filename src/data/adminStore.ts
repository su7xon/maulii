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

export const loadCategories = (): Category[] => sanitizeCategories(read(K.categories, null));
export const saveCategories = (v: Category[]) => write(K.categories, v);

export const loadProducts = (): Product[] => {
  const v = read<Product[] | null>(K.products, null);
  return v && v.length > 0 ? v : PRODUCTS;
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

export const loadOrders = (): Order[] => read<Order[]>(K.orders, []);
export const saveOrders = (v: Order[]) => write(K.orders, v);

export const resetAllAdmin = () => {
  [K.categories, K.products, K.banners, K.offers, K.launches, K.slides].forEach((k) => {
    try { localStorage.removeItem(k); } catch { /* noop */ }
  });
};

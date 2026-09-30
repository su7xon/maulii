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

function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch { /* noop */ }
}

export const loadCategories = (): Category[] => read(K.categories, CATEGORIES);
export const saveCategories = (v: Category[]) => write(K.categories, v);

export const loadProducts = (): Product[] => {
  const v = read<Product[] | null>(K.products, null);
  return v && v.length > 0 ? v : PRODUCTS;
};
export const saveProducts = (v: Product[]) => write(K.products, v);

export const loadBanners = (): Banner[] => read(K.banners, BANNERS);
export const saveBanners = (v: Banner[]) => write(K.banners, v);

export const loadOffers = (): BankOffer[] => read(K.offers, BANK_OFFERS);
export const saveOffers = (v: BankOffer[]) => write(K.offers, v);

export const loadLaunches = (): NewLaunchItem[] => read(K.launches, NEW_LAUNCHES);
export const saveLaunches = (v: NewLaunchItem[]) => write(K.launches, v);

export const loadSlides = (): LandingSlide[] => read(K.slides, LANDING_SLIDES);
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

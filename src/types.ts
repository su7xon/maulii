export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  rating: number;
  ratingCount: number;
  image: string;
  additionalImages?: string[];
  features: string[];
  expressDelivery: boolean;
  inStock: boolean;
  emiStartsAt: number;
  badge?: string;
  offerRibbon?: string;
  bestPrice?: number;
  phoneGraphicSpecs?: string[];
  specs: { [key: string]: string };
  reliancePoints: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
  bannerImage?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  bgGradient: string;
  accentColor: string;
  image: string;
  tag: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWarranty?: boolean;
}

export interface BankOffer {
  bank: string;
  offer: string;
  code: string;
  minAmount: number;
}

export interface FilterState {
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'discount' | 'rating';
  expressOnly: boolean;
}

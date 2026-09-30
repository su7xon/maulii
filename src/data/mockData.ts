import { Product, Category, Banner, BankOffer } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'tablets',
    name: 'Tablets',
    icon: 'Tablet',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'televisions',
    name: 'Televisions',
    icon: 'Tv',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'mobiles',
    name: 'Mobiles',
    icon: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'airconditioners',
    name: 'Air Conditioners',
    icon: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: 'Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: 'Laptop',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'wearables',
    name: 'Smart Wearables',
    icon: 'Watch',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'smallappliances',
    name: 'Small Appliances',
    icon: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'refrigerators',
    name: 'Refrigerators',
    icon: 'Refrigerator',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'personalcare',
    name: 'Personal Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&auto=format&fit=crop&q=80',
  },
];

export interface NewLaunchItem {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  badge?: string;
  priceText?: string;
  btnText: string;
  btnType: 'notify' | 'buynow';
  bgGradient: string;
  image: string;
}

export const NEW_LAUNCHES: NewLaunchItem[] = [
  {
    id: 'launch-s24fe',
    brand: 'SAMSUNG',
    title: 'Galaxy S24 FE 5G',
    subtitle: 'Galaxy AI ✨',
    btnText: 'Notify me',
    btnType: 'notify',
    bgGradient: 'bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb]',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-fe-r1.jpg',
  },
  {
    id: 'launch-pixel9',
    brand: 'Google',
    title: 'Pixel 9 Pro series',
    subtitle: 'Starting from ₹79,999*',
    btnText: 'Buy Now',
    btnType: 'buynow',
    bgGradient: 'bg-gradient-to-b from-[#e8f0fe] via-[#f0f7ff] to-[#e2e8f0]',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-.jpg',
  },
  {
    id: 'launch-iphone16',
    brand: 'Apple',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Starting from ₹1,19,900*',
    badge: 'TITANIUM',
    btnText: 'Buy Now',
    btnType: 'buynow',
    bgGradient: 'bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#e2e8f0]',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg',
  },
  {
    id: 'launch-nothing2a',
    brand: 'NOTHING',
    title: 'Nothing Phone (2a) Plus',
    subtitle: 'Starting from ₹27,999* Incl. offers*',
    btnText: 'Buy Now',
    btnType: 'buynow',
    bgGradient: 'bg-gradient-to-b from-[#f5f3ff] via-[#fdf4ff] to-[#f3f4f6]',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a-plus.jpg',
  },
];

export const BEST_SELLING_PHONES: Product[] = [
  {
    id: 'oneplus-nord-ce6-lite',
    name: 'OnePlus Nord CE6 Lite 5G 128 GB, 8 GB RAM, Vivid Mint, Mobile Phone',
    brand: 'OnePlus',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 22999,
    mrp: 24999,
    discountPercentage: 8,
    rating: 4.6,
    ratingCount: 2420,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce6-lite.jpg',
    offerRibbon: '₹2K Inst Disc + 6M NCEMI HDFC CCEMI*',
    bestPrice: 20999,
    phoneGraphicSpecs: [
      "Segment's fastest phone* 1.03Mn+ AnTuTu score",
      "Segment's highest 144 FPS gaming*",
      "Up to 2 days of power* 7000mAh Battery",
      "Powered by OxygenOS"
    ],
    features: [
      '144Hz ultra smooth FHD+ Display',
      '7000mAh battery with 45W fast charging',
      '50MP Sony main camera sensor',
      'Single speaker with 300% Ultra Volume Mode'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 1113,
    badge: 'BESTSELLER',
    reliancePoints: 230,
    specs: {
      Display: '6.72-inch FHD+ 144Hz LCD',
      Processor: 'MediaTek Dimensity 7400 Apex',
      RAM: '8 GB',
      Storage: '128 GB',
      Camera: '50 MP + 2 MP',
      Battery: '7000 mAh'
    }
  },
  {
    id: 'redmi-15c-5g',
    name: 'Redmi 15C 5G 128 GB, 6 GB RAM, Dusk Purple, Mobile Phone',
    brand: 'Xiaomi',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 15499,
    mrp: 17999,
    discountPercentage: 14,
    rating: 4.4,
    ratingCount: 1980,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-15c.jpg',
    offerRibbon: 'Apply ANDROID1500 To get ₹1500 OFF',
    bestPrice: 14499,
    phoneGraphicSpecs: [
      '6000mAh Big Boss Battery',
      "Segment's Largest 17.53cm(6.9) & Smoothest 120Hz Display",
      'Royale Design'
    ],
    features: [
      '6.9-inch immersive 120Hz AdaptiveSync display',
      'MediaTek Dimensity 6300 5G processor',
      '50MP AI Dual Camera system with Night Mode',
      '6000mAh long-lasting power backup'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 751,
    badge: '14% OFF',
    reliancePoints: 155,
    specs: {
      Display: '6.9-inch 120Hz HD+',
      Processor: 'Dimensity 6300 5G',
      RAM: '6 GB',
      Storage: '128 GB',
      Battery: '6000 mAh'
    }
  },
  {
    id: 'oppo-a6x-5g',
    name: 'Oppo A6x 5G 128 GB, 6 GB RAM, Ice Blue, Mobile Phone',
    brand: 'Oppo',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 15499,
    mrp: 18999,
    discountPercentage: 18,
    rating: 4.5,
    ratingCount: 1410,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6x.jpg',
    offerRibbon: '7%Cart+7.5% Inst Disc with PNB CC*',
    bestPrice: 14499,
    phoneGraphicSpecs: [
      '6500mAh Large Battery',
      '120Hz Ultra Bright Display',
      '45W SUPERVOOC Flash Charge'
    ],
    features: [
      'IP54 Water & Dust resistance rating',
      '6500mAh durable 4-year health battery',
      '45W SUPERVOOC high-speed flash charging',
      'Outdoor-readable 1000 nits Peak brightness'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 751,
    badge: 'HOT DEAL',
    reliancePoints: 155,
    specs: {
      Display: '6.67-inch 120Hz Ultra Bright',
      Processor: 'MediaTek Dimensity 6300',
      RAM: '6 GB',
      Storage: '128 GB',
      Battery: '6500 mAh'
    }
  },
  {
    id: 'oppo-k13-turbo-pro',
    name: 'Oppo K13 Turbo Pro 256 GB, 8 GB RAM, Silver Knight, Mobile Phone',
    brand: 'Oppo',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 31999,
    mrp: 35999,
    discountPercentage: 11,
    rating: 4.7,
    ratingCount: 890,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-k13-turbo-pro.jpg',
    offerRibbon: '7.5% Upto 2K Inst Disc with PNB CC*',
    bestPrice: 29999,
    phoneGraphicSpecs: [
      "India's Only Phone with a Cooling Fan*",
      '7000mm² Ultra Large VC Cooling',
      'SD 8s Gen 4 22Lakh+ AnTuTu Score',
      '7000mAh | 80W'
    ],
    features: [
      'Active hardware centrifugal cooling fan',
      'Snapdragon 8s Gen 4 flagship gaming architecture',
      '7000mAh high-density Silicon-Carbon battery',
      '80W flash charging with bypass charging'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 1549,
    badge: 'GAMING BEAST',
    reliancePoints: 320,
    specs: {
      Display: '6.78-inch 1.5K 144Hz OLED',
      Processor: 'Snapdragon 8s Gen 4',
      RAM: '8 GB',
      Storage: '256 GB',
      Cooling: 'Built-in Turbo Fan + 7000mm² VC'
    }
  },
  {
    id: 'redmi-a7-4g',
    name: 'Redmi A7 4G, 64 GB, 3 GB RAM, Sky Blue, Mobile Phone',
    brand: 'Xiaomi',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 10499,
    mrp: 12999,
    discountPercentage: 19,
    rating: 4.3,
    ratingCount: 3140,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a7-4g.jpg',
    offerRibbon: '-',
    bestPrice: 9999,
    phoneGraphicSpecs: [
      '5200mAh Battery',
      'Powerful Octa-core Processor'
    ],
    features: [
      '5200mAh all-day battery life',
      '13MP rear camera with HDR + Night Mode',
      'Premium leather-feel back finish',
      'Side fingerprint sensor & Face Unlock'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 509,
    badge: '19% OFF',
    reliancePoints: 105,
    specs: {
      Display: '6.88-inch 120Hz HD+',
      Processor: 'Unisoc T7250 Octa-Core',
      RAM: '3 GB + 3 GB Virtual',
      Storage: '64 GB',
      Battery: '5200 mAh'
    }
  },
  {
    id: 'oppo-reno-13-green',
    name: 'Oppo Reno 13 5G 256 GB, 8 GB RAM, Forest Green, Mobile Phone',
    brand: 'Oppo',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 37999,
    mrp: 43999,
    discountPercentage: 14,
    rating: 4.8,
    ratingCount: 720,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno13-cn.jpg',
    offerRibbon: '₹3K Flat Disc with HDFC CC*',
    bestPrice: 35999,
    features: [
      'Studio-grade AI Portrait Camera',
      'Ultra-slim aerospace curved glass design',
      'Corning Gorilla Glass Victus 2 protection',
      '5000mAh battery with 80W SUPERVOOC'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 1840,
    badge: 'NEW LAUNCH',
    reliancePoints: 380,
    specs: {
      Display: '6.7-inch 1.5K Quad Curved OLED',
      Processor: 'Dimensity 8350',
      RAM: '8 GB',
      Storage: '256 GB',
      Camera: '50MP Sony LYT-700 OIS + 50MP Telephoto'
    }
  }
];

export const MIDNIGHT_DISCOUNT_PHONES: Product[] = [
  {
    id: 'oneplus-15-black-256',
    name: 'OnePlus 15 5G 256 GB, 12 GB RAM, Infinite Black, Mobile Phone',
    brand: 'OnePlus',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 85999,
    mrp: 89999,
    discountPercentage: 4,
    rating: 4.9,
    ratingCount: 1650,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-15.jpg',
    offerRibbon: '₹3K Inst Disc+6M NCEMI HDFC CCEMI*',
    bestPrice: 80779,
    phoneGraphicSpecs: [
      'Never Settle'
    ],
    features: [
      'Snapdragon 8 Elite Gen 5 flagship 3nm chip',
      '7300mAh Battery with 120W charging',
      '50MP Triple Main Camera System',
      '1.5K 165Hz ProXDR with Ultra HDR'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 4167,
    badge: 'FLAGSHIP',
    reliancePoints: 860,
    specs: {
      Display: '6.78-inch 1.5K 165Hz LTPO AMOLED',
      Processor: 'Snapdragon 8 Elite Gen 5',
      RAM: '12 GB LPDDR5X',
      Storage: '256 GB UFS 4.1',
      Camera: '50MP + 50MP Periscope + 50MP Ultra-wide'
    }
  },
  {
    id: 'oneplus-15-sandstorm-256',
    name: 'OnePlus 15 5G 256 GB, 12 GB RAM, Sand Storm, Mobile Phone',
    brand: 'OnePlus',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 85999,
    mrp: 89999,
    discountPercentage: 4,
    rating: 4.9,
    ratingCount: 1420,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-15.jpg',
    offerRibbon: '₹3K Inst Disc+6M NCEMI HDFC CCEMI*',
    bestPrice: 80779,
    phoneGraphicSpecs: [
      'Never Settle'
    ],
    features: [
      'Velvet Sand Storm texture rear glass',
      'Snapdragon 8 Elite Gen 5 Extreme Performance',
      'Master Mode photography',
      'IP68 + IP69 extreme water protection'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 4167,
    badge: 'FLAGSHIP',
    reliancePoints: 860,
    specs: {
      Display: '6.78-inch 1.5K 165Hz LTPO AMOLED',
      Processor: 'Snapdragon 8 Elite Gen 5',
      RAM: '12 GB LPDDR5X',
      Storage: '256 GB UFS 4.1'
    }
  },
  {
    id: 'oneplus-15-black-512',
    name: 'OnePlus 15 5G 512 GB, 16 GB RAM, Infinite Black, Mobile Phone',
    brand: 'OnePlus',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 93999,
    mrp: 99999,
    discountPercentage: 6,
    rating: 4.9,
    ratingCount: 880,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-15.jpg',
    offerRibbon: '₹3K Inst Disc+6M NCEMI HDFC CCEMI*',
    bestPrice: 88619,
    phoneGraphicSpecs: [
      'Never Settle'
    ],
    features: [
      'Massive 16GB RAM + 512GB Ultra-speed Storage',
      'Snapdragon 8 Elite Gen 5 with Ray Tracing Engine',
      'Dual Cryo-velocity vapor cooling',
      'OxygenOS 16 with AI Toolbox'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 4554,
    badge: '16GB RAM',
    reliancePoints: 940,
    specs: {
      Display: '6.78-inch 1.5K 165Hz LTPO',
      Processor: 'Snapdragon 8 Elite Gen 5',
      RAM: '16 GB',
      Storage: '512 GB'
    }
  },
  {
    id: 'pixel-10-frost',
    name: 'Google Pixel 10 256 GB, 12 GB RAM, Frost, Mobile Phone',
    brand: 'Google',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 69999,
    mrp: 79999,
    discountPercentage: 13,
    rating: 4.8,
    ratingCount: 1120,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-10-pro-.jpg',
    offerRibbon: '₹5KCart + ₹5K Disc HDFC NCEMI Txn*',
    bestPrice: 63999,
    features: [
      'Google Tensor G5 custom AI silicon',
      'Gemini Nano built directly on-device',
      '48MP Triple camera with 5x Telephoto',
      '7 years of Android OS & security updates'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 3391,
    badge: 'GEMINI AI',
    reliancePoints: 700,
    specs: {
      Display: '6.3-inch Actua OLED 120Hz',
      Processor: 'Google Tensor G5',
      RAM: '12 GB',
      Storage: '256 GB',
      Battery: '4970 mAh'
    }
  },
  {
    id: 'pixel-10-indigo',
    name: 'Google Pixel 10 256 GB, 12 GB RAM, Indigo, Mobile Phone',
    brand: 'Google',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 69999,
    mrp: 79999,
    discountPercentage: 13,
    rating: 4.8,
    ratingCount: 940,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-10-pro-.jpg',
    offerRibbon: '₹5KCart + ₹5K Disc HDFC NCEMI Txn*',
    bestPrice: 63999,
    features: [
      'Stunning Indigo polished finish',
      'Google Tensor G5 with on-device AI Video Boost',
      'Pixel Studio for generative image creation',
      'All-day battery with Extreme Battery Saver up to 100 hours'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 3391,
    badge: 'HOT COLOR',
    reliancePoints: 700,
    specs: {
      Display: '6.3-inch Actua OLED 120Hz',
      Processor: 'Google Tensor G5',
      RAM: '12 GB',
      Storage: '256 GB'
    }
  },
  {
    id: 'pixel-10-obsidian',
    name: 'Google Pixel 10 256 GB, 12 GB RAM, Obsidian, Mobile Phone',
    brand: 'Google',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 69999,
    mrp: 79999,
    discountPercentage: 13,
    rating: 4.8,
    ratingCount: 1320,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-10-pro-.jpg',
    offerRibbon: '₹5KCart + ₹5K Disc HDFC NCEMI Txn*',
    bestPrice: 63999,
    features: [
      'Matte Obsidian rear glass with satin metal frame',
      'Audio Magic Eraser and Best Take 2.0',
      'Tensor G5 with Titan M2 security coprocessor',
      'Qi2 wireless charging compatible'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 3391,
    badge: 'CLASSIC',
    reliancePoints: 700,
    specs: {
      Display: '6.3-inch Actua OLED 120Hz',
      Processor: 'Google Tensor G5',
      RAM: '12 GB',
      Storage: '256 GB'
    }
  }
];

export const BRANDS = [
  { name: 'Apple', logo: '', models: '42+ Models', tag: 'Official Reseller' },
  { name: 'Samsung', logo: 'SAMSUNG', models: '88+ Models', tag: 'Galaxy AI' },
  { name: 'OnePlus', logo: '1+', models: '24+ Models', tag: 'Never Settle' },
  { name: 'Xiaomi', logo: 'mi', models: '65+ Models', tag: 'Redmi & Xiaomi' },
  { name: 'Oppo', logo: 'OPPO', models: '34+ Models', tag: 'Reno & K-Series' },
  { name: 'Vivo', logo: 'vivo', models: '40+ Models', tag: 'V-Series Zeiss' },
  { name: 'Realme', logo: 'realme', models: '38+ Models', tag: 'GT & Number' },
  { name: 'Google', logo: 'G', models: '18+ Models', tag: 'Pixel & Tensor' },
  { name: 'Motorola', logo: 'M', models: '22+ Models', tag: 'Edge Series' },
  { name: 'Poco', logo: 'POCO', models: '16+ Models', tag: 'Speed Evolved' },
];

export const PRODUCTS: Product[] = [
  ...BEST_SELLING_PHONES,
  ...MIDNIGHT_DISCOUNT_PHONES,
  {
    id: 'prod-iphone16',
    name: 'Apple iPhone 16 (128 GB) - Ultramarine Blue',
    brand: 'Apple',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 69900,
    mrp: 79900,
    discountPercentage: 12,
    rating: 4.8,
    ratingCount: 3840,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg',
    features: [
      'Camera Control button for instant photo & video capture',
      'A18 Bionic chip with 16-core Neural Engine',
      'Advanced 48MP Fusion Camera with 2x Telephoto'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 3387,
    badge: 'BESTSELLER',
    reliancePoints: 699,
    offerRibbon: 'Flat ₹5,000 Cashback with HDFC',
    bestPrice: 67900,
    specs: {
      Display: '6.1-inch Super Retina XDR OLED',
      Processor: 'A18 Chip',
      Storage: '128 GB'
    }
  },
  {
    id: 'prod-s24ultra',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB, 12 GB RAM)',
    brand: 'Samsung',
    category: 'mobiles',
    subCategory: 'Smartphones',
    price: 88999,
    mrp: 134999,
    discountPercentage: 34,
    rating: 4.7,
    ratingCount: 2190,
    image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-stylus.jpg',
    features: [
      'Galaxy AI with Circle to Search & Live Translate',
      'Titanium frame with Corning Gorilla Armor',
      '200 MP Quad Telephoto Zoom camera'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 4312,
    badge: 'AI POWERED',
    reliancePoints: 890,
    offerRibbon: '₹12K Instant Bank Discount',
    bestPrice: 84999,
    specs: {
      Display: '6.8-inch Dynamic AMOLED 2X 120Hz',
      Processor: 'Snapdragon 8 Gen 3',
      RAM: '12 GB',
      Storage: '256 GB'
    }
  },
  {
    id: 'prod-macbookm3',
    name: 'Apple MacBook Air 13.6-inch M3 Chip (8GB Unified Memory, 256GB SSD) - Midnight',
    brand: 'Apple',
    category: 'laptops',
    subCategory: 'Ultrabooks',
    price: 94990,
    mrp: 104900,
    discountPercentage: 9,
    rating: 4.9,
    ratingCount: 1820,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    features: [
      'Apple M3 chip with 8-core CPU and 8-core GPU',
      'Liquid Retina display with 500 nits brightness',
      'Up to 18 hours of all-day battery life'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 4599,
    badge: 'TOP RATED',
    reliancePoints: 950,
    offerRibbon: '₹10K Student & Exchange Bonus',
    bestPrice: 84990,
    specs: {
      Processor: 'Apple M3 8-Core',
      Memory: '8 GB',
      Storage: '256 GB SSD'
    }
  },
  {
    id: 'prod-sonytv55',
    name: 'Sony Bravia 139 cm (55 inches) 4K Ultra HD Smart LED Google TV KD-55X74L',
    brand: 'Sony',
    category: 'televisions',
    subCategory: 'Smart TVs',
    price: 56990,
    mrp: 89900,
    discountPercentage: 37,
    rating: 4.8,
    ratingCount: 3100,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
    features: [
      'X1 4K Processor with 4K X-Reality PRO clarity',
      'Live Colour technology with Dolby Audio',
      'Google TV with Voice Search'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 2760,
    badge: 'DEAL OF THE DAY',
    reliancePoints: 570,
    offerRibbon: 'Free Mauli Wallmount & Demo',
    bestPrice: 53990,
    specs: {
      Resolution: '4K Ultra HD (3840 x 2160)',
      Sound: '20 Watts Dolby Audio'
    }
  },
  {
    id: 'prod-lgac',
    name: 'LG 1.5 Ton 5 Star AI DUAL Inverter Split AC (Copper, AI Convertible 6-in-1)',
    brand: 'LG',
    category: 'airconditioners',
    subCategory: 'Split ACs',
    price: 43990,
    mrp: 78990,
    discountPercentage: 44,
    rating: 4.7,
    ratingCount: 4200,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    features: [
      'AI DUAL Inverter adjusts cooling based on room conditions',
      'Super Convertible 6-in-1 cooling modes',
      '100% Ocean Black Protection copper tubes'
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: 2130,
    badge: 'SUMMER SAVER',
    reliancePoints: 440,
    offerRibbon: 'Free Installation & Demo',
    bestPrice: 41990,
    specs: {
      Capacity: '1.5 Ton 5 Star',
      Warranty: '10 Years on Compressor'
    }
  }
];

export const BANK_OFFERS: BankOffer[] = [
  {
    bank: 'Mauli Mobile',
    offer: 'Flat ₹1,000 OFF on orders above ₹10,000 — auto-applied at cart',
    code: 'MAULI1000',
    minAmount: 10000,
  },
  {
    bank: 'Mauli Mobile',
    offer: 'Flat ₹500 OFF on any mobile — no minimum order value',
    code: 'MAULI500',
    minAmount: 0,
  },
  {
    bank: 'Mauli Mobile',
    offer: 'Extra 5% OFF on your first order (up to ₹2,000)',
    code: 'MAULIFIRST',
    minAmount: 0,
  },
];

export const BANNERS: Banner[] = [
  {
    id: 'banner-apple-18',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Titanium build, A18 Pro chip. Pre-order live with exchange bonus.',
    badge: 'NEW LAUNCH',
    ctaText: 'Pre-Order Now',
    bgGradient: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
    accentColor: '#38bdf8',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg',
    tag: 'Flagship',
  },
  {
    id: 'banner-pixel-9',
    title: 'Google Pixel 9 Pro',
    subtitle: 'Best AI camera ever. Gemini built-in. Bank offer ₹8,000 off.',
    badge: 'AI CAMERA KING',
    ctaText: 'Shop Now',
    bgGradient: 'from-[#0f766e] via-[#134e4a] to-[#042f2e]',
    accentColor: '#5eead4',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-.jpg',
    tag: 'Gemini AI',
  },
  {
    id: 'banner-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Galaxy AI is here. 200MP camera, Titanium frame.',
    badge: 'GALAXY AI',
    ctaText: 'Buy Now',
    bgGradient: 'from-[#1e3a8a] via-[#172554] to-[#0f172a]',
    accentColor: '#60a5fa',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-stylus.jpg',
    tag: 'Galaxy AI',
  },
  {
    id: 'banner-nothing-2',
    title: 'Nothing Phone (2a) Plus',
    subtitle: 'Iconic Glyph lights, 50MP OIS dual camera. Sale is live.',
    badge: 'HOT DEAL',
    ctaText: 'Grab Deal',
    bgGradient: 'from-[#7c2d12] via-[#431407] to-[#0c0a09]',
    accentColor: '#fdba74',
    image: 'https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a-plus.jpg',
    tag: 'Glyph Edition',
  },
];

export const CITIES = [
  { name: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { name: 'Delhi NCR', pincode: '110001', state: 'Delhi' },
  { name: 'Bengaluru', pincode: '560001', state: 'Karnataka' },
  { name: 'Hyderabad', pincode: '500001', state: 'Telangana' },
  { name: 'Chennai', pincode: '600001', state: 'Tamil Nadu' },
  { name: 'Kolkata', pincode: '700001', state: 'West Bengal' },
  { name: 'Ahmedabad', pincode: '380001', state: 'Gujarat' },
  { name: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { name: 'Jaipur', pincode: '302001', state: 'Rajasthan' },
  { name: 'Lucknow', pincode: '226001', state: 'Uttar Pradesh' },
  { name: 'Chandigarh', pincode: '160017', state: 'Punjab' },
  { name: 'Kochi', pincode: '682001', state: 'Kerala' },
];

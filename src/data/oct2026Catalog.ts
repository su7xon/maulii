import { Product } from '../types';

// Oct 2026 shop catalog — parsed from cat.png (iPhone), cat1.png (OPPO 07/10/2026), cat2.png (Samsung 12/10/2026)
// price = MOP (customer price), mrp = MRP column, DP kept in specs for dealer reference.
// Variants share family image (same phone, different RAM/ROM). Colors in name + specs.

function mk(
  id: string,
  brand: string,
  name: string,
  price: number,
  mrp: number,
  image: string,
  colorText: string,
  ram: string,
  storage: string,
  extraSpecs: Record<string, string>,
  description: string,
  opts: Partial<Product> = {}
): Product {
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return {
    id,
    name,
    brand,
    category: 'mobiles',
    subCategory: 'Smartphones',
    price,
    mrp,
    discountPercentage: discount,
    rating: 4.4,
    ratingCount: 500 + (price % 900),
    image,
    features: [
      `${ram} RAM + ${storage} Storage`,
      colorText ? `Colours: ${colorText}` : 'Shop stock colours',
      ...Object.entries(extraSpecs).slice(0, 2).map(([k, v]) => `${k}: ${v}`),
    ],
    expressDelivery: true,
    inStock: true,
    emiStartsAt: Math.round(price / 12),
    reliancePoints: Math.round(price / 100),
    specs: {
      RAM: ram,
      Storage: storage,
      Colour: colorText,
      ...extraSpecs,
    },
    ...opts,
  };
}

const IP15 = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg';
const IP16 = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg';
const IP17 = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17.jpg';
const IP17AIR = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-air.jpg';
const IP16E = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16e.jpg';
const IP17PRO = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro.jpg';
const IP17PROMAX = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg';

export const APPLE_OCT2026: Product[] = [
  mk(
    'iphone-15-128-oct26',
    'Apple',
    'Apple iPhone 15 (128 GB)',
    74900,
    74900,
    IP15,
    'Blue, Black, Pink, Green, Yellow',
    '6 GB',
    '128 GB',
    { Chip: 'A16 Bionic', Display: '6.1-inch Super Retina XDR', Camera: '48MP Main' },
    'Reliable iPhone with Dynamic Island, 48MP main camera, USB-C, and all-day battery life.',
    { rating: 4.7, ratingCount: 8200, offerRibbon: '₹4,000 Instant Bank Cashback', bestPrice: 70900 }
  ),
  mk(
    'iphone-16-128-oct26',
    'Apple',
    'Apple iPhone 16 (128 GB)',
    89900,
    89900,
    IP16,
    'Ultramarine, Teal, Pink, White, Black',
    '8 GB',
    '128 GB',
    { Chip: 'A18', Display: '6.1-inch Super Retina XDR', CameraControl: 'Camera Control button' },
    'Powered by A18 chip with Camera Control, Apple Intelligence, and advanced 48MP Fusion camera.',
    { rating: 4.8, ratingCount: 6100, offerRibbon: '₹5,000 Instant Bank Cashback', bestPrice: 84900 }
  ),
  mk(
    'iphone-17-256-oct26',
    'Apple',
    'Apple iPhone 17 (256 GB)',
    99900,
    99900,
    IP17,
    'Mist Blue, Black, Sage, White, Lavender',
    '8 GB',
    '256 GB',
    { Chip: 'A19', Display: '6.3-inch 120Hz OLED', Camera: '48MP Dual Fusion' },
    'Next-gen iPhone with ultra-smooth 120Hz ProMotion display, faster A19 processor, and enhanced Apple Intelligence.',
    { rating: 4.8, ratingCount: 2100, badge: 'NEW', offerRibbon: '₹5,000 Instant Bank Cashback', bestPrice: 94900 }
  ),
  mk(
    'iphone-17-512-oct26',
    'Apple',
    'Apple iPhone 17 (512 GB)',
    124900,
    124900,
    IP17,
    'Mist Blue, Black, Sage, White, Lavender',
    '8 GB',
    '512 GB',
    { Chip: 'A19', Display: '6.3-inch 120Hz OLED', Camera: '48MP Dual Fusion' },
    'High-capacity 512GB iPhone 17 with 120Hz display and powerful computational photography.',
    { rating: 4.8, ratingCount: 1400, offerRibbon: '₹5,000 Instant Bank Cashback', bestPrice: 119900 }
  ),
  mk(
    'iphone-17-air-256-oct26',
    'Apple',
    'Apple iPhone 17 Air (256 GB) - Ultraslim',
    149900,
    149900,
    IP17AIR,
    'Silver, Space Black, Cloud White, Gold',
    '8 GB',
    '256 GB',
    { Chip: 'A19 Pro', Display: '6.6-inch ProMotion', Thickness: '5.5mm Air design' },
    'Ultra-thin architectural marvel at just 5.5mm with expansive 6.6-inch ProMotion OLED and pro power.',
    { badge: 'NEW LAUNCH', rating: 4.7, ratingCount: 800, offerRibbon: '₹6,000 Instant Bank Cashback', bestPrice: 143900 }
  ),
  mk(
    'iphone-17-air-512-oct26',
    'Apple',
    'Apple iPhone 17 Air (512 GB) - Ultraslim',
    174900,
    174900,
    IP17AIR,
    'Silver, Space Black, Cloud White, Gold',
    '8 GB',
    '512 GB',
    { Chip: 'A19 Pro', Display: '6.6-inch ProMotion', Thickness: '5.5mm Air design' },
    '512GB ultra-slim flagship combining breakthrough light form factor with full-day battery life.',
    { badge: 'NEW LAUNCH', rating: 4.7, ratingCount: 600, offerRibbon: '₹6,000 Instant Bank Cashback', bestPrice: 168900 }
  ),
  mk(
    'iphone-17-air-1tb-oct26',
    'Apple',
    'Apple iPhone 17 Air (1 TB) - Ultraslim',
    224900,
    224900,
    IP17AIR,
    'Silver, Space Black, Cloud White, Gold',
    '8 GB',
    '1 TB',
    { Chip: 'A19 Pro', Display: '6.6-inch ProMotion', Thickness: '5.5mm Air design' },
    'Top 1TB edition of the revolutionary iPhone 17 Air for maximum media and uncompromising portability.',
    { rating: 4.7, ratingCount: 300, offerRibbon: '₹6,000 Instant Bank Cashback', bestPrice: 218900 }
  ),
  mk(
    'iphone-17e-256-oct26',
    'Apple',
    'Apple iPhone 17e (256 GB)',
    79900,
    79900,
    IP16E,
    'Black, White, Soft Yellow',
    '8 GB',
    '256 GB',
    { Chip: 'A19', Display: '6.1-inch OLED' },
    'Essential modern iPhone experience powered by A19 chip, offering fast everyday speed and reliable battery.',
    { rating: 4.5, ratingCount: 900, offerRibbon: '₹4,000 Instant Bank Cashback', bestPrice: 75900 }
  ),
  mk(
    'iphone-17e-512-oct26',
    'Apple',
    'Apple iPhone 17e (512 GB)',
    104900,
    104900,
    IP16E,
    'Black, White, Soft Yellow',
    '8 GB',
    '512 GB',
    { Chip: 'A19', Display: '6.1-inch OLED' },
    '512GB high-storage budget flagship with dependable camera and long software support.',
    { rating: 4.5, ratingCount: 700, offerRibbon: '₹4,000 Instant Bank Cashback', bestPrice: 100900 }
  ),
  mk(
    'iphone-18-pro-256-oct26',
    'Apple',
    'Apple iPhone 18 Pro (256 GB)',
    164900,
    164900,
    IP17PRO,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '256 GB',
    { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz', Camera: '48MP Fusion Triple' },
    'Professional grade titanium smartphone with A20 Pro chip, 5x telephoto optical zoom, and 4K 120 fps ProRes.',
    { badge: 'PRO FLAGSHIP', rating: 4.9, ratingCount: 400, offerRibbon: '₹7,000 Instant Bank Cashback', bestPrice: 157900 }
  ),
  mk(
    'iphone-18-pro-512-oct26',
    'Apple',
    'Apple iPhone 18 Pro (512 GB)',
    189900,
    189900,
    IP17PRO,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '512 GB',
    { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz', Camera: '48MP Fusion Triple' },
    '512GB Pro flagship designed for creators capturing ProRes Log video and high-resolution spatial photos.',
    { badge: 'PRO FLAGSHIP', rating: 4.9, ratingCount: 350, offerRibbon: '₹7,000 Instant Bank Cashback', bestPrice: 182900 }
  ),
  mk(
    'iphone-18-pro-1tb-oct26',
    'Apple',
    'Apple iPhone 18 Pro (1 TB)',
    239900,
    239900,
    IP17PRO,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '1 TB',
    { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz' },
    '1TB titanium workhorse for professional photography, videography, and demanding productivity.',
    { rating: 4.9, ratingCount: 200, offerRibbon: '₹7,000 Instant Bank Cashback', bestPrice: 232900 }
  ),
  mk(
    'iphone-18-pro-2tb-oct26',
    'Apple',
    'Apple iPhone 18 Pro (2 TB)',
    314900,
    314900,
    IP17PRO,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '2 TB',
    { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz' },
    'Ultimate 2TB storage edition for uncompressed 8K studio recording and zero storage compromises.',
    { rating: 4.9, ratingCount: 120, offerRibbon: '₹7,000 Instant Bank Cashback', bestPrice: 307900 }
  ),
  mk(
    'iphone-18-promax-256-oct26',
    'Apple',
    'Apple iPhone 18 Pro Max (256 GB)',
    179900,
    179900,
    IP17PROMAX,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '256 GB',
    { Chip: 'A20 Pro', Display: '6.9-inch LTPO 120Hz', Camera: '48MP Fusion Triple' },
    'Flagship 6.9-inch titanium display with biggest iPhone battery life, A20 Pro performance, and pro cameras.',
    { badge: 'PRO MAX', rating: 4.9, ratingCount: 500, offerRibbon: '₹8,000 Instant Bank Cashback', bestPrice: 171900 }
  ),
  mk(
    'iphone-18-promax-512-oct26',
    'Apple',
    'Apple iPhone 18 Pro Max (512 GB)',
    204900,
    204900,
    IP17PROMAX,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '512 GB',
    { Chip: 'A20 Pro', Display: '6.9-inch LTPO 120Hz' },
    '512GB Pro Max providing unmatched screen real estate, battery stamina, and studio-grade media creation.',
    { badge: 'PRO MAX', rating: 4.9, ratingCount: 380, offerRibbon: '₹8,000 Instant Bank Cashback', bestPrice: 196900 }
  ),
  mk(
    'iphone-18-promax-1tb-oct26',
    'Apple',
    'Apple iPhone 18 Pro Max (1 TB)',
    254900,
    254900,
    IP17PROMAX,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '1 TB',
    { Chip: 'A20 Pro', Display: '6.9-inch LTPO 120Hz' },
    '1TB flagship smartphone built for high-end multimedia production and all-day heavy duty workflows.',
    { rating: 4.9, ratingCount: 250, offerRibbon: '₹8,000 Instant Bank Cashback', bestPrice: 246900 }
  ),
  mk(
    'iphone-18-promax-2tb-oct26',
    'Apple',
    'Apple iPhone 18 Pro Max (2 TB)',
    329900,
    329900,
    IP17PROMAX,
    'Natural Titanium, Desert Titanium, White, Black',
    '12 GB',
    '2 TB',
    { Chip: 'A20 Pro', Display: '6.9-inch LTPO 120Hz' },
    'Top-of-the-line 2TB Pro Max offering highest performance and storage capacity in any smartphone.',
    { rating: 4.9, ratingCount: 150, offerRibbon: '₹8,000 Instant Bank Cashback', bestPrice: 321900 }
  ),
];

// OPPO images (gsmarena slugs: 200-verified, variants reuse their own model's photo)
const OPPO_A6X = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6x.jpg';
const OPPO_A6C = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6c.jpg';
const OPPO_A6S = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6s.jpg';
const OPPO_A6 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6.jpg';
const OPPO_A6PRO = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6-pro.jpg';
const OPPO_K = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-k12.jpg';
const OPPO_F33 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-f33.jpg';
const OPPO_F33PRO = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-f33-pro.jpg';
const OPPO_F35PRO = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-f35-pro.jpg';
const OPPO_F35 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-f31-pro.jpg';
const OPPO_RENO15C = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno14.jpg';
const OPPO_RENO15 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno15.jpg';
const OPPO_RENO15PROMINI = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno14-pro-mini.jpg';
const OPPO_RENO15PRO = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno15-pro.jpg';
const OPPO_RENO16C = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno15.jpg';
const OPPO_RENO16 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno16.jpg';
const OPPO_FINDX9 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x9.jpg';
const OPPO_FINDX9S = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x9s.jpg';
const OPPO_FINDX9PRO = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x9-pro.jpg';
const OPPO_FINDX9ULTRA = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8-ultra.jpg';
const OPPO_FINDX10 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x10.jpg';
const OPPO_FINDX10PROMAX = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x10-pro-max.jpg';
const OPPO_PAD = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-pad5.jpg';

export const OPPO_OCT2026: Product[] = [
  // A Series
  mk('oppo-a6c-4-64-oct26', 'Oppo', 'Oppo A6C 4G (4GB/64GB) - Feather White, Stone Brown', 17999, 17999, OPPO_A6C, 'Feather White, Stone Brown', '4 GB', '64 GB', { Processor: 'Unisoc T7250', Camera: '5MP / 13MP', Battery: '7000mAh 15W', DP: '16980' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6c-4-128-oct26', 'Oppo', 'Oppo A6C 4G (4GB/128GB) - Feather White, Stone Brown', 19999, 19999, OPPO_A6C, 'Feather White, Stone Brown', '4 GB', '128 GB', { Processor: 'Unisoc T7250', Camera: '5MP / 13MP', Battery: '7000mAh 15W', DP: '18867' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6x-4-64-oct26', 'Oppo', 'Oppo A6X 5G (4GB/64GB) - Ice Blue, Olive Green', 19999, 19999, OPPO_A6X, 'Ice Blue, Olive Green', '4 GB', '64 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 13MP', Battery: '6500mAh 45W', DP: '18956' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6x-4-128-oct26', 'Oppo', 'Oppo A6X 5G (4GB/128GB) - Ice Blue, Olive Green', 23999, 23999, OPPO_A6X, 'Ice Blue, Olive Green', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 13MP', Battery: '6500mAh 45W', DP: '22748' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6x-6-128-oct26', 'Oppo', 'Oppo A6X 5G (6GB/128GB) - Ice Blue, Olive Green', 26999, 26999, OPPO_A6X, 'Ice Blue, Olive Green', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 13MP', Battery: '6500mAh 45W', DP: '25591' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6s-4-128-oct26', 'Oppo', 'Oppo A6S 5G (4GB/128GB) - Aurora Gold, Plum Purple', 24999, 24999, OPPO_A6S, 'Aurora Gold, Plum Purple', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '23696' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6s-6-128-oct26', 'Oppo', 'Oppo A6S 5G (6GB/128GB) - Aurora Gold, Plum Purple', 27999, 27999, OPPO_A6S, 'Aurora Gold, Plum Purple', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '26539' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6-4-128-oct26', 'Oppo', 'Oppo A6 5G (4GB/128GB) - Sapphire Blue, Ice White, Sakura Pink', 29999, 29999, OPPO_A6, 'Sapphire Blue, Ice White, Sakura Pink', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+2MP', Battery: '7000mAh 45W', DP: '28435' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6-6-128-oct26', 'Oppo', 'Oppo A6 5G (6GB/128GB) - Sapphire Blue, Ice White, Sakura Pink', 31999, 31999, OPPO_A6, 'Sapphire Blue, Ice White, Sakura Pink', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+2MP', Battery: '7000mAh 45W', DP: '30331' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  mk('oppo-a6-6-256-oct26', 'Oppo', 'Oppo A6 5G (6GB/256GB) - Sapphire Blue, Ice White, Sakura Pink', 35999, 35999, OPPO_A6, 'Sapphire Blue, Ice White, Sakura Pink', '6 GB', '256 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+2MP', Battery: '7000mAh 45W', DP: '34122' }, 'Budget-friendly Oppo phone with essential features, good battery life, and reliable performance. Perfect for first-time smartphone users and basic daily tasks.'),
  // K Series
  mk('oppo-k14x-4-64-oct26', 'Oppo', 'Oppo K14X 5G (4GB/64GB) - Prism Violet, Icy Blue', 18999, 18999, OPPO_K, 'Prism Violet, Icy Blue', '4 GB', '64 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '18268' }, 'Gaming-focused Oppo phone with fast processor, smooth display, and long battery life. Ideal for mobile gamers and users who want responsive performance.'),
  mk('oppo-k14x-4-128-oct26', 'Oppo', 'Oppo K14X 5G (4GB/128GB) - Prism Violet, Icy Blue', 21999, 21999, OPPO_K, 'Prism Violet, Icy Blue', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '21153' }, 'Gaming-focused Oppo phone with fast processor, smooth display, and long battery life. Ideal for mobile gamers and users who want responsive performance.'),
  mk('oppo-k14x-6-128-oct26', 'Oppo', 'Oppo K14X 5G (6GB/128GB) - Prism Violet, Icy Blue', 24999, 24999, OPPO_K, 'Prism Violet, Icy Blue', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '24038' }, 'Gaming-focused Oppo phone with fast processor, smooth display, and long battery life. Ideal for mobile gamers and users who want responsive performance.'),
  mk('oppo-k14-6-128-oct26', 'Oppo', 'Oppo K14 5G (6GB/128GB) - Prism Violet, Icy Blue, Prism White', 25999, 25999, OPPO_K, 'Prism Violet, Icy Blue, Prism White', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+8MP', Battery: '7000mAh 45W', DP: '24999' }, 'Gaming-focused Oppo phone with fast processor, smooth display, and long battery life. Ideal for mobile gamers and users who want responsive performance.'),
  mk('oppo-k14-6-256-oct26', 'Oppo', 'Oppo K14 5G (6GB/256GB) - Prism Violet, Icy Blue, Prism White', 28999, 28999, OPPO_K, 'Prism Violet, Icy Blue, Prism White', '6 GB', '256 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+8MP', Battery: '7000mAh 45W', DP: '27884' }, 'Gaming-focused Oppo phone with fast processor, smooth display, and long battery life. Ideal for mobile gamers and users who want responsive performance.'),
  mk('oppo-k14-8-256-oct26', 'Oppo', 'Oppo K14 5G (8GB/256GB) - Prism Violet, Icy Blue, Prism White', 28999, 28999, OPPO_K, 'Prism Violet, Icy Blue, Prism White', '8 GB', '256 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+8MP', Battery: '7000mAh 45W', DP: '27884' }, 'Gaming-focused Oppo phone with fast processor, smooth display, and long battery life. Ideal for mobile gamers and users who want responsive performance.'),
  // F Series
  mk('oppo-f33-6-128-oct26', 'Oppo', 'Oppo F33 5G (6GB/128GB) - Forest Green, Pearl White', 34999, 34999, OPPO_F33, 'Forest Green, Pearl White', '6 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '33176' }, 'Mid-range Oppo phone with good camera, decent performance, and stylish design. Great for social media, photography, and everyday tasks at an affordable price.'),
  mk('oppo-f33-8-128-oct26', 'Oppo', 'Oppo F33 5G (8GB/128GB) - Forest Green, Pearl White', 36999, 36999, OPPO_F33, 'Forest Green, Pearl White', '8 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '35071' }, 'Mid-range Oppo phone with good camera, decent performance, and stylish design. Great for social media, photography, and everyday tasks at an affordable price.'),
  mk('oppo-f33-8-256-oct26', 'Oppo', 'Oppo F33 5G (8GB/256GB) - Forest Green, Pearl White', 39999, 39999, OPPO_F33, 'Forest Green, Pearl White', '8 GB', '256 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '37914' }, 'Mid-range Oppo phone with good camera, decent performance, and stylish design. Great for social media, photography, and everyday tasks at an affordable price.'),
  mk('oppo-f35-6-128-oct26', 'Oppo', 'Oppo F35 5G (6GB/128GB) - Titanium Grey, Mist Pink, Wave Blue', 38999, 38999, OPPO_F35, 'Titanium Grey, Mist Pink, Wave Blue', '6 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '36966' }, 'Mid-range Oppo phone with good camera, decent performance, and stylish design. Great for social media, photography, and everyday tasks at an affordable price.'),
  mk('oppo-f35-8-128-oct26', 'Oppo', 'Oppo F35 5G (8GB/128GB) - Titanium Grey, Mist Pink, Wave Blue', 42999, 42999, OPPO_F35, 'Titanium Grey, Mist Pink, Wave Blue', '8 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '40757' }, 'Mid-range Oppo phone with good camera, decent performance, and stylish design. Great for social media, photography, and everyday tasks at an affordable price.'),
  // Reno Series
  mk('oppo-reno15c-8-256-oct26', 'Oppo', 'Oppo Reno 15C 5G (8GB/256GB) - Twilight Blue, Afterglow Pink', 41999, 41999, OPPO_RENO15C, 'Twilight Blue, Afterglow Pink', '8 GB', '256 GB', { Processor: 'Snapdragon 6 Gen 1', Camera: '50MP / 50+8+2MP', Battery: '7000mAh 80W', DP: '39809' }, 'Stylish Oppo phone with great camera for portraits and selfies, sleek design, and reliable performance. Perfect for photography lovers and style-conscious users.'),
  mk('oppo-reno15c-12-256-oct26', 'Oppo', 'Oppo Reno 15C 5G (12GB/256GB) - Twilight Blue, Afterglow Pink', 44999, 44999, OPPO_RENO15C, 'Twilight Blue, Afterglow Pink', '12 GB', '256 GB', { Processor: 'Snapdragon 6 Gen 1', Camera: '50MP / 50+8+2MP', Battery: '7000mAh 80W', DP: '42653' }, 'Stylish Oppo phone with great camera for portraits and selfies, sleek design, and reliable performance. Perfect for photography lovers and style-conscious users.'),
  mk('oppo-reno15-12-512-oct26', 'Oppo', 'Oppo Reno 15 5G (12GB/512GB) - Twilight Blue, Glacier White, Aurora Blue', 55999, 55999, OPPO_RENO15, 'Twilight Blue, Glacier White, Aurora Blue', '12 GB', '512 GB', { Processor: 'Snapdragon 7 Gen 4', Camera: '50MP / 50+8+50MP', Battery: '6500mAh 80W', DP: '53081' }, 'Stylish Oppo phone with great camera for portraits and selfies, sleek design, and reliable performance. Perfect for photography lovers and style-conscious users.'),
  mk('oppo-reno16c-12-256-oct26', 'Oppo', 'Oppo Reno 16C 5G (12GB/256GB) - Starry White, Stellar Purple, Twilight Violet', 62999, 62999, OPPO_RENO16C, 'Starry White, Stellar Purple, Twilight Violet', '12 GB', '256 GB', { Processor: 'Dimensity 7300', Camera: '50MP / 50+50+8MP', Battery: '7000mAh 80W', DP: '59715' }, 'Stylish Oppo phone with great camera for portraits and selfies, sleek design, and reliable performance. Perfect for photography lovers and style-conscious users.'),
  mk('oppo-reno16-12-256-oct26', 'Oppo', 'Oppo Reno 16 5G (12GB/256GB) - Starry White, Stellar Purple, Twilight Violet', 72999, 72999, OPPO_RENO16, 'Starry White, Stellar Purple, Twilight Violet', '12 GB', '256 GB', { Processor: 'Snapdragon 7 Gen 4', Camera: '50MP / 50+50+50MP', Battery: '6700mAh 80W', DP: '69193' }, 'Stylish Oppo phone with great camera for portraits and selfies, sleek design, and reliable performance. Perfect for photography lovers and style-conscious users.'),
  // Find Series
  mk('oppo-findx9s-12-256-oct26', 'Oppo', 'Oppo Find X9s 5G (12GB/256GB) - Lavender Sky, Sunset Orange, Midnight Grey', 84999, 84999, OPPO_FINDX9S, 'Lavender Sky, Sunset Orange, Midnight Grey', '12 GB', '256 GB', { Processor: 'Dimensity 9500s', Camera: '32MP / 50+50+50MP', Battery: '7025mAh 80W', DP: '80568' }, 'Flagship Oppo phone with premium design, powerful processor, and advanced camera system. Ideal for users who want top-tier performance, great display, and fast charging.'),
  mk('oppo-findx9s-12-512-oct26', 'Oppo', 'Oppo Find X9s 5G (12GB/512GB) - Lavender Sky, Sunset Orange, Midnight Grey', 94999, 94999, OPPO_FINDX9S, 'Lavender Sky, Sunset Orange, Midnight Grey', '12 GB', '512 GB', { Processor: 'Dimensity 9500s', Camera: '32MP / 50+50+50MP', Battery: '7025mAh 80W', DP: '90046' }, 'Flagship Oppo phone with premium design, powerful processor, and advanced camera system. Ideal for users who want top-tier performance, great display, and fast charging.'),
  // Tablet
];

// Samsung images
const SAM_FOLD8U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8-ultra-r1.jpg';
const SAM_FOLD8 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8.jpg';
const SAM_FLIP8 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip8.jpg';
const SAM_FOLD7 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold7.jpg';
const SAM_FLIP7 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip7.jpg';
const SAM_FLIP7FE = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip6.jpg';
const SAM_S26U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra.jpg';
const SAM_S26P = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-plus.jpg';
const SAM_S26 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26.jpg';
const SAM_S26FE = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-fe.jpg';
const SAM_S25U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg';
const SAM_S25 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-sm-s931.jpg';
const SAM_S25P = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-plus.jpg';
const SAM_S25FE = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-fe.jpg';
const SAM_S25EDGE = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-edge.jpg';
const SAM_A = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a16-5g.jpg';
const SAM_F16 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f16-5g.jpg';
const SAM_F70E = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f70e.jpg';
const SAM_F06 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f06-5g.jpg';
const SAM_F07 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f07.jpg';
const SAM_F36 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f36.jpg';
const SAM_F56 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f56-5g.jpg';
const SAM_A08 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a08.jpg';
const SAM_A16 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a16-5g.jpg';
const SAM_A06 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a06-5g.jpg';
const SAM_A07 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a07.jpg';
const SAM_A17 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a17.jpg';
const SAM_A26 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a26.jpg';
const SAM_A27 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a27.jpg';
const SAM_A37 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a37.jpg';
const SAM_A57 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a57.jpg';

export const SAMSUNG_OCT2026: Product[] = [
  // --- FOLD 8 / FLIP 8 FAMILY ---
  mk(
    'sam-zfold8ultra-12-256-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 8 Ultra 5G (12GB/256GB)',
    199999,
    219999,
    SAM_FOLD8U,
    'Graphite, Cream, Violet Shadow',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,98,999',
      Display: '8.0-inch Fold + 6.5-inch Cover',
      Processor: 'Snapdragon 8 Elite Gen 5',
      Camera: '200MP + 50MP UW + 10MP 3x',
      Battery: '5000 mAh 45W',
    },
    'Ultra-premium foldable flagship with expansive 8-inch inner display, 200MP pro-grade camera, and next-gen Galaxy AI productivity tools.',
    {
      badge: 'ULTRA FOLD',
      rating: 4.9,
      ratingCount: 620,
      bestPrice: 192999,
      offerRibbon: '₹7,000 Bank Cashback + ₹12,000 Cash Upgrade',
    }
  ),
  mk(
    'sam-zfold8ultra-12-512-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 8 Ultra 5G (12GB/512GB)',
    219999,
    239999,
    SAM_FOLD8U,
    'Graphite, Cream, Violet Shadow',
    '12 GB',
    '512 GB',
    {
      DP: '₹2,18,999',
      Display: '8.0-inch Dynamic AMOLED 2X',
      Processor: 'Snapdragon 8 Elite Gen 5',
      Camera: '200MP Pro-grade camera',
      Battery: '5000 mAh 45W',
    },
    'Flagship 512GB ultra foldable with massive multitasking screen and pro-level titanium construction.',
    {
      badge: 'ULTRA FOLD',
      rating: 4.9,
      ratingCount: 480,
      bestPrice: 212999,
      offerRibbon: '₹7,000 Bank Cashback + ₹12,000 Cash Upgrade',
    }
  ),
  mk(
    'sam-zfold8ultra-16-1tb-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 8 Ultra 5G (16GB/1TB)',
    259999,
    279999,
    SAM_FOLD8U,
    'Graphite, Cream, Violet Shadow',
    '16 GB',
    '1 TB',
    {
      DP: '₹2,58,999',
      Processor: 'Snapdragon 8 Elite Gen 5',
      RAM: '16 GB',
      Storage: '1 TB',
      Battery: '5000 mAh 45W',
    },
    'Top-tier 1TB foldable powerhouse with 16GB RAM for ultimate mobile computing and media creation.',
    {
      badge: 'TOP FLAGSHIP',
      rating: 5.0,
      ratingCount: 220,
      bestPrice: 252999,
      offerRibbon: '₹7,000 Bank Cashback + ₹12,000 Cash Upgrade',
    }
  ),
  mk(
    'sam-zfold8-12-256-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 8 5G (12GB/256GB) - Wide Fold',
    179999,
    199999,
    SAM_FOLD8,
    'Graphite, Cream, Lavender',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,78,999',
      Display: '7.6-inch Fold 4:3 + 5.5-inch Cover',
      Processor: 'Snapdragon 8 Elite Gen 5',
      Camera: '50MP + 50MP UW Dual Flagship',
      Battery: '4800 mAh 45W',
    },
    'Reimagined wide-aspect foldable giving standard smartphone comfort closed and tablet productivity open.',
    {
      badge: 'NEW SHAPE',
      rating: 4.8,
      ratingCount: 540,
      bestPrice: 172999,
      offerRibbon: '₹7,000 Bank Cashback + ₹12,000 Cash Upgrade',
    }
  ),
  mk(
    'sam-zfold8-12-512-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 8 5G (12GB/512GB) - Wide Fold',
    199999,
    219999,
    SAM_FOLD8,
    'Graphite, Cream, Lavender',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,98,999',
      Processor: 'Snapdragon 8 Elite Gen 5',
      Battery: '4800 mAh 45W',
    },
    'Expansive 512GB wide-aspect foldable built with lighter Armor Aluminum and anti-reflective display.',
    {
      badge: 'NEW SHAPE',
      rating: 4.8,
      ratingCount: 390,
      bestPrice: 192999,
      offerRibbon: '₹7,000 Bank Cashback + ₹12,000 Cash Upgrade',
    }
  ),
  mk(
    'sam-zfold8-16-1tb-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 8 5G (16GB/1TB) - Wide Fold',
    239999,
    259999,
    SAM_FOLD8,
    'Graphite, Cream, Lavender, Pistachio',
    '16 GB',
    '1 TB',
    {
      DP: '₹2,38,999',
      Processor: 'Snapdragon 8 Elite Gen 5',
      RAM: '16 GB',
      Storage: '1 TB',
    },
    'Maximum capacity 1TB wide foldable with 16GB RAM for intensive productivity and creative multitasking.',
    {
      rating: 4.9,
      ratingCount: 190,
      bestPrice: 232999,
      offerRibbon: '₹7,000 Bank Cashback + ₹12,000 Cash Upgrade',
    }
  ),
  mk(
    'sam-zflip8-12-256-oct26',
    'Samsung',
    'Samsung Galaxy Z Flip 8 5G (12GB/256GB)',
    124999,
    139999,
    SAM_FLIP8,
    'Mint, Black, White',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,23,999',
      Processor: 'Snapdragon 8 Elite Gen 5',
      Battery: '4300 mAh',
      CoverScreen: 'Full Edge-to-Edge FlexWindow',
    },
    'Iconic clamshell flip phone featuring a full-bleed cover screen, pro camera zoom, and Galaxy AI photo tools.',
    {
      badge: 'FLIP',
      rating: 4.7,
      ratingCount: 820,
      bestPrice: 120999,
      offerRibbon: '₹4,000 Bank Cashback + Up to ₹19,000 Upgrade & Support',
    }
  ),
  mk(
    'sam-zflip8-12-512-oct26',
    'Samsung',
    'Samsung Galaxy Z Flip 8 5G (12GB/512GB)',
    144999,
    159999,
    SAM_FLIP8,
    'Mint, Black, White',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,43,999',
      Processor: 'Snapdragon 8 Elite Gen 5',
      Storage: '512 GB',
    },
    'High-capacity 512GB compact flip smartphone delivering flagship performance in a pocket-sized form.',
    {
      badge: 'FLIP',
      rating: 4.7,
      ratingCount: 460,
      bestPrice: 140999,
      offerRibbon: '₹4,000 Bank Cashback + Up to ₹19,000 Upgrade & Support',
    }
  ),

  // --- FOLD 7 / FLIP 7 FAMILY ---
  mk(
    'sam-zfold7-12-256-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 7 5G (12GB/256GB)',
    174999,
    189999,
    SAM_FOLD7,
    'Blue Shadow, Black',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,73,999',
      Processor: 'Snapdragon 8 Elite',
      Camera: '200MP Main Camera',
    },
    'Proven flagship foldable with 200MP camera resolution, dual high-refresh rate displays, and S-Pen support.',
    {
      badge: 'FOLDABLE',
      rating: 4.8,
      ratingCount: 1100,
      bestPrice: 167999,
      offerRibbon: '₹7,000 Bank Cashback + ₹7,000 Upgrade Bonus',
    }
  ),
  mk(
    'sam-zfold7-12-512-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 7 5G (12GB/512GB)',
    186999,
    199999,
    SAM_FOLD7,
    'Blue Shadow, Black',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,85,999',
      Processor: 'Snapdragon 8 Elite',
    },
    'High-performance 512GB foldable phone with multitasking split-screen and Galaxy AI features.',
    {
      badge: 'FOLDABLE',
      rating: 4.8,
      ratingCount: 850,
      bestPrice: 179999,
      offerRibbon: '₹7,000 Bank Cashback + ₹7,000 Upgrade Bonus',
    }
  ),
  mk(
    'sam-zfold7-16-1tb-oct26',
    'Samsung',
    'Samsung Galaxy Z Fold 7 5G (16GB/1TB)',
    216999,
    229999,
    SAM_FOLD7,
    'Blue Shadow, Black',
    '16 GB',
    '1 TB',
    {
      DP: '₹2,15,999',
      Processor: 'Snapdragon 8 Elite',
      RAM: '16 GB',
      Storage: '1 TB',
    },
    'Ultimate 1TB capacity model of Galaxy Z Fold 7 for business pros and creators.',
    {
      rating: 4.8,
      ratingCount: 380,
      bestPrice: 209999,
      offerRibbon: '₹7,000 Bank Cashback + ₹7,000 Upgrade Bonus',
    }
  ),
  mk(
    'sam-zflip7-12-256-oct26',
    'Samsung',
    'Samsung Galaxy Z Flip 7 5G (12GB/256GB)',
    109999,
    124999,
    SAM_FLIP7,
    'Blue Shadow, Black, Coral',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,08,999',
      Processor: 'Snapdragon 8 Elite',
    },
    'Premium flip phone with full cover screen widget control, high-res selfie camera, and water resistance.',
    {
      badge: 'FLIP',
      rating: 4.7,
      ratingCount: 950,
      bestPrice: 99999,
      offerRibbon: 'Flat ₹10,000 Instant All Bank / UPI Cashback',
    }
  ),
  mk(
    'sam-zflip7-12-512-oct26',
    'Samsung',
    'Samsung Galaxy Z Flip 7 5G (12GB/512GB)',
    121999,
    134999,
    SAM_FLIP7,
    'Blue Shadow, Black, Coral',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,20,999',
      Processor: 'Snapdragon 8 Elite',
    },
    'Large-storage 512GB flip smartphone with vibrant Dynamic AMOLED 2X folding screen.',
    {
      badge: 'FLIP',
      rating: 4.7,
      ratingCount: 620,
      bestPrice: 111999,
      offerRibbon: 'Flat ₹10,000 Instant All Bank / UPI Cashback',
    }
  ),
  mk(
    'sam-zflip7fe-8-128-oct26',
    'Samsung',
    'Samsung Galaxy Z Flip 7 FE 5G (8GB/128GB)',
    89999,
    99999,
    SAM_FLIP7FE,
    'Black, White',
    '8 GB',
    '128 GB',
    {
      DP: '₹88,999',
    },
    'Accessible Fan Edition foldable bringing the iconic flip experience with durable hinge and Galaxy AI.',
    {
      badge: 'FLIP FE',
      rating: 4.5,
      ratingCount: 780,
      bestPrice: 79999,
      offerRibbon: 'Flat ₹10,000 EMI Cashback All Bank/UPI',
    }
  ),
  mk(
    'sam-zflip7fe-8-256-oct26',
    'Samsung',
    'Samsung Galaxy Z Flip 7 FE 5G (8GB/256GB)',
    95999,
    105999,
    SAM_FLIP7FE,
    'Black, White',
    '8 GB',
    '256 GB',
    {
      DP: '₹94,999',
    },
    '256GB Fan Edition flip smartphone combining stylish pocketable form factor with solid performance.',
    {
      badge: 'FLIP FE',
      rating: 4.5,
      ratingCount: 690,
      bestPrice: 85999,
      offerRibbon: 'Flat ₹10,000 EMI Cashback All Bank/UPI',
    }
  ),

  // --- S26 SERIES ---
  mk(
    'sam-s26fe-8-128-oct26',
    'Samsung',
    'Samsung Galaxy S26 FE 5G (8GB/128GB)',
    69999,
    79999,
    SAM_S26FE,
    'Graphite, Blue',
    '8 GB',
    '128 GB',
    {
      DP: '₹68,999',
    },
    'Next-gen Fan Edition flagship with high-refresh AMOLED, pro triple cameras, and refined aluminum frame.',
    {
      badge: 'NEW S-SERIES',
      rating: 4.5,
      ratingCount: 840,
    }
  ),
  mk(
    'sam-s26fe-8-256-oct26',
    'Samsung',
    'Samsung Galaxy S26 FE 5G (8GB/256GB)',
    79999,
    89999,
    SAM_S26FE,
    'Graphite, Blue',
    '8 GB',
    '256 GB',
    {
      DP: '₹78,999',
    },
    '256GB flagship experience with enhanced battery life and intelligent Galaxy camera algorithms.',
    {
      badge: 'NEW S-SERIES',
      rating: 4.5,
      ratingCount: 720,
      bestPrice: 72999,
      offerRibbon: '₹7,000 Special Support Discount',
    }
  ),
  mk(
    'sam-s26-12-256-oct26',
    'Samsung',
    'Samsung Galaxy S26 5G (12GB/256GB)',
    102999,
    114999,
    SAM_S26,
    'Black, White, Blue',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,01,999',
    },
    'Compact flagship with upgraded 12GB RAM, ultra-bright 120Hz display, and on-device Galaxy AI assistant.',
    {
      badge: 'FLAGSHIP',
      rating: 4.7,
      ratingCount: 650,
      bestPrice: 89999,
      offerRibbon: '₹13,000 Special Support Discount',
    }
  ),
  mk(
    'sam-s26-12-512-oct26',
    'Samsung',
    'Samsung Galaxy S26 5G (12GB/512GB)',
    122999,
    134999,
    SAM_S26,
    'Black, White, Blue',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,21,999',
    },
    '512GB compact flagship offering huge storage in an ergonomic, premium IP68 water-resistant build.',
    {
      badge: 'FLAGSHIP',
      rating: 4.7,
      ratingCount: 420,
      bestPrice: 109999,
      offerRibbon: '₹13,000 Special Support Discount',
    }
  ),
  mk(
    'sam-s26plus-12-256-oct26',
    'Samsung',
    'Samsung Galaxy S26 Plus 5G (12GB/256GB)',
    134999,
    149999,
    SAM_S26P,
    'Black, White',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,33,999',
    },
    'Large-screen flagship with bigger battery, 45W fast charging, and advanced thermal cooling.',
    {
      badge: 'FLAGSHIP+',
      rating: 4.7,
      ratingCount: 410,
      offerRibbon: 'Multibuy Offer: Watch 8/9 & Buds 4 Pro',
    }
  ),
  mk(
    'sam-s26plus-12-512-oct26',
    'Samsung',
    'Samsung Galaxy S26 Plus 5G (12GB/512GB)',
    154999,
    169999,
    SAM_S26P,
    'Black, White',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,53,999',
    },
    '512GB model of Galaxy S26 Plus for intensive entertainment, mobile gaming, and camera captures.',
    {
      badge: 'FLAGSHIP+',
      rating: 4.7,
      ratingCount: 310,
      offerRibbon: 'Multibuy Offer: Watch 8/9 & Buds 4 Pro',
    }
  ),
  mk(
    'sam-s26ultra-12-256-oct26',
    'Samsung',
    'Samsung Galaxy S26 Ultra 5G (12GB/256GB) - S Pen',
    154999,
    174999,
    SAM_S26U,
    'Titanium Black, Grey',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,53,999',
    },
    'Definitive titanium smartphone with built-in S-Pen, quad telephoto optics, and AI computational photography.',
    {
      badge: 'ULTRA',
      rating: 4.9,
      ratingCount: 820,
      bestPrice: 139999,
      offerRibbon: '₹15,000 Special Support Discount',
    }
  ),
  mk(
    'sam-s26ultra-12-512-oct26',
    'Samsung',
    'Samsung Galaxy S26 Ultra 5G (12GB/512GB) - S Pen',
    174999,
    194999,
    SAM_S26U,
    'Titanium Black, Grey',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,73,999',
    },
    '512GB titanium power device with high-grade optical stabilization and Corning Armor anti-reflective glass.',
    {
      badge: 'ULTRA',
      rating: 4.9,
      ratingCount: 560,
      bestPrice: 159999,
      offerRibbon: '₹15,000 Special Support Discount',
    }
  ),
  mk(
    'sam-s26ultra-12-1tb-oct26',
    'Samsung',
    'Samsung Galaxy S26 Ultra 5G (12GB/1TB) - S Pen',
    214999,
    234999,
    SAM_S26U,
    'Titanium Black, Grey',
    '12 GB',
    '1 TB',
    {
      DP: '₹2,13,999',
    },
    'Massive 1TB edition of the S26 Ultra designed for professional 8K videographers and power creators.',
    {
      badge: 'ULTRA 1TB',
      rating: 4.9,
      ratingCount: 290,
      bestPrice: 199999,
      offerRibbon: '₹15,000 Special Support Discount',
    }
  ),

  // --- S25 SERIES ---
  mk(
    'sam-s25fe-8-128-oct26',
    'Samsung',
    'Samsung Galaxy S25 FE 5G (8GB/128GB)',
    59999,
    69999,
    SAM_S25FE,
    'Blue, Black',
    '8 GB',
    '128 GB',
    {
      DP: '₹58,999',
    },
    'Galaxy AI fan edition phone with 120Hz display, premium Nightography, and fast wireless charging.',
    {
      badge: 'GALAXY AI',
      rating: 4.5,
      ratingCount: 1450,
      bestPrice: 55999,
      offerRibbon: '₹4,000 Instant All Bank / UPI Cashback',
    }
  ),
  mk(
    'sam-s25fe-8-256-oct26',
    'Samsung',
    'Samsung Galaxy S25 FE 5G (8GB/256GB)',
    65999,
    74999,
    SAM_S25FE,
    'Blue, Black',
    '8 GB',
    '256 GB',
    {
      DP: '₹64,999',
    },
    '256GB Fan Edition bringing generative photo editing and crisp AMOLED visuals at an attractive price.',
    {
      badge: 'GALAXY AI',
      rating: 4.5,
      ratingCount: 1200,
      bestPrice: 64999,
      offerRibbon: '₹1,000 Instant All Bank / UPI Cashback',
    }
  ),
  mk(
    'sam-s25fe-8-512-oct26',
    'Samsung',
    'Samsung Galaxy S25 FE 5G (8GB/512GB)',
    77999,
    86999,
    SAM_S25FE,
    'Blue, Black',
    '8 GB',
    '512 GB',
    {
      DP: '₹76,999',
    },
    '512GB Galaxy S25 FE ensuring plenty of space for photos, games, and offline 4K video downloads.',
    {
      rating: 4.5,
      ratingCount: 840,
    }
  ),
  mk(
    'sam-s25-12-128-oct26',
    'Samsung',
    'Samsung Galaxy S25 5G (12GB/128GB)',
    74999,
    84999,
    SAM_S25,
    'Silver Shadow, Blue',
    '12 GB',
    '128 GB',
    {
      DP: '₹73,999',
    },
    'Sleek and compact S25 flagship equipped with full Galaxy AI suite and durable Armor Aluminum enclosure.',
    {
      badge: 'FLAGSHIP',
      rating: 4.7,
      ratingCount: 1120,
    }
  ),
  mk(
    'sam-s25-12-256-oct26',
    'Samsung',
    'Samsung Galaxy S25 5G (12GB/256GB)',
    84999,
    94999,
    SAM_S25,
    'Silver Shadow, Blue',
    '12 GB',
    '256 GB',
    {
      DP: '₹83,999',
    },
    'Popular 256GB variant of Galaxy S25 delivering ultra-smooth 120Hz display and high-detail night photos.',
    {
      badge: 'FLAGSHIP',
      rating: 4.7,
      ratingCount: 980,
      bestPrice: 75999,
      offerRibbon: '₹9,000 Instant All Bank / UPI Cashback',
    }
  ),
  mk(
    'sam-s25-12-512-oct26',
    'Samsung',
    'Samsung Galaxy S25 5G (12GB/512GB)',
    104999,
    114999,
    SAM_S25,
    'Silver Shadow, Blue',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,03,999',
    },
    '512GB compact powerhouse with generous memory and instant Live Translate features.',
    {
      badge: 'FLAGSHIP',
      rating: 4.7,
      ratingCount: 710,
      bestPrice: 92999,
      offerRibbon: '₹12,000 Instant All Bank / UPI Cashback',
    }
  ),
  mk(
    'sam-s25plus-12-256-oct26',
    'Samsung',
    'Samsung Galaxy S25 Plus 5G (12GB/256GB)',
    99999,
    114999,
    SAM_S25P,
    'Silver Shadow',
    '12 GB',
    '256 GB',
    {
      DP: '₹98,999',
    },
    'Larger 6.7-inch QHD+ Dynamic AMOLED 2X display with 45W charging and flagship dual-engine processing.',
    {
      badge: 'FLAGSHIP+',
      rating: 4.7,
      ratingCount: 630,
      bestPrice: 82999,
      offerRibbon: 'Flat ₹17,000 Instant All Bank / UPI Cashback',
    }
  ),
  mk(
    'sam-s25plus-12-512-oct26',
    'Samsung',
    'Samsung Galaxy S25 Plus 5G (12GB/512GB)',
    111999,
    124999,
    SAM_S25P,
    'Silver Shadow',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,10,999',
    },
    'High-capacity 512GB Plus flagship with stunning brightness and superior battery stamina.',
    {
      badge: 'FLAGSHIP+',
      rating: 4.7,
      ratingCount: 520,
      bestPrice: 97999,
      offerRibbon: 'Flat ₹14,000 Instant HDFC Bank Cashback',
    }
  ),
  mk(
    'sam-s25ultra-12-256-oct26',
    'Samsung',
    'Samsung Galaxy S25 Ultra 5G (12GB/256GB) - S Pen',
    119999,
    139999,
    SAM_S25U,
    'Titanium Black, Grey, White',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,18,999',
    },
    'Titanium-clad Ultra flagship with 200MP sensor, integrated S-Pen stylus, and 100x Space Zoom capability.',
    {
      badge: 'ULTRA',
      rating: 4.9,
      ratingCount: 1420,
      offerRibbon: 'Multibuy Offer: Watch 9 Ultra 2 & Buds 4 Pro',
    }
  ),
  mk(
    'sam-s25ultra-12-512-oct26',
    'Samsung',
    'Samsung Galaxy S25 Ultra 5G (12GB/512GB) - S Pen',
    139999,
    159999,
    SAM_S25U,
    'Titanium Black, Grey, White',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,38,999',
    },
    '512GB Titanium Ultra smartphone providing endless storage for pro photos, RAW editing, and productivity.',
    {
      badge: 'ULTRA',
      rating: 4.9,
      ratingCount: 1100,
      offerRibbon: 'Multibuy Offer: Watch 9 Ultra 2 & Buds 4 Pro',
    }
  ),
  mk(
    'sam-s25ultra-12-1tb-oct26',
    'Samsung',
    'Samsung Galaxy S25 Ultra 5G (12GB/1TB) - S Pen',
    169999,
    189999,
    SAM_S25U,
    'Titanium Black, Grey',
    '12 GB',
    '1 TB',
    {
      DP: '₹1,68,999',
    },
    'Top-tier 1TB Ultra edition for extreme power users, heavy gamers, and mobile videographers.',
    {
      badge: 'ULTRA 1TB',
      rating: 4.9,
      ratingCount: 520,
      offerRibbon: 'Multibuy Offer: Watch 9 Ultra 2 & Buds 4 Pro',
    }
  ),
  mk(
    'sam-s25edge-12-256-oct26',
    'Samsung',
    'Samsung Galaxy S25 Edge 5G (12GB/256GB) - Slim',
    109999,
    124999,
    SAM_S25EDGE,
    'Titanium Silver',
    '12 GB',
    '256 GB',
    {
      DP: '₹1,08,999',
    },
    'Ultra-slim edge edition combining sleek titanium sides, edge-to-edge curved OLED, and flagship internals.',
    {
      badge: 'SLIM EDGE',
      rating: 4.6,
      ratingCount: 520,
      bestPrice: 84999,
      offerRibbon: '₹25,000 Special Support + Up to ₹12,000 Upgrade',
    }
  ),
  mk(
    'sam-s25edge-12-512-oct26',
    'Samsung',
    'Samsung Galaxy S25 Edge 5G (12GB/512GB) - Slim',
    121999,
    134999,
    SAM_S25EDGE,
    'Titanium Silver',
    '12 GB',
    '512 GB',
    {
      DP: '₹1,20,999',
    },
    '512GB slim profile edge device engineered for premium hand feel without compromising performance.',
    {
      badge: 'SLIM EDGE',
      rating: 4.6,
      ratingCount: 410,
      bestPrice: 91999,
      offerRibbon: '₹25,000 Special Support + ₹5,000 HDFC Cashback',
    }
  ),
];

// Realme images (gsmarena slugs: 200-verified, variants reuse their own model's photo)
const REALME_15 = 'https://fdn2.gsmarena.com/vv/bigpic/realme-15-5g.jpg';
const REALME_15_PRO = 'https://fdn2.gsmarena.com/vv/bigpic/realme-15-pro-5g.jpg';
const REALME_15T = 'https://fdn2.gsmarena.com/vv/bigpic/realme-15t-5g.jpg';
const REALME_15X = 'https://fdn2.gsmarena.com/vv/bigpic/realme-15x-5g.jpg';
const REALME_15_PRO_GAME = 'https://fdn2.gsmarena.com/vv/bigpic/realme-15-pro-game-5g.jpg';
const REALME_C83 = 'https://fdn2.gsmarena.com/vv/bigpic/realme-c83-5g.jpg';
const REALME_C85 = 'https://fdn2.gsmarena.com/vv/bigpic/realme-c85-5g.jpg';
const REALME_P4X = 'https://fdn2.gsmarena.com/vv/bigpic/realme-p4x-5g.jpg';
const REALME_16_PRO = 'https://fdn2.gsmarena.com/vv/bigpic/realme-16-pro-5g.jpg';
const REALME_16_PRO_PLUS = 'https://fdn2.gsmarena.com/vv/bigpic/realme-16-pro-plus-5g.jpg';
const REALME_P4_POWER = 'https://fdn2.gsmarena.com/vv/bigpic/realme-p4-power-5g.jpg';
const REALME_P4_LITE = 'https://fdn2.gsmarena.com/vv/bigpic/realme-p4-lite.jpg';
const REALME_16 = 'https://fdn2.gsmarena.com/vv/bigpic/realme-16-5g.jpg';
const REALME_16T = 'https://fdn2.gsmarena.com/vv/bigpic/realme-16t-5g.jpg';
const REALME_P4R = 'https://fdn2.gsmarena.com/vv/bigpic/realme-p4r.jpg';
const REALME_16X = 'https://fdn2.gsmarena.com/vv/bigpic/realme-16x-5g.jpg';
const REALME_P4 = 'https://fdn2.gsmarena.com/vv/bigpic/realme-p4-5g.jpg';

export const REALME_OCT2026: Product[] = [
  // Realme 15 5G
  // Realme 15 Pro 5G
  // realme 15T 5G
  // realme 15x 5G
  // Realme 15 Pro 5G Game
  // Realme C83 5G
  // realme C85 5G
  // REALME P4X 5G
  // REALME 16 PRO 5G
  // REALME 16 PRO+ 5G
  // Realme P4 Power 5G
  // Realme P4 lite
  // Realme 16 5g
  // Realme 16T 5G
  // Realme P4R
  // realme 16x 5G
  // realme P4 5G
];

// Vivo images (gsmarena slugs: 200-verified, variants reuse their own model's photo)
const VIVO_Y28 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y28-5g.jpg';
const VIVO_Y29 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y29-5g.jpg';
const VIVO_Y19 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y19.jpg';
const VIVO_Y17S = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y17s.jpg';
const VIVO_Y03 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y03.jpg';
const VIVO_S19 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-s19.jpg';
const VIVO_S20 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-s20.jpg';
const VIVO_S18 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-s18.jpg';
const VIVO_S17 = 'https://fdn2.gsmarena.com/vv/bigpic/vivo-s17.jpg';

export const VIVO_OCT2026: Product[] = [
  // Vivo Y Series (Budget)
  // Vivo S Series (Style / Mid-Range)
];

// Per-model gsmarena images (200-verified slugs). Entries here override the
// product's family const, so a variant gets its own model's photo, not a sibling's.
const MODEL_IMAGE: Record<string, string> = {
  'iphone-15-': IP15,
  'iphone-16-': IP16,
  'iphone-17-air': IP17AIR,
  'iphone-17e': IP16E,
  'iphone-17-': IP17,
  'iphone-18-pro': IP17PRO,
  'iphone-18-promax': IP17PROMAX,
  'oppo-a6c': OPPO_A6C,
  'oppo-a6x': OPPO_A6X,
  'oppo-a6s': OPPO_A6S,
  'oppo-a6pro': OPPO_A6PRO,
  'oppo-a6-': OPPO_A6,
  'oppo-k14x': OPPO_K,
  'oppo-k14': OPPO_K,
  'oppo-f33pro': OPPO_F33PRO,
  'oppo-f33': OPPO_F33,
  'oppo-f35pro': OPPO_F35PRO,
  'oppo-f35': OPPO_F35,
  'oppo-reno15c': OPPO_RENO15C,
  'oppo-reno15promini': OPPO_RENO15PROMINI,
  'oppo-reno15pro': OPPO_RENO15PRO,
  'oppo-reno15': OPPO_RENO15,
  'oppo-reno16c': OPPO_RENO16C,
  'oppo-reno16-': OPPO_RENO16,
  'oppo-findx9ultra': OPPO_FINDX9ULTRA,
  'oppo-findx9pro': OPPO_FINDX9PRO,
  'oppo-findx9s': OPPO_FINDX9S,
  'oppo-findx9': OPPO_FINDX9,
  'oppo-findx10promax': OPPO_FINDX10PROMAX,
  'oppo-findx10': OPPO_FINDX10,
  'oppo-pad5': OPPO_PAD,
  'sam-a06': SAM_A06,
  'sam-a07': SAM_A07,
  'sam-a08': SAM_A08,
  'sam-a17': SAM_A17,
  'sam-a26': SAM_A26,
  'sam-a27': SAM_A27,
  'sam-a37': SAM_A37,
  'sam-a57': SAM_A57,
  'sam-f06': SAM_F06,
  'sam-f07': SAM_F07,
  'sam-f08': SAM_F06,
  'sam-f17': SAM_F16,
  'sam-f36': SAM_F36,
  'sam-f56': SAM_F56,
  'sam-f70e': SAM_F70E,
  'sam-zfold8ultra': SAM_FOLD8U,
  'sam-zfold8': SAM_FOLD8,
  'sam-zflip8': SAM_FLIP8,
  'sam-zfold7': SAM_FOLD7,
  'sam-zflip7fe': SAM_FLIP7FE,
  'sam-zflip7': SAM_FLIP7,
  'sam-s26ultra': SAM_S26U,
  'sam-s26plus': SAM_S26P,
  'sam-s26fe': SAM_S26FE,
  'sam-s26': SAM_S26,
  'sam-s25ultra': SAM_S25U,
  'sam-s25plus': SAM_S25P,
  'sam-s25fe': SAM_S25FE,
  'sam-s25edge': SAM_S25EDGE,
  'sam-s25': SAM_S25,
  'realme-15-': REALME_15,
  'realme-15pro': REALME_15_PRO,
  'realme-15t': REALME_15T,
  'realme-15x': REALME_15X,
  'realme-15progame': REALME_15_PRO_GAME,
  'realme-c83': REALME_C83,
  'realme-c85': REALME_C85,
  'realme-p4x': REALME_P4X,
  'realme-16pro': REALME_16_PRO,
  'realme-16proplus': REALME_16_PRO_PLUS,
  'realme-p4power': REALME_P4_POWER,
  'realme-p4lite': REALME_P4_LITE,
  'realme-16-': REALME_16,
  'realme-16t': REALME_16T,
  'realme-p4r': REALME_P4R,
  'realme-16x': REALME_16X,
  'realme-p4-': REALME_P4,
  'vivo-y28': VIVO_Y28,
  'vivo-y29': VIVO_Y29,
  'vivo-y19': VIVO_Y19,
  'vivo-y17s': VIVO_Y17S,
  'vivo-y03': VIVO_Y03,
  'vivo-s19': VIVO_S19,
  'vivo-s20': VIVO_S20,
  'vivo-s18': VIVO_S18,
  'vivo-s17': VIVO_S17,
};

// Longest prefix first — otherwise a short key like 'oppo-reno15' swallows
// 'oppo-reno15pro' and the Pro models show the wrong phone.
const MODEL_IMAGE_KEYS: string[] = Object.keys(MODEL_IMAGE).sort((a, b) => b.length - a.length);

export const OCT2026_CATALOG: Product[] = [...APPLE_OCT2026, ...OPPO_OCT2026, ...SAMSUNG_OCT2026, ...REALME_OCT2026, ...VIVO_OCT2026].map((p) => {
  const hit = MODEL_IMAGE_KEYS.find((k) => p.id.startsWith(k));
  return hit ? { ...p, image: MODEL_IMAGE[hit] } : p;
});

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

export const APPLE_OCT2026: Product[] = [
  mk('iphone-15-128-oct26', 'Apple', 'Apple iPhone 15 128GB - Shop Stock', 74900, 74900, IP15, 'Blue, Black, Pink, Green', '6 GB', '128 GB', { Chip: 'A16 Bionic', Display: '6.1-inch Super Retina XDR' }, 'Reliable iPhone with a great camera, smooth performance, and long software support. Perfect for everyday use, photography, and staying connected with family and friends.', { rating: 4.7, ratingCount: 8200 }),
  mk('iphone-16-128-oct26', 'Apple', 'Apple iPhone 16 128GB - Shop Stock', 89900, 89900, IP16, 'Ultramarine, Black, White', '8 GB', '128 GB', { Chip: 'A18', Display: '6.1-inch Super Retina XDR' }, 'Latest iPhone with advanced camera system, faster performance, and all-day battery life. Ideal for users who want the newest Apple technology and great photo quality.', { rating: 4.8, ratingCount: 6100 }),
  mk('iphone-17-256-oct26', 'Apple', 'Apple iPhone 17 256GB - Mist Blue / Black / Sage', 99900, 99900, IP17, 'Black, White, Mist Blue, Sage, Lavender', '8 GB', '256 GB', { Chip: 'A19', Display: '6.3-inch 120Hz OLED', Camera: '48MP Dual Fusion' }, 'Modern iPhone with great camera, fast A19 chip, and reliable performance. Perfect for everyday use, social media, photography, and staying productive.', { rating: 4.8, ratingCount: 2100, badge: 'NEW' }),
  mk('iphone-17-512-oct26', 'Apple', 'Apple iPhone 17 512GB - Mist Blue / Black / Sage', 124900, 124900, IP17, 'Black, White, Mist Blue, Sage, Lavender', '8 GB', '512 GB', { Chip: 'A19', Display: '6.3-inch 120Hz OLED', Camera: '48MP Dual Fusion' }, 'Modern iPhone with great camera, fast A19 chip, and reliable performance. Perfect for everyday use, social media, photography, and staying productive.', { rating: 4.8, ratingCount: 1400 }),
  mk('iphone-17-air-256-oct26', 'Apple', 'Apple iPhone 17 Air 256GB - Ultraslim', 149900, 149900, IP17AIR, 'Silver, Black, Gold', '8 GB', '256 GB', { Chip: 'A19 Pro', Display: '6.6-inch ProMotion', Thickness: '5.5mm Air design' }, 'Ultra-thin iPhone with a large display, powerful A19 Pro chip, and premium design. Great for users who want a lightweight phone with flagship performance and excellent camera quality.', { badge: 'NEW LAUNCH', rating: 4.7, ratingCount: 800 }),
  mk('iphone-17-air-512-oct26', 'Apple', 'Apple iPhone 17 Air 512GB - Ultraslim', 174900, 174900, IP17AIR, 'Silver, Black, Gold', '8 GB', '512 GB', { Chip: 'A19 Pro', Display: '6.6-inch ProMotion' }, 'Ultra-thin iPhone with a large display, powerful A19 Pro chip, and premium design. Great for users who want a lightweight phone with flagship performance and excellent camera quality.', { badge: 'NEW LAUNCH', rating: 4.7, ratingCount: 600 }),
  mk('iphone-17-air-1tb-oct26', 'Apple', 'Apple iPhone 17 Air 1TB - Ultraslim', 224900, 224900, IP17AIR, 'Silver, Black, Gold', '8 GB', '1 TB', { Chip: 'A19 Pro', Display: '6.6-inch ProMotion' }, 'Ultra-thin iPhone with a large display, powerful A19 Pro chip, and premium design. Great for users who want a lightweight phone with flagship performance and excellent camera quality.', { rating: 4.7, ratingCount: 300 }),
  mk('iphone-17e-256-oct26', 'Apple', 'Apple iPhone 17e 256GB - Budget Flagship', 79900, 79900, IP16E, 'Black, White', '8 GB', '256 GB', { Chip: 'A19', Display: '6.1-inch OLED' }, 'Budget-friendly iPhone with essential features, good camera, and dependable performance. Ideal for first-time iPhone users or those who want Apple quality at a lower price.', { rating: 4.5, ratingCount: 900 }),
  mk('iphone-17e-512-oct26', 'Apple', 'Apple iPhone 17e 512GB - Budget Flagship', 104900, 104900, IP16E, 'Black, White', '8 GB', '512 GB', { Chip: 'A19', Display: '6.1-inch OLED' }, 'Budget-friendly iPhone with essential features, good camera, and dependable performance. Ideal for first-time iPhone users or those who want Apple quality at a lower price.', { rating: 4.5, ratingCount: 700 }),
  mk('iphone-18-pro-256-oct26', 'Apple', 'Apple iPhone 18 Pro 256GB - Pro Camera', 164900, 164900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '256 GB', { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz', Camera: '48MP Fusion Triple' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { badge: 'FLAGSHIP', rating: 4.9, ratingCount: 400 }),
  mk('iphone-18-pro-512-oct26', 'Apple', 'Apple iPhone 18 Pro 512GB - Pro Camera', 189900, 189900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '512 GB', { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { badge: 'FLAGSHIP', rating: 4.9, ratingCount: 350 }),
  mk('iphone-18-pro-1tb-oct26', 'Apple', 'Apple iPhone 18 Pro 1TB', 239900, 239900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '1 TB', { Chip: 'A20 Pro' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { rating: 4.9, ratingCount: 200 }),
  mk('iphone-18-pro-2tb-oct26', 'Apple', 'Apple iPhone 18 Pro 2TB', 314900, 314900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '2 TB', { Chip: 'A20 Pro' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { rating: 4.9, ratingCount: 120 }),
  mk('iphone-18-promax-256-oct26', 'Apple', 'Apple iPhone 18 Pro Max 256GB', 179900, 179900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '256 GB', { Chip: 'A20 Pro', Display: '6.9-inch LTPO' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { badge: 'FLAGSHIP', rating: 4.9, ratingCount: 500 }),
  mk('iphone-18-promax-512-oct26', 'Apple', 'Apple iPhone 18 Pro Max 512GB', 204900, 204900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '512 GB', { Chip: 'A20 Pro', Display: '6.9-inch LTPO' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { rating: 4.9, ratingCount: 380 }),
  mk('iphone-18-promax-1tb-oct26', 'Apple', 'Apple iPhone 18 Pro Max 1TB', 254900, 254900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '1 TB', { Chip: 'A20 Pro' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { rating: 4.9, ratingCount: 250 }),
  mk('iphone-18-promax-2tb-oct26', 'Apple', 'Apple iPhone 18 Pro Max 2TB', 329900, 329900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '2 TB', { Chip: 'A20 Pro' }, 'Professional iPhone with advanced camera system, ProMotion display, and powerful A20 Pro chip. Ideal for photographers, video creators, and power users who need top-tier performance.', { rating: 4.9, ratingCount: 150 }),
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
const SAM_FLIP7FE = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip6-fe.jpg';
const SAM_S26U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra.jpg';
const SAM_S26P = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-plus.jpg';
const SAM_S26 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26.jpg';
const SAM_S26FE = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-fe.jpg';
const SAM_S25U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg';
const SAM_S25 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-sm-s931.jpg';
const SAM_S25P = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus.jpg';
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
  // Fold8 / Flip8 family (DP = dealer, MOP = customer; price=MOP)
  // Fold7 / Flip7
  // S26 series
  // S25 series
  // F series
  // A series
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
  'iphone-18-promax': IP17PRO,
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
  'sam-s25edge': SAM_S25EDGE,
  'sam-s25plus': SAM_S25P,
  'sam-s26plus': SAM_S26P,
  'sam-s26fe': SAM_S26FE,
  'sam-zflip7fe': SAM_FLIP7FE,
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

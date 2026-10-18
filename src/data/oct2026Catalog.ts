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
  mk('iphone-15-128-oct26', 'Apple', 'Apple iPhone 15 128GB - Shop Stock', 74900, 74900, IP15, 'Blue, Black, Pink, Green', '6 GB', '128 GB', { Chip: 'A16 Bionic', Display: '6.1-inch Super Retina XDR' }, { rating: 4.7, ratingCount: 8200 }),
  mk('iphone-16-128-oct26', 'Apple', 'Apple iPhone 16 128GB - Shop Stock', 89900, 89900, IP16, 'Ultramarine, Black, White', '8 GB', '128 GB', { Chip: 'A18', Display: '6.1-inch Super Retina XDR' }, { rating: 4.8, ratingCount: 6100 }),
  mk('iphone-17-256-oct26', 'Apple', 'Apple iPhone 17 256GB - Mist Blue / Black / Sage', 99900, 99900, IP17, 'Black, White, Mist Blue, Sage, Lavender', '8 GB', '256 GB', { Chip: 'A19', Display: '6.3-inch 120Hz OLED', Camera: '48MP Dual Fusion' }, { rating: 4.8, ratingCount: 2100, badge: 'NEW' }),
  mk('iphone-17-512-oct26', 'Apple', 'Apple iPhone 17 512GB - Mist Blue / Black / Sage', 124900, 124900, IP17, 'Black, White, Mist Blue, Sage, Lavender', '8 GB', '512 GB', { Chip: 'A19', Display: '6.3-inch 120Hz OLED', Camera: '48MP Dual Fusion' }, { rating: 4.8, ratingCount: 1400 }),
  mk('iphone-17-air-256-oct26', 'Apple', 'Apple iPhone 17 Air 256GB - Ultraslim', 149900, 149900, IP17AIR, 'Silver, Black, Gold', '8 GB', '256 GB', { Chip: 'A19 Pro', Display: '6.6-inch ProMotion', Thickness: '5.5mm Air design' }, { badge: 'NEW LAUNCH', rating: 4.7, ratingCount: 800 }),
  mk('iphone-17-air-512-oct26', 'Apple', 'Apple iPhone 17 Air 512GB - Ultraslim', 174900, 174900, IP17AIR, 'Silver, Black, Gold', '8 GB', '512 GB', { Chip: 'A19 Pro', Display: '6.6-inch ProMotion' }, { badge: 'NEW LAUNCH', rating: 4.7, ratingCount: 600 }),
  mk('iphone-17-air-1tb-oct26', 'Apple', 'Apple iPhone 17 Air 1TB - Ultraslim', 224900, 224900, IP17AIR, 'Silver, Black, Gold', '8 GB', '1 TB', { Chip: 'A19 Pro', Display: '6.6-inch ProMotion' }, { rating: 4.7, ratingCount: 300 }),
  mk('iphone-17e-256-oct26', 'Apple', 'Apple iPhone 17e 256GB - Budget Flagship', 79900, 79900, IP16E, 'Black, White', '8 GB', '256 GB', { Chip: 'A19', Display: '6.1-inch OLED' }, { rating: 4.5, ratingCount: 900 }),
  mk('iphone-17e-512-oct26', 'Apple', 'Apple iPhone 17e 512GB - Budget Flagship', 104900, 104900, IP16E, 'Black, White', '8 GB', '512 GB', { Chip: 'A19', Display: '6.1-inch OLED' }, { rating: 4.5, ratingCount: 700 }),
  mk('iphone-18-pro-256-oct26', 'Apple', 'Apple iPhone 18 Pro 256GB - Pro Camera', 164900, 164900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '256 GB', { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz', Camera: '48MP Fusion Triple' }, { badge: 'FLAGSHIP', rating: 4.9, ratingCount: 400 }),
  mk('iphone-18-pro-512-oct26', 'Apple', 'Apple iPhone 18 Pro 512GB - Pro Camera', 189900, 189900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '512 GB', { Chip: 'A20 Pro', Display: '6.3-inch LTPO 120Hz' }, { badge: 'FLAGSHIP', rating: 4.9, ratingCount: 350 }),
  mk('iphone-18-pro-1tb-oct26', 'Apple', 'Apple iPhone 18 Pro 1TB', 239900, 239900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '1 TB', { Chip: 'A20 Pro' }, { rating: 4.9, ratingCount: 200 }),
  mk('iphone-18-pro-2tb-oct26', 'Apple', 'Apple iPhone 18 Pro 2TB', 314900, 314900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '2 TB', { Chip: 'A20 Pro' }, { rating: 4.9, ratingCount: 120 }),
  mk('iphone-18-promax-256-oct26', 'Apple', 'Apple iPhone 18 Pro Max 256GB', 179900, 179900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '256 GB', { Chip: 'A20 Pro', Display: '6.9-inch LTPO' }, { badge: 'FLAGSHIP', rating: 4.9, ratingCount: 500 }),
  mk('iphone-18-promax-512-oct26', 'Apple', 'Apple iPhone 18 Pro Max 512GB', 204900, 204900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '512 GB', { Chip: 'A20 Pro', Display: '6.9-inch LTPO' }, { rating: 4.9, ratingCount: 380 }),
  mk('iphone-18-promax-1tb-oct26', 'Apple', 'Apple iPhone 18 Pro Max 1TB', 254900, 254900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '1 TB', { Chip: 'A20 Pro' }, { rating: 4.9, ratingCount: 250 }),
  mk('iphone-18-promax-2tb-oct26', 'Apple', 'Apple iPhone 18 Pro Max 2TB', 329900, 329900, IP17PRO, 'Silver, Cosmic Orange, Deep Blue', '12 GB', '2 TB', { Chip: 'A20 Pro' }, { rating: 4.9, ratingCount: 150 }),
];

// OPPO images (gsmarena verified slugs where available, family reuse for variants)
const OPPO_A6X = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6x.jpg';
const OPPO_A6 = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6.jpg';
const OPPO_A6PRO = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a6-pro.jpg';
const OPPO_K = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-k13-turbo-pro.jpg';
const OPPO_F = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno13-cn.jpg';
const OPPO_RENO = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno13-cn.jpg';
const OPPO_FIND = 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8-pro.jpg';
const OPPO_PAD = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80';

export const OPPO_OCT2026: Product[] = [
  // A Series
  mk('oppo-a6c-4-64-oct26', 'Oppo', 'Oppo A6C 4G (4GB/64GB) - Feather White, Stone Brown', 17999, 17999, OPPO_A6X, 'Feather White, Stone Brown', '4 GB', '64 GB', { Processor: 'Unisoc T7250', Camera: '5MP / 13MP', Battery: '7000mAh 15W', DP: '16980' }),
  mk('oppo-a6c-4-128-oct26', 'Oppo', 'Oppo A6C 4G (4GB/128GB) - Feather White, Stone Brown', 19999, 19999, OPPO_A6X, 'Feather White, Stone Brown', '4 GB', '128 GB', { Processor: 'Unisoc T7250', Camera: '5MP / 13MP', Battery: '7000mAh 15W', DP: '18867' }),
  mk('oppo-a6x-4-64-oct26', 'Oppo', 'Oppo A6X 5G (4GB/64GB) - Ice Blue, Olive Green', 19999, 19999, OPPO_A6X, 'Ice Blue, Olive Green', '4 GB', '64 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 13MP', Battery: '6500mAh 45W', DP: '18956' }),
  mk('oppo-a6x-4-128-oct26', 'Oppo', 'Oppo A6X 5G (4GB/128GB) - Ice Blue, Olive Green', 23999, 23999, OPPO_A6X, 'Ice Blue, Olive Green', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 13MP', Battery: '6500mAh 45W', DP: '22748' }),
  mk('oppo-a6x-6-128-oct26', 'Oppo', 'Oppo A6X 5G (6GB/128GB) - Ice Blue, Olive Green', 26999, 26999, OPPO_A6X, 'Ice Blue, Olive Green', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 13MP', Battery: '6500mAh 45W', DP: '25591' }),
  mk('oppo-a6s-4-128-oct26', 'Oppo', 'Oppo A6S 5G (4GB/128GB) - Aurora Gold, Plum Purple', 24999, 24999, OPPO_A6, 'Aurora Gold, Plum Purple', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '23696' }),
  mk('oppo-a6s-6-128-oct26', 'Oppo', 'Oppo A6S 5G (6GB/128GB) - Aurora Gold, Plum Purple', 27999, 27999, OPPO_A6, 'Aurora Gold, Plum Purple', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '26539' }),
  mk('oppo-a6-4-128-oct26', 'Oppo', 'Oppo A6 5G (4GB/128GB) - Sapphire Blue, Ice White, Sakura Pink', 29999, 29999, OPPO_A6, 'Sapphire Blue, Ice White, Sakura Pink', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+2MP', Battery: '7000mAh 45W', DP: '28435' }),
  mk('oppo-a6-6-128-oct26', 'Oppo', 'Oppo A6 5G (6GB/128GB) - Sapphire Blue, Ice White, Sakura Pink', 31999, 31999, OPPO_A6, 'Sapphire Blue, Ice White, Sakura Pink', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+2MP', Battery: '7000mAh 45W', DP: '30331' }),
  mk('oppo-a6-6-256-oct26', 'Oppo', 'Oppo A6 5G (6GB/256GB) - Sapphire Blue, Ice White, Sakura Pink', 35999, 35999, OPPO_A6, 'Sapphire Blue, Ice White, Sakura Pink', '6 GB', '256 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+2MP', Battery: '7000mAh 45W', DP: '34122' }),
  mk('oppo-a6pro-8-128-oct26', 'Oppo', 'Oppo A6 Pro 5G (8GB/128GB) - Aurora Gold, Cappuccino Brown', 32999, 32999, OPPO_A6PRO, 'Aurora Gold, Cappuccino Brown', '8 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '16MP / 50+2MP', Battery: '7000mAh 80W', DP: '31279' }, { badge: 'NEW' }),
  mk('oppo-a6pro-8-256-oct26', 'Oppo', 'Oppo A6 Pro 5G (8GB/256GB) - Aurora Gold, Cappuccino Brown', 35999, 35999, OPPO_A6PRO, 'Aurora Gold, Cappuccino Brown', '8 GB', '256 GB', { Processor: 'Dimensity 6300', Camera: '16MP / 50+2MP', Battery: '7000mAh 80W', DP: '34122' }, { badge: 'NEW' }),
  // K Series
  mk('oppo-k14x-4-64-oct26', 'Oppo', 'Oppo K14X 5G (4GB/64GB) - Prism Violet, Icy Blue', 18999, 18999, OPPO_K, 'Prism Violet, Icy Blue', '4 GB', '64 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '18268' }),
  mk('oppo-k14x-4-128-oct26', 'Oppo', 'Oppo K14X 5G (4GB/128GB) - Prism Violet, Icy Blue', 21999, 21999, OPPO_K, 'Prism Violet, Icy Blue', '4 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '21153' }),
  mk('oppo-k14x-6-128-oct26', 'Oppo', 'Oppo K14X 5G (6GB/128GB) - Prism Violet, Icy Blue', 24999, 24999, OPPO_K, 'Prism Violet, Icy Blue', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '5MP / 50+2MP', Battery: '6500mAh 45W', DP: '24038' }),
  mk('oppo-k14-6-128-oct26', 'Oppo', 'Oppo K14 5G (6GB/128GB) - Prism Violet, Icy Blue, Prism White', 25999, 25999, OPPO_K, 'Prism Violet, Icy Blue, Prism White', '6 GB', '128 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+8MP', Battery: '7000mAh 45W', DP: '24999' }),
  mk('oppo-k14-6-256-oct26', 'Oppo', 'Oppo K14 5G (6GB/256GB) - Prism Violet, Icy Blue, Prism White', 28999, 28999, OPPO_K, 'Prism Violet, Icy Blue, Prism White', '6 GB', '256 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+8MP', Battery: '7000mAh 45W', DP: '27884' }),
  mk('oppo-k14-8-256-oct26', 'Oppo', 'Oppo K14 5G (8GB/256GB) - Prism Violet, Icy Blue, Prism White', 28999, 28999, OPPO_K, 'Prism Violet, Icy Blue, Prism White', '8 GB', '256 GB', { Processor: 'Dimensity 6300', Camera: '8MP / 50+8MP', Battery: '7000mAh 45W', DP: '27884' }),
  // F Series
  mk('oppo-f33-6-128-oct26', 'Oppo', 'Oppo F33 5G (6GB/128GB) - Forest Green, Pearl White', 34999, 34999, OPPO_F, 'Forest Green, Pearl White', '6 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '33176' }),
  mk('oppo-f33-8-128-oct26', 'Oppo', 'Oppo F33 5G (8GB/128GB) - Forest Green, Pearl White', 36999, 36999, OPPO_F, 'Forest Green, Pearl White', '8 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '35071' }),
  mk('oppo-f33-8-256-oct26', 'Oppo', 'Oppo F33 5G (8GB/256GB) - Forest Green, Pearl White', 39999, 39999, OPPO_F, 'Forest Green, Pearl White', '8 GB', '256 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '37914' }),
  mk('oppo-f33pro-8-128-oct26', 'Oppo', 'Oppo F33 Pro 5G (8GB/128GB) - Misty Forest, Passion Red, Starry Blue', 39999, 39999, OPPO_F, 'Misty Forest, Passion Red, Starry Blue', '8 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '37914' }, { badge: 'PRO' }),
  mk('oppo-f33pro-8-256-oct26', 'Oppo', 'Oppo F33 Pro 5G (8GB/256GB) - Misty Forest, Passion Red, Starry Blue', 43999, 43999, OPPO_F, 'Misty Forest, Passion Red, Starry Blue', '8 GB', '256 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '41707' }, { badge: 'PRO' }),
  mk('oppo-f35-6-128-oct26', 'Oppo', 'Oppo F35 5G (6GB/128GB) - Titanium Grey, Mist Pink, Wave Blue', 38999, 38999, OPPO_F, 'Titanium Grey, Mist Pink, Wave Blue', '6 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '36966' }),
  mk('oppo-f35-8-128-oct26', 'Oppo', 'Oppo F35 5G (8GB/128GB) - Titanium Grey, Mist Pink, Wave Blue', 42999, 42999, OPPO_F, 'Titanium Grey, Mist Pink, Wave Blue', '8 GB', '128 GB', { Processor: 'Dimensity 6360 Max', Camera: '50MP / 50+2MP', Battery: '7000mAh 80W', DP: '40757' }),
  mk('oppo-f35pro-6-128-oct26', 'Oppo', 'Oppo F35 Pro 5G (6GB/128GB) - Twilight Brown, Sunrise Orange, Wave Blue', 45999, 45999, OPPO_F, 'Twilight Brown, Sunrise Orange, Wave Blue', '6 GB', '128 GB', { Processor: 'Dimensity 7360 Max', Camera: '50MP / 50+8MP', Battery: '8000mAh 80W', DP: '43601' }, { badge: 'PRO' }),
  mk('oppo-f35pro-8-128-oct26', 'Oppo', 'Oppo F35 Pro 5G (8GB/128GB) - Twilight Brown, Sunrise Orange, Wave Blue', 49999, 49999, OPPO_F, 'Twilight Brown, Sunrise Orange, Wave Blue', '8 GB', '128 GB', { Processor: 'Dimensity 7360 Max', Camera: '50MP / 50+8MP', Battery: '8000mAh 80W', DP: '47392' }, { badge: 'PRO' }),
  mk('oppo-f35pro-8-256-oct26', 'Oppo', 'Oppo F35 Pro 5G (8GB/256GB) - Twilight Brown, Sunrise Orange, Wave Blue', 54999, 54999, OPPO_F, 'Twilight Brown, Sunrise Orange, Wave Blue', '8 GB', '256 GB', { Processor: 'Dimensity 7360 Max', Camera: '50MP / 50+8MP', Battery: '8000mAh 80W', DP: '52132' }, { badge: 'PRO' }),
  // Reno Series
  mk('oppo-reno15c-8-256-oct26', 'Oppo', 'Oppo Reno 15C 5G (8GB/256GB) - Twilight Blue, Afterglow Pink', 41999, 41999, OPPO_RENO, 'Twilight Blue, Afterglow Pink', '8 GB', '256 GB', { Processor: 'Snapdragon 6 Gen 1', Camera: '50MP / 50+8+2MP', Battery: '7000mAh 80W', DP: '39809' }),
  mk('oppo-reno15c-12-256-oct26', 'Oppo', 'Oppo Reno 15C 5G (12GB/256GB) - Twilight Blue, Afterglow Pink', 44999, 44999, OPPO_RENO, 'Twilight Blue, Afterglow Pink', '12 GB', '256 GB', { Processor: 'Snapdragon 6 Gen 1', Camera: '50MP / 50+8+2MP', Battery: '7000mAh 80W', DP: '42653' }),
  mk('oppo-reno15-8-256-oct26', 'Oppo', 'Oppo Reno 15 5G (8GB/256GB) - Twilight Blue, Glacier White, Aurora Blue', 47999, 47999, OPPO_RENO, 'Twilight Blue, Glacier White, Aurora Blue', '8 GB', '256 GB', { Processor: 'Snapdragon 7 Gen 4', Camera: '50MP / 50+8+50MP', Battery: '6500mAh 80W', DP: '45498' }, { badge: 'NEW' }),
  mk('oppo-reno15-12-256-oct26', 'Oppo', 'Oppo Reno 15 5G (12GB/256GB) - Twilight Blue, Glacier White, Aurora Blue', 50999, 50999, OPPO_RENO, 'Twilight Blue, Glacier White, Aurora Blue', '12 GB', '256 GB', { Processor: 'Snapdragon 7 Gen 4', Camera: '50MP / 50+8+50MP', Battery: '6500mAh 80W', DP: '48342' }, { badge: 'NEW' }),
  mk('oppo-reno15-12-512-oct26', 'Oppo', 'Oppo Reno 15 5G (12GB/512GB) - Twilight Blue, Glacier White, Aurora Blue', 55999, 55999, OPPO_RENO, 'Twilight Blue, Glacier White, Aurora Blue', '12 GB', '512 GB', { Processor: 'Snapdragon 7 Gen 4', Camera: '50MP / 50+8+50MP', Battery: '6500mAh 80W', DP: '53081' }),
  mk('oppo-reno15promini-12-256-oct26', 'Oppo', 'Oppo Reno 15 Pro Mini 5G (12GB/256GB) - Cocoa Brown', 59999, 59999, OPPO_RENO, 'Cocoa Brown', '12 GB', '256 GB', { Processor: 'Dimensity 8450', Camera: '50MP / 200+50+50MP', Battery: '6200mAh 80W', DP: '56871' }, { badge: 'PRO' }),
  mk('oppo-reno15promini-12-512-oct26', 'Oppo', 'Oppo Reno 15 Pro Mini 5G (12GB/512GB) - Cocoa Brown', 64999, 64999, OPPO_RENO, 'Cocoa Brown', '12 GB', '512 GB', { Processor: 'Dimensity 8450', Camera: '50MP / 200+50+50MP', Battery: '6200mAh 80W', DP: '61610' }, { badge: 'PRO' }),
  mk('oppo-reno15pro-12-256-oct26', 'Oppo', 'Oppo Reno 15 Pro 5G (12GB/256GB) - Cocoa Brown, Sunset Gold', 67999, 67999, OPPO_RENO, 'Cocoa Brown, Sunset Gold', '12 GB', '256 GB', { Processor: 'Dimensity 8450', Camera: '50MP / 200+50+50MP', Battery: '6500mAh 80W + 50W Wireless', DP: '64454' }, { badge: 'PRO' }),
  mk('oppo-reno15pro-12-512-oct26', 'Oppo', 'Oppo Reno 15 Pro 5G (12GB/512GB) - Cocoa Brown, Sunset Gold', 72999, 72999, OPPO_RENO, 'Cocoa Brown, Sunset Gold', '12 GB', '512 GB', { Processor: 'Dimensity 8450', Camera: '50MP / 200+50+50MP', Battery: '6500mAh 80W + 50W Wireless', DP: '69193' }, { badge: 'PRO' }),
  mk('oppo-reno16c-8-128-oct26', 'Oppo', 'Oppo Reno 16C 5G (8GB/128GB) - Starry White, Stellar Purple, Twilight Violet', 52999, 52999, OPPO_RENO, 'Starry White, Stellar Purple, Twilight Violet', '8 GB', '128 GB', { Processor: 'Dimensity 7300', Camera: '50MP / 50+50+8MP', Battery: '7000mAh 80W', DP: '50236' }, { badge: 'NEW' }),
  mk('oppo-reno16c-8-256-oct26', 'Oppo', 'Oppo Reno 16C 5G (8GB/256GB) - Starry White, Stellar Purple, Twilight Violet', 57999, 57999, OPPO_RENO, 'Starry White, Stellar Purple, Twilight Violet', '8 GB', '256 GB', { Processor: 'Dimensity 7300', Camera: '50MP / 50+50+8MP', Battery: '7000mAh 80W', DP: '54975' }, { badge: 'NEW' }),
  mk('oppo-reno16c-12-256-oct26', 'Oppo', 'Oppo Reno 16C 5G (12GB/256GB) - Starry White, Stellar Purple, Twilight Violet', 62999, 62999, OPPO_RENO, 'Starry White, Stellar Purple, Twilight Violet', '12 GB', '256 GB', { Processor: 'Dimensity 7300', Camera: '50MP / 50+50+8MP', Battery: '7000mAh 80W', DP: '59715' }),
  mk('oppo-reno16-8-256-oct26', 'Oppo', 'Oppo Reno 16 5G (8GB/256GB) - Starry White, Stellar Purple, Twilight Violet', 66999, 66999, OPPO_RENO, 'Starry White, Stellar Purple, Twilight Violet', '8 GB', '256 GB', { Processor: 'Snapdragon 7 Gen 4', Camera: '50MP / 50+50+50MP', Battery: '6700mAh 80W', DP: '63506' }, { badge: 'NEW' }),
  mk('oppo-reno16-12-256-oct26', 'Oppo', 'Oppo Reno 16 5G (12GB/256GB) - Starry White, Stellar Purple, Twilight Violet', 72999, 72999, OPPO_RENO, 'Starry White, Stellar Purple, Twilight Violet', '12 GB', '256 GB', { Processor: 'Snapdragon 7 Gen 4', Camera: '50MP / 50+50+50MP', Battery: '6700mAh 80W', DP: '69193' }),
  // Find Series
  mk('oppo-findx9-12-256-oct26', 'Oppo', 'Oppo Find X9 5G (12GB/256GB) - Space Black, Titanium Grey', 84999, 84999, OPPO_FIND, 'Space Black, Titanium Grey', '12 GB', '256 GB', { Processor: 'Dimensity 9500', Camera: '32MP / 50+50+50MP', Battery: '7025mAh 80W + 50W Wireless', DP: '80568' }, { badge: 'FLAGSHIP' }),
  mk('oppo-findx9-16-512-oct26', 'Oppo', 'Oppo Find X9 5G (16GB/512GB) - Space Black, Titanium Grey', 94999, 94999, OPPO_FIND, 'Space Black, Titanium Grey', '16 GB', '512 GB', { Processor: 'Dimensity 9500', Camera: '32MP / 50+50+50MP', Battery: '7025mAh 80W + 50W Wireless', DP: '90046' }, { badge: 'FLAGSHIP' }),
  mk('oppo-findx9s-12-256-oct26', 'Oppo', 'Oppo Find X9s 5G (12GB/256GB) - Lavender Sky, Sunset Orange, Midnight Grey', 84999, 84999, OPPO_FIND, 'Lavender Sky, Sunset Orange, Midnight Grey', '12 GB', '256 GB', { Processor: 'Dimensity 9500s', Camera: '32MP / 50+50+50MP', Battery: '7025mAh 80W', DP: '80568' }),
  mk('oppo-findx9s-12-512-oct26', 'Oppo', 'Oppo Find X9s 5G (12GB/512GB) - Lavender Sky, Sunset Orange, Midnight Grey', 94999, 94999, OPPO_FIND, 'Lavender Sky, Sunset Orange, Midnight Grey', '12 GB', '512 GB', { Processor: 'Dimensity 9500s', Camera: '32MP / 50+50+50MP', Battery: '7025mAh 80W', DP: '90046' }),
  mk('oppo-findx9pro-16-512-oct26', 'Oppo', 'Oppo Find X9 Pro 5G (16GB/512GB) - Titanium Charcoal, Silk White', 109999, 109999, OPPO_FIND, 'Titanium Charcoal, Silk White', '16 GB', '512 GB', { Processor: 'Dimensity 9500', Camera: '50MP / 200+50+50MP', Battery: '7500mAh 80W + 50W Wireless', DP: '104268' }, { badge: 'FLAGSHIP' }),
  mk('oppo-findx9ultra-12-512-oct26', 'Oppo', 'Oppo Find X9 Ultra 5G (12GB/512GB) - Tundra Umber, Canyon Orange', 169999, 169999, OPPO_FIND, 'Tundra Umber, Canyon Orange', '12 GB', '512 GB', { Processor: 'Snapdragon 8 Elite Gen 5', Camera: '50MP / 200+200+50+50+3.2MP', Battery: '7050mAh 100W + 50W Wireless', DP: '161136' }, { badge: 'ULTRA' }),
  mk('oppo-findx10-12-256-oct26', 'Oppo', 'Oppo Find X10 5G (12GB/256GB) - Misty Grey, Glow Coral, Glacier Blue - Coming Soon', 0, 0, OPPO_FIND, 'Misty Grey, Glow Coral, Glacier Blue', '12 GB', '256 GB', { Processor: 'Dimensity 9600', Camera: '50MP / 200+200+50+3.2MP', Battery: '8000mAh 80W + 50W Wireless' }, { inStock: false, price: 99999, mrp: 99999 }),
  mk('oppo-findx10-12-512-oct26', 'Oppo', 'Oppo Find X10 5G (12GB/512GB) - Misty Grey, Glow Coral, Glacier Blue - Coming Soon', 99999, 99999, OPPO_FIND, 'Misty Grey, Glow Coral, Glacier Blue', '12 GB', '512 GB', { Processor: 'Dimensity 9600', Camera: '50MP / 200+200+50+3.2MP', Battery: '8000mAh 80W + 50W Wireless' }, { inStock: false }),
  mk('oppo-findx10promax-12-512-oct26', 'Oppo', 'Oppo Find X10 Pro Max 5G (12GB/512GB) - Titanium Grey, Luma White - Coming Soon', 129999, 129999, OPPO_FIND, 'Titanium Grey, Luma White', '12 GB', '512 GB', { Processor: 'Dimensity 9600 Pro', Camera: '50MP / 200+200+200+3.2MP' }, { inStock: false, badge: 'ULTRA' }),
  // Tablet
  mk('oppo-pad5-8-128-oct26', 'Oppo', 'Oppo Pad 5 (8GB/128GB) - Starlight Black, Aurora Pink', 29999, 29999, OPPO_PAD, 'Starlight Black, Aurora Pink', '8 GB', '128 GB', { Processor: 'Dimensity 7300U', Camera: '8MP / 8MP', Battery: '10050mAh 33W', DP: '28435' }, { category: 'tablets', subCategory: 'Tablets' }),
  mk('oppo-pad5-8-256-oct26', 'Oppo', 'Oppo Pad 5 (8GB/256GB) - Starlight Black, Aurora Pink', 34999, 34999, OPPO_PAD, 'Starlight Black, Aurora Pink', '8 GB', '256 GB', { Processor: 'Dimensity 7300U', Camera: '8MP / 8MP', Battery: '10050mAh 33W', DP: '33174' }, { category: 'tablets', subCategory: 'Tablets' }),
];

// Samsung images
const SAM_FOLD8U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8-ultra-r1.jpg';
const SAM_FOLD8 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold8.jpg';
const SAM_FLIP8 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip8.jpg';
const SAM_FOLD7 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold7.jpg';
const SAM_FLIP7 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip7.jpg';
const SAM_S26U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra.jpg';
const SAM_S26 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26.jpg';
const SAM_S25U = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg';
const SAM_S25 = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-sm-s931.jpg';
const SAM_S25FE = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-fe.jpg';
const SAM_A = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a16-5g.jpg';
const SAM_F = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f16-5g.jpg';

export const SAMSUNG_OCT2026: Product[] = [
  // Fold8 / Flip8 family (DP = dealer, MOP = customer; price=MOP)
  mk('sam-zfold8ultra-12-256-oct26', 'Samsung', 'Samsung Galaxy Z Fold 8 Ultra 5G (12GB/256GB)', 199999, 199999, SAM_FOLD8U, 'Graphite, Cream, Violet Shadow', '12 GB', '256 GB', { Display: '8.0-inch Fold + 6.5-inch Cover', Chip: 'Snapdragon 8 Elite Gen 5', Camera: '200MP + 50MP UW + 10MP 3x', Battery: '5000mAh 45W', DP: '198999', Offer: 'Multibuy Watch/Buds + 5000 upgrade + 12000 cash upgrade' }, { badge: 'ULTRA FOLD', rating: 4.9, ratingCount: 600 }),
  mk('sam-zfold8ultra-12-512-oct26', 'Samsung', 'Samsung Galaxy Z Fold 8 Ultra 5G (12GB/512GB)', 219999, 219999, SAM_FOLD8U, 'Graphite, Cream, Violet Shadow', '12 GB', '512 GB', { Display: '8.0-inch Fold', Chip: 'Snapdragon 8 Elite Gen 5', Camera: '200MP', Battery: '5000mAh 45W', DP: '218999' }, { badge: 'ULTRA FOLD', rating: 4.9, ratingCount: 450 }),
  mk('sam-zfold8ultra-16-1tb-oct26', 'Samsung', 'Samsung Galaxy Z Fold 8 Ultra 5G (16GB/1TB)', 259999, 259999, SAM_FOLD8U, 'Graphite, Cream, Violet Shadow', '16 GB', '1 TB', { Chip: 'Snapdragon 8 Elite Gen 5', Battery: '5000mAh 45W', DP: '258999' }, { rating: 4.9, ratingCount: 200 }),
  mk('sam-zfold8-12-256-oct26', 'Samsung', 'Samsung Galaxy Z Fold 8 5G (12GB/256GB) - Wide Fold', 179999, 179999, SAM_FOLD8, 'Graphite, Cream, Lavender', '12 GB', '256 GB', { Display: '7.6-inch Fold 4:3 + 5.5-inch Cover', Chip: 'Snapdragon 8 Elite Gen 5', Camera: '50MP + 50MP UW', Battery: '4800mAh 45W', DP: '178999' }, { badge: 'NEW SHAPE', rating: 4.8, ratingCount: 350 }),
  mk('sam-zfold8-12-512-oct26', 'Samsung', 'Samsung Galaxy Z Fold 8 5G (12GB/512GB) - Wide Fold', 199999, 199999, SAM_FOLD8, 'Graphite, Cream, Lavender', '12 GB', '512 GB', { Chip: 'Snapdragon 8 Elite Gen 5', Battery: '4800mAh 45W', DP: '198999' }, { rating: 4.8, ratingCount: 280 }),
  mk('sam-zfold8-16-1tb-oct26', 'Samsung', 'Samsung Galaxy Z Fold 8 5G (16GB/1TB) - Wide Fold', 239999, 239999, SAM_FOLD8, 'Graphite, Cream, Lavender, Pistachio', '16 GB', '1 TB', { Chip: 'Snapdragon 8 Elite Gen 5', DP: '238999' }, { rating: 4.8, ratingCount: 150 }),
  mk('sam-zflip8-12-256-oct26', 'Samsung', 'Samsung Galaxy Z Flip 8 5G (12GB/256GB)', 124999, 124999, SAM_FLIP8, 'Mint, Black, White', '12 GB', '256 GB', { Chip: 'Snapdragon 8 Elite Gen 5', Battery: '4300mAh', DP: '123999', Offer: '10000 special + 9000 cash upgrade' }, { badge: 'FLIP', rating: 4.7, ratingCount: 500 }),
  mk('sam-zflip8-12-512-oct26', 'Samsung', 'Samsung Galaxy Z Flip 8 5G (12GB/512GB)', 144999, 144999, SAM_FLIP8, 'Mint, Black, White', '12 GB', '512 GB', { Chip: 'Snapdragon 8 Elite Gen 5', DP: '143999' }, { rating: 4.7, ratingCount: 350 }),
  // Fold7 / Flip7
  mk('sam-zfold7-12-256-oct26', 'Samsung', 'Samsung Galaxy Z Fold 7 5G (12GB/256GB)', 174999, 174999, SAM_FOLD7, 'Blue Shadow, Black', '12 GB', '256 GB', { Chip: 'Snapdragon 8 Elite', Camera: '200MP', DP: '173999', Offer: '3000/7000 upgrade' }, { rating: 4.8, ratingCount: 900 }),
  mk('sam-zfold7-12-512-oct26', 'Samsung', 'Samsung Galaxy Z Fold 7 5G (12GB/512GB)', 186999, 186999, SAM_FOLD7, 'Blue Shadow, Black', '12 GB', '512 GB', { DP: '185999' }, { rating: 4.8, ratingCount: 700 }),
  mk('sam-zfold7-16-1tb-oct26', 'Samsung', 'Samsung Galaxy Z Fold 7 5G (16GB/1TB)', 216999, 216999, SAM_FOLD7, 'Blue Shadow, Black', '16 GB', '1 TB', { DP: '215999' }, { rating: 4.8, ratingCount: 300 }),
  mk('sam-zflip7-12-256-oct26', 'Samsung', 'Samsung Galaxy Z Flip 7 5G (12GB/256GB)', 109999, 109999, SAM_FLIP7, 'Blue Shadow, Black, Coral', '12 GB', '256 GB', { DP: '108999', Offer: 'Multibuy Watch Ultra/Buds3 Pro' }, { rating: 4.7, ratingCount: 800 }),
  mk('sam-zflip7fe-8-128-oct26', 'Samsung', 'Samsung Galaxy Z Flip 7 FE 5G (8GB/128GB)', 89999, 89999, SAM_FLIP7, 'Black, White', '8 GB', '128 GB', { DP: '88999' }, { rating: 4.5, ratingCount: 600 }),
  mk('sam-zflip7fe-8-256-oct26', 'Samsung', 'Samsung Galaxy Z Flip 7 FE 5G (8GB/256GB)', 95999, 95999, SAM_FLIP7, 'Black, White', '8 GB', '256 GB', { DP: '94999', Offer: '10000 EMI cashback All Bank' }, { rating: 4.5, ratingCount: 500 }),
  // S26 series
  mk('sam-s26fe-8-128-oct26', 'Samsung', 'Samsung Galaxy S26 FE 5G (8GB/128GB)', 69999, 69999, SAM_S26, 'Graphite, Blue', '8 GB', '128 GB', { DP: '68999' }, { rating: 4.5, ratingCount: 700 }),
  mk('sam-s26fe-8-256-oct26', 'Samsung', 'Samsung Galaxy S26 FE 5G (8GB/256GB)', 79999, 79999, SAM_S26, 'Graphite, Blue', '8 GB', '256 GB', { DP: '78999', Offer: '7000 support till 31 Oct' }, { rating: 4.5, ratingCount: 600 }),
  mk('sam-s26-12-256-oct26', 'Samsung', 'Samsung Galaxy S26 5G (12GB/256GB)', 102999, 102999, SAM_S26, 'Black, White, Blue', '12 GB', '256 GB', { DP: '101999', Offer: '13000 support + Multibuy Watch/Buds' }, { badge: 'NEW', rating: 4.7, ratingCount: 500 }),
  mk('sam-s26-12-512-oct26', 'Samsung', 'Samsung Galaxy S26 5G (12GB/512GB)', 122999, 122999, SAM_S26, 'Black, White, Blue', '12 GB', '512 GB', { DP: '121999' }, { rating: 4.7, ratingCount: 350 }),
  mk('sam-s26plus-12-256-oct26', 'Samsung', 'Samsung Galaxy S26 Plus 5G (12GB/256GB)', 134999, 134999, SAM_S26, 'Black, White', '12 GB', '256 GB', { DP: '133999' }, { rating: 4.7, ratingCount: 300 }),
  mk('sam-s26plus-12-512-oct26', 'Samsung', 'Samsung Galaxy S26 Plus 5G (12GB/512GB)', 154999, 154999, SAM_S26, 'Black, White', '12 GB', '512 GB', { DP: '153999' }, { rating: 4.7, ratingCount: 250 }),
  mk('sam-s26ultra-12-256-oct26', 'Samsung', 'Samsung Galaxy S26 Ultra 5G (12GB/256GB) - S Pen', 164999, 164999, SAM_S26U, 'Titanium Black, Grey', '12 GB', '256 GB', { DP: '163999', Offer: '15000 support + Multibuy' }, { badge: 'ULTRA', rating: 4.9, ratingCount: 600 }),
  mk('sam-s26ultra-12-512-oct26', 'Samsung', 'Samsung Galaxy S26 Ultra 5G (12GB/512GB) - S Pen', 174999, 174999, SAM_S26U, 'Titanium Black, Grey', '12 GB', '512 GB', { DP: '173999' }, { badge: 'ULTRA', rating: 4.9, ratingCount: 450 }),
  mk('sam-s26ultra-12-1tb-oct26', 'Samsung', 'Samsung Galaxy S26 Ultra 5G (12GB/1TB) - S Pen', 214999, 214999, SAM_S26U, 'Titanium Black, Grey', '12 GB', '1 TB', { DP: '213999' }, { rating: 4.9, ratingCount: 200 }),
  // S25 series
  mk('sam-s25fe-8-128-oct26', 'Samsung', 'Samsung Galaxy S25 FE 5G (8GB/128GB)', 59999, 59999, SAM_S25FE, 'Blue, Black', '8 GB', '128 GB', { DP: '58999', Offer: 'All Bank/UPI 4000 cashback' }, { rating: 4.5, ratingCount: 1200 }),
  mk('sam-s25fe-8-256-oct26', 'Samsung', 'Samsung Galaxy S25 FE 5G (8GB/256GB)', 65999, 65999, SAM_S25FE, 'Blue, Black', '8 GB', '256 GB', { DP: '64999', Offer: 'All Bank/UPI 1000 cashback' }, { rating: 4.5, ratingCount: 1000 }),
  mk('sam-s25fe-8-512-oct26', 'Samsung', 'Samsung Galaxy S25 FE 5G (8GB/512GB)', 77999, 77999, SAM_S25FE, 'Blue, Black', '8 GB', '512 GB', { DP: '76999' }, { rating: 4.5, ratingCount: 700 }),
  mk('sam-s25-12-128-oct26', 'Samsung', 'Samsung Galaxy S25 5G (12GB/128GB)', 74999, 74999, SAM_S25, 'Silver Shadow, Blue', '12 GB', '128 GB', { DP: '73999', Offer: 'All Bank/UPI 9000' }, { rating: 4.7, ratingCount: 900 }),
  mk('sam-s25-12-256-oct26', 'Samsung', 'Samsung Galaxy S25 5G (12GB/256GB)', 84999, 84999, SAM_S25, 'Silver Shadow, Blue', '12 GB', '256 GB', { DP: '83999', Offer: 'All Bank/UPI 12000' }, { rating: 4.7, ratingCount: 800 }),
  mk('sam-s25-12-512-oct26', 'Samsung', 'Samsung Galaxy S25 5G (12GB/512GB)', 104999, 104999, SAM_S25, 'Silver Shadow, Blue', '12 GB', '512 GB', { DP: '103999', Offer: 'All Bank/UPI 17000 + Multibuy' }, { rating: 4.7, ratingCount: 600 }),
  mk('sam-s25plus-12-256-oct26', 'Samsung', 'Samsung Galaxy S25 Plus 5G (12GB/256GB)', 99999, 99999, SAM_S25, 'Silver Shadow', '12 GB', '256 GB', { DP: '98999', Offer: 'HDFC 14000' }, { rating: 4.7, ratingCount: 500 }),
  mk('sam-s25plus-12-512-oct26', 'Samsung', 'Samsung Galaxy S25 Plus 5G (12GB/512GB)', 111999, 111999, SAM_S25, 'Silver Shadow', '12 GB', '512 GB', { DP: '110999' }, { rating: 4.7, ratingCount: 400 }),
  mk('sam-s25ultra-12-256-oct26', 'Samsung', 'Samsung Galaxy S25 Ultra 5G (12GB/256GB) - S Pen', 119999, 119999, SAM_S25U, 'Titanium Black, Grey, White', '12 GB', '256 GB', { DP: '118999' }, { badge: 'ULTRA', rating: 4.9, ratingCount: 1100 }),
  mk('sam-s25ultra-12-512-oct26', 'Samsung', 'Samsung Galaxy S25 Ultra 5G (12GB/512GB) - S Pen', 139999, 139999, SAM_S25U, 'Titanium Black, Grey, White', '12 GB', '512 GB', { DP: '138999' }, { badge: 'ULTRA', rating: 4.9, ratingCount: 900 }),
  mk('sam-s25ultra-12-1tb-oct26', 'Samsung', 'Samsung Galaxy S25 Ultra 5G (12GB/1TB) - S Pen', 169999, 169999, SAM_S25U, 'Titanium Black, Grey', '12 GB', '1 TB', { DP: '168999' }, { rating: 4.9, ratingCount: 400 }),
  mk('sam-s25edge-12-256-oct26', 'Samsung', 'Samsung Galaxy S25 Edge 5G (12GB/256GB) - Slim', 109999, 109999, SAM_S25, 'Titanium Silver', '12 GB', '256 GB', { DP: '108999', Offer: '25000 support + 12000/10000 upgrade + HDFC 5000' }, { badge: 'SLIM', rating: 4.6, ratingCount: 400 }),
  mk('sam-s25edge-12-512-oct26', 'Samsung', 'Samsung Galaxy S25 Edge 5G (12GB/512GB) - Slim', 121999, 121999, SAM_S25, 'Titanium Silver', '12 GB', '512 GB', { DP: '120999' }, { rating: 4.6, ratingCount: 300 }),
  // F series
  mk('sam-f06-4-64-oct26', 'Samsung', 'Samsung Galaxy F06 5G (4GB/64GB)', 12499, 12499, SAM_F, 'Black, Blue', '4 GB', '64 GB', { DP: '12499' }, { rating: 4.1, ratingCount: 2000 }),
  mk('sam-f06-4-128-oct26', 'Samsung', 'Samsung Galaxy F06 5G (4GB/128GB)', 13999, 13999, SAM_F, 'Black, Blue', '4 GB', '128 GB', { DP: '13999' }, { rating: 4.1, ratingCount: 1800 }),
  mk('sam-f06-6-128-oct26', 'Samsung', 'Samsung Galaxy F06 5G (6GB/128GB)', 15999, 15999, SAM_F, 'Black, Blue', '6 GB', '128 GB', { DP: '15999' }, { rating: 4.2, ratingCount: 1500 }),
  mk('sam-f70e-4-128-oct26', 'Samsung', 'Samsung Galaxy F70e 5G (4GB/128GB)', 18499, 18499, SAM_F, 'Black, Green', '4 GB', '128 GB', { DP: '18499' }, { rating: 4.3, ratingCount: 900 }),
  mk('sam-f70e-6-128-oct26', 'Samsung', 'Samsung Galaxy F70e 5G (6GB/128GB)', 21499, 21499, SAM_F, 'Black, Green', '6 GB', '128 GB', { DP: '21499' }, { rating: 4.3, ratingCount: 800 }),
  mk('sam-f07-4-64-oct26', 'Samsung', 'Samsung Galaxy F07 4G (4GB/64GB)', 11399, 11399, SAM_F, 'Black, Blue', '4 GB', '64 GB', { DP: '11399' }, { rating: 4.0, ratingCount: 1200 }),
  mk('sam-f08-4-64-oct26', 'Samsung', 'Samsung Galaxy F08 4G (4GB/64GB)', 16999, 16999, SAM_F, 'Black, Blue', '4 GB', '64 GB', { DP: '16999' }, { rating: 4.1, ratingCount: 800 }),
  mk('sam-f17-4-128-oct26', 'Samsung', 'Samsung Galaxy F17 5G (4GB/128GB)', 23499, 23499, SAM_F, 'Black, Blue', '4 GB', '128 GB', { DP: '23499', Offer: '500 support till 31 Oct' }, { rating: 4.3, ratingCount: 700 }),
  mk('sam-f17-6-128-oct26', 'Samsung', 'Samsung Galaxy F17 5G (6GB/128GB)', 26499, 26499, SAM_F, 'Black, Blue', '6 GB', '128 GB', { DP: '26499' }, { rating: 4.3, ratingCount: 600 }),
  mk('sam-f17-8-128-oct26', 'Samsung', 'Samsung Galaxy F17 5G (8GB/128GB)', 29499, 29499, SAM_F, 'Black, Blue', '8 GB', '128 GB', { DP: '29499' }, { rating: 4.4, ratingCount: 500 }),
  mk('sam-f36-6-128-oct26', 'Samsung', 'Samsung Galaxy F36 5G (6GB/128GB)', 21999, 21999, SAM_F, 'Black, Green', '6 GB', '128 GB', { DP: '21999' }, { rating: 4.3, ratingCount: 900 }),
  mk('sam-f36-8-128-oct26', 'Samsung', 'Samsung Galaxy F36 5G (8GB/128GB)', 23999, 23999, SAM_F, 'Black, Green', '8 GB', '128 GB', { DP: '23999' }, { rating: 4.4, ratingCount: 800 }),
  mk('sam-f36-8-256-oct26', 'Samsung', 'Samsung Galaxy F36 5G (8GB/256GB)', 27999, 27999, SAM_F, 'Black, Green', '8 GB', '256 GB', { DP: '27999' }, { rating: 4.4, ratingCount: 600 }),
  mk('sam-f56-8-128-oct26', 'Samsung', 'Samsung Galaxy F56 5G (8GB/128GB)', 24999, 24999, SAM_F, 'Black, Green', '8 GB', '128 GB', { DP: '24999' }, { rating: 4.4, ratingCount: 700 }),
  mk('sam-f56-8-256-oct26', 'Samsung', 'Samsung Galaxy F56 5G (8GB/256GB)', 27999, 27999, SAM_F, 'Black, Green', '8 GB', '256 GB', { DP: '27999' }, { rating: 4.4, ratingCount: 600 }),
  // A series
  mk('sam-a06-4-64-oct26', 'Samsung', 'Samsung Galaxy A06 5G (4GB/64GB)', 15999, 15999, SAM_A, 'Black, Blue', '4 GB', '64 GB', { DP: '15384' }, { rating: 4.0, ratingCount: 1500 }),
  mk('sam-a06-4-128-oct26', 'Samsung', 'Samsung Galaxy A06 5G (4GB/128GB)', 17999, 17999, SAM_A, 'Black, Blue', '4 GB', '128 GB', { DP: '17307' }, { rating: 4.0, ratingCount: 1300 }),
  mk('sam-a06-6-128-oct26', 'Samsung', 'Samsung Galaxy A06 5G (6GB/128GB)', 19999, 19999, SAM_A, 'Black, Blue', '6 GB', '128 GB', { DP: '19230' }, { rating: 4.1, ratingCount: 1100 }),
  mk('sam-a07-4-64-oct26', 'Samsung', 'Samsung Galaxy A07 4G (4GB/64GB)', 13499, 13499, SAM_A, 'Black, Blue, Green', '4 GB', '64 GB', { DP: '13499' }, { rating: 4.0, ratingCount: 1400 }),
  mk('sam-a07-4-128-oct26', 'Samsung', 'Samsung Galaxy A07 5G (4GB/128GB)', 20999, 20999, SAM_A, 'Black, Blue, Green', '4 GB', '128 GB', { DP: '20191', Offer: '481 support till 31 Oct' }, { rating: 4.2, ratingCount: 900 }),
  mk('sam-a07-6-128-oct26', 'Samsung', 'Samsung Galaxy A07 5G (6GB/128GB)', 23999, 23999, SAM_A, 'Black, Blue, Green', '6 GB', '128 GB', { DP: '23076', Offer: '481 support till 31 Oct' }, { rating: 4.2, ratingCount: 800 }),
  mk('sam-a08-4-64-oct26', 'Samsung', 'Samsung Galaxy A08 4G (4GB/64GB)', 18499, 18499, SAM_A, 'Black, Blue', '4 GB', '64 GB', { DP: '18499' }, { rating: 4.1, ratingCount: 700 }),
  mk('sam-a17-6-128-noad-oct26', 'Samsung', 'Samsung Galaxy A17 5G (6GB/128GB) - Without Adapter', 27999, 27999, SAM_A, 'Black, Blue', '6 GB', '128 GB', { DP: '26922', Offer: '481 support', Charger: 'Without Adapter' }, { rating: 4.3, ratingCount: 600 }),
  mk('sam-a17-8-128-noad-oct26', 'Samsung', 'Samsung Galaxy A17 5G (8GB/128GB) - Without Adapter', 30999, 30999, SAM_A, 'Black, Blue', '8 GB', '128 GB', { DP: '29807' }, { rating: 4.3, ratingCount: 550 }),
  mk('sam-a17-8-256-noad-oct26', 'Samsung', 'Samsung Galaxy A17 5G (8GB/256GB) - Without Adapter', 36499, 36499, SAM_A, 'Black, Blue', '8 GB', '256 GB', { DP: '35095' }, { rating: 4.3, ratingCount: 450 }),
  mk('sam-a17-6-128-ad-oct26', 'Samsung', 'Samsung Galaxy A17 5G (6GB/128GB) - With Adapter', 29999, 29999, SAM_A, 'Black, Blue', '6 GB', '128 GB', { DP: '28845', Offer: '1442 support', Charger: 'With Adapter' }, { rating: 4.3, ratingCount: 500 }),
  mk('sam-a17-8-128-ad-oct26', 'Samsung', 'Samsung Galaxy A17 5G (8GB/128GB) - With Adapter', 32999, 32999, SAM_A, 'Black, Blue', '8 GB', '128 GB', { DP: '31730' }, { rating: 4.4, ratingCount: 450 }),
  mk('sam-a17-8-256-ad-oct26', 'Samsung', 'Samsung Galaxy A17 5G (8GB/256GB) - With Adapter', 38499, 38499, SAM_A, 'Black, Blue', '8 GB', '256 GB', { DP: '37018' }, { rating: 4.4, ratingCount: 400 }),
  mk('sam-a26-6-128-oct26', 'Samsung', 'Samsung Galaxy A26 5G (6GB/128GB)', 23499, 23499, SAM_A, 'Black, White, Mint', '6 GB', '128 GB', { DP: '22815' }, { rating: 4.3, ratingCount: 800 }),
  mk('sam-a26-8-128-oct26', 'Samsung', 'Samsung Galaxy A26 5G (8GB/128GB)', 24999, 24999, SAM_A, 'Black, White, Mint', '8 GB', '128 GB', { DP: '24271' }, { rating: 4.4, ratingCount: 750 }),
  mk('sam-a26-8-256-oct26', 'Samsung', 'Samsung Galaxy A26 5G (8GB/256GB)', 27999, 27999, SAM_A, 'Black, White, Mint', '8 GB', '256 GB', { DP: '27183' }, { rating: 4.4, ratingCount: 650 }),
  mk('sam-a27-6-128-oct26', 'Samsung', 'Samsung Galaxy A27 5G (6GB/128GB)', 35999, 35999, SAM_A, 'Black, Blue', '6 GB', '128 GB', { DP: '34614', Offer: '2404 support till 31 Oct' }, { rating: 4.4, ratingCount: 400 }),
  mk('sam-a27-8-128-oct26', 'Samsung', 'Samsung Galaxy A27 5G (8GB/128GB)', 40999, 40999, SAM_A, 'Black, Blue', '8 GB', '128 GB', { DP: '39422' }, { rating: 4.4, ratingCount: 350 }),
  mk('sam-a27-8-256-oct26', 'Samsung', 'Samsung Galaxy A27 5G (8GB/256GB)', 47499, 47499, SAM_A, 'Black, Blue', '8 GB', '256 GB', { DP: '45672' }, { rating: 4.5, ratingCount: 300 }),
  mk('sam-a37-8-128-oct26', 'Samsung', 'Samsung Galaxy A37 5G NEW (8GB/128GB)', 46999, 46999, SAM_A, 'Black, Blue', '8 GB', '128 GB', { DP: '45191', Offer: '3846 support + Multibuy Buds4' }, { badge: 'NEW', rating: 4.5, ratingCount: 250 }),
  mk('sam-a37-8-256-oct26', 'Samsung', 'Samsung Galaxy A37 5G NEW (8GB/256GB)', 54499, 54499, SAM_A, 'Black, Blue', '8 GB', '256 GB', { DP: '52403' }, { badge: 'NEW', rating: 4.5, ratingCount: 200 }),
  mk('sam-a37-12-256-oct26', 'Samsung', 'Samsung Galaxy A37 5G NEW (12GB/256GB)', 63999, 63999, SAM_A, 'Black, Blue', '12 GB', '256 GB', { DP: '61538' }, { badge: 'NEW', rating: 4.5, ratingCount: 180 }),
  mk('sam-a57-8-256-oct26', 'Samsung', 'Samsung Galaxy A57 5G NEW (8GB/256GB)', 62999, 62999, SAM_A, 'Black, Blue', '8 GB', '256 GB', { DP: '60576', Offer: '8173 support' }, { badge: 'NEW', rating: 4.6, ratingCount: 150 }),
  mk('sam-a57-12-256-oct26', 'Samsung', 'Samsung Galaxy A57 5G NEW (12GB/256GB)', 72499, 72499, SAM_A, 'Black, Blue', '12 GB', '256 GB', { DP: '69711', Offer: '9135 support' }, { badge: 'NEW', rating: 4.6, ratingCount: 120 }),
];

export const OCT2026_CATALOG: Product[] = [...APPLE_OCT2026, ...OPPO_OCT2026, ...SAMSUNG_OCT2026];

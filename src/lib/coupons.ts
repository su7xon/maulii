/** Mauli store coupons — single source, Cart + Checkout dono yahi use karte. */
import type { CartItem } from '../types';

export interface CouponDef {
  code: string;
  short: string;
  desc: string;
  minAmount: number;
}

export const COUPONS: CouponDef[] = [
  { code: 'MAULI1000', short: 'MAULI1000 (₹1000 Off)', desc: '₹1000 off on orders above ₹10,000', minAmount: 10000 },
  { code: 'MAULI500', short: 'MAULI500 (₹500 Off)', desc: '₹500 off, no minimum order', minAmount: 0 },
  { code: 'MAULIFIRST', short: 'MAULIFIRST (5% Off)', desc: 'Extra 5% off first order (up to ₹2,000)', minAmount: 0 },
];

export function calcCouponDiscount(code: string | null, subtotal: number): number {
  if (code === 'MAULI1000' && subtotal >= 10000) return 1000;
  if (code === 'MAULI500') return 500;
  if (code === 'MAULIFIRST') return Math.min(Math.round(subtotal * 0.05), 2000);
  return 0;
}

export function validateCoupon(code: string, subtotal: number): string {
  if (code === 'MAULI1000' && subtotal < 10000) return 'MAULI1000 requires minimum order of ₹10,000';
  if (code === 'MAULI1000' || code === 'MAULI500' || code === 'MAULIFIRST') return '';
  return 'Invalid coupon code. Try MAULI1000, MAULI500 or MAULIFIRST';
}

/**
 * Cash (COD) purchase discounts — applied automatically at checkout when payMethod === 'cod'.
 * Rules:
 * 1. Vivo Y series / S series + cash  → extra 10% off subtotal
 * 2. Any brand + cash                 → flat ₹1000 off
 * Both stack for Vivo Y/S + cash.
 */
export function calcCashDiscount(cartItems: CartItem[], paymentMethod: string, subtotal: number): number {
  if (paymentMethod !== 'cod') return 0;

  let discount = 0;

  // Rule 2: any brand cash purchase = ₹1000 off
  discount += 1000;

  // Rule 1: Vivo Y series / S series = extra 10% off
  const hasVivoYS = cartItems.some((i) => {
    const b = (i.product.brand || '').toLowerCase();
    const n = (i.product.name || '').toLowerCase();
    return b === 'vivo' && (n.includes(' y ') || n.includes('s19') || n.includes('s20') || n.includes('s18') || n.includes('s17'));
  });
  if (hasVivoYS) {
    discount += Math.round(subtotal * 0.10);
  }

  return discount;
}

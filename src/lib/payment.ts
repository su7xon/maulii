import { loadScript } from './loadScript';

/**
 * Razorpay payment helper.
 *
 * SECURITY: Key SECRET kabhi frontend me nahi. Sirf Key ID public hai.
 * Order create + signature verify server (netlify/functions/razorpay.ts) pe hota hai.
 */

export const RAZORPAY_KEY_ID = (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) || '';

export const isRazorpayConfigured = RAZORPAY_KEY_ID.startsWith('rzp_');

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface CreateOrderResponse {
  ok: boolean;
  id?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

/**
 * Server se Razorpay order banao. Server Key Secret se Razorpay API call karta hai
 * aur razorpay_order_id wapas deta hai.
 */
export async function createRazorpayOrder(amountInPaise: number, receipt: string): Promise<string> {
  const res = await fetch('/.netlify/functions/razorpay?action=create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt }),
  });
  const data = (await res.json().catch(() => ({}))) as CreateOrderResponse;
  if (!res.ok || !data.ok || !data.id) {
    throw new Error(data.error || `Order create failed (HTTP ${res.status})`);
  }
  return data.id;
}

/** Server pe signature verify karo — payment asli hai ya nahi. */
export async function verifyRazorpayPayment(p: RazorpaySuccess): Promise<boolean> {
  try {
    const res = await fetch('/.netlify/functions/razorpay?action=verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: p.razorpay_order_id,
        payment_id: p.razorpay_payment_id,
        signature: p.razorpay_signature,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; verified?: boolean };
    return res.ok && data.ok === true && data.verified !== false;
  } catch {
    return false;
  }
}

/** Razorpay Checkout popup kholo. Resolve: payment success; reject: user cancel / fail. */
export async function openRazorpayCheckout(opts: {
  orderId: string;
  amountInPaise: number;
  name: string;
  email?: string;
  phone: string;
  description: string;
}): Promise<RazorpaySuccess> {
  await loadScript('https://checkout.razorpay.com/v1/checkout.js');

  const Rzp = (window as unknown as { Razorpay?: new (o: unknown) => { open: () => void; on: (e: string, cb: (a: unknown) => void) => void } }).Razorpay;
  if (!Rzp) throw new Error('Razorpay checkout load nahi hua. Internet check karo.');

  return new Promise<RazorpaySuccess>((resolve, reject) => {
    const rzp = new Rzp({
      key: RAZORPAY_KEY_ID,
      amount: opts.amountInPaise,
      currency: 'INR',
      name: 'Mauli Mobile',
      description: opts.description,
      order_id: opts.orderId,
      prefill: {
        name: opts.name,
        email: opts.email || '',
        contact: opts.phone,
      },
      theme: { color: '#e42529' },
      handler: (r: unknown) => {
        const resp = r as RazorpaySuccess;
        if (resp?.razorpay_payment_id && resp?.razorpay_signature) resolve(resp);
        else reject(new Error('Payment response adhura aaya.'));
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancel ho gaya.')),
      },
    });
    rzp.on('payment.failed', () => reject(new Error('Payment fail ho gaya. Dobara try karo.')));
    rzp.open();
  });
}

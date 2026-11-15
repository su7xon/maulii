/**
 * Vercel serverless function for Razorpay.
 * SECURITY: Key SECRET stays here (server-side), never in frontend.
 * Uses native fetch to call Razorpay REST API — no extra npm package needed.
 */

type VercelRequest = {
  method?: string;
  query?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => VercelResponse;
  setHeader: (key: string, value: string) => VercelResponse;
  end: () => void;
};

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const authHeader = keyId && keySecret
  ? 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  : '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!keyId || !keySecret) {
    return res.status(500).json({ ok: false, error: 'Razorpay not configured on server' });
  }

  const { action } = (req.query || {}) as { action?: string };

  if (action === 'create') {
    try {
      const body = req.body as { amount?: number; currency?: string; receipt?: string } || {};
      const { amount, currency = 'INR', receipt } = body;
      const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, receipt, payment_capture: 1 }),
      });
      const data = await razorpayRes.json();
      if (!razorpayRes.ok || !data.id) {
        return res.status(razorpayRes.status || 500).json({
          ok: false,
          error: (data as { error?: { description?: string } })?.error?.description || 'Order create failed',
        });
      }
      return res.status(200).json({ ok: true, id: data.id, amount: data.amount, currency: data.currency });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order create failed';
      return res.status(500).json({ ok: false, error: message });
    }
  }

  if (action === 'verify') {
    try {
      const body = req.body as { order_id?: string; payment_id?: string; signature?: string } || {};
      const { order_id, payment_id, signature } = body;
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(`${order_id}|${payment_id}`);
      const digest = hmac.digest('hex');
      const verified = digest === signature;
      return res.status(200).json({ ok: verified, verified });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      return res.status(500).json({ ok: false, error: message });
    }
  }

  return res.status(400).json({ ok: false, error: 'Invalid action' });
}

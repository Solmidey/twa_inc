import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { buffer } from 'micro';
import { markPaid, storeToken, upsertPurchase } from '@/lib/datastore';
import { issueRevealToken } from '@/lib/auth';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(500).json({ error: 'Webhook secret missing' });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email ?? undefined;
    upsertPurchase({ sessionId: session.id, email, paid: false });
    markPaid(session.id, email);
    const token = issueRevealToken({ sessionId: session.id, email }, '15m');
    const expiresAt = Date.now() + 15 * 60 * 1000;
    storeToken(session.id, token, expiresAt);
  }

  res.json({ received: true });
}

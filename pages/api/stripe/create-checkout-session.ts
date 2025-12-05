import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe, appDomain } from '@/lib/stripe';
import { getPlan } from '@/lib/plans';
import { upsertPurchase } from '@/lib/datastore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { planId, email } = req.body as { planId?: string; email?: string };
  if (!planId || !email) {
    return res.status(400).json({ error: 'planId and email are required' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const plan = getPlan(planId);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const amount = Number(plan.price.replace(/[^0-9.]/g, '')) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      metadata: { planId: plan.id, email },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(amount),
            product_data: {
              name: plan.name,
              description: plan.description
            }
          }
        }
      ],
      success_url: `${appDomain}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appDomain}/pricing`
    });

    upsertPurchase({ sessionId: session.id, email, planId: plan.id, paid: false });
    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe session error', error);
    return res.status(500).json({ error: error.message });
  }
}

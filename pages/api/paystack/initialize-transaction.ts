import type { NextApiRequest, NextApiResponse } from 'next';
import { paystackFetch } from '@/lib/paystack';

type InitApiResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, amount, metadata } = req.body ?? {};

  if (!email || amount == null) {
    return res.status(400).json({ error: 'email and amount are required' });
  }

  // Paystack expects amount in the lowest currency unit (e.g., kobo for NGN).
  // This assumes you pass amount in naira. Adjust if your UI already sends kobo.
  const amountInKobo = Math.round(Number(amount) * 100);

  if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
    return res.status(400).json({ error: 'amount must be a valid positive number' });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  try {
    const init = await paystackFetch<InitApiResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        metadata,
        callback_url: appUrl ? `${appUrl}/paystack/success` : undefined,
      }),
    });

    return res.status(200).json(init.data);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? 'Failed to initialize transaction' });
  }
}

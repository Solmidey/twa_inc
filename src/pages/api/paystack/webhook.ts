import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// Disable body parsing so we can verify the raw payload
export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

  if (!secret) {
    return res.status(500).send('PAYSTACK_WEBHOOK_SECRET not set');
  }

  const sig = req.headers['x-paystack-signature'];
  if (!sig || Array.isArray(sig)) {
    return res.status(400).send('Missing signature');
  }

  const buf = await getRawBody(req);
  const hash = crypto.createHmac('sha512', secret).update(buf).digest('hex');

  if (hash !== sig) {
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(buf.toString('utf8'));

  // TODO: replace with your real fulfillment logic
  if (event?.event === 'charge.success') {
    // Example: event.data.reference, event.data.customer.email, event.data.amount
    // You can mark user as paid, unlock Discord, etc.
  }

  return res.status(200).json({ received: true });
}

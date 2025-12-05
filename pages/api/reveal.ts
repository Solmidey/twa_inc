import type { NextApiRequest, NextApiResponse } from 'next';
import { getPurchase, storeToken } from '@/lib/datastore';
import { issueRevealToken, verifyRevealToken } from '@/lib/auth';

const INVITE_URL = 'https://discord.com/invite/fnG5DTfGs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const sessionId = req.query.session_id as string | undefined;
    if (!sessionId) return res.status(400).json({ status: 'error', message: 'session_id is required' });
    const record = getPurchase(sessionId);
    if (!record || !record.paid) {
      return res.status(403).json({ status: 'unpaid', message: 'Payment has not been verified yet.' });
    }
    const token = issueRevealToken({ sessionId, email: record.email }, '15m');
    const expiresAt = Date.now() + 15 * 60 * 1000;
    storeToken(sessionId, token, expiresAt);
    return res.status(200).json({ status: 'authorized', token });
  }

  if (req.method === 'POST') {
    const { token } = req.body as { token?: string };
    if (!token) return res.status(400).json({ status: 'error', message: 'token missing' });
    const payload = verifyRevealToken(token);
    if (!payload) return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    const record = getPurchase(payload.sessionId);
    if (!record || !record.paid || record.token !== token || (record.tokenExpiresAt ?? 0) < Date.now()) {
      return res.status(401).json({ status: 'error', message: 'Token not recognized or payment not verified' });
    }
    return res.status(200).json({ status: 'revealed', inviteUrl: INVITE_URL });
  }

  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
}

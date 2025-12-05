import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';

export type RevealPayload = {
  sessionId: string;
  email?: string | null;
};

export const issueRevealToken = (payload: RevealPayload, expiresIn = '15m') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyRevealToken = (token: string): RevealPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as RevealPayload;
  } catch (e) {
    return null;
  }
};

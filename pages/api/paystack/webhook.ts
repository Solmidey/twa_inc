import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Minimal webhook stub.
 * Your unlock flow uses client-side verification.
 * You can expand this later to persist purchases.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  return res.status(200).json({ received: true });
}

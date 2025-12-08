import type { NextApiRequest, NextApiResponse } from "next";
import { getDiscordInviteUrl } from "../../lib/getDiscordInviteUrl";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const reference = String(req.query.reference ?? req.query.session_id ?? "").trim();
  if (!reference) return res.status(400).json({ error: "Missing reference" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET_KEY not set" });

  const inviteUrl = getDiscordInviteUrl();
  if (!inviteUrl) return res.status(500).json({ error: "Discord invite is not configured" });

  const psRes = await fetch(
    "https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference),
    { headers: { Authorization: "Bearer " + secret } }
  );
  const data = await psRes.json();

  if (!psRes.ok) return res.status(psRes.status).json(data);

  if (data?.data?.status !== "success") {
    return res.status(402).json({ error: "Payment not confirmed" });
  }

  return res.status(200).json({ inviteUrl });
}

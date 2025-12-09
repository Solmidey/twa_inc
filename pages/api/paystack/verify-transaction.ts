import type { NextApiRequest, NextApiResponse } from "next";

const getInviteUrl = () =>
  process.env.DISCORD_INVITE_URL ||
  process.env.DISCORD_INVITE_LINK ||
  process.env.DISCORD_INVITE ||
  "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const reference = String(req.query.reference ?? req.query.trxref ?? "").trim();
  if (!reference) return res.status(400).json({ error: "reference is required" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET_KEY not set" });

  const inviteUrl = getInviteUrl();
  if (!inviteUrl) return res.status(500).json({ error: "Discord invite not configured" });

  try {
    const psRes = await fetch(
      "https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference),
      { headers: { Authorization: "Bearer " + secret } }
    );

    const data = await psRes.json();
    if (!psRes.ok) return res.status(psRes.status).json(data);

    const status = data?.data?.status ?? "unknown";

    if (status === "success") {
      return res.status(200).json({ status: "success", reference, inviteUrl });
    }

    return res.status(402).json({ status, error: "Payment not confirmed yet" });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Paystack verify error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";

const PRICE_BY_MONTHS: Record<number, number> = { 1: 50, 2: 100, 3: 150, 6: 300 };

function monthsFromPlanId(planId?: string) {
  if (!planId) return undefined;
  const m = String(planId).match(/\d+/);
  return m ? Number(m[0]) : undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { planId, email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: "Email is required" });

    const months = monthsFromPlanId(planId);
    const price = months ? PRICE_BY_MONTHS[months] : undefined;
    if (!price) return res.status(400).json({ error: "Invalid planId" });

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET_KEY not set" });

    const proto = String(req.headers["x-forwarded-proto"] ?? "https");
    const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "");
    const baseUrl = proto + "://" + host;

    const payload = {
      email,
      amount: Math.round(price * 100),
      callback_url: baseUrl + "/thank-you",
      metadata: { planId, months, price },
    };

    const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await psRes.json();
    if (!psRes.ok) return res.status(psRes.status).json(data);

    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Paystack error" });
  }
}

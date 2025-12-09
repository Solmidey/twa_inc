import type { NextApiRequest, NextApiResponse } from "next";
import { getPlan } from "@/lib/plans";

const PRICE_BY_MONTHS: Record<number, number> = { 1: 50, 2: 100, 3: 150, 6: 300 };

function monthsFromPlanId(planId?: string) {
  if (!planId) return undefined;
  const id = String(planId).toLowerCase();

  const digit = id.match(/\d+/)?.[0];
  if (digit) return Number(digit);

  if (id.includes("one")) return 1;
  if (id.includes("two")) return 2;
  if (id.includes("three")) return 3;
  if (id.includes("six")) return 6;

  if (id.includes("monthly")) return 1;
  if (id.includes("bimonth")) return 2;
  if (id.includes("quarter")) return 3;
  if (id.includes("half") || id.includes("biannual") || id.includes("semiannual")) return 6;

  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { planId, email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!planId) return res.status(400).json({ error: "planId is required" });

    const plan = getPlan(String(planId));

    // Prefer plan-driven values (source of truth)
    const months =
      (plan as any)?.months ??
      monthsFromPlanId(String(planId));

    const priceUsd =
      Number((plan as any)?.priceUsd ?? (plan as any)?.price ?? undefined) ||
      (months ? PRICE_BY_MONTHS[months] : undefined);

    if (!months || !priceUsd) {
      return res.status(400).json({ error: "Invalid planId" });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET_KEY not set" });

    const proto = String(req.headers["x-forwarded-proto"] ?? "https");
    const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "");
    const baseUrl = proto + "://" + host;

    /**
     * IMPORTANT:
     * If your integration cannot charge USD directly (common in test mode),
     * keep using your existing USD->NGN conversion logic in this file.
     *
     * This template assumes you already handle currency/rates elsewhere
     * or your Paystack account supports your chosen currency.
     *
     * If you previously added live FX here, keep that section and just
     * replace how months/priceUsd are derived (as done above).
     */

    const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(priceUsd * 100),
        callback_url: baseUrl + "/thank-you",
        metadata: { planId: (plan as any)?.id ?? planId, months, priceUsd },
      }),
    });

    const data = await psRes.json();
    if (!psRes.ok) return res.status(psRes.status).json(data);

    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Paystack error" });
  }
}

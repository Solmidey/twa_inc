import type { NextApiRequest, NextApiResponse } from "next";
import { getPlan } from "@/lib/plans";
import { getUsdToNgnRate } from "@/lib/fx";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { planId, email } = req.body ?? {};

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const plan = getPlan(String(planId ?? ""));
    if (!plan) {
      return res.status(400).json({ error: "Invalid planId" });
    }

    // Support multiple possible plan field names without breaking your existing structure
    const rawPrice: any =
      (plan as any).priceUsd ??
      (plan as any).price ??
      (plan as any).amountUsd ??
      (plan as any).amount ??
      0;

    const priceUsd =
      typeof rawPrice === "string"
        ? Number(String(rawPrice).replace(/[^0-9.]/g, ""))
        : Number(rawPrice);

    if (!priceUsd || Number.isNaN(priceUsd)) {
      return res.status(400).json({ error: "Invalid plan price" });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: "PAYSTACK_SECRET_KEY not set" });
    }

    const proto = String(req.headers["x-forwarded-proto"] ?? "https");
    const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "");
    const baseUrl = proto + "://" + host;

    const rate = await getUsdToNgnRate();
    const amountNgnKobo = Math.round(priceUsd * rate * 100);

    const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountNgnKobo,
        currency: "NGN",
        callback_url: baseUrl + "/thank-you",
        metadata: {
          planId: (plan as any).id ?? planId,
          months: (plan as any).months,
          priceUsd,
          usdToNgnRate: rate,
        },
      }),
    });

    const data = await psRes.json();

    if (!psRes.ok) {
      return res.status(psRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Paystack error" });
  }
}

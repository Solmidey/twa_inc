import type { NextApiRequest, NextApiResponse } from "next";

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

type CachedRate = { value: number; fetchedAt: number };
let cached: CachedRate | null = null;
const CACHE_MS = 60 * 60 * 1000; // 1 hour

async function fetchLiveUsdToNgn(): Promise<number | null> {
  const urls = [
    "https://open.er-api.com/v6/latest/USD",
    "https://api.exchangerate.host/latest?base=USD&symbols=NGN",
  ];

  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const j: any = await r.json();

      const rate =
        j?.rates?.NGN ??
        j?.conversion_rates?.NGN ??
        j?.data?.rates?.NGN;

      const n = Number(rate);
      if (Number.isFinite(n) && n > 0) return n;
    } catch {
      // try next source
    }
  }

  return null;
}

async function getUsdToNgnRateOrThrow() {
  const now = Date.now();

  if (cached && now - cached.fetchedAt < CACHE_MS) {
    return { rate: cached.value, source: "live" as const };
  }

  const live = await fetchLiveUsdToNgn();
  if (live) {
    cached = { value: live, fetchedAt: now };
    return { rate: live, source: "live" as const };
  }

  const fallback = Number(
    process.env.USD_TO_NGN_FALLBACK_RATE ??
    process.env.USD_TO_NGN_RATE ??
    ""
  );

  if (Number.isFinite(fallback) && fallback > 0) {
    return { rate: fallback, source: "fallback" as const };
  }

  throw new Error("USD_TO_NGN_FALLBACK_RATE not set and live FX rate unavailable");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { planId, email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: "Email is required" });

    const months = monthsFromPlanId(planId);
    const priceUsd = months ? PRICE_BY_MONTHS[months] : undefined;
    if (!priceUsd) return res.status(400).json({ error: "Invalid planId" });

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET_KEY not set" });

    const { rate, source } = await getUsdToNgnRateOrThrow();

    const amountNgn = priceUsd * rate;
    const amountKobo = Math.round(amountNgn * 100);

    const proto = String(req.headers["x-forwarded-proto"] ?? "https");
    const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "");
    const baseUrl = proto + "://" + host;

    const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: "NGN",
        callback_url: baseUrl + "/thank-you",
        metadata: {
          planId,
          months,
          priceUsd,
          usdToNgnRate: rate,
          rateSource: source,
          amountNgn: Math.round(amountNgn * 100) / 100,
        },
      }),
    });

    const data = await psRes.json();
    if (!psRes.ok) return res.status(psRes.status).json(data);

    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Paystack error" });
  }
}

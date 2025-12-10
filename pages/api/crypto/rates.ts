import type { NextApiRequest, NextApiResponse } from "next";

let cachedEthUsd: number | null = null;
let lastFetch = 0;
const TTL = 60 * 1000; // 1 minute

async function fetchEthUsd(): Promise<number | null> {
  try {
    // Lightweight public source; if it ever fails, UI can fallback gracefully.
    const res = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=ETH");
    if (!res.ok) return null;
    const json = await res.json();
    const rateStr = json?.data?.rates?.USD;
    const rate = Number(rateStr);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    return rate;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now();
  if (cachedEthUsd && now - lastFetch < TTL) {
    return res.status(200).json({ ok: true, ethUsd: cachedEthUsd, cached: true });
  }

  const live = await fetchEthUsd();
  if (live) {
    cachedEthUsd = live;
    lastFetch = now;
    return res.status(200).json({ ok: true, ethUsd: live, cached: false });
  }

  // Optional safe fallback from env
  const fallback = Number(process.env.ETH_USD_FALLBACK || "");
  if (Number.isFinite(fallback) && fallback > 0) {
    cachedEthUsd = fallback;
    lastFetch = now;
    return res.status(200).json({ ok: true, ethUsd: fallback, cached: true, fallback: true });
  }

  return res.status(200).json({ ok: false, error: "ETH USD rate unavailable" });
}

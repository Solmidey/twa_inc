import type { NextApiRequest, NextApiResponse } from "next";

let cachedEthUsd: number | null = null;
let lastFetch = 0;
const TTL = 60 * 1000; // 1 minute

export async function fetchEthUsd(): Promise<number | null> {
  const now = Date.now();
  if (cachedEthUsd && now - lastFetch < TTL) return cachedEthUsd;

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    if (!res.ok) return null;
    const json = await res.json();
    const rate = Number(json?.ethereum?.usd ?? json?.ethereum?.USD);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    cachedEthUsd = rate;
    lastFetch = now;
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

  return res.status(200).json({ ok: false, error: "ETH USD rate unavailable" });
}

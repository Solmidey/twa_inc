let cachedRate: number | null = null;
let cachedAt = 0;

const TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

function readFallbackRate() {
  const raw =
    process.env.USD_NGN_FALLBACK_RATE ||
    process.env.USD_NGN_RATE ||
    "";
  const num = Number(raw);
  return Number.isFinite(num) && num > 0 ? num : null;
}

// Uses a public FX endpoint. If it fails, we fall back to env.
// You can swap this URL later without changing the rest of your code.
async function fetchLiveUsdNgnRate(): Promise<number | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) return null;
    const data: any = await res.json();
    const rate =
      data?.rates?.NGN ??
      data?.conversion_rates?.NGN ??
      null;

    const num = Number(rate);
    if (!Number.isFinite(num) || num <= 0) return null;
    return num;
  } catch {
    return null;
  }
}

export async function getUsdToNgnRate(): Promise<number> {
  const now = Date.now();

  if (cachedRate && now - cachedAt < TTL_MS) {
    return cachedRate;
  }

  const live = await fetchLiveUsdNgnRate();
  if (live) {
    cachedRate = live;
    cachedAt = now;
    return live;
  }

  const fallback = readFallbackRate();
  if (fallback) {
    cachedRate = fallback;
    cachedAt = now;
    return fallback;
  }

  throw new Error("USD→NGN rate not set");
}

import { getPlan } from "./plans";

export type CryptoMethodId =
  | "usdt_base"
  | "eth_base"
  | "eth_erc20"
  | "usdt_bep20";

export type ChainKey = "ethereum" | "base" | "bsc";

export const CRYPTO_METHODS: {
  id: CryptoMethodId;
  label: string;
  chain: ChainKey;
  asset: "ETH" | "USDT";
  stable: boolean;
  decimals: number;
}[] = [
  { id: "usdt_base", label: "USDT (Base)", chain: "base", asset: "USDT", stable: true, decimals: 6 },
  { id: "eth_base", label: "ETH (Base)", chain: "base", asset: "ETH", stable: false, decimals: 18 },
  { id: "eth_erc20", label: "ETH (ERC20)", chain: "ethereum", asset: "ETH", stable: false, decimals: 18 },
  { id: "usdt_bep20", label: "USDT (BEP20)", chain: "bsc", asset: "USDT", stable: true, decimals: 18 },
];

export function getCryptoMethod(id: string) {
  return CRYPTO_METHODS.find((m) => m.id === id);
}

/**
 * For USDT:
 * 1 USDT ~ 1 USD (lightweight assumption for stable checkout UX)
 * We enforce the plan USD amount in token units.
 */
export function getRequiredUsdtAmount(planId: string) {
  const plan = getPlan(planId);
  if (!plan) return null;

  // Extract number from "$50" style or use any numeric fields you already have
  const raw =
    (plan as any).priceUsd ??
    (plan as any).amountUsd ??
    (typeof (plan as any).price === "string"
      ? Number(String((plan as any).price).replace(/[^0-9.]/g, ""))
      : Number((plan as any).price ?? 0));

  const usd = Number(raw);
  if (!Number.isFinite(usd) || usd <= 0) return null;
  return usd;
}

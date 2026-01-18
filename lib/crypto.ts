import { getPlan } from "./plans";

export type CryptoMethodId =
  | "usdt_base"
  | "eth_base"
  | "eth_erc20"
  | "usdt_bep20";

export type ChainKey = "ethereum" | "base" | "bsc";

export type CryptoMethod = {
  id: CryptoMethodId;
  label: string;
  chain: ChainKey;
  currency: "ETH" | "USDT";
  decimals: number;
};

export const CRYPTO_METHODS = [
  {
    id: "usdt-arbitrum",
    label: "USDT (Arbitrum)",
    currency: "USDT",
    chain: "ethereum",
    networkLabel: "Arbitrum",
  },
];

export function getCryptoMethod(id?: string) {
  if (!id) return undefined;
  return CRYPTO_METHODS.find((m) => m.id === id);
}

export function getPlanUsd(planId?: string) {
  if (!planId) return null;
  const plan = getPlan(planId);
  if (!plan) return null;

  const usd = Number(plan.priceUsd ?? plan.price ?? 0);
  if (!Number.isFinite(usd) || usd <= 0) return null;
  return usd;
}

export function getRequiredUsdtAmount(planId: string) {
  return getPlanUsd(planId);
}

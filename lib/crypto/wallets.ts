export const CRYPTO_WALLETS = {
  ETH_BASE: process.env.NEXT_PUBLIC_WALLET_ETH_BASE ?? "",
  USDT_BASE: process.env.NEXT_PUBLIC_WALLET_USDT_BASE ?? "",
  ETH_ERC20: process.env.NEXT_PUBLIC_WALLET_ETH_ERC20 ?? "",
  USDT_BEP20: process.env.NEXT_PUBLIC_WALLET_USDT_BEP20 ?? "",
} as const;

export type SupportedAsset = keyof typeof CRYPTO_WALLETS;

export function getWallet(asset: SupportedAsset) {
  const addr = CRYPTO_WALLETS[asset];
  return addr?.trim();
}

import type { NextApiRequest, NextApiResponse } from "next";
import { CRYPTO_METHODS, getPlanUsd } from "@/lib/crypto";
import { fetchEthUsd } from "./rates";

const RPC_URLS = {
  base: "https://mainnet.base.org",
  ethereum: "https://cloudflare-eth.com",
  bsc: "https://bsc-dataseed.binance.org",
} as const;

const USDT_CONTRACTS = {
  base: "0x2a5E2a57A5B2F2F0657180E6fC8b33aDd869eE57",
  bsc: "0x55d398326f99059fF775485246999027B3197955",
} as const;

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function normalizeAddress(addr?: string) {
  return (addr || "").toLowerCase();
}

function topicAddress(addr: string) {
  const clean = addr.toLowerCase().replace(/^0x/, "");
  return "0x" + clean.padStart(64, "0");
}

async function rpc(chain: keyof typeof RPC_URLS, method: string, params: any[]) {
  const res = await fetch(RPC_URLS[chain], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json?.error) throw new Error(json.error.message || "RPC error");
  return json.result;
}

function getInviteUrl() {
  return (
    process.env.DISCORD_INVITE_URL ||
    process.env.DISCORD_INVITE_LINK ||
    process.env.DISCORD_INVITE ||
    ""
  );
}

function withinTolerance(actual: number, expected: number, tolerancePct: number) {
  const lower = expected * (1 - tolerancePct);
  return actual >= lower;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { planId, email, chain, currency, txHash } = req.body ?? {};

    if (!planId || !chain || !currency || !txHash) {
      return res.status(400).json({ error: "planId, chain, currency and txHash are required" });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required for access delivery" });
    }

    const receiver = process.env.NEXT_PUBLIC_CRYPTO_EVM_ADDRESS;
    if (!receiver) return res.status(500).json({ error: "NEXT_PUBLIC_CRYPTO_EVM_ADDRESS not set" });

    const chainKey = String(chain) as keyof typeof RPC_URLS;
    if (!RPC_URLS[chainKey]) {
      return res.status(400).json({ error: "Unsupported network" });
    }

    const method = CRYPTO_METHODS.find(
      (m) => m.chain === chainKey && m.currency.toLowerCase() === String(currency).toLowerCase()
    );

    if (!method) {
      return res.status(400).json({ error: "Unsupported currency or chain" });
    }

    const usd = getPlanUsd(String(planId));
    if (!usd) return res.status(400).json({ error: "Invalid plan" });

    const tx = await rpc(method.chain, "eth_getTransactionByHash", [txHash]);
    if (!tx) return res.status(400).json({ error: "Transaction not found on selected network" });

    if (method.currency === "ETH") {
      const to = normalizeAddress(tx.to);
      if (!to || to !== normalizeAddress(receiver)) {
        return res.status(400).json({ error: "Recipient address mismatch" });
      }

      const valueWei = BigInt(tx.value || "0x0");
      if (valueWei <= BigInt(0)) return res.status(400).json({ error: "Invalid ETH amount" });

      const ethUsd = await fetchEthUsd();
      if (!ethUsd) return res.status(500).json({ error: "Unable to fetch ETH price" });

      const expectedEth = usd / ethUsd;
      const paidEth = Number(valueWei) / 1e18;

      if (!withinTolerance(paidEth, expectedEth, 0.02)) {
        return res.status(400).json({ error: "ETH amount does not meet plan price" });
      }
    } else {
      const receipt = await rpc(method.chain, "eth_getTransactionReceipt", [txHash]);
      const logs: any[] = receipt?.logs ?? [];

      const contract =
        method.chain === "base"
          ? USDT_CONTRACTS.base
          : method.chain === "bsc"
          ? USDT_CONTRACTS.bsc
          : null;

      if (!contract) return res.status(400).json({ error: "Unsupported USDT network" });

      const receiverTopic = topicAddress(receiver);
      const matched = logs.find((l) => {
        const addr = normalizeAddress(l.address);
        if (addr !== normalizeAddress(contract)) return false;
        const topics = l.topics || [];
        if ((topics[0] || "").toLowerCase() !== TRANSFER_TOPIC) return false;
        return normalizeAddress(topics[2]) === normalizeAddress(receiverTopic);
      });

      if (!matched) {
        return res
          .status(400)
          .json({ error: "USDT transfer to receiver not found in transaction logs" });
      }

      const amount = BigInt(matched.data || "0x0");
      const requiredUnits = BigInt(Math.round(usd * Math.pow(10, method.decimals)));

      if (amount < requiredUnits) {
        return res.status(400).json({ error: "USDT amount below required plan price" });
      }
    }

    const inviteUrl = getInviteUrl();
    if (!inviteUrl) return res.status(500).json({ error: "Discord invite not configured" });

    return res.status(200).json({ ok: true, inviteUrl });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Crypto verification error" });
  }
}

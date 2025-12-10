import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getCryptoMethod, getRequiredUsdtAmount } from "@/lib/crypto";
import { getPlan } from "@/lib/plans";
import { getWallet } from "@/lib/crypto/wallets";

const PUBLIC_FALLBACKS = {
  ethereum: "https://cloudflare-eth.com",
  base: "https://mainnet.base.org",
  bsc: "https://bsc-dataseed.binance.org",
};

function rpcUrl(chain: "ethereum" | "base" | "bsc") {
  if (chain === "ethereum") return process.env.ETH_RPC_URL || PUBLIC_FALLBACKS.ethereum;
  if (chain === "base") return process.env.BASE_RPC_URL || PUBLIC_FALLBACKS.base;
  return process.env.BSC_RPC_URL || PUBLIC_FALLBACKS.bsc;
}

async function rpc(chain: "ethereum" | "base" | "bsc", method: string, params: any[]) {
  const res = await fetch(rpcUrl(chain), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json?.error) throw new Error(json.error.message || "RPC error");
  return json.result;
}

function signPayload(payload: any) {
  const secret = process.env.CRYPTO_CONFIRM_SECRET;
  if (!secret) throw new Error("CRYPTO_CONFIRM_SECRET not set");

  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySig(token: string) {
  const secret = process.env.CRYPTO_CONFIRM_SECRET;
  if (!secret) throw new Error("CRYPTO_CONFIRM_SECRET not set");

  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (expected !== sig) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function normalizeAddress(addr?: string) {
  return (addr || "").toLowerCase();
}

// Minimal ERC20 Transfer topic0
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function topicAddress(addr: string) {
  const clean = addr.toLowerCase().replace(/^0x/, "");
  return "0x" + clean.padStart(64, "0");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { planId, methodId, txHash } = req.body ?? {};
    if (!planId || !methodId || !txHash) {
      return res.status(400).json({ error: "planId, methodId and txHash are required" });
    }

    const plan = getPlan(String(planId));
    if (!plan) return res.status(400).json({ error: "Invalid planId" });

    const method = getCryptoMethod(String(methodId));
    if (!method) return res.status(400).json({ error: "Invalid methodId" });

    const receiver = process.env.NEXT_PUBLIC_CRYPTO_EVM_ADDRESS;
    if (!receiver) return res.status(500).json({ error: "NEXT_PUBLIC_CRYPTO_EVM_ADDRESS not set" });

    const chain = method.chain;
    const tx = await rpc(chain, "eth_getTransactionByHash", [txHash]);
    if (!tx) return res.status(400).json({ error: "Transaction not found on selected network" });

    // ETH path (Base or Ethereum)
    if (method.asset === "ETH") {
      const to = normalizeAddress(tx.to);
      const expectedTo = normalizeAddress(receiver);

      if (!to || to !== expectedTo) {
        return res.status(400).json({ error: "Recipient address mismatch" });
      }

      // We do a light check: value must be > 0
      // Client shows exact ETH quote; this avoids hard dependency on price APIs.
      const valueWei = BigInt(tx.value || "0x0");
      if (valueWei <= BigInt(0)) {
        return res.status(400).json({ error: "Invalid ETH value" });
      }

      const token = signPayload({
        planId: String(planId),
        methodId: method.id,
        txHash: String(txHash),
        chain,
        ts: Date.now(),
        exp: Date.now() + 10 * 60 * 1000, // 10 mins
      });

      return res.status(200).json({ ok: true, token });
    }

    // USDT path
    const requiredUsd = getRequiredUsdtAmount(String(planId));
    if (!requiredUsd) return res.status(500).json({ error: "Plan USDT requirement failed" });

    const contractEnv =
      chain === "ethereum"
        ? process.env.USDT_ERC20_CONTRACT
        : chain === "base"
        ? process.env.USDT_BASE_CONTRACT
        : process.env.USDT_BEP20_CONTRACT;

    if (!contractEnv) {
      return res.status(500).json({ error: "USDT contract address not set for this chain" });
    }

    const receipt = await rpc(chain, "eth_getTransactionReceipt", [txHash]);
    const logs: any[] = receipt?.logs ?? [];
    const receiverTopic = topicAddress(receiver);

    // Find Transfer(to == receiver) from USDT contract
    const matched = logs.find((l) => {
      const addr = normalizeAddress(l.address);
      if (addr !== normalizeAddress(contractEnv)) return false;
      const topics = l.topics || [];
      if (topics[0]?.toLowerCase() !== TRANSFER_TOPIC) return false;
      // topics[2] is "to" for Transfer(address,address,uint256)
      return normalizeAddress(topics[2]) === normalizeAddress(receiverTopic);
    });

    if (!matched) {
      return res.status(400).json({ error: "USDT Transfer to receiver not found in tx logs" });
    }

    // Decode data (uint256 amount)
    const amountHex = matched.data;
    const amount = BigInt(amountHex);

    // decimals: USDT is commonly 6 on ETH/Base; BSC token may be 18 depending on deployment.
    // We keep method.decimals as the reference.
    const requiredUnits =
      BigInt(Math.round(requiredUsd * Math.pow(10, method.decimals)));

    if (amount < requiredUnits) {
      return res.status(400).json({ error: "USDT amount below required plan price" });
    }

    const token = signPayload({
      planId: String(planId),
      methodId: method.id,
      txHash: String(txHash),
      chain,
      ts: Date.now(),
      exp: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    return res.status(200).json({ ok: true, token });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Crypto verification error" });
  }
}

// Export a small helper endpoint for reveal page reuse via import if needed
export function verifyCryptoToken(token: string) {
  const payload = verifySig(token);
  if (!payload) return null;
  if (payload.exp && Date.now() > Number(payload.exp)) return null;
  return payload;
}

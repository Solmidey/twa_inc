import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { txHash } = req.query;

  if (!txHash || typeof txHash !== "string") {
    return res.status(400).json({ error: "Transaction hash is required" });
  }

  const receiver = process.env.NEXT_PUBLIC_CRYPTO_EVM_ADDRESS;
  if (!receiver) {
    return res.status(500).json({ error: "Wallet address not configured" });
  }

  // Lightweight confirmation only (manual or later automation)
  return res.status(200).json({
    ok: true,
    message: "Transaction submitted. Access will be confirmed shortly.",
  });
}

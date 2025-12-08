import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const reference = String(req.query.reference ?? "");
  if (!reference) return res.status(400).json({ error: "Missing reference" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET_KEY not set" });

  const psRes = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), {
    headers: { Authorization: "Bearer " + secret }
  });
  const data = await psRes.json();
  if (!psRes.ok) return res.status(psRes.status).json(data);

  const status = data?.data?.status;
  return res.status(200).json({ paid: status === "success", status, data: data?.data });
}
